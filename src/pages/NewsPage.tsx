import { useState, useEffect } from 'react';
import { useNavigate, useParams, Outlet, useLocation } from 'react-router-dom';
import { useI18n } from '../localization/i18n';
import { getNews, NewsItem } from '../services/lobby';

/**
 * NewsPage component
 * Shows news list or individual article via Outlet.
 * Matches original ft/wt components.
 */
const NewsPage = () => {
  const location = useLocation();
  
  // If we're at the exact /news path, show the list
  // Otherwise, the Outlet will render the article
  const isListView = location.pathname.endsWith('/news') || location.pathname.endsWith('/news/');

  if (!isListView) {
    return <Outlet />;
  }

  return <NewsListView />;
};

/**
 * NewsListView component
 * Shows the list of news articles with load more functionality.
 * Matches original wt component structure exactly.
 */
const NewsListView = () => {
  const { translate } = useI18n();
  const { localeName } = useParams<{ localeName: string }>();
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const data = await getNews();
        setNews(data);
        if (data.length < 10) {
          setHasMore(false);
        }
      } catch (error) {
        console.error('Failed to load news:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNews();
  }, []);

  const loadMore = async () => {
    if (isLoadingMore || !hasMore || news.length === 0) return;

    setIsLoadingMore(true);
    try {
      const lastId = news[news.length - 1].id;
      const moreNews = await getNews(lastId);
      if (moreNews.length > 0) {
        setNews(prev => [...prev, ...moreNews]);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to load more news:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const handleArticleClick = (articleId: string) => {
    navigate(`/${localeName}/news/${articleId}`);
  };

  return (
    <main id="news" className="newsPreviewView">
      <h1>{translate('News & Updates')}</h1>

      {isLoading ? (
        <div className="loading">{translate('Loading...')}</div>
      ) : news.length === 0 ? (
        <h2 className="noResults">{translate('No news available')}</h2>
      ) : (
        <>
          {news.map((article, index) => (
            <NewsPreviewCard
              key={`newsPreview-${index}`}
              article={article}
              formatDate={formatDate}
              formatTime={formatTime}
              localeName={localeName || 'international'}
              onNavigate={handleArticleClick}
            />
          ))}

          <div className="buttonWrapper">
            {!hasMore ? (
              <span>{translate('You have reached the end - no more news found.')}</span>
            ) : (
              <button
                className={`gold buttonSecondary loadMore decorative withText withLoadingIndicator${isLoadingMore ? ' loading' : ''}`}
                type="button"
                onClick={loadMore}
                disabled={isLoadingMore}
              >
                <div>{translate('Load more news')}</div>
              </button>
            )}
          </div>
        </>
      )}
    </main>
  );
};

interface NewsPreviewCardProps {
  article: NewsItem;
  formatDate: (timestamp: number) => string;
  formatTime: (timestamp: number) => string;
  localeName: string;
  onNavigate: (articleId: string) => void;
}

/**
 * NewsPreviewCard component
 * Individual news preview card.
 * Matches original tt component structure exactly.
 */
const NewsPreviewCard = ({ article, formatDate, formatTime, localeName, onNavigate }: NewsPreviewCardProps) => {
  const { translate } = useI18n();
  const articleUrl = `/${localeName}/news/${article.id}`;

  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    // Don't navigate if clicking on a link
    if (target.nodeName !== 'A' && target.parentElement?.nodeName !== 'A') {
      onNavigate(article.id);
    }
  };

  return (
    <div className="newsPreviewContainer">
      <div className="newsPreview" onClick={handleClick}>
        <div className="previewImage">
          {article.headerImage ? (
            <img src={article.headerImage} alt={translate('Article image')} />
          ) : (
            <div className="defaultPreviewImage" />
          )}
        </div>
        <h3 className="title">{article.title}</h3>
        <div className="previewText">{article.previewText}</div>
        <div className="date">
          <span>{formatDate(article.date)}</span>
          {' | '}
          <span>{formatTime(article.date)}</span>
        </div>
        <div className="linkToFullArticle">
          <a href={articleUrl} onClick={(e) => { e.preventDefault(); onNavigate(article.id); }}>
            <span className="full">{translate('Read full story')}</span>
            <span className="short">{translate('Read')}</span>
            <ArrowIcon />
          </a>
        </div>
      </div>
    </div>
  );
};

/**
 * Arrow icon for "Read full story" link
 */
const ArrowIcon = () => (
  <svg viewBox="0 0 8 14">
    <path d="M.3 13.7a1 1 0 0 1 0-1.42L5.07 7 .29 1.71A1 1 0 0 1 1.71.3l5.5 6a1 1 0 0 1 0 1.42l-5.5 6a1 1 0 0 1-1.41 0Z" />
  </svg>
);

export default NewsPage;
