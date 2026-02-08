import React from 'react';
import { Button } from './ui/Button';
import { AlertCircle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-4 text-center text-white">
                    <div className="mb-6 rounded-full bg-red-500/10 p-4">
                        <AlertCircle className="h-12 w-12 text-red-500" />
                    </div>
                    <h1 className="mb-2 text-3xl font-bold">Something went wrong</h1>
                    <p className="mb-8 max-w-md text-slate-400">
                        The application encountered an unexpected error.
                    </p>

                    {this.state.error && (
                        <div className="mb-8 w-full max-w-lg overflow-auto rounded-lg border border-red-500/20 bg-red-950/20 p-4 text-left font-mono text-xs text-red-200">
                            {this.state.error.toString()}
                        </div>
                    )}

                    <Button onClick={this.handleReload} className="gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Reload Application
                    </Button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
