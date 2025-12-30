import { useI18n } from '../localization/i18n';

const GameRulesPage = () => {
  const { translate } = useI18n();

  return (
    <main id="gameRules">
      <h1>{translate('Game Rules')}</h1>
      <div className="goldenFrame">
        <svg className="start_start" viewBox="0 0 11 11"><path fill="none" stroke="#7c694b" d="m9.5.5-9 9v-9h9Z"></path><path fill="#cba467" d="M4 8V4h4L4 8Z"></path></svg>
        <svg className="start_end" viewBox="0 0 11 11"><path fill="none" stroke="#7c694b" d="m9.5.5-9 9v-9h9Z"></path><path fill="#cba467" d="M4 8V4h4L4 8Z"></path></svg>
        <svg className="end_start" viewBox="0 0 11 11"><path fill="none" stroke="#7c694b" d="m9.5.5-9 9v-9h9Z"></path><path fill="#cba467" d="M4 8V4h4L4 8Z"></path></svg>
        <svg className="end_end" viewBox="0 0 11 11"><path fill="none" stroke="#7c694b" d="m9.5.5-9 9v-9h9Z"></path><path fill="#cba467" d="M4 8V4h4L4 8Z"></path></svg>
        <div className="contentWrapper">
          <p>
            {translate('gameRulesInfo')}{' '}
            <a href="http://agb.traviangames.com/terms-en.pdf" target="_blank" rel="noopener noreferrer">
              {translate('Terms & Conditions')}
            </a>
          </p>

          <h3>§ 1. {translate('Avatar')}:</h3>
          <p><strong>§ 1.1.a</strong> {translate('gameRules1.1.a')}</p>
          <p><strong>§ 1.1.b</strong> {translate('gameRules1.1.b')}</p>
          <ul>
            <li>{translate('gameRules1.1.b-1')}</li>
            <li>{translate('gameRules1.1.b-2')}</li>
          </ul>
          <p><strong>§ 1.2</strong> {translate('gameRules1.2')}</p>
          <p><strong>§ 1.3.a</strong> {translate('gameRules1.3.a')}</p>
          <p><strong>§ 1.3.b</strong> {translate('gameRules1.3.b')}</p>
          <p><strong>§ 1.4</strong> {translate('gameRules1.4')}</p>
          <p><strong>§ 1.5</strong> {translate('gameRules1.5')}</p>
          <p><strong>§ 1.6</strong> {translate('gameRules1.6')}</p>
          <p><strong>§ 1.7</strong> {translate('gameRules1.7')}</p>
          <p><strong>§ 1.8</strong> {translate('gameRules1.8')}</p>

          <h3>§ 2. {translate('Sitting an avatar')}:</h3>
          <p><strong>§ 2.1</strong> {translate('gameRules2.1')}</p>
          <p><strong>§ 2.2</strong> {translate('gameRules2.2')}</p>

          <h3>§ 3. {translate('Use of external programs')}:</h3>
          <p>{translate('gameRules3.1')}</p>
          <ul>
            <li>{translate('gameRules3.1.1')}</li>
            <li>{translate('gameRules3.1.2')}</li>
            <li>{translate('gameRules3.1.3')}</li>
            <li>{translate('gameRules3.1.4')}</li>
            <li>{translate('gameRules3.1.5')}</li>
            <li>{translate('gameRules3.1.6')}</li>
            <li>{translate('gameRules3.1.7')}</li>
            <li>{translate('gameRules3.1.8')}</li>
            <li>{translate('gameRules3.1.9')}</li>
            <li>{translate('gameRules3.1.10')}</li>
            <li>{translate('gameRules3.1.11')}</li>
          </ul>
          <p>{translate('gameRules3.2')}</p>

          <h3>§ 4. {translate('Program errors / bugs')}:</h3>
          <p>{translate('gameRules4.1')}</p>

          <h3>§ 5. {translate('Selling/buying game content')}:</h3>
          <p>{translate('gameRules5.1')}</p>

          <h3>§ 6. {translate('Netiquette')}:</h3>
          <p><strong>§ 6.1</strong> {translate('gameRules6.1')}</p>
          <p><strong>§ 6.2</strong> {translate('gameRules6.2')}</p>
          <p><strong>§ 6.3</strong> {translate('gameRules6.3')}</p>
          <p><strong>§ 6.4</strong> {translate('gameRules6.4')}</p>
          <p><strong>§ 6.5</strong> {translate('gameRules6.5')}</p>
          <p><strong>§ 6.6</strong> {translate('gameRules6.6')}</p>
          <p><strong>§ 6.7</strong> {translate('gameRules6.7')}</p>
          <p><strong>§ 6.8</strong> {translate('gameRules6.8')}</p>

          <h3>§ 7. {translate('Punishments')}:</h3>
          <p><strong>§ 7.1</strong> {translate('gameRules7.1')}</p>
          <p><strong>§ 7.2</strong> {translate('gameRules7.2')}</p>

          <h3>§ 8. {translate('Rule changes and correction clause')}:</h3>
          <p><strong>§ 8.1</strong> {translate('gameRules8.1')}</p>
          <p><strong>§ 8.2</strong> {translate('gameRules8.2')}</p>
          <p><strong>§ 8.3</strong> {translate('gameRules8.3')}</p>

          <br />

          <p>
            {translate('More detailed explanations of certain game rules can be found in the')}{' '}
            <a
              href="https://support.travian.com/support/solutions/articles/7000058111-game-rules-faq"
              target="_blank"
              rel="noopener noreferrer"
            >
              {translate('Game Rules FAQ')}
            </a>
          </p>
        </div>
      </div>
    </main>
  );
};

export default GameRulesPage;
