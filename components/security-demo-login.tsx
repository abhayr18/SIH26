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
    <main className="min-h-screen bg-white text-[#000000]">
      <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
        <section className="relative hidden overflow-hidden bg-[#000000] p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
          <div
            className="absolute -right-28 top-20 h-96 w-96 rounded-full border border-white/10"
            aria-hidden="true"
          />
          <Link href="/" className="relative flex w-fit items-center gap-3 rounded-full focus-visible:outline-none">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black border border-white">
              <span className="font-bold text-xs">HV</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="block text-xl font-bold tracking-[0.06em] uppercase text-white">HeatVector</span>
              </div>
              <span className="font-mono text-[10px] tracking-[0.06em] text-[#808080] uppercase">SIH26083 · INDIA</span>
            </div>
          </Link>

          <div className="relative max-w-lg">
            <div className="mb-4 inline-flex rounded-full border border-white/30 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.06em] text-white">
              SECURE OFFICER WORKSPACE
            </div>
            <h1 className="hero-foggy-display text-white text-5xl xl:text-6xl">
              TRUSTED ACCESS.<br/>
              HEAT RESPONSE DISPATCH.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-[#808080] tracking-[0.06em]">
              Public heat information stays open. Operational records, dispatch directives, and municipal warning controls require verified officer access.
            </p>
            <div className="mt-8 grid gap-3.5">
              {[
                'Officer credentials verified against disaster authority registry',
                'Cryptographically signed HTTP-only operational session',
                'Protected endpoints re-validate authority role on every dispatch',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-xs text-white/90 tracking-[0.06em]">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white text-black">
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="relative font-mono text-[10px] uppercase tracking-[0.06em] text-[#808080]">
            PUBLIC RISK OPEN · AUTHORITY DISPATCH SECURED
          </p>
        </section>

        <section className="flex min-h-screen items-center justify-center bg-[#eeeeee] p-5 sm:p-8 lg:p-12">
          <div className="w-full max-w-[460px]">
            <Link href="/" className="mb-8 flex w-fit items-center gap-2.5 text-xs font-bold text-[#000000] lg:hidden">
              <span className="h-2.5 w-2.5 rounded-full bg-[#000000]" />
              <span className="text-base tracking-[0.06em] uppercase">HeatVector</span>
            </Link>

            <div className="mb-6">
              <span className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-black text-white">
                <LockKeyhole className="h-5 w-5" />
              </span>
              <p className="font-mono text-[11px] font-bold tracking-[0.06em] text-[#000000] uppercase">
                SECURE OFFICER ACCESS
              </p>
              <h2 className="mt-1.5 text-2xl font-bold tracking-[0.06em] uppercase text-[#000000] sm:text-3xl">
                Verify Authority Identity
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-[#595959] tracking-[0.06em]">
                Sign in to manage heatwave alerts, deploy municipal cooling, and inspect operational telemetry.
              </p>
            </div>

            {checking ? (
              <div className="flex min-h-64 items-center justify-center rounded-lg border border-[#d9d9d9] bg-white shadow-none">
                <Loader2 className="h-5 w-5 animate-spin text-[#000000]" />
                <span className="ml-3 font-mono text-xs text-[#595959] uppercase tracking-[0.06em]">CHECKING SECURE SESSION…</span>
              </div>
            ) : session.authenticated ? (
              <div className="rounded-lg border border-[#d9d9d9] bg-white p-7 sm:p-8 shadow-none">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-[#7ffeb1] text-[#000000]">
                  <ShieldCheck className="h-6 w-6 stroke-[2.5]" />
                </span>
                <h3 className="mt-4 text-xl font-bold uppercase tracking-[0.06em] text-[#000000]">Officer identity verified</h3>
                <p className="mt-2 text-xs leading-relaxed text-[#595959] tracking-[0.06em]">
                  Signed in as <b className="text-[#000000] font-bold">{session.officer_id}</b>. Your emergency response session is active.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <Link href="/" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#000000] px-5 text-xs font-bold uppercase tracking-[0.06em] text-white transition hover:opacity-85">
                    Open workspace <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Button variant="outline" className="min-h-11 rounded-full border-[#000000] text-xs text-[#000000] hover:bg-[#000000] hover:text-white" onClick={signOut} disabled={loading}>
                    Sign out
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} className="rounded-lg border border-[#d9d9d9] bg-white p-7 sm:p-8 shadow-none">
                {/* 1-Click Auto-Fill Badge */}
                <button
                  type="button"
                  onClick={() => {
                    setOfficerId('admin');
                    setPasscode('admin123');
                  }}
                  className="group mb-5 flex w-full items-center justify-between rounded-lg border border-[#d9d9d9] bg-[#eeeeee] p-3 text-left transition hover:border-[#000000]"
                >
                  <div>
                    <span className="block font-mono text-[10px] font-bold uppercase tracking-[0.06em] text-[#000000]">
                      EVALUATOR CREDENTIALS
                    </span>
                    <span className="text-xs text-[#000000] tracking-[0.06em]">
                      User: <code className="rounded bg-white px-1.5 py-0.5 font-mono text-[11px] text-[#000000] border border-[#d9d9d9]">admin</code> · Pass: <code className="rounded bg-white px-1.5 py-0.5 font-mono text-[11px] text-[#000000] border border-[#d9d9d9]">admin123</code>
                    </span>
                  </div>
                  <span className="rounded-full bg-[#000000] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.06em] text-white transition group-hover:opacity-80">
                    Auto-fill
                  </span>
                </button>

                <label htmlFor="officer-id" className="block font-mono text-[11px] font-bold uppercase tracking-[0.06em] text-[#000000]">
                  Officer Username
                </label>
                <div className="relative mt-1.5">
                  <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#808080]" />
                  <Input
                    id="officer-id"
                    name="officer-id"
                    autoComplete="username"
                    value={officerId}
                    onChange={(event) => setOfficerId(event.target.value)}
                    className="h-11 pl-10 text-xs rounded-full border-[#d9d9d9] bg-white text-[#000000] focus-visible:border-[#000000] focus-visible:ring-0 tracking-[0.06em]"
                    placeholder="e.g. admin"
                    required
                  />
                </div>

                <label htmlFor="passcode" className="mt-4 block font-mono text-[11px] font-bold uppercase tracking-[0.06em] text-[#000000]">
                  Password
                </label>
                <div className="relative mt-1.5">
                  <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#808080]" />
                  <Input
                    id="passcode"
                    name="passcode"
                    type={showPasscode ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={passcode}
                    onChange={(event) => setPasscode(event.target.value)}
                    className="h-11 px-10 text-xs rounded-full border-[#d9d9d9] bg-white text-[#000000] focus-visible:border-[#000000] focus-visible:ring-0 tracking-[0.06em]"
                    placeholder="e.g. admin123"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasscode((current) => !current)}
                    className="absolute right-2 top-1 grid h-9 w-9 place-items-center rounded-full text-[#808080] transition-colors hover:text-[#000000]"
                    aria-label={showPasscode ? 'Hide passcode' : 'Show passcode'}
                  >
                    {showPasscode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {error && (
                  <p role="alert" className="mt-4 rounded-lg border border-[#000000] bg-[#eeeeee] px-3.5 py-2.5 text-xs font-bold text-[#000000] tracking-[0.06em]">
                    {error}
                  </p>
                )}

                <Button type="submit" size="lg" className="mt-6 min-h-11 w-full rounded-full bg-[#000000] hover:opacity-85 text-white font-bold text-xs shadow-none uppercase tracking-[0.06em]" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                  {loading ? 'Verifying access…' : 'Sign In as Officer'}
                </Button>

                <div className="mt-6 border-t border-[#d9d9d9] pt-5 text-center">
                  <Link
                    href="/"
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-[#000000] bg-white px-5 text-xs font-bold uppercase tracking-[0.06em] text-[#000000] transition-all hover:bg-[#000000] hover:text-white"
                  >
                    Continue as Public Citizen
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <p className="mt-2.5 text-[11px] leading-relaxed text-[#595959] tracking-[0.06em]">
                    View real-time risk, forecasts, spatial maps, and safety advisories without signing in.
                  </p>
                </div>
              </form>
            )}

            <p className="mt-7 text-center font-mono text-[10px] uppercase tracking-[0.06em] text-[#808080]">
              Server-verified · Signed session · Auditable
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
