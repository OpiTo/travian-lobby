import { useI18n } from '../localization/i18n';

/**
 * ImprintPage component
 * Legal imprint page.
 * Matches original Ct component.
 */
const ImprintPage = () => {
  const { translate } = useI18n();

  return (
    <main id="imprint">
      <h1>{translate('Imprint')}</h1>
      <div className="goldenFrame">
        <svg className="start_start" viewBox="0 0 11 11"><path fill="none" stroke="#7c694b" d="m9.5.5-9 9v-9h9Z"></path><path fill="#cba467" d="M4 8V4h4L4 8Z"></path></svg>
        <svg className="start_end" viewBox="0 0 11 11"><path fill="none" stroke="#7c694b" d="m9.5.5-9 9v-9h9Z"></path><path fill="#cba467" d="M4 8V4h4L4 8Z"></path></svg>
        <svg className="end_start" viewBox="0 0 11 11"><path fill="none" stroke="#7c694b" d="m9.5.5-9 9v-9h9Z"></path><path fill="#cba467" d="M4 8V4h4L4 8Z"></path></svg>
        <svg className="end_end" viewBox="0 0 11 11"><path fill="none" stroke="#7c694b" d="m9.5.5-9 9v-9h9Z"></path><path fill="#cba467" d="M4 8V4h4L4 8Z"></path></svg>
        <div className="contentWrapper">
          <h3>{translate('Responsible for this website')}:</h3>
          <p>{translate('imprintResponsible')}</p>

          <h3>{translate('Jurisdiction')}:</h3>
          <p>{translate('imprintJurisdiction')}</p>

          <h3>{translate('Support')}:</h3>
          <p>
            <a href="https://support.travian.com/en/support/tickets/new" target="_blank" rel="noopener noreferrer">
              {translate('Contact')}
            </a>
          </p>

          <h3>{translate('Youth protection officer')}:</h3>
          <p>{translate('imprintYouthProtection')}</p>

          <h3>{translate('Data protection officer')}:</h3>
          <p>{translate('imprintDataProtection')}</p>

          <br />

          <p>
            {translate("Please don't forget to include your username and game server when you write to Support.")}
          </p>

          <p>
            {translate('All rights to texts, graphics and source codes are held by Travian Games GmbH.')}
          </p>

          <p>
            {translate('Travian is a registered trademark of Travian Games GmbH.')}
          </p>

          <p>
            {translate(
              'The EU Commission has created a platform for online dispute resolution (ODR platform) between merchants and consumers. This ODR platform is available via the following link: {link}. We are not obliged to participate and will currently not take part in alternative dispute resolutions or dispute resolution platforms.',
              { link: 'https://ec.europa.eu/consumers/odr' }
            )}
          </p>
        </div>
      </div>
    </main>
  );
};

export default ImprintPage;
