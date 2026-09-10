import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { getCreditDebtorDetail, type CreditDebtorDetail, type CreditWatchlistItem } from "../../services/creditMomentumApi";

const amount = (value: number | null, currency: string) => value === null ? "—" :
  new Intl.NumberFormat("en-GB", { style: "currency", currency, notation: "compact", maximumFractionDigits: 2 }).format(value);

export default function DebtorHoverDetail({ item }: { item: CreditWatchlistItem }) {
  const id = useId();
  const anchor = useRef<HTMLButtonElement>(null);
  const popup = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cache = useRef<{ key: string; data: CreditDebtorDetail } | null>(null);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<CreditDebtorDetail | null>(null);
  const [error, setError] = useState(false);
  const [position, setPosition] = useState({ left: 0, top: 0, width: 380, maxHeight: 500 });
  const keepOpen = () => { if (closeTimer.current) clearTimeout(closeTimer.current); setOpen(true); };
  const scheduleClose = () => { if (closeTimer.current) clearTimeout(closeTimer.current); closeTimer.current = setTimeout(() => setOpen(false), 180); };
  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current); }, []);

  useEffect(() => {
    if (!open || !item.debtorId) return;
    const controller = new AbortController();
    const key = `${item.debtorId}:${item.reportingDate ?? "latest"}`;
    setError(false);
    setData(cache.current?.key === key ? cache.current.data : null);
    if (cache.current?.key !== key) {
      getCreditDebtorDetail(item.debtorId, item.reportingDate, controller.signal).then((result) => {
        if (controller.signal.aborted) return;
        cache.current = { key, data: result }; setData(result);
      }).catch(() => { if (!controller.signal.aborted) setError(true); });
    }
    return () => controller.abort();
  }, [open, item.debtorId, item.reportingDate]);

  useEffect(() => {
    if (!open) return;
    const place = () => {
      const rect = anchor.current?.getBoundingClientRect(); if (!rect) return;
      const width = Math.min(400, window.innerWidth - 24);
      const height = Math.min(510, window.innerHeight - 24);
      setPosition({ left: Math.max(12, Math.min(rect.left, window.innerWidth - width - 12)),
        top: Math.max(12, Math.min(rect.bottom + 8, window.innerHeight - height - 12)), width, maxHeight: height });
    };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    const outside = (event: PointerEvent) => { if (!anchor.current?.contains(event.target as Node) && !popup.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", outside);
    place(); window.addEventListener("resize", place); window.addEventListener("scroll", place, true);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); window.removeEventListener("resize", place); window.removeEventListener("scroll", place, true); document.removeEventListener("keydown", escape); };
  }, [open]);

  if (!item.debtorId) return <span title="Debtor detail is not linked yet">{item.debtor}</span>;
  return <>
    <button ref={anchor} type="button" aria-describedby={open ? id : undefined}
      className="text-left underline decoration-cyan-500/40 decoration-dotted underline-offset-4 transition hover:text-cyan-300 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-cyan-400"
      onMouseEnter={keepOpen} onMouseLeave={scheduleClose} onFocus={keepOpen} onBlur={scheduleClose}
      onClick={() => { if (closeTimer.current) clearTimeout(closeTimer.current); setOpen(true); }}>
      {item.debtor}
    </button>
    {open && createPortal(<div ref={popup} id={id} role="tooltip" onMouseEnter={keepOpen} onMouseLeave={scheduleClose}
      style={{ position: "fixed", ...position, zIndex: 1000 }}
      className="overflow-y-auto rounded-2xl border border-cyan-500/30 bg-slate-950 p-5 text-sm text-slate-200 shadow-2xl shadow-black/50">
      <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-400">Debtor overview</p>
      <p className="mt-1 font-semibold text-white">{item.debtor}</p>
      {!data && !error && <p role="status" className="mt-4 animate-pulse text-slate-400">Loading account details…</p>}
      {error && <p role="status" className="mt-4 text-amber-300">Details currently unavailable. Hover again to retry.</p>}
      {data && <>
        <p className="mt-1 text-xs text-slate-400">{data.debtorCode} · {data.reportingDate ?? "No reporting date"}</p>
        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
          <div><dt className="text-xs text-slate-400">NoA · active accounts</dt><dd className="mt-1 font-semibold">{data.numberOfAccounts}</dd></div>
          <div><dt className="text-xs text-slate-400">Status</dt><dd className="mt-1 text-xs font-semibold text-cyan-200">{data.restructureStatus.replaceAll("_", " ")}</dd></div>
          <div><dt className="text-xs text-slate-400">Core economic sector</dt><dd className="mt-1">{data.coreSector ?? "—"}</dd></div>
          <div><dt className="text-xs text-slate-400">Segment · risk</dt><dd className="mt-1">{data.segment ?? "—"} · {data.riskLevel ?? "—"}</dd></div>
        </dl>
        {!data.numberOfAccounts && <p className="mt-3 text-amber-200">No active accounts at this reporting date.</p>}
        {data.currencies.map((group) => <div key={group.currency} className="mt-4 border-t border-slate-800 pt-3">
          <p className="mb-2 text-[10px] uppercase tracking-wider text-slate-500">{group.currency} · {group.numberOfAccounts} accounts</p>
          <dl className="grid grid-cols-2 gap-3">
            <div><dt className="text-xs text-slate-400">Outstanding</dt><dd className="mt-1 font-semibold">{amount(group.outstandingAmount, group.currency)}</dd></div>
            <div><dt className="text-xs text-slate-400">Total CKPN</dt><dd className="mt-1 font-semibold">{amount(group.totalCkpn, group.currency)}</dd></div>
            <div><dt className="text-xs text-slate-400">Interest overdue</dt><dd className="mt-1 font-semibold">{amount(group.interestOverdue, group.currency)}</dd></div>
            <div><dt className="text-xs text-slate-400">Weighted interest rate</dt><dd className="mt-1 font-semibold">{group.appliedInterestRate === null ? "—" : `${group.appliedInterestRate.toFixed(2)}%`}</dd></div>
          </dl>
        </div>)}
        {data.primaryTrigger && <p className="mt-4 border-t border-slate-800 pt-3 text-xs leading-relaxed text-amber-200">{data.primaryTrigger}</p>}
        {data.recommendedAttention && <p className="mt-2 text-xs text-slate-400">Next: {data.recommendedAttention}</p>}
      </>}
    </div>, document.body)}
  </>;
}
