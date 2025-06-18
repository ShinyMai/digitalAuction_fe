import React, { Component } from "react";
import type { ReactNode } from "react";
import { Button, Result } from "antd";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(
    error: Error,
    errorInfo: React.ErrorInfo
  ) {
    console.error(
      "Router Error Boundary caught an error:",
      error,
      errorInfo
    );
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Result
          status="500"
          title="500"
          subTitle="Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại."
          extra={
            <Button
              type="primary"
              onClick={this.handleReload}
            >
              Tải lại trang
            </Button>
          }
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
