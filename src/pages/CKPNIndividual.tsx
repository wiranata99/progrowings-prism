import { useMemo, useState } from "react";
import {
  Calculator,
  Download,
  FileCheck2,
  Plus,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { jsPDF } from "jspdf";

import AppLayout from "../components/layout/AppLayout";
import SectionHeader from "../components/common/SectionHeader";

/* =========================================================
   TYPES
========================================================= */

type RecoverySource =
  | "Operational"
  | "Collateral"
  | "Other";

type Collateral = {
  id: string;
  name: string;
  value: number;
  haircut: number;
  workoutCost: number;
};

type RecoverySchedule = {
  id: string;
  source: RecoverySource;
  collateralId: string | null;
  amount: number;
  month: number;
};

type Inputs = {
  borrower: string;
  cif: string;
  facility: string;
  reportingDate: string;
  assessmentId: string;

  gca: number;

  /*
    Stored internally as percentage:
    9.75 means 9.75%
  */
  eir: number;

  judgement: string;

  collaterals: Collateral[];
  schedules: RecoverySchedule[];
};

/* =========================================================
   INITIAL DATA
========================================================= */

const initial: Inputs = {
  borrower: "PT Contoh Debitur",
  cif: "CIF-001234",
  facility: "Kredit Modal Kerja",
  reportingDate: "2026-08-20",
  assessmentId: "PRISM-ICKPN-20260820-001",

  gca: 100_000_000_000,
  eir: 9.75,

  judgement:
    "Estimasi recovery didasarkan pada informasi terkini yang tersedia, kemampuan pembayaran debitur, nilai agunan yang dapat direalisasikan, biaya penyelesaian, serta estimasi waktu pemulihan yang dapat didukung oleh bukti dan dokumentasi.",

  collaterals: [
    {
      id: "collateral-1",
      name: "Land & Building",
      value: 50_000_000_000,
      haircut: 20,
      workoutCost: 2_000_000_000,
    },
    {
      id: "collateral-2",
      name: "Warehouse",
      value: 30_000_000_000,
      haircut: 30,
      workoutCost: 1_575_000_000,
    },
  ],

  schedules: [
    {
      id: "recovery-1",
      source: "Operational",
      collateralId: null,
      amount: 10_000_000_000,
      month: 6,
    },
    {
      id: "recovery-2",
      source: "Operational",
      collateralId: null,
      amount: 15_000_000_000,
      month: 12,
    },
    {
      id: "recovery-3",
      source: "Collateral",
      collateralId: "collateral-1",
      amount: 18_000_000_000,
      month: 18,
    },
    {
      id: "recovery-4",
      source: "Other",
      collateralId: null,
      amount: 5_000_000_000,
      month: 24,
    },
    {
      id: "recovery-5",
      source: "Collateral",
      collateralId: "collateral-1",
      amount: 20_000_000_000,
      month: 30,
    },
    {
      id: "recovery-6",
      source: "Collateral",
      collateralId: "collateral-2",
      amount: 19_425_000_000,
      month: 36,
    },
  ],
};

/* =========================================================
   FORMATTERS
========================================================= */

const rupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(n) ? n : 0);

const rupiahCompact = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(Number.isFinite(n) ? n : 0);

const percentage = (n: number) =>
  `${(Number.isFinite(n) ? n : 0).toFixed(2)}%`;

const formatAmountInput = (n: number) => {
  if (!Number.isFinite(n)) return "0";

  return Math.round(n).toLocaleString("en-US", {
    maximumFractionDigits: 0,
  });
};

const parseAmountInput = (value: string) => {
  const cleanValue = value
    .replace(/,/g, "")
    .replace(/[^\d]/g, "");

  if (cleanValue === "") return 0;

  const parsed = Number(cleanValue);

  return Number.isFinite(parsed) ? parsed : 0;
};

const reportingDateDisplay = (date: string) => {
  if (!date) return "-";

  const [year, month, day] = date.split("-");

  if (!year || !month || !day) return date;

  return `${month}/${day}/${year}`;
};

/* =========================================================
   PERCENT INPUT HELPERS

   Important:
   - User may type 2
   - then 20
   - then 20.
   - then 20.5
   - then 20.50

   We therefore keep a LOCAL STRING while editing.
   Parent numeric value is updated only when the typed
   value can be parsed.

   This avoids the previous "locking" behaviour.
========================================================= */

const sanitizePercentText = (raw: string) => {
  /*
    Accept comma as decimal separator too.
  */
  let value = raw.replace(",", ".");

  /*
    Keep only digits and decimal point.
  */
  value = value.replace(/[^\d.]/g, "");

  /*
    Allow only one decimal point.
  */
  const firstDot = value.indexOf(".");

  if (firstDot !== -1) {
    value =
      value.slice(0, firstDot + 1) +
      value
        .slice(firstDot + 1)
        .replace(/\./g, "");
  }

  return value;
};


/* =========================================================
   SAFE MONTH ADDITION
========================================================= */

const addMonthsToDate = (
  dateString: string,
  monthsToAdd: number,
) => {
  if (!dateString) return "-";

  const parts = dateString.split("-").map(Number);

  if (parts.length !== 3) return "-";

  const [year, month, day] = parts;

  if (!year || !month || !day) return "-";

  const safeMonths = Math.max(
    0,
    Math.trunc(monthsToAdd),
  );

  const startingMonthIndex = month - 1;

  const absoluteMonth =
    startingMonthIndex + safeMonths;

  const targetYear =
    year + Math.floor(absoluteMonth / 12);

  const targetMonthIndex =
    ((absoluteMonth % 12) + 12) % 12;

  const lastDay = new Date(
    Date.UTC(
      targetYear,
      targetMonthIndex + 1,
      0,
    ),
  ).getUTCDate();

  const targetDay = Math.min(day, lastDay);

  const mm = String(
    targetMonthIndex + 1,
  ).padStart(2, "0");

  const dd = String(targetDay).padStart(2, "0");

  return `${mm}/${dd}/${targetYear}`;
};

/* =========================================================
   IDS
========================================================= */

const newRecoveryId = () =>
  `recovery-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;

const newCollateralId = () =>
  `collateral-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;

/* =========================================================
   GENERIC FIELD
========================================================= */

function Field({
  label,
  value,
  onChange,
  suffix,
  type = "text",
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  suffix?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </span>

      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-3 text-sm text-white outline-none transition focus:border-cyan-400 ${
            suffix ? "pr-20" : ""
          }`}
        />

        {suffix && (
          <span className="pointer-events-none absolute right-3 top-3 text-sm text-slate-500">
            {suffix}
          </span>
        )}
      </div>
    </label>
  );
}

/* =========================================================
   PERCENT FIELD

   No HTML number spinner.
   Free typing supported.
========================================================= */

function PercentField({
  label,
  value,
  onChange,
  max = 100,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
}) {
  const [draft, setDraft] = useState(
    String(value),
  );

  const handleChange = (raw: string) => {
    const cleaned = sanitizePercentText(raw);

    setDraft(cleaned);

    if (
      cleaned === "" ||
      cleaned === "."
    ) {
      return;
    }

    const parsed = Number(cleaned);

    if (!Number.isFinite(parsed)) {
      return;
    }

    /*
      Do not modify user's typing.
      Only numeric state is capped.
    */
    onChange(
      Math.max(
        0,
        Math.min(max, parsed),
      ),
    );
  };

  const handleBlur = () => {
    const parsed = Number(draft);

    if (!Number.isFinite(parsed)) {
      setDraft(String(value));
      return;
    }

    const safeValue = Math.max(
      0,
      Math.min(max, parsed),
    );

    onChange(safeValue);

    /*
      Keep sensible display.
      20.50 typed by user remains usable while editing,
      but after blur it becomes standard numeric display.
    */
    setDraft(String(safeValue));
  };

  return (
    <label className="block">
      {label !== "" && (
        <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </span>
      )}

      <div className="relative">
        <input
          type="text"
          inputMode="decimal"
          value={draft}
          onChange={(e) =>
            handleChange(e.target.value)
          }
          onBlur={handleBlur}
          className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-3 pr-9 text-sm text-white outline-none transition focus:border-cyan-400"
        />

        <span className="pointer-events-none absolute right-3 top-3 text-sm text-slate-500">
          %
        </span>
      </div>
    </label>
  );
}

/* =========================================================
   FULL RUPIAH FIELD
========================================================= */

function AmountField({
  label,
  value,
  onChange,
  showHelper = true,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  showHelper?: boolean;
}) {
  return (
    <label className="block">
      {label !== "" && (
        <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </span>
      )}

      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          value={formatAmountInput(value)}
          onChange={(e) =>
            onChange(
              parseAmountInput(e.target.value),
            )
          }
          className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-3 pr-14 text-sm text-white outline-none transition focus:border-cyan-400"
        />

        <span className="pointer-events-none absolute right-3 top-3 text-sm text-slate-500">
          Rp
        </span>
      </div>

      {showHelper && (
        <div className="mt-1 text-[11px] text-slate-600">
          Full Rupiah
        </div>
      )}
    </label>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function CKPNIndividual() {
  const [v, setV] = useState<Inputs>(initial);

  /* =======================================================
     BASIC SETTERS
  ======================================================= */

  const setText = (
    key:
      | "borrower"
      | "cif"
      | "facility"
      | "reportingDate"
      | "assessmentId"
      | "judgement",
    value: string,
  ) => {
    setV((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const setGca = (value: number) => {
    setV((previous) => ({
      ...previous,
      gca: Math.max(0, value),
    }));
  };

  const setEir = (value: number) => {
    setV((previous) => ({
      ...previous,
      eir: Math.max(0, value),
    }));
  };

  /* =======================================================
     COLLATERAL REGISTER
  ======================================================= */

  const updateCollateral = (
    id: string,
    patch: Partial<Collateral>,
  ) => {
    setV((previous) => ({
      ...previous,

      collaterals: previous.collaterals.map(
        (collateral) =>
          collateral.id === id
            ? {
                ...collateral,
                ...patch,
              }
            : collateral,
      ),
    }));
  };

  const addCollateral = () => {
    setV((previous) => ({
      ...previous,

      collaterals: [
        ...previous.collaterals,
        {
          id: newCollateralId(),
          name: `Collateral ${
            previous.collaterals.length + 1
          }`,
          value: 0,
          haircut: 0,
          workoutCost: 0,
        },
      ],
    }));
  };

  const removeCollateral = (
    collateralId: string,
  ) => {
    setV((previous) => {
      if (previous.collaterals.length <= 1) {
        return previous;
      }

      return {
        ...previous,

        collaterals: previous.collaterals.filter(
          (collateral) =>
            collateral.id !== collateralId,
        ),

        schedules: previous.schedules.map((row) =>
          row.collateralId === collateralId
            ? {
                ...row,
                source:
                  "Operational" as RecoverySource,
                collateralId: null,
              }
            : row,
        ),
      };
    });
  };

  /* =======================================================
     RECOVERY SCHEDULE
  ======================================================= */

  const updateSchedule = (
    id: string,
    patch: Partial<RecoverySchedule>,
  ) => {
    setV((previous) => ({
      ...previous,

      schedules: previous.schedules.map((row) =>
        row.id === id
          ? {
              ...row,
              ...patch,
            }
          : row,
      ),
    }));
  };

  const changeRecoverySource = (
    id: string,
    source: RecoverySource,
  ) => {
    setV((previous) => {
      const firstCollateralId =
        previous.collaterals[0]?.id ?? null;

      return {
        ...previous,

        schedules: previous.schedules.map((row) =>
          row.id === id
            ? {
                ...row,
                source,
                collateralId:
                  source === "Collateral"
                    ? firstCollateralId
                    : null,
              }
            : row,
        ),
      };
    });
  };

  const addSchedule = () => {
    setV((previous) => ({
      ...previous,

      schedules: [
        ...previous.schedules,
        {
          id: newRecoveryId(),
          source: "Operational",
          collateralId: null,
          amount: 0,
          month: 1,
        },
      ],
    }));
  };

  const removeSchedule = (id: string) => {
    setV((previous) => {
      if (previous.schedules.length <= 1) {
        return previous;
      }

      return {
        ...previous,

        schedules: previous.schedules.filter(
          (row) => row.id !== id,
        ),
      };
    });
  };

  /* =======================================================
     CALCULATION ENGINE
  ======================================================= */

  const result = useMemo(() => {
    const annualRate =
      Math.max(0, v.eir) / 100;

    const discount = (
      amount: number,
      month: number,
    ) => {
      const safeAmount = Math.max(0, amount);
      const safeMonth = Math.max(0, month);

      const discountFactor =
        1 /
        Math.pow(
          1 + annualRate,
          safeMonth / 12,
        );

      return safeAmount * discountFactor;
    };

    /* =====================================================
       COLLATERAL ENGINE

       After Haircut
       =
       Collateral Value × (1 − Haircut%)

       Net Recoverable
       =
       MAX(
         0,
         After Haircut − Workout Cost Rp
       )
    ===================================================== */

    const calculatedCollaterals =
      v.collaterals.map((collateral) => {
        const safeValue = Math.max(
          0,
          collateral.value,
        );

        const haircutRate =
          Math.max(
            0,
            Math.min(100, collateral.haircut),
          ) / 100;

        const workoutCost = Math.max(
          0,
          collateral.workoutCost,
        );

        const afterHaircut =
          safeValue * (1 - haircutRate);

        const netRecoverable = Math.max(
          0,
          afterHaircut - workoutCost,
        );

        return {
          ...collateral,
          value: safeValue,
          haircut: haircutRate * 100,
          workoutCost,
          afterHaircut,
          netRecoverable,
        };
      });

    const collateralMap = new Map(
      calculatedCollaterals.map((collateral) => [
        collateral.id,
        collateral,
      ]),
    );

    /* =====================================================
       SORT RECOVERY
    ===================================================== */

    const sortedSchedules = [
      ...v.schedules,
    ].sort((a, b) => {
      if (a.month !== b.month) {
        return a.month - b.month;
      }

      return a.source.localeCompare(b.source);
    });

    /* =====================================================
       SCHEDULE ENGINE
    ===================================================== */

    const calculatedSchedules =
      sortedSchedules.map((row) => {
        const safeMonth = Math.max(
          0,
          Math.trunc(row.month),
        );

        const safeAmount = Math.max(
          0,
          row.amount,
        );

        const linkedCollateral =
          row.source === "Collateral" &&
          row.collateralId
            ? collateralMap.get(row.collateralId)
            : undefined;

        return {
          ...row,

          amount: safeAmount,
          month: safeMonth,

          expectedDate: addMonthsToDate(
            v.reportingDate,
            safeMonth,
          ),

          pv: discount(
            safeAmount,
            safeMonth,
          ),

          recoveryFrom:
            row.source === "Collateral"
              ? linkedCollateral?.name ??
                "Unassigned Collateral"
              : "—",
        };
      });

    /* =====================================================
       GROUP RECOVERY
    ===================================================== */

    const operationalRows =
      calculatedSchedules.filter(
        (row) => row.source === "Operational",
      );

    const collateralRows =
      calculatedSchedules.filter(
        (row) => row.source === "Collateral",
      );

    const otherRows =
      calculatedSchedules.filter(
        (row) => row.source === "Other",
      );

    const sumAmount = (
      rows: typeof calculatedSchedules,
    ) =>
      rows.reduce(
        (total, row) => total + row.amount,
        0,
      );

    const sumPV = (
      rows: typeof calculatedSchedules,
    ) =>
      rows.reduce(
        (total, row) => total + row.pv,
        0,
      );

    const operationalAmount =
      sumAmount(operationalRows);

    const operationalPV =
      sumPV(operationalRows);

    const collateralScheduled =
      sumAmount(collateralRows);

    const collateralPV =
      sumPV(collateralRows);

    const otherAmount =
      sumAmount(otherRows);

    const otherPV = sumPV(otherRows);

    /* =====================================================
       PER COLLATERAL CONTROL
    ===================================================== */

    const collateralControls =
      calculatedCollaterals.map((collateral) => {
        const linkedRows =
          collateralRows.filter(
            (row) =>
              row.collateralId === collateral.id,
          );

        const scheduledRecovery =
          linkedRows.reduce(
            (total, row) => total + row.amount,
            0,
          );

        const scheduledPV =
          linkedRows.reduce(
            (total, row) => total + row.pv,
            0,
          );

        const difference =
          collateral.netRecoverable -
          scheduledRecovery;

        const tally =
          Math.abs(difference) < 1;

        const status = tally
          ? "TALLY"
          : difference > 0
            ? "UNDER-ALLOCATED"
            : "OVER-ALLOCATED";

        return {
          ...collateral,
          scheduledRecovery,
          scheduledPV,
          difference,
          tally,
          status,
        };
      });

    /* =====================================================
       COLLATERAL TOTALS
    ===================================================== */

    const totalCollateralValue =
      calculatedCollaterals.reduce(
        (total, collateral) =>
          total + collateral.value,
        0,
      );

    const totalAfterHaircut =
      calculatedCollaterals.reduce(
        (total, collateral) =>
          total + collateral.afterHaircut,
        0,
      );

    const totalWorkoutCost =
      calculatedCollaterals.reduce(
        (total, collateral) =>
          total + collateral.workoutCost,
        0,
      );

    const totalNetRecoverableCollateral =
      calculatedCollaterals.reduce(
        (total, collateral) =>
          total + collateral.netRecoverable,
        0,
      );

    const collateralDifference =
      totalNetRecoverableCollateral -
      collateralScheduled;

    const collateralTally =
      collateralControls.every(
        (collateral) => collateral.tally,
      );

    const collateralStatus =
      collateralTally
        ? "TALLY"
        : collateralControls.some(
              (collateral) =>
                collateral.status ===
                "OVER-ALLOCATED",
            )
          ? "REVIEW REQUIRED"
          : "UNDER-ALLOCATED";

    /* =====================================================
       TOTAL RECOVERY
    ===================================================== */

    const totalExpectedRecovery =
      operationalAmount +
      collateralScheduled +
      otherAmount;

    const totalPVRecovery =
      operationalPV +
      collateralPV +
      otherPV;

    /* =====================================================
       INDIVIDUAL CKPN
    ===================================================== */

    const ckpn = Math.max(
      0,
      v.gca - totalPVRecovery,
    );

    const coverageRatio =
      v.gca > 0
        ? (ckpn / v.gca) * 100
        : 0;

    return {
      calculatedCollaterals,
      collateralControls,

      totalCollateralValue,
      totalAfterHaircut,
      totalWorkoutCost,
      totalNetRecoverableCollateral,

      calculatedSchedules,

      operationalAmount,
      operationalPV,

      collateralScheduled,
      collateralPV,

      otherAmount,
      otherPV,

      totalExpectedRecovery,
      totalPVRecovery,

      collateralDifference,
      collateralTally,
      collateralStatus,

      ckpn,
      coverageRatio,
    };
  }, [v]);

  /* =======================================================
     PDF REPORT
  ======================================================= */

  const downloadPDF = async () => {
    const doc = new jsPDF({
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    });

    const pageHeight = 297;

    const left = 14;
    const right = 196;

    const contentWidth = right - left;

    const navy: [number, number, number] = [
      9, 30, 50,
    ];

    const cyan: [number, number, number] = [
      8, 145, 178,
    ];

    const dark: [number, number, number] = [
      35, 45, 55,
    ];

    const grey: [number, number, number] = [
      100, 110, 120,
    ];

    const lightGrey: [number, number, number] = [
      242, 245, 247,
    ];

    let y = 14;

    const text = (
      value: string,
      x: number,
      yy: number,
      size = 7,
      bold = false,
      color: [number, number, number] = dark,
      align: "left" | "center" | "right" = "left",
    ) => {
      doc.setFont(
        "helvetica",
        bold ? "bold" : "normal",
      );

      doc.setFontSize(size);

      doc.setTextColor(
        color[0],
        color[1],
        color[2],
      );

      doc.text(value, x, yy, {
        align,
      });
    };

    const wrappedText = (
      value: string,
      x: number,
      yy: number,
      width: number,
      size = 5.7,
      lineHeight = 2.8,
      maxLines = 3,
    ) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(size);
      doc.setTextColor(...dark);

      const rawLines =
        doc.splitTextToSize(
          value,
          width,
        ) as string[];

      const lines = rawLines.slice(0, maxLines);

      if (
        rawLines.length > maxLines &&
        lines.length > 0
      ) {
        const last = lines[lines.length - 1];

        lines[lines.length - 1] =
          `${last.slice(
            0,
            Math.max(0, last.length - 3),
          )}...`;
      }

      doc.text(lines, x, yy);

      return yy + lines.length * lineHeight;
    };

    const sectionTitle = (
      title: string,
      yy: number,
    ) => {
      doc.setFillColor(...navy);

      doc.roundedRect(
        left,
        yy,
        contentWidth,
        7,
        1,
        1,
        "F",
      );

      text(
        title,
        left + 3,
        yy + 4.6,
        6.8,
        true,
        [255, 255, 255],
      );

      return yy + 10;
    };

    /* =====================================================
       LOGO
    ===================================================== */

    try {
      const image = await fetch(
        "/progrowings-logo.png",
      ).then((response) => response.blob());

      const data = await new Promise<string>(
        (resolve) => {
          const reader = new FileReader();

          reader.onload = () =>
            resolve(String(reader.result));

          reader.readAsDataURL(image);
        },
      );

      doc.addImage(
        data,
        "PNG",
        169,
        8,
        25,
        25,
      );
    } catch {
      // PDF remains functional without logo.
    }

    /* =====================================================
       HEADER
    ===================================================== */

    text(
      "LAPORAN PENILAIAN",
      left,
      y + 4,
      9.5,
      true,
      navy,
    );

    text(
      "CKPN INDIVIDUAL",
      left,
      y + 11,
      16,
      true,
      navy,
    );

    text(
      "PRISM - Individual Credit Impairment Assessment",
      left,
      y + 17,
      7,
      false,
      grey,
    );

    doc.setDrawColor(200);

    doc.line(
      left,
      y + 22,
      right,
      y + 22,
    );

    y += 28;

    /* =====================================================
       1. INFORMATION
    ===================================================== */

    y = sectionTitle(
      "1. INFORMASI PENILAIAN",
      y,
    );

    text(
      "Assessment ID",
      left + 2,
      y,
      5.7,
      false,
      grey,
    );

    text(
      v.assessmentId,
      left + 27,
      y,
      6.1,
      true,
    );

    text(
      "Reporting Date",
      111,
      y,
      5.7,
      false,
      grey,
    );

    text(
      reportingDateDisplay(v.reportingDate),
      139,
      y,
      6.1,
      true,
    );

    y += 5;

    text(
      "Debitur",
      left + 2,
      y,
      5.7,
      false,
      grey,
    );

    text(
      v.borrower,
      left + 27,
      y,
      6.1,
      true,
    );

    text(
      "CIF",
      111,
      y,
      5.7,
      false,
      grey,
    );

    text(
      v.cif,
      139,
      y,
      6.1,
      true,
    );

    y += 5;

    text(
      "Fasilitas",
      left + 2,
      y,
      5.7,
      false,
      grey,
    );

    text(
      v.facility,
      left + 27,
      y,
      6.1,
      true,
    );

    text(
      "EIR",
      111,
      y,
      5.7,
      false,
      grey,
    );

    text(
      percentage(v.eir),
      139,
      y,
      6.1,
      true,
    );

    y += 7;

    /* =====================================================
       2. RESULT SUMMARY
    ===================================================== */

    y = sectionTitle(
      "2. RINGKASAN HASIL",
      y,
    );

    const boxGap = 3;

    const boxWidth =
      (contentWidth - boxGap * 2) / 3;

    const boxes = [
      {
        label: "GCA",
        value: rupiah(v.gca),
      },
      {
        label: "PV EXPECTED RECOVERY",
        value: rupiah(result.totalPVRecovery),
      },
      {
        label: "INDIVIDUAL CKPN",
        value: rupiah(result.ckpn),
      },
    ];

    boxes.forEach((item, index) => {
      const x =
        left +
        index * (boxWidth + boxGap);

      doc.setFillColor(...lightGrey);

      doc.roundedRect(
        x,
        y,
        boxWidth,
        16,
        1.5,
        1.5,
        "F",
      );

      text(
        item.label,
        x + 3,
        y + 5,
        5.1,
        true,
        grey,
      );

      text(
        item.value,
        x + 3,
        y + 11.5,
        7.1,
        true,
        index === 2 ? cyan : navy,
      );
    });

    y += 20;

    text(
      `CKPN Coverage: ${percentage(
        result.coverageRatio,
      )}`,
      left + 2,
      y,
      6.5,
      true,
      cyan,
    );

    y += 6;

    /* =====================================================
       3. COLLATERAL SUMMARY
    ===================================================== */

    y = sectionTitle(
      "3. RINGKASAN AGUNAN",
      y,
    );

    text(
      `Jumlah Agunan: ${result.calculatedCollaterals.length}`,
      left + 2,
      y,
      5.5,
      false,
      grey,
    );

    text(
      `Gross: ${rupiah(
        result.totalCollateralValue,
      )}`,
      54,
      y,
      5.5,
      false,
      grey,
    );

    text(
      `Workout Cost: ${rupiah(
        result.totalWorkoutCost,
      )}`,
      109,
      y,
      5.5,
      false,
      grey,
    );

    y += 5;

    text(
      `Net Recoverable Collateral: ${rupiah(
        result.totalNetRecoverableCollateral,
      )}`,
      left + 2,
      y,
      6,
      true,
      navy,
    );

    y += 7;

    /* =====================================================
       4. RECOVERY TIMELINE
    ===================================================== */

    y = sectionTitle(
      "4. EXPECTED RECOVERY TIMELINE",
      y,
    );

    const tableX = left;

    const widths = [
      17, 28, 47, 45, 45,
    ];

    const headers = [
      "M+",
      "Expected Date",
      "Source / Recovery From",
      "Expected Recovery",
      "PV Recovery",
    ];

    let x = tableX;

    headers.forEach((header, index) => {
      doc.setFillColor(
        225,
        231,
        235,
      );

      doc.rect(
        x,
        y,
        widths[index],
        7,
        "F",
      );

      text(
        header,
        x + 2,
        y + 4.5,
        5,
        true,
        navy,
      );

      x += widths[index];
    });

    let rowY = y + 7;

    const pdfRows =
      result.calculatedSchedules.slice(
        0,
        9,
      );

    pdfRows.forEach((row, index) => {
      x = tableX;

      if (index % 2 === 0) {
        doc.setFillColor(
          248,
          250,
          252,
        );

        doc.rect(
          tableX,
          rowY,
          contentWidth,
          7,
          "F",
        );
      }

      const source =
        row.source === "Collateral"
          ? `Collateral / ${row.recoveryFrom}`
          : row.source;

      const cells = [
        `M+${row.month}`,
        row.expectedDate,
        source,
        rupiah(row.amount),
        rupiah(row.pv),
      ];

      cells.forEach((cell, cellIndex) => {
        const alignRight =
          cellIndex >= 3;

        text(
          cell,

          alignRight
            ? x +
                widths[cellIndex] -
                2
            : x + 2,

          rowY + 4.5,

          cellIndex === 2
            ? 4.6
            : 5,

          cellIndex === 0,

          dark,

          alignRight
            ? "right"
            : "left",
        );

        x += widths[cellIndex];
      });

      rowY += 7;
    });

    y = rowY + 4;

    if (
      result.calculatedSchedules.length > 9
    ) {
      text(
        `+ ${
          result.calculatedSchedules.length - 9
        } recovery schedule tambahan tidak ditampilkan dalam executive resume.`,
        left + 2,
        y,
        5,
        false,
        grey,
      );

      y += 5;
    }

    /* =====================================================
       5. RECOVERY SUMMARY
    ===================================================== */

    y = sectionTitle(
      "5. RECOVERY SUMMARY",
      y,
    );

    text(
      `Operational: ${rupiah(
        result.operationalAmount,
      )} | PV ${rupiah(
        result.operationalPV,
      )}`,
      left + 2,
      y,
      5.4,
    );

    y += 4.2;

    text(
      `Collateral: ${rupiah(
        result.collateralScheduled,
      )} | PV ${rupiah(
        result.collateralPV,
      )}`,
      left + 2,
      y,
      5.4,
    );

    y += 4.2;

    text(
      `Other: ${rupiah(
        result.otherAmount,
      )} | PV ${rupiah(
        result.otherPV,
      )}`,
      left + 2,
      y,
      5.4,
    );

    y += 5;

    /* =====================================================
       6. PROFESSIONAL JUDGEMENT
    ===================================================== */

    y = sectionTitle(
      "6. PROFESSIONAL JUDGEMENT",
      y,
    );

    y = wrappedText(
      v.judgement,
      left + 2,
      y,
      contentWidth - 4,
      5.5,
      2.7,
      3,
    );

    y += 2;

    /* =====================================================
       7. CONCLUSION
    ===================================================== */

    y = sectionTitle(
      "7. KESIMPULAN PENILAIAN",
      y,
    );

    const conclusion =
      `Berdasarkan expected recovery yang diproyeksikan sesuai M+ dan didiskontokan menggunakan EIR ${percentage(
        v.eir,
      )} dengan formula PV = Recovery / (1 + EIR)^(M/12), diperoleh PV Expected Recovery sebesar ${rupiah(
        result.totalPVRecovery,
      )}. Dibandingkan dengan GCA sebesar ${rupiah(
        v.gca,
      )}, estimasi CKPN Individual adalah ${rupiah(
        result.ckpn,
      )}, atau ${percentage(
        result.coverageRatio,
      )} dari GCA.`;

    wrappedText(
      conclusion,
      left + 2,
      y,
      contentWidth - 4,
      5.6,
      2.8,
      4,
    );

    /* =====================================================
       FOOTER
    ===================================================== */

    const footerY =
      pageHeight - 18;

    doc.setFillColor(
      248,
      250,
      252,
    );

    doc.roundedRect(
      left,
      footerY - 10,
      contentWidth,
      9,
      1,
      1,
      "F",
    );

    text(
      "DISCLAIMER",
      left + 2,
      footerY - 6.5,
      5.1,
      true,
      grey,
    );

    text(
      "Output berdasarkan data dan asumsi pengguna serta tetap memerlukan review, validasi dan approval sesuai governance internal bank.",
      left + 24,
      footerY - 6.5,
      4.9,
      false,
      grey,
    );

    doc.setDrawColor(210);

    doc.line(
      left,
      footerY + 1,
      right,
      footerY + 1,
    );

    text(
      "CONFIDENTIAL - Generated by PRISM",
      left,
      footerY + 6,
      5.1,
      true,
      grey,
    );

    text(
      "© PT Progressive Knowledge Consulting - Progrowings",
      105,
      footerY + 6,
      4.9,
      false,
      grey,
      "center",
    );

    text(
      "Page 1 of 1",
      right,
      footerY + 6,
      4.9,
      false,
      grey,
      "right",
    );

    doc.save(
      `CKPN_Individual_${v.assessmentId}.pdf`,
    );
  };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <AppLayout>
      <SectionHeader
        eyebrow="Credit Analytics"
        title="Individual CKPN Assessment"
        description="Cash shortfall assessment based on layered recovery schedules, multiple collateral assumptions, recovery timing and EIR discounting."
        badge="Showcase V3"
      />

      <div className="space-y-6">
        {/* =================================================
            01 · ASSESSMENT SETUP
        ================================================= */}

        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="mb-5">
            <div className="text-xs font-bold uppercase tracking-[.2em] text-cyan-400">
              01 · Assessment Setup
            </div>

            <h3 className="mt-2 flex items-center gap-2 text-lg font-bold">
              <ShieldCheck className="text-cyan-400" />
              Debtor & Exposure
            </h3>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Field
              label="Debitur"
              value={v.borrower}
              onChange={(x) =>
                setText("borrower", x)
              }
            />

            <Field
              label="CIF"
              value={v.cif}
              onChange={(x) =>
                setText("cif", x)
              }
            />

            <Field
              label="Fasilitas"
              value={v.facility}
              onChange={(x) =>
                setText("facility", x)
              }
            />

            <Field
              label="Reporting Date (mm/dd/yyyy)"
              type="date"
              value={v.reportingDate}
              onChange={(x) =>
                setText(
                  "reportingDate",
                  x,
                )
              }
            />

            <Field
              label="Assessment ID"
              value={v.assessmentId}
              onChange={(x) =>
                setText(
                  "assessmentId",
                  x,
                )
              }
            />

            <AmountField
              label="Gross Carrying Amount (GCA)"
              value={v.gca}
              onChange={setGca}
            />

            {/* EIR NOW USES FREE-TYPING PERCENT FIELD */}

            <PercentField
              label="Effective Interest Rate (EIR)"
              value={v.eir}
              onChange={setEir}
              max={100}
            />
          </div>
        </section>

        {/* =================================================
            02 · COLLATERAL REGISTER

            NEW ORDER:
            Collateral
            Collateral Value
            Haircut
            After Haircut
            Workout Cost
            Net Recoverable
        ================================================= */}

        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <div className="text-xs font-bold uppercase tracking-[.2em] text-cyan-400">
                02 · Collateral Register
              </div>

              <h3 className="mt-2 text-lg font-bold">
                Collateral Recoverability
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Register each collateral separately so haircut, nominal workout/legal cost and recovery timing can reflect the characteristics of each asset.
              </p>
            </div>

            <button
              type="button"
              onClick={addCollateral}
              className="flex items-center justify-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 text-sm font-bold text-cyan-300 transition hover:bg-cyan-500/20"
            >
              <Plus size={17} />
              Add Collateral
            </button>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[1120px]">
              {/* HEADER */}

              <div className="grid grid-cols-[1.25fr_1.35fr_110px_1.1fr_1.25fr_1.15fr_55px] gap-3 border-b border-slate-800 px-3 pb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <div>
                  Collateral
                </div>

                <div>
                  Collateral Value
                </div>

                <div>
                  Haircut
                </div>

                <div>
                  After Haircut
                </div>

                <div>
                  Workout Cost
                </div>

                <div>
                  Net Recoverable
                </div>

                <div />
              </div>

              {/* ROWS */}

              <div className="divide-y divide-slate-800/80">
                {result.calculatedCollaterals.map(
                  (collateral) => (
                    <div
                      key={collateral.id}
                      className="grid grid-cols-[1.25fr_1.35fr_110px_1.1fr_1.25fr_1.15fr_55px] items-center gap-3 px-3 py-4"
                    >
                      {/* COLLATERAL */}

                      <input
                        type="text"
                        value={collateral.name}
                        onChange={(e) =>
                          updateCollateral(
                            collateral.id,
                            {
                              name:
                                e.target.value,
                            },
                          )
                        }
                        className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                      />

                      {/* COLLATERAL VALUE */}

                      <AmountField
                        label=""
                        showHelper={false}
                        value={collateral.value}
                        onChange={(value) =>
                          updateCollateral(
                            collateral.id,
                            {
                              value,
                            },
                          )
                        }
                      />

                      {/* HAIRCUT — FREE TYPE, NO SPINNER */}

                      <PercentField
                        label=""
                        value={collateral.haircut}
                        onChange={(haircut) =>
                          updateCollateral(
                            collateral.id,
                            {
                              haircut,
                            },
                          )
                        }
                        max={100}
                      />

                      {/* AFTER HAIRCUT — MOVED HERE */}

                      <div className="rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-3 text-sm font-bold text-white">
                        {rupiahCompact(
                          collateral.afterHaircut,
                        )}
                      </div>

                      {/* WORKOUT COST */}

                      <AmountField
                        label=""
                        showHelper={false}
                        value={
                          collateral.workoutCost
                        }
                        onChange={(workoutCost) =>
                          updateCollateral(
                            collateral.id,
                            {
                              workoutCost,
                            },
                          )
                        }
                      />

                      {/* NET RECOVERABLE */}

                      <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-3 py-3 text-sm font-black text-cyan-200">
                        {rupiahCompact(
                          collateral.netRecoverable,
                        )}
                      </div>

                      {/* DELETE */}

                      <button
                        type="button"
                        onClick={() =>
                          removeCollateral(
                            collateral.id,
                          )
                        }
                        disabled={
                          v.collaterals.length <= 1
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 text-slate-500 transition hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-300 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* COLLATERAL TOTALS */}

          <div className="mt-5 grid gap-3 md:grid-cols-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <div className="text-xs uppercase tracking-wider text-slate-500">
                Total Collateral Value
              </div>

              <div className="mt-2 text-lg font-black">
                {rupiah(
                  result.totalCollateralValue,
                )}
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <div className="text-xs uppercase tracking-wider text-slate-500">
                Total After Haircut
              </div>

              <div className="mt-2 text-lg font-black">
                {rupiah(
                  result.totalAfterHaircut,
                )}
              </div>
            </div>

            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
              <div className="text-xs uppercase tracking-wider text-amber-400">
                Total Workout Cost
              </div>

              <div className="mt-2 text-lg font-black text-amber-200">
                {rupiah(
                  result.totalWorkoutCost,
                )}
              </div>
            </div>

            <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
              <div className="text-xs uppercase tracking-wider text-cyan-400">
                Total Net Recoverable
              </div>

              <div className="mt-2 text-lg font-black text-cyan-200">
                {rupiah(
                  result.totalNetRecoverableCollateral,
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/30 px-4 py-3 text-xs text-slate-500">
            Net Recoverable Collateral = MAX(0, Collateral Value × (1 − Haircut %) − Workout Cost Rp)
          </div>
        </section>

        {/* =================================================
            03 · RECOVERY SCHEDULE
        ================================================= */}

        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <div className="text-xs font-bold uppercase tracking-[.2em] text-cyan-400">
                03 · Layered Recovery Schedule
              </div>

              <h3 className="mt-2 text-lg font-bold">
                Expected Recovery Schedule
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                One row represents one expected recovery cash flow. Expected date and present value are calculated automatically.
              </p>
            </div>

            <button
              type="button"
              onClick={addSchedule}
              className="flex items-center justify-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 text-sm font-bold text-cyan-300 transition hover:bg-cyan-500/20"
            >
              <Plus size={17} />
              Add Recovery Schedule
            </button>
          </div>

          <div className="mb-5 rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-3 text-xs leading-5 text-slate-400">
            <span className="font-bold text-cyan-300">
              Time convention:
            </span>{" "}
            Expected Date = Reporting Date + M+. PV = Recovery / (1 + EIR)
            <sup>M+/12</sup>.
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[1210px]">
              <div className="grid grid-cols-[82px_145px_190px_1.35fr_125px_145px_1fr_55px] gap-3 border-b border-slate-800 px-3 pb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <div>M+</div>
                <div>Source</div>
                <div>Recovery From</div>
                <div>Expected Recovery</div>
                <div>Expected Date</div>
                <div>PV Recovery</div>
                <div>PV / Amount</div>
                <div />
              </div>

              <div className="divide-y divide-slate-800/80">
                {result.calculatedSchedules.map(
                  (row) => (
                    <div
                      key={row.id}
                      className="grid grid-cols-[82px_145px_190px_1.35fr_125px_145px_1fr_55px] items-center gap-3 px-3 py-4"
                    >
                      {/* MONTH */}

                      <div className="relative">
                        <span className="pointer-events-none absolute left-3 top-3 text-sm font-bold text-cyan-400">
                          M+
                        </span>

                        <input
                          type="text"
                          inputMode="numeric"
                          value={row.month}
                          onChange={(e) => {
                            const clean =
                              e.target.value.replace(
                                /\D/g,
                                "",
                              );

                            updateSchedule(
                              row.id,
                              {
                                month:
                                  clean === ""
                                    ? 0
                                    : Math.max(
                                        0,
                                        Number(clean),
                                      ),
                              },
                            );
                          }}
                          className="w-full rounded-xl border border-slate-700 bg-slate-950/70 py-3 pl-9 pr-2 text-sm text-white outline-none transition focus:border-cyan-400"
                        />
                      </div>

                      {/* SOURCE */}

                      <select
                        value={row.source}
                        onChange={(e) =>
                          changeRecoverySource(
                            row.id,
                            e.target
                              .value as RecoverySource,
                          )
                        }
                        className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                      >
                        <option value="Operational">
                          Operational
                        </option>

                        <option value="Collateral">
                          Collateral
                        </option>

                        <option value="Other">
                          Other
                        </option>
                      </select>

                      {/* RECOVERY FROM */}

                      {row.source ===
                      "Collateral" ? (
                        <select
                          value={
                            row.collateralId ?? ""
                          }
                          onChange={(e) =>
                            updateSchedule(
                              row.id,
                              {
                                collateralId:
                                  e.target.value ||
                                  null,
                              },
                            )
                          }
                          className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                        >
                          {result.calculatedCollaterals.map(
                            (collateral) => (
                              <option
                                key={
                                  collateral.id
                                }
                                value={
                                  collateral.id
                                }
                              >
                                {collateral.name}
                              </option>
                            ),
                          )}
                        </select>
                      ) : (
                        <div className="rounded-xl border border-slate-800 bg-slate-950/30 px-3 py-3 text-sm text-slate-600">
                          —
                        </div>
                      )}

                      {/* AMOUNT */}

                      <AmountField
                        label=""
                        showHelper={false}
                        value={row.amount}
                        onChange={(amount) =>
                          updateSchedule(
                            row.id,
                            {
                              amount,
                            },
                          )
                        }
                      />

                      {/* DATE */}

                      <div className="rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-3 text-sm font-medium text-slate-300">
                        {row.expectedDate}
                      </div>

                      {/* PV */}

                      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-3 text-sm font-bold text-emerald-300">
                        {rupiahCompact(row.pv)}
                      </div>

                      {/* PV RATIO */}

                      <div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                          <div
                            className="h-full rounded-full bg-cyan-400"
                            style={{
                              width: `${
                                row.amount > 0
                                  ? Math.min(
                                      100,
                                      (row.pv /
                                        row.amount) *
                                        100,
                                    )
                                  : 0
                              }%`,
                            }}
                          />
                        </div>

                        <div className="mt-1 text-[11px] text-slate-500">
                          {row.amount > 0
                            ? `${(
                                (row.pv /
                                  row.amount) *
                                100
                              ).toFixed(2)}%`
                            : "0.00%"}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeSchedule(row.id)
                        }
                        disabled={
                          v.schedules.length <= 1
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 text-slate-500 transition hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-300 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={addSchedule}
            className="mt-5 flex items-center gap-2 rounded-xl border border-dashed border-slate-700 px-4 py-3 text-sm font-semibold text-slate-400 transition hover:border-cyan-500/40 hover:text-cyan-300"
          >
            <Plus size={16} />
            Add Another Recovery Schedule
          </button>
        </section>

        {/* =================================================
            04 · COLLATERAL CONTROL
        ================================================= */}

        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="text-xs font-bold uppercase tracking-[.2em] text-cyan-400">
            04 · Collateral Control
          </div>

          <div className="mt-2 flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
            <div>
              <h3 className="text-lg font-bold">
                Collateral Allocation
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Allocation control is performed per collateral to prevent cross-collateral over-allocation.
              </p>
            </div>

            <div
              className={`rounded-xl border px-4 py-2 text-xs font-black uppercase tracking-wider ${
                result.collateralTally
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                  : "border-amber-500/30 bg-amber-500/10 text-amber-300"
              }`}
            >
              {result.collateralStatus}
            </div>
          </div>

          <div className="mt-5 overflow-x-auto">
            <div className="min-w-[940px]">
              <div className="grid grid-cols-[1.3fr_1.15fr_1.15fr_1.15fr_140px] gap-4 border-b border-slate-800 px-3 pb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <div>Collateral</div>
                <div>Net Recoverable</div>
                <div>Scheduled</div>
                <div>Difference</div>
                <div>Status</div>
              </div>

              <div className="divide-y divide-slate-800/80">
                {result.collateralControls.map(
                  (collateral) => (
                    <div
                      key={collateral.id}
                      className="grid grid-cols-[1.3fr_1.15fr_1.15fr_1.15fr_140px] items-center gap-4 px-3 py-4"
                    >
                      <div className="font-semibold text-white">
                        {collateral.name}
                      </div>

                      <div className="font-bold text-cyan-200">
                        {rupiah(
                          collateral.netRecoverable,
                        )}
                      </div>

                      <div className="font-bold text-white">
                        {rupiah(
                          collateral.scheduledRecovery,
                        )}
                      </div>

                      <div
                        className={`font-bold ${
                          collateral.tally
                            ? "text-emerald-300"
                            : collateral.difference >
                                0
                              ? "text-amber-300"
                              : "text-rose-300"
                        }`}
                      >
                        {rupiah(
                          collateral.difference,
                        )}
                      </div>

                      <div
                        className={`rounded-lg border px-3 py-2 text-center text-xs font-black ${
                          collateral.tally
                            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                            : collateral.difference >
                                0
                              ? "border-amber-500/20 bg-amber-500/10 text-amber-300"
                              : "border-rose-500/20 bg-rose-500/10 text-rose-300"
                        }`}
                      >
                        {collateral.status}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <div className="text-xs uppercase tracking-wider text-slate-500">
                Total Net Recoverable
              </div>

              <div className="mt-2 text-lg font-black">
                {rupiah(
                  result.totalNetRecoverableCollateral,
                )}
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <div className="text-xs uppercase tracking-wider text-slate-500">
                Total Scheduled
              </div>

              <div className="mt-2 text-lg font-black">
                {rupiah(
                  result.collateralScheduled,
                )}
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <div className="text-xs uppercase tracking-wider text-slate-500">
                Difference
              </div>

              <div
                className={`mt-2 text-lg font-black ${
                  Math.abs(
                    result.collateralDifference,
                  ) < 1
                    ? "text-emerald-300"
                    : result.collateralDifference >
                        0
                      ? "text-amber-300"
                      : "text-rose-300"
                }`}
              >
                {rupiah(
                  result.collateralDifference,
                )}
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            05 · RECOVERY SUMMARY
        ================================================= */}

        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="text-xs font-bold uppercase tracking-[.2em] text-cyan-400">
            05 · Recovery Summary
          </div>

          <h3 className="mt-2 text-lg font-bold">
            Recovery by Source
          </h3>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {[
              {
                title: "Operational",
                amount:
                  result.operationalAmount,
                pv:
                  result.operationalPV,
              },
              {
                title: "Collateral",
                amount:
                  result.collateralScheduled,
                pv:
                  result.collateralPV,
              },
              {
                title: "Other",
                amount:
                  result.otherAmount,
                pv:
                  result.otherPV,
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-slate-800 bg-slate-950/50 p-4"
              >
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {item.title}
                </div>

                <div className="mt-3 text-sm font-bold text-white">
                  {rupiah(item.amount)}
                </div>

                <div className="mt-2 text-xs text-slate-500">
                  PV Recovery
                </div>

                <div className="mt-1 text-sm font-bold text-emerald-300">
                  {rupiah(item.pv)}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <div className="text-xs uppercase tracking-wider text-slate-500">
                Total Expected Recovery
              </div>

              <div className="mt-2 text-lg font-black">
                {rupiah(
                  result.totalExpectedRecovery,
                )}
              </div>
            </div>

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <div className="text-xs uppercase tracking-wider text-emerald-400">
                Total PV Recovery
              </div>

              <div className="mt-2 text-lg font-black text-emerald-300">
                {rupiah(
                  result.totalPVRecovery,
                )}
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            06 · PROFESSIONAL JUDGEMENT
        ================================================= */}

        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="text-xs font-bold uppercase tracking-[.2em] text-cyan-400">
            06 · Professional Judgement
          </div>

          <h3 className="mt-2 text-lg font-bold">
            Basis of Assumption
          </h3>

          <textarea
            rows={4}
            value={v.judgement}
            onChange={(e) =>
              setText(
                "judgement",
                e.target.value,
              )
            }
            className="mt-5 w-full rounded-xl border border-slate-700 bg-slate-950/70 p-4 text-sm leading-6 text-white outline-none transition focus:border-cyan-400"
          />

          <p className="mt-3 text-xs leading-5 text-slate-500">
            Recovery timing should be supported by available evidence such as payment projections, appraisal, auction or sale progress, legal process, PKPU/homologation where relevant, buyer interest, and representative historical recovery experience.
          </p>
        </section>

        {/* =================================================
            07 · CKPN RESULT
        ================================================= */}

        <section className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
          <div className="rounded-2xl border border-cyan-500/25 bg-gradient-to-r from-cyan-500/10 to-slate-900 p-6">
            <div className="flex items-center gap-2 text-sm font-bold text-cyan-300">
              <Calculator size={18} />
              INDIVIDUAL CKPN RESULT
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div>
                <div className="text-xs uppercase tracking-wider text-slate-500">
                  Gross Carrying Amount
                </div>

                <div className="mt-2 text-xl font-black">
                  {rupiah(v.gca)}
                </div>
              </div>

              <div>
                <div className="text-xs uppercase tracking-wider text-slate-500">
                  PV Expected Recovery
                </div>

                <div className="mt-2 text-xl font-black text-emerald-300">
                  {rupiah(
                    result.totalPVRecovery,
                  )}
                </div>
              </div>

              <div>
                <div className="text-xs uppercase tracking-wider text-slate-500">
                  Cash Shortfall
                </div>

                <div className="mt-2 text-xl font-black text-amber-300">
                  {rupiah(result.ckpn)}
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-5">
              <div className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                Individual CKPN
              </div>

              <div className="mt-2 text-3xl font-black">
                {rupiah(result.ckpn)}
              </div>

              <div className="mt-1 text-sm text-cyan-200">
                {percentage(
                  result.coverageRatio,
                )}{" "}
                of GCA
              </div>
            </div>

            <button
              type="button"
              onClick={downloadPDF}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 font-black text-slate-950 transition hover:bg-cyan-300"
            >
              <Download size={18} />
              Download PDF Report
            </button>
          </div>

          {/* LOGIC */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <div className="flex items-center gap-2 font-bold">
              <FileCheck2 className="text-emerald-400" />
              Assessment Logic
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-400">
              Each expected recovery cash flow is discounted independently according to its expected recovery month.
            </p>

            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Expected Date
              </div>

              <div className="mt-2 text-sm text-slate-300">
                Reporting Date + M+
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Collateral Recovery
              </div>

              <div className="mt-2 text-sm leading-6 text-slate-300">
                Net Recoverable = MAX(0, Collateral Value × (1 − Haircut %) − Workout Cost Rp)
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Present Value
              </div>

              <div className="mt-2 text-sm text-slate-300">
                PV = Recovery / (1 + EIR)
                <sup>M+ / 12</sup>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Individual CKPN
              </div>

              <div className="mt-2 text-sm text-slate-300">
                CKPN = max(0, GCA − Σ PV Expected Recovery)
              </div>
            </div>

            <p className="mt-4 text-xs leading-5 text-slate-500">
              Mechanical Base / Upside / Downside weighting is not imposed. Uncertainty is reflected through supportable expected recovery amounts, collateral-specific assumptions, nominal workout costs and timing.
            </p>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}