import { Component } from 'react';

// Error Boundary component to catch and handle JavaScript errors in React components
// Prevents the entire app from crashing when a component throws an error
// Displays a fallback UI when an error occurs
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    // Initialize state with error tracking variables
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  // Static method to update state when an error is caught
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  // Lifecycle method called when an error is caught by the boundary
  componentDidCatch(error, errorInfo) {
    // Update state with error details for display
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    // If an error occurred, render fallback UI
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 space-y-4">
            <div className="text-red-600 text-2xl font-bold">Something went wrong</div>
            <p className="text-gray-600">
              We're sorry, but something went wrong. Please try refreshing the page.
            </p>
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-4 p-4 bg-red-100 rounded">
                <summary className="font-semibold cursor-pointer">Error Details</summary>
                <pre className="mt-2 text-sm text-red-800 overflow-auto">
                  {this.state.error && this.state.error.toString()}
                </pre>
              </details>
            )}
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    // If no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;