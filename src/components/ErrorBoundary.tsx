
import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    console.error('ErrorBoundary: Caught error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary: Error details:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '100vh',
          padding: '16px',
          backgroundColor: '#f9fafb'
        }}>
          <div style={{ 
            textAlign: 'center',
            maxWidth: '500px',
            backgroundColor: 'white',
            padding: '32px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <h1 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#dc2626', 
              marginBottom: '16px' 
            }}>
              Something went wrong
            </h1>
            <p style={{ 
              color: '#6b7280', 
              marginBottom: '16px',
              lineHeight: '1.5'
            }}>
              An error occurred while loading the application. This might be a temporary issue.
            </p>
            {this.state.error && (
              <details style={{ 
                marginBottom: '16px', 
                textAlign: 'left',
                backgroundColor: '#f3f4f6',
                padding: '12px',
                borderRadius: '4px',
                fontSize: '14px'
              }}>
                <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                  Error Details
                </summary>
                <pre style={{ 
                  marginTop: '8px', 
                  fontSize: '12px',
                  overflow: 'auto'
                }}>
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                onClick={() => window.location.reload()}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Reload Page
              </button>
              <button 
                onClick={() => this.setState({ hasError: false, error: undefined, errorInfo: undefined })}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Try Again
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
