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
