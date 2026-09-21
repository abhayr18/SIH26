import Link from 'next/link';
import { StoredKannadaLocalizer } from '@/components/kannada-localizer';

export default function PrivacyPage() {
  return (
    <StoredKannadaLocalizer>
      <main className="min-h-screen bg-[#eeeeee] px-5 py-12 text-[#000000]">
        <article className="mx-auto max-w-3xl rounded-lg border border-[#d9d9d9] bg-white p-6 sm:p-10 shadow-none">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.06em] text-[#000000]">
            HEATVECTOR · SIH26083 · PRIVACY & DATA USE
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-[0.06em] uppercase text-[#000000]">
            Privacy & Data Governance
          </h1>
          <p className="mt-3 text-xs leading-relaxed text-[#595959] tracking-[0.06em]">
            HeatVector is an early-warning and decision-support prototype. It
            is not a medical service or an official government warning system.
          </p>

          <div className="mt-8 space-y-6 text-xs leading-relaxed text-[#595959] tracking-[0.06em]">
            <section>
              <h2 className="text-sm font-bold text-[#000000] mb-1 uppercase tracking-[0.06em]">
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
              <h2 className="text-sm font-bold text-[#000000] mb-1 uppercase tracking-[0.06em]">
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
              <h2 className="text-sm font-bold text-[#000000] mb-1 uppercase tracking-[0.06em]">
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
              <h2 className="text-sm font-bold text-[#000000] mb-1 uppercase tracking-[0.06em]">
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
              <h2 className="text-sm font-bold text-[#000000] mb-1 uppercase tracking-[0.06em]">
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
              <h2 className="text-sm font-bold text-[#000000] mb-1 uppercase tracking-[0.06em]">
                Safety boundary
              </h2>
              <p>
                HTSI and ML predictions support decisions but do not diagnose
                illness. Follow official IMD, NDMA, health-department and
                emergency guidance when available.
              </p>
            </section>
          </div>

          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex rounded-full bg-[#000000] hover:opacity-85 px-6 py-3 text-xs font-bold uppercase tracking-[0.06em] text-white transition-opacity border border-[#000000]"
            >
              ← Return to HeatVector
            </Link>
          </div>
        </article>
      </main>
    </StoredKannadaLocalizer>
  );
}
