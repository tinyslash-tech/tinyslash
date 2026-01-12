import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-xl w-full bg-white rounded-lg shadow-xl overflow-hidden border border-red-200">
            <div className="bg-red-50 p-4 border-b border-red-100 flex items-center">
              <div className="bg-red-100 p-2 rounded-full mr-3">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-red-900">Application Error</h2>
            </div>

            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Something went wrong rendering the application. Please report this to the developer.
              </p>

              <div className="bg-gray-900 rounded-lg p-4 overflow-auto max-h-64 mb-4">
                <code className="text-red-400 font-mono text-sm block mb-2">
                  {this.state.error && this.state.error.toString()}
                </code>
                {this.state.errorInfo && (
                  <pre className="text-gray-500 font-mono text-xs whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>

              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-200 font-medium"
              >
                Clear Cache & Reload
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
