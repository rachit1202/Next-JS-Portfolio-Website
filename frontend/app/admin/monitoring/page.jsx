'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import {
  Activity,
  RefreshCw,
  Server,
  Database,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Cpu,
  Zap,
  Gauge,
  Play,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Layers
} from 'lucide-react';
import { api } from '@/lib/api';

const ENDPOINTS = [
  { id: 'site-config', name: 'Site Config & Profile CMS', path: '/site-config', method: 'GET', desc: 'Global settings, technical skills, socials & CTA banners' },
  { id: 'projects', name: 'Projects Catalog API', path: '/projects', method: 'GET', desc: 'Case studies, cover images, technology stack' },
  { id: 'services', name: 'Services Offerings API', path: '/services', method: 'GET', desc: 'Service details, deliverables & step-by-step processes' },
  { id: 'blogs', name: 'Blogs & Articles API', path: '/blogs', method: 'GET', desc: 'Published engineering articles, tags & views counter' },
  { id: 'seo', name: 'SEO & Metadata API', path: '/seo', method: 'GET', desc: 'Page meta titles, descriptions & OpenGraph tags' },
  { id: 'health', name: 'System Health Telemetry Probe', path: '/monitoring/health', method: 'GET', desc: 'MongoDB ping latency, memory & server uptime' },
];

export default function AdminMonitoringPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(15); // seconds, 0 = off
  const [countdown, setCountdown] = useState(15);
  const [healthData, setHealthData] = useState(null);
  const [results, setResults] = useState({});
  const [testingEndpointId, setTestingEndpointId] = useState(null);
  const timerRef = useRef(null);

  // Ping a single endpoint directly from client to measure real network roundtrip
  const testSingleEndpoint = useCallback(async (ep) => {
    setTestingEndpointId(ep.id);
    const start = performance.now();
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const token = typeof window !== 'undefined' ? localStorage.getItem('rachit_admin_token') : null;

    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const url = `${API_BASE}${ep.path}${ep.path.includes('?') ? '&' : '?'}_t=${Date.now()}`;
      const res = await fetch(url, {
        cache: 'no-store',
        headers
      });
      const end = performance.now();
      const latencyMs = Math.round(end - start);
      const data = await res.json().catch(() => ({}));
      const itemCount = Array.isArray(data.data) ? data.data.length : (data.data ? 1 : null);

      const result = {
        id: ep.id,
        name: ep.name,
        path: ep.path,
        statusCode: res.status,
        statusText: res.status === 200 ? 'Healthy' : 'Degraded',
        latencyMs,
        itemCount,
        isHealthy: res.status === 200,
        timestamp: new Date().toLocaleTimeString()
      };

      setResults(prev => ({ ...prev, [ep.id]: result }));
      return result;
    } catch (err) {
      const end = performance.now();
      const latencyMs = Math.round(end - start);
      const result = {
        id: ep.id,
        name: ep.name,
        path: ep.path,
        statusCode: 500,
        statusText: 'Down / Error',
        latencyMs,
        isHealthy: false,
        error: err.message,
        timestamp: new Date().toLocaleTimeString()
      };
      setResults(prev => ({ ...prev, [ep.id]: result }));
      return result;
    } finally {
      setTestingEndpointId(null);
    }
  }, []);

  // Run full benchmark for all endpoints concurrently
  const runFullDiagnostics = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Fetch server health probe
      const health = await api.getMonitoringHealth().catch(() => null);
      if (health) setHealthData(health);

      // 2. Ping each endpoint concurrently from client to measure real latency
      await Promise.all(ENDPOINTS.map(ep => testSingleEndpoint(ep)));

      setLastChecked(new Date().toLocaleTimeString());
      setCountdown(autoRefreshInterval);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [autoRefreshInterval, testSingleEndpoint]);

  useEffect(() => {
    const token = localStorage.getItem('rachit_admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    api.getMe().then((res) => {
      if (res.user && res.user.role === 'editor') {
        router.push('/admin/dashboard');
        return;
      }
      runFullDiagnostics();
    }).catch(() => {
      runFullDiagnostics();
    });
  }, [router, runFullDiagnostics]);

  // Auto-refresh countdown timer
  useEffect(() => {
    if (autoRefreshInterval === 0) return;

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          runFullDiagnostics();
          return autoRefreshInterval;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [autoRefreshInterval, runFullDiagnostics]);

  // Derived metrics
  const resultsArray = Object.values(results);
  const totalTested = resultsArray.length;
  const healthyCount = resultsArray.filter(r => r.isHealthy).length;
  const isAllHealthy = totalTested > 0 && healthyCount === totalTested;

  const sortedByLatency = [...resultsArray].sort((a, b) => b.latencyMs - a.latencyMs);
  const slowestApi = sortedByLatency[0] || null;
  const fastestApi = sortedByLatency[sortedByLatency.length - 1] || null;
  const avgLatency = resultsArray.length > 0
    ? Math.round(resultsArray.reduce((sum, r) => sum + r.latencyMs, 0) / resultsArray.length)
    : 0;

  const maxLatency = Math.max(...resultsArray.map(r => r.latencyMs), 100);

  const getLatencyBadge = (latency) => {
    if (latency === null || latency === undefined) return null;
    if (latency < 80) return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Optimal (&lt;80ms)</span>;
    if (latency < 250) return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">Moderate ({latency}ms)</span>;
    return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">Slow ({latency}ms)</span>;
  };

  return (
    <div className="flex min-h-screen bg-[#07080f] text-slate-100">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto w-full">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shadow-lg shadow-emerald-500/20">
                <Activity className="w-4 h-4" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">API Telemetry &amp; Monitoring</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Real-time latency tracker &bull; Pinpoints slow endpoints, network latency, and database responsiveness
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Auto-Refresh Select */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400 text-[11px]">Auto:</span>
              <select
                value={autoRefreshInterval}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setAutoRefreshInterval(val);
                  setCountdown(val);
                }}
                className="bg-transparent text-white font-semibold text-xs focus:outline-none cursor-pointer"
              >
                <option value={10} className="bg-slate-900">10s</option>
                <option value={15} className="bg-slate-900">15s</option>
                <option value={30} className="bg-slate-900">30s</option>
                <option value={0} className="bg-slate-900">Off</option>
              </select>
              {autoRefreshInterval > 0 && (
                <span className="font-mono text-cyan-400 text-[11px] font-bold">({countdown}s)</span>
              )}
            </div>

            {/* Run Diagnostics Button */}
            <button
              onClick={runFullDiagnostics}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-500/25 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Running Diagnostics...' : 'Test All APIs Now'}
            </button>
          </div>
        </div>

        {/* System Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Overall Health Card */}
          <div className="glass-card p-6 rounded-3xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall API Health</span>
              {isAllHealthy ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              )}
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className={`text-2xl sm:text-3xl font-black ${isAllHealthy ? 'text-emerald-400' : 'text-amber-400'}`}>
                {isAllHealthy ? '100% Operational' : `${healthyCount}/${totalTested} Healthy`}
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              {totalTested} endpoints actively monitored
            </p>
          </div>

          {/* Average Latency Card */}
          <div className="glass-card p-6 rounded-3xl space-y-3">
            <div className="flex items-center justify-between text-cyan-400">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Latency</span>
              <Gauge className="w-5 h-5" />
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl sm:text-3xl font-black text-white">{avgLatency} ms</h3>
              {getLatencyBadge(avgLatency)}
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Client round-trip execution time
            </p>
          </div>

          {/* Slowest Endpoint Detector */}
          <div className="glass-card p-6 rounded-3xl space-y-3">
            <div className="flex items-center justify-between text-amber-400">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Slowest Endpoint</span>
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-amber-300 line-clamp-1">
              {slowestApi ? `${slowestApi.name}` : 'N/A'}
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">
              {slowestApi ? `${slowestApi.path} (${slowestApi.latencyMs}ms)` : 'Checking...'}
            </p>
          </div>

          {/* Database Health Card */}
          <div className="glass-card p-6 rounded-3xl space-y-3">
            <div className="flex items-center justify-between text-purple-400">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">MongoDB Atlas Ping</span>
              <Database className="w-5 h-5" />
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl sm:text-3xl font-black text-purple-300">
                {healthData?.database?.latencyMs !== null && healthData?.database?.latencyMs !== undefined
                  ? `${healthData.database.latencyMs} ms`
                  : 'Connected'}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {healthData?.database?.status || 'Connected'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              {healthData?.database?.collectionsCount || 6} Collections synced
            </p>
          </div>

        </div>

        {/* Latency Comparison Progress Meter */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Gauge className="w-4 h-4 text-cyan-400" /> Endpoint Latency Benchmark (Relative Load Time)
              </h3>
              <p className="text-xs text-slate-400">Visual comparison identifying which API takes the most time to respond</p>
            </div>
            {lastChecked && (
              <span className="text-[10px] text-slate-500 font-mono">Last Checked: {lastChecked}</span>
            )}
          </div>

          <div className="space-y-3 pt-2">
            {ENDPOINTS.map((ep) => {
              const res = results[ep.id];
              const latency = res ? res.latencyMs : 0;
              const percent = Math.min(100, Math.max(8, (latency / maxLatency) * 100));

              return (
                <div key={ep.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200 flex items-center gap-2">
                      <code className="text-cyan-400 font-mono text-[11px]">{ep.path}</code>
                      <span className="text-slate-400 text-[11px]">({ep.name})</span>
                    </span>
                    <span className="font-mono font-bold text-slate-300">
                      {res ? `${res.latencyMs} ms` : 'Testing...'}
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800/80">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        !res
                          ? 'bg-slate-700 animate-pulse w-1/4'
                          : latency < 80
                          ? 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                          : latency < 250
                          ? 'bg-gradient-to-r from-amber-500 to-indigo-500'
                          : 'bg-gradient-to-r from-rose-500 to-amber-500'
                      }`}
                      style={{ width: res ? `${percent}%` : '20%' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Real-Time API Endpoint Matrix */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-purple-400" /> Monitored API Endpoint Health Grid
              </h3>
              <p className="text-xs text-slate-400">Live response codes, data payloads, and single-endpoint ping tests</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {ENDPOINTS.map((ep) => {
              const res = results[ep.id];
              const isTesting = testingEndpointId === ep.id;

              return (
                <div
                  key={ep.id}
                  className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-3 flex flex-col justify-between hover:border-slate-700/80 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300">
                        {ep.method}
                      </span>
                      {res ? (
                        res.isHealthy ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> {res.statusCode} OK
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                            <XCircle className="w-3 h-3" /> {res.statusCode} Error
                          </span>
                        )
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800">
                          Probing...
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white">{ep.name}</h4>
                      <code className="text-[11px] text-cyan-400 font-mono block mt-0.5">{ep.path}</code>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{ep.desc}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-900 flex items-center justify-between">
                    <div className="text-[11px]">
                      <span className="text-slate-500">Latency: </span>
                      <span className="font-mono font-bold text-slate-200">
                        {res ? `${res.latencyMs} ms` : '—'}
                      </span>
                      {res?.itemCount !== null && res?.itemCount !== undefined && (
                        <span className="text-slate-500 ml-1.5">({res.itemCount} items)</span>
                      )}
                    </div>

                    <button
                      onClick={() => testSingleEndpoint(ep)}
                      disabled={isTesting}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <RefreshCw className={`w-3 h-3 ${isTesting ? 'animate-spin' : ''}`} />
                      Ping
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Server & Runtime Environment Diagnostics */}
        {healthData?.server && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Cpu className="w-4 h-4 text-emerald-400" /> Fastify Runtime &amp; Infrastructure Telemetry
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <span className="text-slate-400 text-[11px]">Process Uptime</span>
                <p className="text-base font-bold text-white font-mono">{healthData.server.uptimeFormatted}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <span className="text-slate-400 text-[11px]">Node.js Runtime</span>
                <p className="text-base font-bold text-cyan-300 font-mono">{healthData.server.nodeVersion} ({healthData.server.platform})</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <span className="text-slate-400 text-[11px]">Memory Heap (Used / Total)</span>
                <p className="text-base font-bold text-purple-300 font-mono">{healthData.server.memory.heapUsedMb} MB / {healthData.server.memory.heapTotalMb} MB</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <span className="text-slate-400 text-[11px]">Memory RSS Total</span>
                <p className="text-base font-bold text-emerald-300 font-mono">{healthData.server.memory.rssMb} MB</p>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
