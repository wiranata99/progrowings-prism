import { useEffect, useState } from "react";

import Panel from "../ui/Panel";
import { getFundingColor } from "../../utils/fundingColor";

interface FundingComponent {
  key: string;
  accountCode: string;
  label: string;
  amount: number;
  share: number;
}

interface FundingCompositionResponse {
  reportingDate: string;
  currency: "ALL" | "IDR" | "USD";
  unit: string;
  totalDpk: number;
  totalDpkLocal: number;

  casa: {
    amount: number;
    ratio: number;
  };

  components: FundingComponent[];

  reconciliation: {
    deposit: number;
    componentTotal: number;
    difference: number;
    isReconciled: boolean;
  };

  source: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: FundingCompositionResponse;
}

interface DisplayFundingItem {
  name: string;
  value: number;
  amount: string;
}

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ??
  "http://localhost:3001/api/v1";

function formatIDR(value: number) {
  const absValue = Math.abs(value);

  if (absValue >= 1_000_000_000_000) {
    return `Rp${(value / 1_000_000_000_000).toFixed(2)}T`;
  }

  if (absValue >= 1_000_000_000) {
    return `Rp${(value / 1_000_000_000).toFixed(2)}B`;
  }

  if (absValue >= 1_000_000) {
    return `Rp${(value / 1_000_000).toFixed(2)}M`;
  }

  return `Rp${value.toLocaleString("id-ID")}`;
}

export default function FundingComposition() {
  const [data, setData] =
    useState<FundingCompositionResponse | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  useEffect(() => {
    let active = true;

    async function loadFundingComposition() {
      try {
        setLoading(true);
        setError(false);

        const response = await fetch(
          `${API_BASE}/intelligence/liquidity/funding-composition?currency=ALL`,
        );

        if (!response.ok) {
          throw new Error(
            `Funding Composition API failed: ${response.status}`,
          );
        }

        const result: ApiResponse =
          await response.json();

        if (!active) return;

        setData(result.data);
      } catch (err) {
        console.error(
          "Failed to load Funding Composition",
          err,
        );

        if (active) {
          setError(true);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadFundingComposition();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <Panel title="Funding Composition">
        <div className="py-12 text-center text-sm text-slate-500">
          Loading funding composition...
        </div>
      </Panel>
    );
  }

  if (error || !data) {
    return (
      <Panel title="Funding Composition">
        <div className="py-12 text-center text-sm text-amber-400">
          Funding composition data is currently unavailable.
        </div>
      </Panel>
    );
  }

  const labelMap: Record<string, string> = {
    currentAccount: "Current Account",
    savings: "Savings",
    timeDeposit: "Time Deposit",
  };

  const fundingComposition: DisplayFundingItem[] =
    data.components.map((item) => ({
      name: labelMap[item.key] ?? item.label,
      value: item.share,
      amount: formatIDR(item.amount),
    }));

  const currentAccount =
    fundingComposition.find(
      (item) => item.name === "Current Account",
    )?.value ?? 0;

  const savings =
    fundingComposition.find(
      (item) => item.name === "Savings",
    )?.value ?? 0;

  const casa =
    currentAccount + savings;

  /*
   * Existing UI target preserved.
   * Later this can come from PRISM threshold/rules engine.
   */
  const target = 75;

  /*
   * MoM requires previous BSIS reporting date.
   * Do NOT fabricate movement from a single snapshot.
   */
  

  let stability = "Healthy";

  if (casa < 35) {
    stability = "Watch";
  } else if (casa < 50) {
    stability = "Moderate";
  }

  return (
    <Panel title="Funding Composition">
      <div className="space-y-8">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <div className="mb-6 w-full rounded-2xl border border-cyan-500/20 bg-cyan-500/5 px-8 py-6">
              <div className="grid grid-cols-4 gap-8">
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    Funding Stability
                  </p>

                  <p
                    className={`mt-2 text-xl font-bold ${
                      stability === "Healthy"
                        ? "text-emerald-400"
                        : stability === "Moderate"
                          ? "text-amber-400"
                          : "text-red-400"
                    }`}
                  >
                    {stability}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    CASA Ratio
                  </p>

                  <p className="mt-2 text-xl font-bold text-cyan-400">
                    {casa.toFixed(2)}%
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    Target
                  </p>

                  <p className="mt-2 text-xl font-bold text-white">
                    &gt; {target.toFixed(2)}%
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    MoM
                  </p>

                  <p className="mt-2 text-xl font-bold text-slate-400">
                    N/A
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="h-5 overflow-hidden rounded-full bg-slate-800">
            <div className="flex h-full">
              <div
                className="bg-cyan-500"
                style={{
                  width: `${
                    fundingComposition[0]?.value ?? 0
                  }%`,
                }}
              />

              <div
                className="bg-sky-500"
                style={{
                  width: `${
                    fundingComposition[1]?.value ?? 0
                  }%`,
                }}
              />

              <div
                className="bg-amber-400"
                style={{
                  width: `${
                    fundingComposition[2]?.value ?? 0
                  }%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {fundingComposition.map((item) => (
            <div
              key={item.name}
              className="rounded-2xl border border-slate-800 p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-3 w-3 rounded-full ${getFundingColor(
                      item.name,
                    )}`}
                  />

                  <span className="font-medium">
                    {item.name}
                  </span>
                </div>

                <span className="font-bold">
                  {item.value.toFixed(2)}%
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    Outstanding
                  </p>

                  <p className="mt-1 font-semibold text-white">
                    {item.amount}
                  </p>
                </div>

                <div className="text-sm font-semibold text-slate-500">
                  BSIS
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.20em] text-cyan-400">
          PRISM Insight
        </p>

        <p className="mt-4 leading-7 text-slate-300">
          CASA contributes
          <span className="font-semibold text-cyan-400">
            {" "}
            {casa.toFixed(2)}%
          </span>
          {" "}of total third-party funding, with
          Current Account at
          <span className="font-semibold text-white">
            {" "}
            {currentAccount.toFixed(2)}%
          </span>
          {" "}and Savings at
          <span className="font-semibold text-white">
            {" "}
            {savings.toFixed(2)}%
          </span>
          . Time Deposit represents
          <span className="font-semibold text-white">
            {" "}
            {(
              fundingComposition.find(
                (item) =>
                  item.name === "Time Deposit",
              )?.value ?? 0
            ).toFixed(2)}
            %
          </span>
          {" "}of total funding.
        </p>
      </div>
    </Panel>
  );
}