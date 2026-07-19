import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ChartDataPoint {
  date: string;
  month?: string;
  timestamp: number;
  totalLoanAmount: number;
  nplAmount: number;
  totalRatio: number;
}

interface Props {
  data: ChartDataPoint[];
  period: 1 | 3 | 6 | 12;
}

type ThresholdStatus =
  | "Breached"
  | "Almost Breached"
  | "Safe";

const OJK_THRESHOLD = 5;

function formatAmount(value: number): string {
  return value.toLocaleString("en-US", {
    maximumFractionDigits: 0,
  });
}

function getThresholdStatus(
  ratio: number
): ThresholdStatus {
  if (ratio > 5) {
    return "Breached";
  }

  if (ratio >= 4) {
    return "Almost Breached";
  }

  return "Safe";
}

function getStatusClass(
  status: ThresholdStatus
): string {
  if (status === "Breached") {
    return "border-red-500/30 bg-red-500/15 text-red-300";
  }

  if (status === "Almost Breached") {
    return "border-amber-500/30 bg-amber-500/15 text-amber-300";
  }

  return "border-emerald-500/30 bg-emerald-500/15 text-emerald-300";
}

function getObservation(
  status: ThresholdStatus
): string {
  if (status === "Breached") {
    return "Gross NPL ratio has exceeded the OJK threshold.";
  }

  if (status === "Almost Breached") {
    return "Gross NPL ratio is approaching the OJK threshold.";
  }

  return "Gross NPL ratio remains safely below the OJK threshold.";
}

function CustomMomentumTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{
    payload?: {
      date: string;

      totalLoanAmount: number;
      nplAmount: number;
      totalRatio: number;

      consumerOutstanding: number;
      consumerNplAmount: number;
      consumerRatio: number;

      corporateOutstanding: number;
      corporateNplAmount: number;
      corporateRatio: number;
    };

    dataKey?: string;
    value?: number;
    color?: string;
    name?: string;
  }>;
}) {
  if (
    !active ||
    !payload ||
    payload.length === 0
  ) {
    return null;
  }

  const row = payload[0]?.payload;

  if (!row) {
    return null;
  }

  return (
    <div className="min-w-[460px] rounded-2xl border border-slate-700 bg-slate-950/95 p-4 shadow-2xl backdrop-blur">
      <p className="mb-4 text-sm font-semibold text-white">
        {row.date}
      </p>

      <div className="space-y-2">
        {payload.map((item) => {
          const value = Number(
            item.value ?? 0
          );

          const isRatio =
            item.dataKey === "totalRatio";

          return (
            <div
              key={String(item.dataKey)}
              className="flex items-center justify-between gap-6 text-sm"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{
                    backgroundColor:
                      item.color,
                  }}
                />

                <span className="text-slate-400">
                  {item.name}
                </span>
              </div>

              <span className="font-semibold text-white">
                {isRatio
                  ? `${value.toFixed(2)}%`
                  : `Rp ${formatAmount(
                      value
                    )} Bio`}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 border-t border-slate-800 pt-4">
        <div className="grid grid-cols-[110px_1fr] items-center gap-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Consumer
          </div>

          <div className="flex items-center justify-between gap-4 whitespace-nowrap text-xs">
            <span className="text-slate-400">
              OS{" "}
              <span className="font-semibold text-white">
                Rp{" "}
                {formatAmount(
                  row.consumerOutstanding
                )}{" "}
                Bio
              </span>
            </span>

            <span className="text-slate-400">
              NPL{" "}
              <span className="font-semibold text-amber-300">
                Rp{" "}
                {formatAmount(
                  row.consumerNplAmount
                )}{" "}
                Bio
              </span>
            </span>

            <span className="text-slate-400">
              Ratio{" "}
              <span className="font-semibold text-cyan-300">
                {row.consumerRatio.toFixed(
                  2
                )}
                %
              </span>
            </span>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-[110px_1fr] items-center gap-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Corporate
          </div>

          <div className="flex items-center justify-between gap-4 whitespace-nowrap text-xs">
            <span className="text-slate-400">
              OS{" "}
              <span className="font-semibold text-white">
                Rp{" "}
                {formatAmount(
                  row.corporateOutstanding
                )}{" "}
                Bio
              </span>
            </span>

            <span className="text-slate-400">
              NPL{" "}
              <span className="font-semibold text-amber-300">
                Rp{" "}
                {formatAmount(
                  row.corporateNplAmount
                )}{" "}
                Bio
              </span>
            </span>

            <span className="text-slate-400">
              Ratio{" "}
              <span className="font-semibold text-cyan-300">
                {row.corporateRatio.toFixed(
                  2
                )}
                %
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PortfolioMomentumChart({
  data,
  period,
}: Props) {
  const latestRatio =
    data.at(-1)?.totalRatio ?? 0;

  const thresholdStatus =
    getThresholdStatus(latestRatio);

  const availableMonths = data.length;

  return (
    <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-950/40 p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-cyan-500" />

            <span className="text-slate-300">
              Total Loan Amount
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-amber-400" />

            <span className="text-slate-300">
              NPL Amount
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-[2px] w-8 bg-cyan-300" />

            <span className="text-slate-300">
              Gross NPL Ratio
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-[2px] w-8 border-t-2 border-dashed border-red-400" />

            <span className="text-slate-300">
              OJK Threshold
            </span>
          </div>
        </div>

        <div className="text-sm text-slate-500">
          Last {period} Month
          {period > 1 ? "s" : ""}
        </div>
      </div>

      <div className="mb-2 flex items-center justify-between px-2 text-xs uppercase tracking-wider text-slate-500">
        <span>Amount (Rp Bio)</span>
        <span>NPL Ratio (%)</span>
      </div>

      <div className="h-[460px]">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <ComposedChart
            data={data}
            margin={{
              top: 20,
              right: 10,
              left: 10,
              bottom: 10,
            }}
            barGap={4}
          >
            <CartesianGrid
              vertical={false}
              stroke="#243244"
              strokeDasharray="4 6"
            />

            <XAxis
              dataKey="month"
              tick={{
                fill: "#94A3B8",
                fontSize: 13,
              }}
              tickLine={false}
              axisLine={{
                stroke: "#334155",
              }}
              minTickGap={20}
            />

            <YAxis
              yAxisId="amount"
              orientation="left"
              tick={{
                fill: "#94A3B8",
                fontSize: 12,
              }}
              tickFormatter={formatAmount}
              tickLine={false}
              axisLine={false}
              width={80}
            />

            <YAxis
              yAxisId="ratio"
              orientation="right"
              domain={[
                0,
                (dataMax: number) =>
                  Math.max(
                    6,
                    Math.ceil(dataMax + 1)
                  ),
              ]}
              tick={{
                fill: "#94A3B8",
                fontSize: 12,
              }}
              tickFormatter={(value) =>
                `${value}%`
              }
              tickLine={false}
              axisLine={false}
              width={55}
            />

            <Tooltip
              content={
                <CustomMomentumTooltip />
              }
              cursor={{
                fill: "rgba(148, 163, 184, 0.05)",
              }}
            />

            <Legend
              wrapperStyle={{
                display: "none",
              }}
            />

            <ReferenceLine
              yAxisId="ratio"
              y={OJK_THRESHOLD}
              stroke="#F87171"
              strokeWidth={1.5}
              strokeDasharray="6 6"
            />

            <Bar
              yAxisId="amount"
              dataKey="totalLoanAmount"
              name="Total Loan Amount"
              fill="#0891B2"
              radius={[7, 7, 0, 0]}
              maxBarSize={52}
              animationDuration={800}
            />

            <Bar
              yAxisId="amount"
              dataKey="nplAmount"
              name="NPL Amount"
              fill="#FBBF24"
              radius={[7, 7, 0, 0]}
              maxBarSize={36}
              animationDuration={900}
            />

            <Line
              yAxisId="ratio"
              type="monotone"
              dataKey="totalRatio"
              name="Gross NPL Ratio"
              stroke="#22D3EE"
              strokeWidth={3}
              dot={{
                r: 5,
                fill: "#22D3EE",
                stroke: "#083344",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 7,
                fill: "#22D3EE",
                stroke: "#FFFFFF",
                strokeWidth: 2,
              }}
              animationDuration={1000}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 pt-5">
        <div>
          <p className="text-sm text-slate-500">
            Latest Observation
          </p>

          <p className="mt-1 text-lg font-semibold text-white">
            {getObservation(
              thresholdStatus
            )}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            Showing latest available
            reporting date for the current
            month and the last available date
            for each previous month.
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div
            className={`rounded-full border px-4 py-2 text-sm font-semibold ${getStatusClass(
              thresholdStatus
            )}`}
          >
            {thresholdStatus}
          </div>

          <div className="text-xs text-slate-500">
            Available: {availableMonths} of{" "}
            {period} month
            {period > 1 ? "s" : ""}
          </div>
        </div>
      </div>
    </div>
  );
}