const Loading = ({ title = '', loading = false }) => {
  return (
    <>
      {loading ? (
        <>
          <div
            className="spinner-border spinner-border-sm mx-2"
            role="status"
          ></div>
          <span>{title}</span>
        </>
      ) : (
        <span>{title}</span>
      )}
    </>
  );
};

export default Loading;

// The summary of this page includes:
// This page allows you to easily integrate loading animations into any other page applications
// by controlling the visibility of the spinner based on the loading prop.
