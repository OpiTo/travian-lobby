import { useI18n } from '../../../localization/i18n';

const StageSVG = () => {
  const { locale, translate } = useI18n();

  return (
    <svg className="stageSVG" viewBox="0 0 2688 1512" preserveAspectRatio="xMidYMid meet" direction={locale.direction}>
      <defs>
        <filter id="tribeStageFilterRoman" colorInterpolationFilters="sRGB">
          <feFlood floodColor="#c21c1f" floodOpacity="0.25" result="redFill"></feFlood>
          <feComposite in="redFill" in2="SourceAlpha" operator="in" result="redTint"></feComposite>
          <feBlend in="SourceGraphic" in2="redTint" mode="multiply" result="blended"></feBlend>
          <feComponentTransfer>
            <feFuncR type="linear" slope="1.2"></feFuncR>
            <feFuncG type="linear" slope=".6"></feFuncG>
            <feFuncB type="linear" slope=".6"></feFuncB>
          </feComponentTransfer>
        </filter>
        <filter id="tribeStageFilterTeuton" colorInterpolationFilters="sRGB">
          <feFlood floodColor="#47726e" floodOpacity="0.2" result="blueFill"></feFlood>
          <feComposite in="blueFill" in2="SourceAlpha" operator="in" result="blueTint"></feComposite>
          <feBlend in="SourceGraphic" in2="blueTint" mode="multiply" result="blended"></feBlend>
          <feComponentTransfer>
            <feFuncR type="linear" slope="1.6" intercept="-0.35"></feFuncR>
            <feFuncG type="linear" slope=".9" intercept="0.02"></feFuncG>
            <feFuncB type="linear" slope=".9" intercept="0.02"></feFuncB>
          </feComponentTransfer>
        </filter>
        <filter id="tribeStageFilterGaul" colorInterpolationFilters="sRGB">
          <feFlood floodColor="#c25b07" floodOpacity="0.3" result="orangeFill"></feFlood>
          <feComposite in="orangeFill" in2="SourceAlpha" operator="in" result="orangeTint"></feComposite>
          <feBlend in="SourceGraphic" in2="orangeTint" mode="multiply" result="blended"></feBlend>
          <feComponentTransfer>
            <feFuncR type="linear" slope="1.15" intercept="0.11"></feFuncR>
            <feFuncG type="linear" slope="1" intercept="0.01"></feFuncG>
            <feFuncB type="linear" slope=".5"></feFuncB>
          </feComponentTransfer>
        </filter>
      </defs>
      <image width="2688" height="1512" href="image/tribeStage/layer1.webp"></image>
      <image width="2688" height="1512" href="image/tribeStage/layer2.webp" className="tinted"></image>
      <image width="2688" height="871" x="0" y="641" href="image/tribeStage/layer3.webp" className="tinted"></image>
      <g className="tribeLayer romans">
        <image width="366" height="632" x="2000" y="571" href="image/tribeStage/gaul2.webp"></image>
        <image width="247" height="380" x="713" y="918" href="image/tribeStage/teuton3.webp"></image>
      </g>
      <g className="tribeLayer teutons">
        <image width="416" height="608" x="1987" y="575" href="image/tribeStage/roman2.webp"></image>
        <image width="218" height="375" x="694" y="925" href="image/tribeStage/gaul3.webp"></image>
      </g>
      <g className="tribeLayer gauls">
        <image width="389" height="601" x="1981" y="585" href="image/tribeStage/teuton2.webp"></image>
        <image width="271" height="396" x="701" y="899" href="image/tribeStage/roman3.webp"></image>
      </g>
      <image width="2688" height="398" x="0" y="1114" href="image/tribeStage/layer4.webp" className="tinted"></image>
      <image width="2688" height="653" x="0" y="859" href="image/tribeStage/layer5.webp" className="tinted"></image>
      <image
        width="635"
        height="58"
        x="1067"
        y="1406"
        href="image/tribeStage/unitShadow.webp"
        opacity=".8"
      ></image>
      <g className="tribeLayer romans">
        <g className="headlineContainer">
          <text x="15%" y="10%" dominantBaseline="middle" textAnchor="start" className="headline">{translate('Romans')}</text>
        </g>
        <image width="909" height="1327" x="983" y="140" href="image/tribeStage/roman1.webp"></image>
        <g className="foreignObjectContainer">
          <foreignObject x="15.5%" y="17%" width="100%" height="50%">
            <div>
              {translate('Disciplined legions, advanced engineering, and strategic brilliance define Rome. Lead your legionaries to expand your empire through military might and cultural dominance.')}
            </div>
          </foreignObject>
        </g>
      </g>
      <g className="tribeLayer teutons">
        <g className="headlineContainer">
          <text x="15%" y="10%" dominantBaseline="middle" textAnchor="start" className="headline">{translate('Teutons')}</text>
        </g>
        <image width="828" height="1280" x="998" y="175" href="image/tribeStage/teuton1.webp"></image>
        <g className="foreignObjectContainer">
          <foreignObject x="15.5%" y="17%" width="100%" height="50%">
            <div>
              {translate('Fierce raiders, ruthless warriors, and unrelenting aggression characterize the Teutons. Lead your savage forces to pillage enemies and strike fear into their hearts with lightning-fast attacks.')}
            </div>
          </foreignObject>
        </g>
      </g>
      <g className="tribeLayer gauls">
        <g className="headlineContainer">
          <text x="15%" y="10%" dominantBaseline="middle" textAnchor="start" className="headline">{translate('Gauls')}</text>
        </g>
        <image width="770" height="1331" x="998" y="129" href="image/tribeStage/gaul1.webp"></image>
        <g className="foreignObjectContainer">
          <foreignObject x="15.5%" y="17%" width="100%" height="50%">
            <div>
              {translate('Swift defenders, cunning traps, and hidden crannies protect Gaul resources. Lead your tribe to outlast foes with resilience and guile.')}
            </div>
          </foreignObject>
        </g>
      </g>
    </svg>
  );
};

export default StageSVG;
