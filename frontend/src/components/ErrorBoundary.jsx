import React from 'react';

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = React.useState(false);

  // In a real app, we'd use componentDidCatch. For this functional component, 
  // we'll use a simple wrapper to catch async errors.
  const handleError = (error) => {
    console.error('Application Error:', error);
    setHasError(true);
  };

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-12 text-center space-y-4">
        <div className="bg-red-900/20 p-4 rounded-full text-red-500">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.023 0 1.847-1.154 1.424-2.166L13.382 5.53c-.423-1.013-1.424-1.53-2.424-1.53H6.424c-1.023 0-1.847 1.154-1.424 2.166L10.576 18.334" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white">Something went wrong</h2>
        <p className="text-gray-400 max-w-md">
          The system encountered an unexpected error while processing the telemetry data. 
          Please try refreshing the page or contact the system administrator.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh Application
        </button>
      </div>
    );
  }

  return <div onError={handleError}>{children}</div>;
};

export default ErrorBoundary;
