/**
 * Error boundary — stops a crashing component from taking down the whole
 * dashboard during a check-in rush. Renders a fallback UI and offers a
 * "Refresh page" recovery action.
 */
import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null, errorInfo: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // In production you could send this to an error reporting service here.
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('havendesk:error-boundary', {
          detail: { error, errorInfo },
        })
      );
    }
  }

  reset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong</h2>
          <p>
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button className="primary-button" onClick={this.reset}>
            Refresh page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
