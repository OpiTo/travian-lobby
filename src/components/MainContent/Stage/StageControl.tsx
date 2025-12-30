interface StageControlProps {
  onBack: () => void;
  onForth: () => void;
}

const StageControl = ({ onBack, onForth }: StageControlProps) => {
  return (
    <div className="stageControl">
      <button 
        className="decorative gold round buttonSecondary back withText" 
        type="button"
        onClick={onBack}
      >
        <div>
          <svg viewBox="0 0 20 36">
            <path d="M20 36 2 18 20 0v36ZM4.95 18l12.97 12.97V5.03L4.95 18Z"></path>
            <path d="m6 24-6-6 6-6 .41.41L.83 18l5.58 5.59L6 24z"></path>
          </svg>
        </div>
      </button>
      <button 
        className="decorative gold round buttonSecondary forth withText" 
        type="button"
        onClick={onForth}
      >
        <div>
          <svg viewBox="0 0 20 36">
            <path d="M20 36 2 18 20 0v36ZM4.95 18l12.97 12.97V5.03L4.95 18Z"></path>
            <path d="m6 24-6-6 6-6 .41.41L.83 18l5.58 5.59L6 24z"></path>
          </svg>
        </div>
      </button>
    </div>
  );
};

export default StageControl;
