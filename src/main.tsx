import { StrictMode, Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 40, color: '#ff6b6b', background: '#0d1b2a', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h1 style={{ color: '#c9a84c' }}>Cultivation Sect Tycoon — Error</h1>
          <pre style={{ whiteSpace: 'pre-wrap', marginTop: 20, color: '#e8dcc8' }}>
            {this.state.error.message}
          </pre>
          <pre style={{ whiteSpace: 'pre-wrap', marginTop: 10, fontSize: 12, color: '#a89660' }}>
            {this.state.error.stack}
          </pre>
          <button
            onClick={() => { localStorage.clear(); window.location.reload(); }}
            style={{ marginTop: 20, padding: '10px 20px', background: '#d94a2b', color: '#e8dcc8', border: 'none', cursor: 'pointer', borderRadius: 4 }}
          >
            Clear Save & Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
