'use client';

import { type SyntheticEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LockKeyhole,
  ShieldCheck,
  Activity,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type DemoSession = {
  authenticated: boolean;
  officer_id?: string;
  role?: string;
  expires_at?: string;
};

export function SecurityDemoLogin() {
  const [officerId, setOfficerId] = useState('');
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState('');
  const [session, setSession] = useState<DemoSession>({ authenticated: false });

  function returnPath() {
    const requested = new URLSearchParams(window.location.search).get('next');
    return requested?.startsWith('/') && !requested.startsWith('//')
      ? requested
      : '/';
  }

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/security-demo', { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error('Session check failed');
        setSession((await response.json()) as DemoSession);
      })
      .catch(() => undefined)
      .finally(() => setChecking(false));
    return () => controller.abort();
  }, []);

  async function submit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/security-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ officer_id: officerId, passcode }),
      });
      const result = (await response.json()) as DemoSession & { error?: string };
      if (!response.ok) throw new Error(result.error || 'Unable to verify access.');
      setSession(result);
      setPasscode('');
      window.location.assign(returnPath());
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to verify access.');
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    setLoading(true);
    await fetch('/api/security-demo', { method: 'DELETE' }).catch(() => undefined);
    setSession({ authenticated: false });
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
        {/* Left Copernicus Command Panel */}
        <section className="relative hidden overflow-hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16 border-r border-slate-800">
          <div
            className="absolute -right-28 top-20 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none"
            aria-hidden="true"
          />
          <Link href="/" className="relative flex w-fit items-center gap-3 rounded-lg focus-visible:outline-none">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm shadow-sm shadow-blue-500/20">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="block text-xl font-bold tracking-tight text-white">HeatVector</span>
                <span className="rounded bg-blue-500/20 border border-blue-400/30 px-1.5 py-0.5 font-mono text-[9.5px] font-semibold text-blue-300">
                  DECISION SUPPORT
                </span>
              </div>
              <span className="font-mono text-[10px] text-slate-400 tracking-wider">SIH26083 · GOVERNMENT OF INDIA</span>
            </div>
          </Link>

          <div className="relative max-w-lg">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 font-mono text-[10px] font-semibold text-blue-300">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
              SECURE OFFICER WORKSPACE
            </div>
            <h1 className="text-3xl xl:text-4xl font-bold tracking-tight text-white leading-tight">
              Trusted Disaster Intelligence.<br/>
              Municipal Heat Response Dispatch.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400">
              Public heat information stays open. Operational records, dispatch directives, and municipal warning controls require verified officer access.
            </p>
            <div className="mt-8 grid gap-3">
              {[
                'Officer credentials verified against disaster authority registry',
                'Cryptographically signed HTTP-only operational session',
                'Protected endpoints re-validate authority role on every dispatch',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-xs text-slate-300">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="relative font-mono text-[10px] text-slate-500">
            PUBLIC RISK OPEN · AUTHORITY DISPATCH SECURED · IMD/MoES COMPLIANT
          </p>
        </section>

        {/* Right Form Section */}
        <section className="flex min-h-screen items-center justify-center bg-slate-50 p-5 sm:p-8 lg:p-12">
          <div className="w-full max-w-[440px]">
            <Link href="/" className="mb-8 flex w-fit items-center gap-2.5 text-xs font-semibold text-slate-900 lg:hidden">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
              <span className="text-base font-bold tracking-tight">HeatVector</span>
            </Link>

            <div className="mb-6">
              <span className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-slate-900 text-white shadow-sm">
                <LockKeyhole className="h-5 w-5" />
              </span>
              <p className="font-mono text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
                SECURE OFFICER ACCESS
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                Verify Authority Identity
              </h2>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                Sign in to manage heatwave alerts, deploy municipal cooling, and inspect operational telemetry.
              </p>
            </div>

            {checking ? (
              <div className="flex min-h-64 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-xs">
                <Loader2 className="h-5 w-5 animate-spin text-slate-700" />
                <span className="ml-3 font-mono text-xs text-slate-500">CHECKING SECURE SESSION…</span>
              </div>
            ) : session.authenticated ? (
              <div className="rounded-xl border border-slate-200 bg-white p-7 shadow-xs">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                  <ShieldCheck className="h-6 w-6 stroke-[2.5]" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-slate-900 tracking-tight">Officer Identity Verified</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                  Signed in as <strong className="text-slate-900 font-semibold">{session.officer_id}</strong>. Your emergency response session is active.
                </p>
                <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
                  <Link href="/" className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white shadow-xs transition hover:bg-slate-800">
                    Open Workspace <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Button variant="outline" className="h-9 rounded-lg border-slate-200 text-xs text-slate-700 hover:bg-slate-50" onClick={signOut} disabled={loading}>
                    Sign out
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} className="rounded-xl border border-slate-200 bg-white p-7 shadow-xs">
                {/* 1-Click Auto-Fill Badge */}
                <button
                  type="button"
                  onClick={() => {
                    setOfficerId('admin');
                    setPasscode('admin123');
                  }}
                  className="group mb-5 flex w-full items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3 text-left transition hover:border-slate-300 hover:bg-slate-100/70"
                >
                  <div>
                    <span className="block font-mono text-[9.5px] font-semibold text-slate-500 uppercase tracking-wider">
                      EVALUATOR CREDENTIALS
                    </span>
                    <span className="text-xs text-slate-700">
                      User: <code className="rounded bg-white px-1.5 py-0.5 font-mono text-[11px] text-slate-900 border border-slate-200">admin</code> · Pass: <code className="rounded bg-white px-1.5 py-0.5 font-mono text-[11px] text-slate-900 border border-slate-200">admin123</code>
                    </span>
                  </div>
                  <span className="rounded bg-slate-900 px-2.5 py-1 text-[10.5px] font-medium text-white shadow-xs transition group-hover:bg-slate-800">
                    Auto-fill
                  </span>
                </button>

                <label htmlFor="officer-id" className="block text-xs font-semibold text-slate-700">
                  Officer Username
                </label>
                <div className="relative mt-1.5">
                  <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="officer-id"
                    name="officer-id"
                    autoComplete="username"
                    value={officerId}
                    onChange={(event) => setOfficerId(event.target.value)}
                    className="h-9 pl-9.5 text-xs rounded-lg border-slate-200 bg-white text-slate-900 focus-visible:border-slate-900 focus-visible:ring-1 focus-visible:ring-slate-900"
                    placeholder="e.g. admin"
                    required
                  />
                </div>

                <label htmlFor="passcode" className="mt-4 block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <div className="relative mt-1.5">
                  <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="passcode"
                    name="passcode"
                    type={showPasscode ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={passcode}
                    onChange={(event) => setPasscode(event.target.value)}
                    className="h-9 px-9.5 text-xs rounded-lg border-slate-200 bg-white text-slate-900 focus-visible:border-slate-900 focus-visible:ring-1 focus-visible:ring-slate-900"
                    placeholder="e.g. admin123"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasscode((current) => !current)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 grid h-7 w-7 place-items-center rounded-md text-slate-400 transition hover:text-slate-700"
                    aria-label={showPasscode ? 'Hide passcode' : 'Show passcode'}
                  >
                    {showPasscode ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>

                {error && (
                  <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-medium text-red-700">
                    {error}
                  </p>
                )}

                <Button type="submit" size="lg" className="mt-5 h-9.5 w-full rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-sm" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                  {loading ? 'Verifying access…' : 'Sign In as Officer'}
                </Button>

                <div className="mt-5 border-t border-slate-100 pt-4 text-center">
                  <Link
                    href="/"
                    className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 text-xs font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900 shadow-xs"
                  >
                    Continue as Public Citizen
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
                    View real-time risk, forecasts, spatial maps, and safety advisories without signing in.
                  </p>
                </div>
              </form>
            )}

            <p className="mt-6 text-center font-mono text-[10px] text-slate-400">
              Server-verified · Signed session · Auditable
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
