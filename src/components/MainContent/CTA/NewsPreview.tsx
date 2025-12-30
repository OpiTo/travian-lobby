import { Link } from 'react-router-dom';
import GoldenFrameCorners from './GoldenFrameCorners';
import { useI18n } from '../../../localization/i18n';
import { useLatestNews, useNavigateWithParams } from '../../../hooks';

const NewsPreview = () => {
  const { translate, locale } = useI18n();
  const { news, loading, error } = useLatestNews();
  const navigate = useNavigateWithParams();

  const handleShowAllNews = () => {
    navigate(`/${locale.name}/news`);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return { date: `${day}/${month}/${year}`, time: `${hours}:${minutes}` };
  };

  const getArticleUrl = () => {
    if (!news) return '#';
    const date = new Date(news.date * 1000);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const slug = news.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return `/${locale.name}/news/${year}/${month}/${day}/${slug}/`;
  };

  if (loading) {
    return (
      <div className="newsWrapper infoBoxWrapper">
        <div className="goldenFrame newsPreviewContainer">
          <GoldenFrameCorners />
          <div className="newsPreview">
            <div className="loading">{translate('Loading...')}</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="newsWrapper infoBoxWrapper">
        <div className="goldenFrame newsPreviewContainer">
          <GoldenFrameCorners />
          <div className="newsPreview">
            <h3 className="title">{translate('No news available')}</h3>
          </div>
        </div>
        <button
          className="gold decorative buttonSecondary withText"
          type="button"
          onClick={handleShowAllNews}
        >
          <div>
            <span>{translate('Show all news')}</span>
            <svg viewBox="0 0 20 18">
              <path d="M2 18c-.55 0-1.02-.2-1.41-.59C.2 17.04 0 16.53 0 16V0l1.67 1.67L3.32 0l1.67 1.67L6.67 0l1.65 1.67L10 0l1.68 1.67L13.33 0l1.68 1.67L16.68 0l1.65 1.67L20.01 0v16c0 .55-.2 1.02-.59 1.41-.37.38-.88.59-1.41.59H2Zm0-2h7v-6H2v6Zm9 0h7v-2h-7v2Zm0-4h7v-2h-7v2ZM2 8h16V5H2v3Z"></path>
            </svg>
          </div>
        </button>
      </div>
    );
  }

  const { date, time } = formatDate(news.date);

  return (
    <div className="newsWrapper infoBoxWrapper">
      <div className="goldenFrame newsPreviewContainer">
        <GoldenFrameCorners />
        <div className="newsPreview">
          {news.headerImage && (
            <div className="previewImage">
              <img alt={translate('Article image')} src={news.headerImage} />
            </div>
          )}
          <h3 className="title">{news.title}</h3>
          {news.previewText && <div className="previewText">{news.previewText}</div>}
          <div className="date"><span>{date}</span> | <span>{time}</span></div>
          <div className="linkToFullArticle">
            <Link to={getArticleUrl()} data-discover="true">
              <span className="full">{translate('Read full story')}</span>
              <span className="short">{translate('Read')}</span>
              <svg viewBox="0 0 16 12">
                <path d="m10 12-1.4-1.45L12.15 7H0V5h12.15L8.6 1.45 10 0l6 6-6 6Z"></path>
              </svg>
            </Link>
          </div>
        </div>
      </div>
      <button
        className="gold decorative buttonSecondary withText"
        type="button"
        onClick={handleShowAllNews}
      >
        <div>
          <span>{translate('Show all news')}</span>
          <svg viewBox="0 0 20 18">
            <path d="M2 18c-.55 0-1.02-.2-1.41-.59C.2 17.04 0 16.53 0 16V0l1.67 1.67L3.32 0l1.67 1.67L6.67 0l1.65 1.67L10 0l1.68 1.67L13.33 0l1.68 1.67L16.68 0l1.65 1.67L20.01 0v16c0 .55-.2 1.02-.59 1.41-.37.38-.88.59-1.41.59H2Zm0-2h7v-6H2v6Zm9 0h7v-2h-7v2Zm0-4h7v-2h-7v2ZM2 8h16V5H2v3Z"></path>
          </svg>
        </div>
      </button>
    </div>
  );
};

export default NewsPreview;
