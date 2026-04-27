import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch() {
    // Intentionally no-op: avoid noisy console logging in production.
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    const message = this.state.error?.message || 'Unknown error';

    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-xl font-bold text-red-700 mb-2">Page error</h1>
        <p className="text-sm text-slate-600 mb-4">A runtime error prevented this page from rendering.</p>
        <pre className="text-xs bg-slate-900 text-slate-100 rounded-lg p-4 overflow-auto">{message}</pre>
      </div>
    );
  }
}

export default ErrorBoundary;
