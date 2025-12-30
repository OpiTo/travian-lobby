import { useState } from 'react';
import StageControl from './StageControl';
import StageSVG from './StageSVG';

type Tribe = 'romans' | 'teutons' | 'gauls';

const TRIBES: Tribe[] = ['romans', 'teutons', 'gauls'];

const Stage = () => {
  const [currentTribe, setCurrentTribe] = useState<Tribe>('romans');

  const handleBack = () => {
    const currentIndex = TRIBES.indexOf(currentTribe);
    const prevIndex = currentIndex === 0 ? TRIBES.length - 1 : currentIndex - 1;
    setCurrentTribe(TRIBES[prevIndex]);
  };

  const handleForth = () => {
    const currentIndex = TRIBES.indexOf(currentTribe);
    const nextIndex = (currentIndex + 1) % TRIBES.length;
    setCurrentTribe(TRIBES[nextIndex]);
  };

  return (
    <div id="stage" data-tribe={currentTribe}>
      <StageControl onBack={handleBack} onForth={handleForth} />
      <StageSVG />
    </div>
  );
};

export default Stage;
