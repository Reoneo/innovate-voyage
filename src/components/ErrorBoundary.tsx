
import React from "react";

type Props = { children: React.ReactNode };
type State = { hasError: boolean; error?: any };

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 32, color: "#b91c1c", fontFamily: "sans-serif" }}>
          <h1>Something went wrong.</h1>
          <pre style={{ background: "#fee2e2", padding: 16, borderRadius: 8, color: "#dc2626", overflow: "auto" }}>
            {this.state.error ? this.state.error.toString() : "Unknown error"}
          </pre>
          <p>Check the browser console for details.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
