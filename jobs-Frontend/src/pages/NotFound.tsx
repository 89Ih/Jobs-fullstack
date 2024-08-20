import React from 'react';


const NotFound: React.FC = () => {
  return (
    <div className='min-w-full'>
    <div className="not-found-container">
      <h1 className="not-found-title">404</h1>
      <p className="not-found-text">Oops! The page you're looking for doesn't exist.</p>
      <button type='button' className="not-found-button" onClick={() => window.location.href = '/'}>
        Go Home
      </button>
    </div>
    </div>
  );
}

export default NotFound;
