import { navigate } from '../../utils/navigation';
import { useI18n } from '../../localization/i18n';

const LanguageSelector = () => {
  const { locale } = useI18n();

  const handleClick = () => {
    navigate('#languageSelection');
  };

  return (
    <button
      className="gold buttonSecondary language withText"
      type="button"
      onClick={handleClick}
    >
      <div>
        <i className={`flag ${locale.flag}`}></i>
        <span>{locale.langNative}</span>
      </div>
    </button>
  );
};

export default LanguageSelector;
