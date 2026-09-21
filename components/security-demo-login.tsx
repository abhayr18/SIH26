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
    <main className="min-h-screen bg-[#f5f2ec] text-[#12203a]">
      <div className="grid min-h-screen lg:grid-cols-[0.9fr_1.1fr]">
        <section className="relative hidden overflow-hidden bg-[#0d1e38] p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
          <div
            className="absolute -right-28 top-20 h-96 w-96 rounded-full border border-white/10"
            aria-hidden="true"
          />
          <div
            className="absolute -right-12 top-36 h-64 w-64 rounded-full border border-[#f2c96c]/25"
            aria-hidden="true"
          />
          <Link href="/" className="relative flex w-fit items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#f2c96c]/60">
            <span className="grid h-11 w-11 place-items-center rounded-xl border border-white/15 bg-white/10 text-[#f2c96c] shadow-lg">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <span>
              <b className="block text-lg">ThermoWatch</b>
              <small className="font-mono text-[11px] tracking-[0.18em] text-blue-100/55">SIH26083 · INDIA</small>
            </span>
          </Link>

          <div className="relative max-w-lg">
            <p className="mb-4 font-mono text-xs font-semibold tracking-[0.2em] text-[#f2c96c]">SECURE OFFICER WORKSPACE</p>
            <h1 className="text-4xl font-bold leading-tight tracking-[-0.04em] xl:text-5xl">
              Trusted access for critical heat-response work.
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-blue-100/70">
              Public heat information stays open. Operational records, response tools and warning controls require verified officer access.
            </p>
            <div className="mt-9 grid gap-4">
              {[
                'Officer credentials are checked on the server',
                'Session cookie is signed and inaccessible to JavaScript',
                'Operational APIs verify the officer role on every request',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-blue-50/85">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-400/15 text-emerald-300">
                    <Check className="h-4 w-4" />
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <p className="relative text-xs leading-5 text-blue-100/45">
            Public risk data remains open. Authority operations are protected and auditable.
          </p>
        </section>

        <section className="flex min-h-screen items-center justify-center p-5 sm:p-8 lg:p-12">
          <div className="w-full max-w-[470px]">
            <Link href="/" className="mb-8 flex w-fit items-center gap-2.5 text-sm font-semibold text-blue-700 hover:underline lg:hidden">
              <ShieldCheck className="h-5 w-5" /> ThermoWatch
            </Link>

            <div className="mb-6">
              <span className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-700 border border-blue-100 shadow-sm">
                <LockKeyhole className="h-5 w-5" />
              </span>
              <p className="font-mono text-[11px] font-bold tracking-[0.18em] text-blue-700">SECURE OFFICER ACCESS</p>
              <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Verify Authority Identity</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Sign in to manage heat alerts, deploy municipal interventions, and access operational audits.
              </p>
            </div>

            {checking ? (
              <div className="flex min-h-64 items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-sm">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                <span className="ml-3 text-sm text-slate-600">Checking secure session…</span>
              </div>
            ) : session.authenticated ? (
              <div className="rounded-3xl border border-emerald-200 bg-white p-7 shadow-sm sm:p-8">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <ShieldCheck className="h-7 w-7" />
                </span>
                <h3 className="mt-5 text-2xl font-bold text-slate-900">Officer identity verified</h3>
                <p className="mt-2 text-base leading-7 text-slate-600">
                  Signed in as <b className="text-slate-900">{session.officer_id}</b>. Your officer session is active.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <Link href="/" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/30">
                    Open workspace <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Button variant="outline" className="min-h-11" onClick={signOut} disabled={loading}>
                    Sign out
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-[0_20px_50px_rgba(15,23,42,0.06)] sm:p-8">
                {/* 1-Click Auto-Fill Badge */}
                <button
                  type="button"
                  onClick={() => {
                    setOfficerId('admin');
                    setPasscode('admin123');
                  }}
                  className="group mb-5 flex w-full items-center justify-between rounded-xl border border-blue-100 bg-blue-50/60 p-3 text-left transition-all hover:border-blue-300 hover:bg-blue-50"
                >
                  <div>
                    <span className="block font-mono text-[10px] font-bold uppercase tracking-wider text-blue-700">Quick Test Credentials</span>
                    <span className="text-xs font-semibold text-slate-800">Username: <code className="rounded bg-blue-100/80 px-1 py-0.5 text-blue-900">admin</code> &middot; Pass: <code className="rounded bg-blue-100/80 px-1 py-0.5 text-blue-900">admin123</code></span>
                  </div>
                  <span className="rounded-lg bg-blue-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm transition group-hover:bg-blue-700">
                    Auto-fill
                  </span>
                </button>

                <label htmlFor="officer-id" className="block text-sm font-semibold text-slate-800">
                  Officer Username
                </label>
                <div className="relative mt-2">
                  <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="officer-id"
                    name="officer-id"
                    autoComplete="username"
                    value={officerId}
                    onChange={(event) => setOfficerId(event.target.value)}
                    className="h-12 pl-10 text-base border-slate-200 focus-visible:ring-blue-500"
                    placeholder="e.g. admin"
                    required
                  />
                </div>

                <label htmlFor="passcode" className="mt-5 block text-sm font-semibold text-slate-800">
                  Password
                </label>
                <div className="relative mt-2">
                  <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="passcode"
                    name="passcode"
                    type={showPasscode ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={passcode}
                    onChange={(event) => setPasscode(event.target.value)}
                    className="h-12 px-10 text-base border-slate-200 focus-visible:ring-blue-500"
                    placeholder="e.g. admin123"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasscode((current) => !current)}
                    className="absolute right-1 top-1 grid h-10 w-10 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-500/30"
                    aria-label={showPasscode ? 'Hide passcode' : 'Show passcode'}
                  >
                    {showPasscode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {error && (
                  <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
                    {error}
                  </p>
                )}

                <Button type="submit" size="lg" className="mt-6 min-h-12 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                  {loading ? 'Verifying access…' : 'Sign In as Officer'}
                </Button>

                <div className="mt-6 border-t border-slate-100 pt-5 text-center">
                  <Link
                    href="/"
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20"
                  >
                    Continue as Public Citizen
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </Link>
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    View current risk, forecasts, the map, explanations and public safety guidance without signing in.
                  </p>
                </div>
              </form>
            )}

            <p className="mt-7 text-center text-xs leading-5 text-slate-500">
              Server-verified access · signed session · rate-limited attempts · auditable actions
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
