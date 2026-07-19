import type { DatabaseRow } from "../../data/database/DatabaseReader";
import type { MetricStatus } from "../../types/metric";

const DPK_OUTFLOW_WINDOWS = [3, 7, 10] as const;
const DPK_OUTFLOW_THRESHOLD_RATE = 0.03;

type DpkOutflowWindow = (typeof DPK_OUTFLOW_WINDOWS)[number];

export interface DpkOutflowWindowResult {
  window: DpkOutflowWindow;
  delta: number | null;
  outflowAmount: number | null;
  fulfilled: boolean;
}

export interface DpkNetOutflowResult {
  value: number | null;
  threshold: number | null;
  status: MetricStatus;
  fulfilledConditions: number;
  windows: DpkOutflowWindowResult[];
}

interface ParsedTpfRow {
  date: Date;
  tpf: number;
  tpfAveragePreviousEom: number | null;
}

function normalizeKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}

function normalizeRow(
  row: DatabaseRow
): Record<string, unknown> {
  const normalized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(row)) {
    normalized[normalizeKey(key)] = value;
  }

  return normalized;
}

function getValue(
  row: Record<string, unknown>,
  aliases: string[]
): unknown {
  for (const alias of aliases) {
    const normalizedAlias = normalizeKey(alias);

    if (normalizedAlias in row) {
      return row[normalizedAlias];
    }
  }

  return undefined;
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value !== "string") {
    return null;
  }

  const normalized = value
    .replace(/,/g, "")
    .replace(/%/g, "")
    .trim();

  if (!normalized) {
    return null;
  }

  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : null;
}

function parseDate(value: unknown): Date | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime())
      ? null
      : value;
  }

  if (typeof value === "number") {
    const excelEpoch = Date.UTC(1899, 11, 30);

    const parsedDate = new Date(
      excelEpoch +
        value * 24 * 60 * 60 * 1000
    );

    return Number.isNaN(parsedDate.getTime())
      ? null
      : parsedDate;
  }

  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return null;
  }

  const dayFirstMatch = trimmedValue.match(
    /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})/
  );

  if (dayFirstMatch) {
    const [, day, month, year] = dayFirstMatch;

    const parsedDate = new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    );

    return Number.isNaN(parsedDate.getTime())
      ? null
      : parsedDate;
  }

  const parsedDate = new Date(trimmedValue);

  return Number.isNaN(parsedDate.getTime())
    ? null
    : parsedDate;
}

function toMetricStatus(
  fulfilledConditions: number
): MetricStatus {
  if (fulfilledConditions >= 3) {
    return "Critical";
  }

  if (fulfilledConditions === 2) {
    return "Warning";
  }

  if (fulfilledConditions === 1) {
    return "Watch";
  }

  return "Healthy";
}

function parseTpfRows(
  rows: DatabaseRow[]
): ParsedTpfRow[] {
  return rows
    .map((sourceRow): ParsedTpfRow | null => {
      const row = normalizeRow(sourceRow);

      const date = parseDate(
        getValue(row, [
          "date",
          "reporting_date",
          "report_date",
          "tanggal",
        ])
      );

      const tpf = toNumber(
        getValue(row, ["tpf"])
      );

      const tpfAveragePreviousEom = toNumber(
        getValue(row, ["tpf_avg_eom"])
      );

      if (!date || tpf === null) {
        return null;
      }

      return {
        date,
        tpf,
        tpfAveragePreviousEom,
      };
    })
    .filter(
      (row): row is ParsedTpfRow =>
        row !== null
    )
    .sort(
      (a, b) =>
        a.date.getTime() -
        b.date.getTime()
    );
}

function selectDisplayedValue(
  windows: DpkOutflowWindowResult[]
): number | null {
  const fulfilledDeltas = windows
    .filter(
      (windowResult) =>
        windowResult.fulfilled &&
        windowResult.delta !== null
    )
    .map(
      (windowResult) =>
        windowResult.delta as number
    );

  if (fulfilledDeltas.length > 0) {
    return Math.min(...fulfilledDeltas);
  }

  /*
   * Saat belum ada kondisi yang melampaui threshold,
   * card tetap menampilkan net outflow terbesar yang
   * tersedia agar tidak menjadi kosong.
   */
  const availableOutflowDeltas = windows
    .filter(
      (windowResult) =>
        windowResult.delta !== null &&
        (windowResult.delta as number) < 0
    )
    .map(
      (windowResult) =>
        windowResult.delta as number
    );

  if (availableOutflowDeltas.length > 0) {
    return Math.min(...availableOutflowDeltas);
  }

  /*
   * Apabila semua periode mengalami inflow,
   * tampilkan delta paling kecil atau paling dekat
   * dengan kondisi outflow.
   */
  const availableDeltas = windows
    .filter(
      (windowResult) =>
        windowResult.delta !== null
    )
    .map(
      (windowResult) =>
        windowResult.delta as number
    );

  return availableDeltas.length > 0
    ? Math.min(...availableDeltas)
    : null;
}

export function calculateDpkNetOutflow(
  rows: DatabaseRow[]
): DpkNetOutflowResult {
  const parsedRows = parseTpfRows(rows);

  const latestRow = parsedRows.at(-1);

  if (!latestRow) {
    return {
      value: null,
      threshold: null,
      status: "Healthy",
      fulfilledConditions: 0,
      windows: DPK_OUTFLOW_WINDOWS.map(
        (window) => ({
          window,
          delta: null,
          outflowAmount: null,
          fulfilled: false,
        })
      ),
    };
  }

  const averagePreviousEom =
    latestRow.tpfAveragePreviousEom;

  const threshold =
    averagePreviousEom !== null
      ? averagePreviousEom *
        DPK_OUTFLOW_THRESHOLD_RATE
      : null;

  const windows: DpkOutflowWindowResult[] =
    DPK_OUTFLOW_WINDOWS.map((window) => {
      /*
       * Window menggunakan jumlah observasi harian
       * yang tersedia di DB_EWI. Karena data bank
       * dapat melewati weekend atau hari libur,
       * D-3 berarti tiga reporting observations lalu.
       */
      const comparisonRow =
        parsedRows[
          parsedRows.length - 1 - window
        ];

      if (!comparisonRow) {
        return {
          window,
          delta: null,
          outflowAmount: null,
          fulfilled: false,
        };
      }

      /*
       * Nilai negatif = net outflow.
       * Nilai positif = net inflow.
       */
      const delta =
        latestRow.tpf -
        comparisonRow.tpf;

      const outflowAmount =
        delta < 0
          ? Math.abs(delta)
          : 0;

      /*
       * Kondisi terpenuhi apabila nilai penurunan TPF
       * lebih besar dari 3% average TPF bulan lalu.
       */
      const fulfilled =
        threshold !== null &&
        delta < -threshold;

      return {
        window,
        delta,
        outflowAmount,
        fulfilled,
      };
    });

  const fulfilledConditions =
    windows.filter(
      (windowResult) =>
        windowResult.fulfilled
    ).length;

  return {
    value: selectDisplayedValue(windows),
    threshold:
      threshold !== null
        ? -threshold
        : null,
    status: toMetricStatus(
      fulfilledConditions
    ),
    fulfilledConditions,
    windows,
  };
}