import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useI18n } from '../localization/i18n';
import { getArticle, NewsItem } from '../services/lobby';

/**
 * NewsArticlePage component
 * Shows a single news article.
 * Matches original Nt component.
 */
const NewsArticlePage = () => {
  const { translate, locale } = useI18n();
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<NewsItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticle = async () => {
      if (!articleId) {
        setError('Article not found');
        setIsLoading(false);
        return;
      }

      try {
        const data = await getArticle(articleId);
        setArticle(data);
      } catch (err) {
        setError('Failed to load article');
        console.error('Failed to load article:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadArticle();
  }, [articleId]);

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const handleBack = () => {
    navigate(`/${locale.name}/news`);
  };

  if (isLoading) {
    return (
      <main id="news" className="newsArticleView">
        <div className="loading">{translate('Loading...')}</div>
      </main>
    );
  }

  if (error || !article) {
    return (
      <main id="news" className="newsArticleView">
        <h1>{translate('News & Updates')}</h1>
        <div className="error">{error || translate('Article not found')}</div>
        <button className="gold buttonSecondary back withText" type="button" onClick={handleBack}>
          <div>
            <BackArrowIcon />
            <span>{translate('To news overview')}</span>
          </div>
        </button>
      </main>
    );
  }

  return (
    <main id="news" className="newsArticleView">
      <h1>{translate('News & Updates')}</h1>
      
      <div className="contentWrapper newsArticle">
        <button className="gold buttonSecondary back withText" type="button" onClick={handleBack}>
          <div>
            <BackArrowIcon />
            <span>{translate('To news overview')}</span>
          </div>
        </button>

        <div className="headerImage">
          {article.headerImage ? (
            <img src={article.headerImage} alt={translate('Article image')} />
          ) : (
            <div className="defaultHeaderImage" />
          )}
        </div>

        <h3 className="title">{article.title}</h3>

        <div className="date">
          <span>{formatDate(article.date)}</span>
          {' | '}
          <span>{formatTime(article.date)}</span>
        </div>

        {article.fullHTMLText && (
          <div
            className="fullArticle"
            dangerouslySetInnerHTML={{ __html: article.fullHTMLText }}
          />
        )}
      </div>
    </main>
  );
};

/**
 * Back arrow icon
 */
const BackArrowIcon = () => (
  <svg viewBox="0 0 20 36">
    <path d="M20 36 2 18 20 0v36ZM4.95 18l12.97 12.97V5.03L4.95 18Z" />
    <path d="m6 24-6-6 6-6 .41.41L.83 18l5.58 5.59L6 24z" />
  </svg>
);

export default NewsArticlePage;
