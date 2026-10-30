import React, { useState, useEffect } from 'react';
import {
  Activity,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Database,
  ShieldCheck,
  Smartphone,
  Trash2,
  ChevronDown,
  ChevronUp,
  Wifi,
  WifiOff,
  Server,
  Layers,
  Clock
} from 'lucide-react';
import {
  testFirestoreConnection,
  testFirestoreWrite,
  isFirebaseConfigured,
  resolvedConfig,
  initError
} from '../firebase/config.js';
import {
  getErrorLogs,
  clearErrorLogs,
  subscribeToErrorLogs,
  getDeviceInfo
} from '../utils/errorLogger.js';

export default function AdminDiagnosticsTab({ currentUser, lastSyncTime, onRefreshData }) {
  const [connectionStatus, setConnectionStatus] = useState({ testing: false, result: null });
  const [writeStatus, setWriteStatus] = useState({ testing: false, result: null });
  const [logs, setLogs] = useState(getErrorLogs());
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedLogId, setExpandedLogId] = useState(null);
  const [deviceInfo, setDeviceInfo] = useState(getDeviceInfo());

  // Subscribe to real-time error logs
  useEffect(() => {
    const unsub = subscribeToErrorLogs((_, allLogs) => {
      setLogs([...allLogs]);
    });
    return unsub;
  }, []);

  // Run initial diagnostic check upon tab load
  useEffect(() => {
    runFullDiagnostics();
  }, []);

  const runFullDiagnostics = async () => {
    setConnectionStatus({ testing: true, result: null });
    setWriteStatus({ testing: true, result: null });

    const connRes = await testFirestoreConnection();
    setConnectionStatus({ testing: false, result: connRes });

    const writeRes = await testFirestoreWrite();
    setWriteStatus({ testing: false, result: writeRes });

    setDeviceInfo(getDeviceInfo());
    if (onRefreshData) {
      await onRefreshData();
    }
  };

  const filteredLogs = logs.filter((log) => {
    if (selectedCategory === 'All') return true;
    return log.category === selectedCategory;
  });

  const categories = ['All', 'React', 'Firebase', 'Firestore', 'Auth', 'Network', 'JavaScript', 'UnhandledPromise'];

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-[#12345A] to-[#1E3A5F] p-5 rounded-3xl text-white shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#F2BE4F]" />
            <h2 className="font-heading font-extrabold text-base sm:text-lg">
              System Health & Diagnostics Center
            </h2>
          </div>
          <p className="text-xs text-slate-300 max-w-xl">
            Live verification of Firebase cloud database, authentication rules, read/write latency, and client runtime error telemetry.
          </p>
        </div>

        <button
          type="button"
          disabled={connectionStatus.testing || writeStatus.testing}
          onClick={runFullDiagnostics}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#F2BE4F] hover:bg-[#e0ac3c] text-[#0B1F3A] text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer self-start sm:self-center"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${connectionStatus.testing || writeStatus.testing ? 'animate-spin' : ''}`} />
          <span>{connectionStatus.testing ? 'Testing...' : 'Run Diagnostics Test'}</span>
        </button>
      </div>

      {/* 4 Health Status Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Firebase Connectivity */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E3EAF2] space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Database Connection</span>
            <Database className="w-4 h-4 text-[#2468B4]" />
          </div>
          <div>
            {connectionStatus.testing ? (
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold py-1">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#12345A]" />
                <span>Pinging Firestore...</span>
              </div>
            ) : connectionStatus.result?.connected ? (
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Connected ({connectionStatus.result.latencyMs}ms)</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-red-600 font-bold text-sm">
                <XCircle className="w-4 h-4 text-red-500" />
                <span>Offline / Error</span>
              </div>
            )}
          </div>
          <div className="text-[11px] text-slate-500 truncate" title={resolvedConfig.firestoreDatabaseId}>
            DB: <span className="font-mono text-slate-700 font-semibold">{resolvedConfig.firestoreDatabaseId || '(default)'}</span>
          </div>
        </div>

        {/* 2. Authentication Status */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E3EAF2] space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Auth Status</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            {currentUser ? (
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Authorized Admin</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-amber-700 font-bold text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Not Authenticated</span>
              </div>
            )}
          </div>
          <div className="text-[11px] text-slate-500 truncate" title={currentUser?.email || 'N/A'}>
            Account: <span className="font-semibold text-slate-700">{currentUser?.email || 'Demo Mode'}</span>
          </div>
        </div>

        {/* 3. Firestore Write Capability */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E3EAF2] space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Write Capability</span>
            <Server className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            {writeStatus.testing ? (
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold py-1">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#12345A]" />
                <span>Testing Write...</span>
              </div>
            ) : writeStatus.result?.success ? (
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Write Verified ({writeStatus.result.latencyMs}ms)</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-red-600 font-bold text-sm">
                <XCircle className="w-4 h-4 text-red-500" />
                <span>Write Failed</span>
              </div>
            )}
          </div>
          <div className="text-[11px] text-slate-500 truncate">
            {writeStatus.result?.error ? (
              <span className="text-red-600 font-medium">{writeStatus.result.error}</span>
            ) : (
              <span>Permanent cloud storage active</span>
            )}
          </div>
        </div>

        {/* 4. Client & Device Runtime */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E3EAF2] space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Client Device</span>
            <Smartphone className="w-4 h-4 text-[#12345A]" />
          </div>
          <div className="flex items-center gap-1.5 font-bold text-sm text-[#182B45]">
            {deviceInfo.online ? (
              <Wifi className="w-4 h-4 text-emerald-600" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-600" />
            )}
            <span>{deviceInfo.os} • {deviceInfo.browser}</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Viewport: <span className="font-semibold text-slate-700">{deviceInfo.screen}</span>
          </div>
        </div>
      </div>

      {/* Sync State & Config Details Card */}
      <div className="bg-white rounded-3xl p-5 border border-[#E3EAF2] space-y-3">
        <h3 className="font-heading font-bold text-sm text-[#182B45] flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#2468B4]" />
          <span>Firebase & Environment Configuration Summary</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-slate-400 font-semibold text-[10px] uppercase">GCP Project ID</div>
            <div className="font-mono font-bold text-slate-800 mt-0.5">{resolvedConfig.projectId || 'N/A'}</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-slate-400 font-semibold text-[10px] uppercase">Firestore Database ID</div>
            <div className="font-mono font-bold text-slate-800 mt-0.5">{resolvedConfig.firestoreDatabaseId || '(default)'}</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-slate-400 font-semibold text-[10px] uppercase">Last Data Sync</div>
            <div className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{lastSyncTime ? new Date(lastSyncTime).toLocaleTimeString() : 'Just now'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Runtime Error Logs & Telemetry Section */}
      <div className="bg-white rounded-3xl p-5 border border-[#E3EAF2] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-bold text-base text-[#182B45]">
                Recent Application Runtime Logs
              </h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                logs.length > 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {logs.length} {logs.length === 1 ? 'Event' : 'Events'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Captures React render warnings, unhandled rejections, Firestore permissions, and network failures.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={logs.length === 0}
              onClick={() => {
                clearErrorLogs();
                setLogs([]);
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition-colors disabled:opacity-40 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Logs</span>
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#12345A] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Logs List */}
        {filteredLogs.length === 0 ? (
          <div className="py-10 text-center text-slate-400 space-y-2 border border-dashed border-slate-200 rounded-2xl">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <p className="text-xs font-bold text-slate-700">All systems operational</p>
            <p className="text-[11px] text-slate-400">No runtime errors captured in this session.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden text-xs">
            {filteredLogs.map((log) => {
              const isExpanded = expandedLogId === log.id;
              return (
                <div key={log.id} className="p-3.5 hover:bg-slate-50/70 transition-colors space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          log.category === 'React'
                            ? 'bg-rose-100 text-rose-800'
                            : log.category === 'Firestore' || log.category === 'Firebase'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {log.category}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                        <span className="text-[11px] text-slate-500 truncate max-w-[200px]">
                          in <strong className="text-slate-700">{log.component}</strong>
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-800 break-words">
                        {log.message}
                      </p>
                      <div className="text-[10px] text-slate-400">
                        {log.device}
                      </div>
                    </div>

                    {log.stack && (
                      <button
                        type="button"
                        onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                        className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer shrink-0"
                        title="Toggle stack trace"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    )}
                  </div>

                  {isExpanded && log.stack && (
                    <div className="p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-[10px] overflow-x-auto whitespace-pre-wrap max-h-48 border border-slate-800">
                      {log.stack}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
