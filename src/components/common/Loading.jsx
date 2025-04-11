import React from "react";

const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="loading-container">
      <div className="loading-content">
        <div className="spinner" role="status" aria-label="Loading"></div>
        {message && <p className="loading-message">{message}</p>}
      </div>
    </div>
  );
};

export default Loading;
