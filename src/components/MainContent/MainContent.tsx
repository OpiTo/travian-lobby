import Stage from './Stage';
import CTAWrapper from './CTA';

const MainContent = () => {
  return (
    <main id="main" className="withStage">
      <Stage />
      <CTAWrapper />
    </main>
  );
};

export default MainContent;
