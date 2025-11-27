// components/ErrorBoundary.tsx
import React, { Component, ErrorInfo } from 'react'; // Removed ReactNode as it's implicitly included via PropsWithChildren
import Button from './Button';

// Fix 1: Modify ErrorBoundaryProps to directly extend React.PropsWithChildren.
// This ensures the 'children' property is implicitly included and correctly typed,
// resolving the error in App.tsx and improving type inference for this.props.
interface ErrorBoundaryProps extends React.PropsWithChildren {}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

// Ensure ErrorBoundary correctly extends React.Component with proper types.
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // Explicitly declare state as a public class field, initialized with the default state.
  // This approach correctly infers 'this.state', 'this.props', and 'this.setState'.
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  // Fix 2: The constructor is already correctly defined. This, in conjunction with
  // the proper generic types for Component<P, S>, ensures 'this.props' and
  // 'this.setState' are correctly inferred and recognized by TypeScript.
  constructor(props: ErrorBoundaryProps) {
    super(props);
  }

  public static getDerivedStateFromError(_: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
    // 'this.setState' is now correctly recognized.
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  public render() {
    // 'this.state' and 'this.props' are now correctly recognized.
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)] p-8 text-center bg-red-50 rounded-lg shadow-md border border-red-200">
          <svg
            className="h-20 w-20 text-red-500 mb-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <h2 className="text-3xl font-bold text-red-700 mb-4">Oops! Something went wrong.</h2>
          <p className="text-lg text-gray-700 mb-6">
            We're sorry for the inconvenience. Our team has been notified and is working on a fix.
          </p>
          <details className="text-left bg-red-100 p-4 rounded-md border border-red-200 text-sm text-red-800 w-full max-w-lg mb-6">
            <summary className="font-semibold cursor-pointer text-red-900">Error Details</summary>
            {this.state.error && <p className="mt-2 font-medium">{this.state.error.toString()}</p>}
            {this.state.errorInfo && (
              <pre className="mt-2 whitespace-pre-wrap break-all overflow-auto max-h-40">
                {this.state.errorInfo.componentStack}
              </pre>
            )}
          </details>
          <Button onClick={() => window.location.reload()} variant="primary" size="lg">
            Reload Page
          </Button>
        </div>
      );
    }

    // 'this.props.children' is now correctly recognized.
    return this.props.children;
  }
}

export default ErrorBoundary;