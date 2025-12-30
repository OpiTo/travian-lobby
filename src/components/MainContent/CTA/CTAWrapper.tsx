import NewsPreview from './NewsPreview';
import PlayNowButton from './PlayNowButton';
import CalendarPreview from './CalendarPreview';

const CTAWrapper = () => {
  return (
    <div className="ctaWrapper">
      <NewsPreview />
      <PlayNowButton />
      <CalendarPreview />
    </div>
  );
};

export default CTAWrapper;
