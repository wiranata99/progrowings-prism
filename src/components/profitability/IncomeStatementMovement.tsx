import {
  ArrowDownRight,
  ArrowUpRight,
  Minus,
  TrendingUp,
} from "lucide-react";

import Panel from "../ui/Panel";

import type {
  IncomeStatementMovementRow,
  IncomeStatementMovementValue,
  IncomeStatementMovementViewModel,
} from "../../presentation/mappers/incomeStatementMovementMapper";

interface IncomeStatementMovementProps {
  data: IncomeStatementMovementViewModel | null;
}

type MovementColumnKey =
  | "previousEoy"
  | "previousEom"
  | "latest"
  | "dtd"
  | "wtd"
  | "mtd";

interface ColumnDefinition {
  key: MovementColumnKey;
  label: string;
  subLabel?: string;
  movement?: boolean;
  highlighted?: boolean;
}

function getColumns(
  data: IncomeStatementMovementViewModel
): ColumnDefinition[] {
  return [
    {
      key: "previousEoy",
      label: "EOY-1",
      subLabel: data.previousEoyDate,
      highlighted: true,
    },
    {
      key: "previousEom",
      label: "EOM-1",
      subLabel: data.previousEomDate,
      highlighted: true,
    },
    {
  key: "latest",
  label: "D-1",
  subLabel: data.latestDateLabel,
  highlighted: true,
},
{
  key: "dtd",
  label: "DTD",
  highlighted: true,
  movement: true,
},
{
  key: "wtd",
  label: "WTD",
  highlighted: true,
  movement: true,
},
{
  key: "mtd",
  label: "MTD",
  highlighted: true,
  movement: true,
},
  ];
}

function getRowClass(
  row: IncomeStatementMovementRow
): string {
  switch (row.kind) {
    case "section":
      return "bg-white/[0.025] text-slate-100";

    case "subtotal":
      return "border-y border-cyan-400/10 bg-cyan-400/[0.035] text-cyan-100";

    case "total":
      return "border-y border-emerald-400/15 bg-emerald-400/[0.05] text-emerald-100";

    default:
      return "text-slate-300";
  }
}

function getLabelClass(
  row: IncomeStatementMovementRow
): string {
  switch (row.kind) {
    case "section":
      return "font-semibold";

    case "subtotal":
      return "font-semibold text-cyan-200";

    case "total":
      return "font-bold text-emerald-200";

    default:
      return "font-medium";
  }
}

function getMovementTone(
  value: number | null,
  expenseRow: boolean
): string {
  if (
    value === null ||
    value === 0
  ) {
    return "text-slate-500";
  }

  const favourable =
    expenseRow
      ? value < 0
      : value > 0;

  return favourable
    ? "text-emerald-300"
    : "text-rose-300";
}

function getStaticTone(
  value: number | null
): string {
  if (value === null) {
    return "text-slate-500";
  }

  if (value < 0) {
    return "text-rose-300";
  }

  return "text-slate-300";
}

function MovementIcon({
  value,
}: {
  value: number | null;
}) {
  if (
    value === null ||
    value === 0
  ) {
    return (
      <Minus className="h-3.5 w-3.5" />
    );
  }

  if (value > 0) {
    return (
      <ArrowUpRight className="h-3.5 w-3.5" />
    );
  }

  return (
    <ArrowDownRight className="h-3.5 w-3.5" />
  );
}

function ValueCell({
  value,
  movement,
  expenseRow,
  emphasized,
}: {
  value: IncomeStatementMovementValue;
  movement?: boolean;
  expenseRow: boolean;
  emphasized: boolean;
}) {
  const tone = movement
    ? getMovementTone(
        value.raw,
        expenseRow
      )
    : getStaticTone(value.raw);

  return (
    <div
      className={`flex items-center justify-end gap-1 text-right tabular-nums ${tone} ${
        emphasized
          ? "font-semibold"
          : "font-medium"
      }`}
    >
      {movement && (
        <MovementIcon
          value={value.raw}
        />
      )}

      <span>{value.formatted}</span>
    </div>
  );
}

function isExpenseRow(
  row: IncomeStatementMovementRow
): boolean {
  return [
    "interestExpense",
    "casa",
    "tdid",
    "interbankBorrowing",
    "interestExpenseOthers",
    "operatingExpense",
    "eclCkpn",
    "operatingExpenseOthers",
    "nonOperatingExpense",
    "tax",
    "deferredTax",
  ].includes(row.key);
}

function EmptyState() {
  return (
    <Panel className="overflow-hidden">
      <div className="flex min-h-[320px] items-center justify-center px-6">
        <div className="max-w-md text-center">
          <TrendingUp className="mx-auto h-7 w-7 text-cyan-300" />

          <h3 className="mt-3 text-sm font-semibold text-slate-200">
            Income Statement Movement is unavailable
          </h3>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            Upload a valid profitability dataset to generate the latest income statement movement.
          </p>
        </div>
      </div>
    </Panel>
  );
}

export default function IncomeStatementMovement({
  data,
}: IncomeStatementMovementProps) {
  if (!data) {
    return <EmptyState />;
  }

  const columns =
    getColumns(data);

  return (
    <Panel className="overflow-hidden">
      <div className="border-b border-white/5 px-5 py-4 lg:px-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-cyan-300" />

              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
                Earnings Movement
              </p>
            </div>

            <h2 className="mt-2 text-lg font-semibold text-white">
              Income Statement Movement
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Cumulative income statement performance and period movement
            </p>
          </div>

          <div className="rounded-lg border border-white/5 bg-white/[0.025] px-3 py-2 text-right">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Reporting Date
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-200">
              {data.reportingDate}
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[980px]">
          <div className="sticky top-0 z-20 grid grid-cols-[minmax(250px,1.7fr)_repeat(6,minmax(105px,0.8fr))] border-b border-white/5 bg-slate-950/95 backdrop-blur">
            <div className="flex items-center px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 lg:px-6">
              Line Item
            </div>

            {columns.map(
              (column) => (
                <div
                  key={column.key}
                  className={`border-l border-white/5 px-3 py-3 text-right ${
                    column.highlighted
                      ? "bg-cyan-400/[0.035]"
                      : ""
                  } ${
                    column.movement
                      ? "bg-white/[0.015]"
                      : ""
                  }`}
                >
                  <p
                    className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${
                      column.highlighted
                        ? "text-cyan-300"
                        : column.movement
                        ? "text-slate-400"
                        : "text-slate-500"
                    }`}
                  >
                    {column.label}
                  </p>

                  {column.subLabel && (
                    <p className="mt-1 truncate text-[10px] text-slate-600">
                      {column.subLabel}
                    </p>
                  )}
                </div>
              )
            )}
          </div>

          <div className="divide-y divide-white/5">
            {data.rows.map((row) => {
              const expenseRow =
                isExpenseRow(row);

              const emphasized =
                row.kind === "subtotal" ||
                row.kind === "total";

              return (
                <div
                  key={row.key}
                  className={`grid grid-cols-[minmax(250px,1.7fr)_repeat(6,minmax(105px,0.8fr))] transition-colors hover:bg-white/[0.025] ${getRowClass(
                    row
                  )}`}
                >
                  <div className="flex min-h-[48px] items-center px-5 py-3 lg:px-6">
                    <span
                      className={`${getLabelClass(
                        row
                      )} ${
                        row.indent === 1
                          ? "pl-6 text-sm"
                          : "text-sm"
                      }`}
                    >
                      {row.label}
                    </span>
                  </div>

                  {columns.map(
                    (column) => (
                      <div
                        key={column.key}
                        className={`flex min-h-[48px] items-center justify-end border-l border-white/5 px-3 py-3 text-sm ${
                          column.highlighted
                            ? "bg-cyan-400/[0.018]"
                            : ""
                        } ${
                          column.movement
                            ? "bg-white/[0.01]"
                            : ""
                        }`}
                      >
                        <ValueCell
                          value={
                            row.values[
                              column.key
                            ]
                          }
                          movement={
                            column.movement
                          }
                          expenseRow={
                            expenseRow
                          }
                          emphasized={
                            emphasized
                          }
                        />
                      </div>
                    )
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-white/5 bg-white/[0.015] px-5 py-3 text-[10px] text-slate-600 sm:flex-row sm:items-center sm:justify-between lg:px-6">
        <p>
          DTD, WTD, and MTD represent movement against the applicable comparison date.
        </p>

        <p className="shrink-0">
          Week base: {data.weekStartDate}
        </p>
      </div>
    </Panel>
  );
}
