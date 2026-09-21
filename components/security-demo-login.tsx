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
    <main className="min-h-screen bg-white text-[#0e0f10]">
      <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
        <section className="relative hidden overflow-hidden bg-[#0e0f10] p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
          <div
            className="absolute -right-28 top-20 h-96 w-96 rounded-full border border-white/5"
            aria-hidden="true"
          />
          <div
            className="absolute -right-12 top-36 h-64 w-64 rounded-full border border-[#ff5065]/20"
            aria-hidden="true"
          />
          <Link href="/" className="relative flex w-fit items-center gap-3 rounded-full focus-visible:outline-none">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white border border-white/10 backdrop-blur-md">
              {/* HeatVector Logo Icon */}
              <div className="grid grid-cols-3 gap-0.5 p-1 w-5 h-5 items-center justify-center">
                <span className="h-1 w-1 rounded-full bg-white" />
                <span className="h-1 w-1 rounded-full bg-white" />
                <span className="h-1 w-1 rounded-full bg-white" />
                <span className="h-1 w-1 rounded-full bg-transparent" />
                <span className="h-1 w-1 rounded-full bg-[#ff5065]" />
                <span className="h-1 w-1 rounded-full bg-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="block text-xl font-bold tracking-tight text-white">HeatVector</span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#ff5065]" />
              </div>
              <span className="font-mono text-[10px] tracking-wider text-neutral-400 uppercase">SIH26083 · INDIA</span>
            </div>
          </Link>

          <div className="relative max-w-lg">
            <div className="mb-3 font-mono text-[11px] font-bold uppercase tracking-wider text-[#ff5065]">
              SECURE OFFICER WORKSPACE
            </div>
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white xl:text-4xl">
              Trusted access for critical heat-response coordination.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-400">
              Public heat information stays open. Operational records, dispatch directives, and municipal warning controls require verified officer access.
            </p>
            <div className="mt-8 grid gap-3.5">
              {[
                'Officer credentials verified against disaster authority registry',
                'Cryptographically signed HTTP-only operational session',
                'Protected endpoints re-validate authority role on every dispatch',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-xs text-neutral-300">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#ff5065]/20 text-[#ff5065]">
                    <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="relative font-mono text-[10px] uppercase tracking-wider text-neutral-500">
            PUBLIC RISK OPEN · AUTHORITY DISPATCH SECURED
          </p>
        </section>

        <section className="flex min-h-screen items-center justify-center bg-[#f4f4f8] p-5 sm:p-8 lg:p-12">
          <div className="w-full max-w-[460px]">
            <Link href="/" className="mb-8 flex w-fit items-center gap-2.5 text-xs font-bold text-[#0e0f10] lg:hidden">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5065]" />
              <span className="text-base tracking-tight">HeatVector</span>
            </Link>

            <div className="mb-6">
              <span className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-white text-[#ff5065] shadow-[0_5px_25px_rgba(38,42,62,0.06)] border border-[#0e0f10]/6">
                <LockKeyhole className="h-5 w-5" />
              </span>
              <p className="font-mono text-[10px] font-bold tracking-wider text-[#ff5065] uppercase">
                SECURE OFFICER ACCESS
              </p>
              <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-[#0e0f10] sm:text-3xl">
                Verify Authority Identity
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-[#666666]">
                Sign in to manage heatwave alerts, deploy municipal cooling, and inspect operational telemetry.
              </p>
            </div>

            {checking ? (
              <div className="flex min-h-64 items-center justify-center rounded-3xl border border-[#0e0f10]/6 bg-white shadow-[0_5px_25px_rgba(38,42,62,0.06)]">
                <Loader2 className="h-5 w-5 animate-spin text-[#ff5065]" />
                <span className="ml-3 font-mono text-xs text-[#666666]">CHECKING SECURE SESSION…</span>
              </div>
            ) : session.authenticated ? (
              <div className="rounded-3xl border border-[#0e0f10]/6 bg-white p-7 sm:p-8 shadow-[0_5px_25px_rgba(38,42,62,0.06)]">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#ffe9eb] text-[#ff5065]">
                  <ShieldCheck className="h-6 w-6 stroke-[2.5]" />
                </span>
                <h3 className="mt-4 text-xl font-bold text-[#0e0f10]">Officer identity verified</h3>
                <p className="mt-2 text-xs leading-relaxed text-[#666666]">
                  Signed in as <b className="text-[#0e0f10] font-semibold">{session.officer_id}</b>. Your emergency response session is active.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <Link href="/" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#ff5065] px-5 text-xs font-semibold text-white transition hover:bg-[#ff3850]">
                    Open workspace <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Button variant="outline" className="min-h-11 rounded-full border-[#0e0f10]/15 text-xs text-[#0e0f10] hover:bg-[#f4f4f8]" onClick={signOut} disabled={loading}>
                    Sign out
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} className="rounded-3xl border border-[#0e0f10]/6 bg-white p-7 sm:p-8 shadow-[0_5px_25px_rgba(38,42,62,0.06)]">
                {/* 1-Click Auto-Fill Badge */}
                <button
                  type="button"
                  onClick={() => {
                    setOfficerId('admin');
                    setPasscode('admin123');
                  }}
                  className="group mb-5 flex w-full items-center justify-between rounded-2xl border border-[#ff5065]/20 bg-[#ffe9eb]/60 p-3 text-left transition hover:border-[#ff5065]/40 hover:bg-[#ffe9eb]"
                >
                  <div>
                    <span className="block font-mono text-[10px] font-bold uppercase tracking-wider text-[#ff5065]">
                      EVALUATOR CREDENTIALS
                    </span>
                    <span className="text-xs text-[#0e0f10]">
                      User: <code className="rounded bg-white px-1.5 py-0.5 font-mono text-[11px] text-[#0e0f10] border border-[#0e0f10]/10">admin</code> · Pass: <code className="rounded bg-white px-1.5 py-0.5 font-mono text-[11px] text-[#0e0f10] border border-[#0e0f10]/10">admin123</code>
                    </span>
                  </div>
                  <span className="rounded-full bg-[#ff5065] px-3 py-1 text-[10px] font-semibold text-white transition group-hover:bg-[#ff3850]">
                    Auto-fill
                  </span>
                </button>

                <label htmlFor="officer-id" className="block font-mono text-[11px] font-bold uppercase tracking-wider text-[#666666]">
                  Officer Username
                </label>
                <div className="relative mt-1.5">
                  <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7a7b7c]" />
                  <Input
                    id="officer-id"
                    name="officer-id"
                    autoComplete="username"
                    value={officerId}
                    onChange={(event) => setOfficerId(event.target.value)}
                    className="h-11 pl-10 text-xs rounded-full border-[#0e0f10]/10 bg-[#f4f4f8] text-[#0e0f10] focus-visible:border-[#ff5065] focus-visible:ring-0"
                    placeholder="e.g. admin"
                    required
                  />
                </div>

                <label htmlFor="passcode" className="mt-4 block font-mono text-[11px] font-bold uppercase tracking-wider text-[#666666]">
                  Password
                </label>
                <div className="relative mt-1.5">
                  <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7a7b7c]" />
                  <Input
                    id="passcode"
                    name="passcode"
                    type={showPasscode ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={passcode}
                    onChange={(event) => setPasscode(event.target.value)}
                    className="h-11 px-10 text-xs rounded-full border-[#0e0f10]/10 bg-[#f4f4f8] text-[#0e0f10] focus-visible:border-[#ff5065] focus-visible:ring-0"
                    placeholder="e.g. admin123"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasscode((current) => !current)}
                    className="absolute right-2 top-1 grid h-9 w-9 place-items-center rounded-full text-[#7a7b7c] transition-colors hover:text-[#0e0f10]"
                    aria-label={showPasscode ? 'Hide passcode' : 'Show passcode'}
                  >
                    {showPasscode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {error && (
                  <p role="alert" className="mt-4 rounded-2xl border border-[#ff5065]/20 bg-[#ffe9eb] px-3.5 py-2.5 text-xs font-medium text-[#ff5065]">
                    {error}
                  </p>
                )}

                <Button type="submit" size="lg" className="mt-6 min-h-11 w-full rounded-full bg-[#ff5065] hover:bg-[#ff3850] text-white font-semibold text-xs shadow-none" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                  {loading ? 'Verifying access…' : 'Sign In as Officer'}
                </Button>

                <div className="mt-6 border-t border-[#0e0f10]/6 pt-5 text-center">
                  <Link
                    href="/"
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-[#0e0f10]/10 bg-white px-5 text-xs font-semibold text-[#0e0f10] transition-all hover:bg-[#f4f4f8]"
                  >
                    Continue as Public Citizen
                    <ArrowRight className="h-3.5 w-3.5 text-[#ff5065]" />
                  </Link>
                  <p className="mt-2.5 text-[11px] leading-relaxed text-[#666666]">
                    View real-time risk, forecasts, spatial maps, and safety advisories without signing in.
                  </p>
                </div>
              </form>
            )}

            <p className="mt-7 text-center font-mono text-[10px] uppercase tracking-wider text-[#7a7b7c]">
              Server-verified · Signed session · Auditable
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
