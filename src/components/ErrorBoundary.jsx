import React from 'react';
import { AlertTriangle, RefreshCw, Home, ShieldAlert, ChevronDown, ChevronUp } from 'lucide-react';
import { logAppError, getDeviceInfo } from '../utils/errorLogger.js';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    logAppError({
      category: 'React',
      message: error?.message || 'React rendering crash',
      component: errorInfo?.componentStack?.split('\n')?.[1]?.trim() || 'React Component',
      stack: error?.stack || errorInfo?.componentStack || '',
      metadata: { componentStack: errorInfo?.componentStack }
    });
    console.error('[ExamQuestHub ErrorBoundary]', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleHardReset = () => {
    try {
      window.sessionStorage?.clear();
    } catch {
      // Ignore
    }
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const deviceInfo = getDeviceInfo();
      return (
        <div className="min-h-screen bg-[#F6F8FC] flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white rounded-3xl border border-[#E3EAF2] shadow-xl p-6 sm:p-8 space-y-6 text-center">
            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 mx-auto flex items-center justify-center shadow-xs">
              <AlertTriangle className="w-8 h-8" />
            </div>

            {/* Heading & Explanation */}
            <div className="space-y-2">
              <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-[#12345A]">
                Unable to Load Content
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                An unexpected interface error occurred on this screen. Your data and session are safe.
                Please retry or reload to restore normal operation.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={this.handleRetry}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#12345A] hover:bg-[#0B1F3A] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>

              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto px-4 py-2.5 bg-[#EAF3FF] hover:bg-[#d8e8fc] text-[#12345A] text-xs font-bold rounded-xl transition-all border border-[#2468B4]/20 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Reload Page</span>
              </button>

              <button
                type="button"
                onClick={this.handleHardReset}
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Go to Home</span>
              </button>
            </div>

            {/* Expandable Technical Details (Safe, sanitized) */}
            <div className="pt-4 border-t border-slate-100 text-left">
              <button
                type="button"
                onClick={() => this.setState({ showDetails: !this.state.showDetails })}
                className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 flex items-center justify-between w-full cursor-pointer py-1"
              >
                <span className="flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
                  Technical Diagnostics ({deviceInfo.os} • {deviceInfo.browser})
                </span>
                {this.state.showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {this.state.showDetails && (
                <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-[10px] text-slate-600 font-mono overflow-x-auto space-y-1">
                  <div><strong>Error:</strong> {String(this.state.error?.message || 'Unknown error')}</div>
                  <div><strong>Device:</strong> {deviceInfo.os} • {deviceInfo.browser} ({deviceInfo.screen})</div>
                  <div><strong>Online:</strong> {deviceInfo.online ? 'Yes' : 'No'}</div>
                  {this.state.error?.stack && (
                    <div className="mt-1 text-slate-400 max-h-32 overflow-y-auto whitespace-pre-wrap">
                      {this.state.error.stack.slice(0, 500)}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
