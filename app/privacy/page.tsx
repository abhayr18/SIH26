import Link from 'next/link';
import { StoredKannadaLocalizer } from '@/components/kannada-localizer';

export default function PrivacyPage() {
  return (
    <StoredKannadaLocalizer>
      <main className="min-h-screen bg-slate-50 px-5 py-12 text-slate-900 font-sans">
        <article className="mx-auto max-w-3xl rounded-xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-xs">
          <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-blue-700">
            HEATVECTOR · SIH26083 · PRIVACY & DATA USE
          </p>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Privacy & Data Governance
          </h1>
          <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-600">
            HeatVector is an early-warning and decision-support prototype. It
            is not a medical service or an official government warning system.
          </p>

          <div className="mt-8 space-y-6 text-xs sm:text-sm leading-relaxed text-slate-600">
            <section>
              <h2 className="text-sm font-bold text-slate-900 mb-1 tracking-tight">
                Information stored
              </h2>
              <p>
                The system stores weather observations, model predictions,
                warning records, alert acknowledgements and community incident
                reports. A reporter name is optional; anonymous reporting is the
                default. Do not enter medical records, government identifiers,
                phone numbers or other unnecessary personal information.
              </p>
            </section>
            <section>
              <h2 className="text-sm font-bold text-slate-900 mb-1 tracking-tight">
                Identity and permissions
              </h2>
              <p>
                Public visitors can view public heat-risk information. Authority
                records and operational actions require a server-verified
                officer session and are checked again by protected API routes.
                Audit records store the actor identifier and role, not passwords
                or authentication tokens.
              </p>
            </section>
            <section>
              <h2 className="text-sm font-bold text-slate-900 mb-1 tracking-tight">
                Purpose and sharing
              </h2>
              <p>
                Data is used to demonstrate heat-risk monitoring, response
                coordination, validation and accountability. HeatVector does
                not sell personal information. Weather requests are sent to
                Open-Meteo and MET Norway, and facility searches are sent to
                OpenStreetMap services without incident descriptions or reporter
                names.
              </p>
            </section>
            <section>
              <h2 className="text-sm font-bold text-slate-900 mb-1 tracking-tight">
                Local assistant and voice
              </h2>
              <p>
                Assistant answers are created in the browser from the heat-risk
                data already shown on screen. Chat messages and audio are not
                stored by HeatVector. Optional speech recognition and
                read-aloud use browser-provided voice services, whose processing
                and regional-language availability depend on the user&apos;s
                browser and device. Users can always use text without granting
                microphone access.
              </p>
            </section>
            <section>
              <h2 className="text-sm font-bold text-slate-900 mb-1 tracking-tight">
                Retention and deletion
              </h2>
              <p>
                Prototype records are retained for the duration of the SIH
                evaluation so the audit trail can be demonstrated. Before any
                field deployment, the responsible authority must approve a
                time-limited retention schedule, deletion process and legal
                basis appropriate to its jurisdiction.
              </p>
            </section>
            <section>
              <h2 className="text-sm font-bold text-slate-900 mb-1 tracking-tight">
                Safety boundary
              </h2>
              <p>
                HTSI and ML predictions support decisions but do not diagnose
                illness. Follow official IMD, NDMA, health-department and
                emergency guidance when available.
              </p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <Link
              href="/"
              className="inline-flex rounded-lg bg-slate-900 hover:bg-slate-800 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-colors shadow-xs"
            >
              ← Return to HeatVector
            </Link>
          </div>
        </article>
      </main>
    </StoredKannadaLocalizer>
  );
}
