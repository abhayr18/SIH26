import Link from 'next/link';
import { StoredKannadaLocalizer } from '@/components/kannada-localizer';

export default function PrivacyPage() {
  return (
    <StoredKannadaLocalizer>
      <main className="min-h-screen bg-[#f4f4f8] px-5 py-12 text-[#0e0f10]">
        <article className="mx-auto max-w-3xl rounded-3xl border border-[#0e0f10]/6 bg-white p-6 sm:p-10 shadow-[0_5px_25px_rgba(38,42,62,0.06)]">
          <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#ff5065]">
            HEATVECTOR · SIH26083 · PRIVACY & DATA USE
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#0e0f10]">Privacy and data governance</h1>
          <p className="mt-3 text-xs leading-relaxed text-[#666666]">
            HeatVector is an early-warning and decision-support prototype. It
            is not a medical service or an official government warning system.
          </p>

          <div className="mt-8 space-y-6 text-xs leading-relaxed text-[#666666]">
            <section>
              <h2 className="text-sm font-bold text-[#0e0f10] mb-1">
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
              <h2 className="text-sm font-bold text-[#0e0f10] mb-1">
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
              <h2 className="text-sm font-bold text-[#0e0f10] mb-1">
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
              <h2 className="text-sm font-bold text-[#0e0f10] mb-1">
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
              <h2 className="text-sm font-bold text-[#0e0f10] mb-1">
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
              <h2 className="text-sm font-bold text-[#0e0f10] mb-1">
                Safety boundary
              </h2>
              <p>
                HTSI and ML predictions support decisions but do not diagnose
                illness. Follow official IMD, NDMA, health-department and
                emergency guidance when available.
              </p>
            </section>
          </div>

          <Link
            href="/"
            className="mt-8 inline-flex rounded-full bg-[#ff5065] hover:bg-[#ff3850] px-6 py-2.5 text-xs font-semibold text-white transition-colors"
          >
            ← Return to HeatVector
          </Link>

        </article>
      </main>
    </StoredKannadaLocalizer>
  );
}
