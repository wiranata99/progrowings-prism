import Panel from "../ui/Panel";
import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function AIExecutiveInsight() {
  const { i18n } = useTranslation();

  const isID = i18n.language === "id";

  return (
    <Panel
      title="AI Executive Insight"
      subtitle={
        isID
          ? "Ringkasan risiko operasional yang dihasilkan AI"
          : "AI-generated operational risk summary"
      }
    >
      <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6">

        <div className="flex items-center gap-3">

          <Sparkles
            size={22}
            className="text-cyan-400"
          />

          <h3 className="text-lg font-semibold text-cyan-400">
            {isID
              ? "Rekomendasi Eksekutif"
              : "Executive Recommendation"}
          </h3>

        </div>

        <div className="mt-5 space-y-4 leading-8 text-slate-300">

          <p>
            {isID
              ? "Risiko keamanan siber masih menjadi risiko operasional residual tertinggi dengan meningkatnya upaya serangan eksternal dan tingginya eksposur finansial."
              : "Cyber Security remains the highest residual operational risk with increasing external attack attempts and elevated financial exposure."}
          </p>

          <p>
            {isID
              ? "Indikator Internal Fraud masih berada di atas toleransi manajemen meskipun efektivitas pengendalian preventif terus meningkat di seluruh unit bisnis."
              : "Internal Fraud indicators remain above management tolerance although preventive controls continue to improve across business units."}
          </p>

          <p>
            {isID ? (
              <>
                Efektivitas pengendalian secara keseluruhan dinilai
                <span className="font-semibold text-emerald-400">
                  {" "}Strong
                </span>
                , namun ketahanan sistem TI tetap menjadi prioritas utama pada periode pelaporan berikutnya.
              </>
            ) : (
              <>
                Overall control effectiveness is assessed as
                <span className="font-semibold text-emerald-400">
                  {" "}Strong
                </span>
                , however IT resilience should remain the primary management focus
                during the next reporting period.
              </>
            )}
          </p>

          <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">

            <p className="font-semibold text-amber-300">
              {isID
                ? "Rekomendasi Manajemen"
                : "Recommended Executive Actions"}
            </p>

            <ul className="mt-3 list-disc space-y-2 pl-6">

              <li>
                {isID
                  ? "Percepat program peningkatan Cyber Security."
                  : "Accelerate Cyber Security enhancement program."}
              </li>

              <li>
                {isID
                  ? "Perkuat pengawasan transaksi berisiko tinggi."
                  : "Increase fraud surveillance on high-risk transactions."}
              </li>

              <li>
                {isID
                  ? "Selesaikan simulasi Disaster Recovery pada kuartal ini."
                  : "Complete disaster recovery simulation this quarter."}
              </li>

              <li>
                {isID
                  ? "Lakukan review terhadap seluruh KRI yang telah melampaui Risk Appetite."
                  : "Review KRIs exceeding Board Risk Appetite."}
              </li>

            </ul>

          </div>

        </div>

      </div>

    </Panel>
  );
}