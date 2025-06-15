
import React from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to console for debugging in white screen cases
    console.error("ErrorBoundary caught an unhandled error:", error, errorInfo);
    this.setState({ hasError: true, error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          background: "#fffbe8",
          color: "#680000",
          padding: 32,
          borderRadius: 12,
          margin: "60px auto",
          maxWidth: 480,
          textAlign: "center",
          fontFamily: "sans-serif",
        }}>
          <h2 style={{ fontSize: 22, marginBottom: 8 }}>Something went wrong.</h2>
          <div style={{
            fontSize: 15,
            wordBreak: "break-word",
            margin: "12px 0",
          }}>
            {this.state.error?.toString()}
          </div>
          <pre style={{
            textAlign: "left",
            fontSize: 12,
            background: "#fde4e4",
            color: "#800",
            padding: 8,
            borderRadius: 6,
            overflowX: "auto",
          }}>
            {this.state.errorInfo?.componentStack}
          </pre>
          <p style={{ marginTop: 12, fontSize: 13, color: "#888" }}>
            (This message is shown only in case of a fatal React error.)
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
