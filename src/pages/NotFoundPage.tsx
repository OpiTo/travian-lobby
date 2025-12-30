/**
 * NotFoundPage component
 * 404 error page.
 * Matches original Et component.
 */
const NotFoundPage = () => {
  const handleBack = () => {
    window.location.href = '/';
  };

  return (
    <main id="errorPage" className="notFound">
      <h1>404 Error</h1>
      <p>
        Vanished in the dunes!
        <br />
        This page got buried in the desert sands.
      </p>
      <button
        className="gold buttonSecondary withText"
        type="button"
        onClick={handleBack}
      >
        <div>
          <span>Bring me back</span>
        </div>
      </button>
    </main>
  );
};

export default NotFoundPage;
