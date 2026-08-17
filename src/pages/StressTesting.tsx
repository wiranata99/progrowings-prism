import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Play, Zap } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import SectionHeader from "../components/common/SectionHeader";

type Inputs = {
  segment: string; reportingDate: string; drawn: number; unused: number; ccf: number;
  s1: number; s2: number; s3: number; pd1: number; pd2: number; lgd: number;
  wu: number; wb: number; wd: number; pd1Shock: number; pd2Shock: number; lgdShock: number;
  stressedCcf: number; migration12: number; migration23: number; swu: number; swb: number; swd: number;
  profit: number; totalAssets: number; totalEquity: number; operatingIncome: number; operatingExpense: number;
  regulatoryCapital: number; rwa: number;
};

type CalcOptions = { pd?: boolean; lgd?: boolean; ccf?: boolean; migration?: boolean; stressWeights?: boolean };

type CalcResult = { totalEad: number; ead: number[]; pd: number[]; lgd: number; ecl: number[]; total: number };

const initial: Inputs = {
  segment: "Kredit Modal Kerja", reportingDate: "2026-08-16", drawn: 10000, unused: 2000, ccf: 50,
  s1: 85, s2: 10, s3: 5, pd1: 16.7333, pd2: 35, lgd: 48.472,
  wu: 20, wb: 60, wd: 20, pd1Shock: 25, pd2Shock: 30, lgdShock: 15,
  stressedCcf: 70, migration12: 8, migration23: 3, swu: 5, swb: 35, swd: 60,
  profit: 850, totalAssets: 45000, totalEquity: 6000, operatingIncome: 4200, operatingExpense: 3100,
  regulatoryCapital: 6500, rwa: 30000,
};

const scenario = { upturn: { pd: .8, lgd: .95 }, baseline: { pd: 1, lgd: 1 }, downturn: { pd: 1.25, lgd: 1.1 } };
const clamp = (n: number) => Math.min(1, Math.max(0, n));
const money = (n: number) => n >= 1000 ? `Rp ${(n / 1000).toFixed(2)} T` : `Rp ${n.toFixed(1)} B`;
const pct = (n: number) => `${(n * 100).toFixed(2)}%`;

function Field({ label, value, onChange, suffix, disabled = false, step = "any" }: { label: string; value: string | number; onChange?: (v: string) => void; suffix?: string; disabled?: boolean; step?: string }) {
  return <label className="block"><span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</span><div className="relative"><input disabled={disabled} step={step} type={typeof value === "number" ? "number" : "text"} value={value} onChange={e => onChange?.(e.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-3 text-sm text-white outline-none transition focus:border-cyan-400 disabled:text-slate-500" />{suffix && <span className="absolute right-3 top-3 text-sm text-slate-500">{suffix}</span>}</div></label>;
}


export default function StressTesting() {
  const [v, setV] = useState(initial);
  const [result, setResult] = useState<{ base: CalcResult; stress: CalcResult } | null>(null);
  const set = (key: keyof Inputs, raw: string) => setV(p => ({ ...p, [key]: typeof p[key] === "number" ? Number(raw) : raw }));

  const factors = (stressWeights = false) => {
    const w = stressWeights ? [v.swu, v.swb, v.swd] : [v.wu, v.wb, v.wd];
    return {
      pd: (w[0] * scenario.upturn.pd + w[1] * scenario.baseline.pd + w[2] * scenario.downturn.pd) / 100,
      lgd: (w[0] * scenario.upturn.lgd + w[1] * scenario.baseline.lgd + w[2] * scenario.downturn.lgd) / 100,
    };
  };

  const calculate = (o: CalcOptions = {}): CalcResult => {
    const f = factors(!!o.stressWeights);
    const ccf = (o.ccf ? v.stressedCcf : v.ccf) / 100;
    const totalEad = v.drawn + v.unused * ccf;
    const ead = [v.s1, v.s2, v.s3].map(x => totalEad * x / 100);
    if (o.migration) {
      const move12 = ead[0] * clamp(v.migration12 / 100); ead[0] -= move12; ead[1] += move12;
      const move23 = ead[1] * clamp(v.migration23 / 100); ead[1] -= move23; ead[2] += move23;
    }
    const pd = [clamp(v.pd1 / 100 * f.pd), clamp(v.pd2 / 100 * f.pd), 1];
    let lgd = clamp(v.lgd / 100 * f.lgd);
    if (o.pd) { pd[0] = clamp(pd[0] * (1 + v.pd1Shock / 100)); pd[1] = clamp(pd[1] * (1 + v.pd2Shock / 100)); }
    if (o.lgd) lgd = clamp(lgd * (1 + v.lgdShock / 100));
    const ecl = ead.map((x, i) => x * pd[i] * lgd);
    return { totalEad, ead, pd, lgd, ecl, total: ecl.reduce((a, b) => a + b, 0) };
  };

  const stageTotal = v.s1 + v.s2 + v.s3;
  const baseWeightTotal = v.wu + v.wb + v.wd;
  const stressWeightTotal = v.swu + v.swb + v.swd;
  const valid = Math.abs(stageTotal - 100) < .01 && Math.abs(baseWeightTotal - 100) < .01 && Math.abs(stressWeightTotal - 100) < .01;
  const liveEad = v.drawn + v.unused * v.ccf / 100;

  const effects = useMemo(() => {
    if (!result) return [] as [string, number][];
    const b = result.base.total;
    return [
      ["PD Effect", calculate({ pd: true }).total - b],
      ["LGD Effect", calculate({ lgd: true }).total - b],
      ["CCF / EAD", calculate({ ccf: true }).total - b],
      ["Stage Migration", calculate({ migration: true }).total - b],
      ["FLI Weight Shift", calculate({ stressWeights: true }).total - b],
    ] as [string, number][];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  const run = () => { if (!valid) return; setResult({ base: calculate(), stress: calculate({ pd: true, lgd: true, ccf: true, migration: true, stressWeights: true }) }); };
  const delta = result ? result.stress.total - result.base.total : 0;
  const deltaPct = result && result.base.total ? delta / result.base.total * 100 : 0;
  const topDriver = effects.length ? [...effects].sort((a,b) => Math.abs(b[1])-Math.abs(a[1]))[0] : null;

  const additionalCkpn = result ? Math.max(0, result.stress.total - result.base.total) : 0;
  const stressedProfit = v.profit - additionalCkpn;
  const stressedEquity = Math.max(0, v.totalEquity - additionalCkpn);
  const stressedCapital = Math.max(0, v.regulatoryCapital - additionalCkpn);
  const ratio = (n: number, d: number) => d > 0 ? n / d * 100 : 0;
  const financialImpact = {
    baseline: {
      roa: ratio(v.profit, v.totalAssets),
      roe: ratio(v.profit, v.totalEquity),
      bopo: ratio(v.operatingExpense, v.operatingIncome),
      cir: ratio(v.operatingExpense, v.operatingIncome),
      car: ratio(v.regulatoryCapital, v.rwa),
    },
    stressed: {
      roa: ratio(stressedProfit, v.totalAssets),
      roe: ratio(stressedProfit, stressedEquity || v.totalEquity),
      bopo: ratio(v.operatingExpense + additionalCkpn, v.operatingIncome),
      cir: ratio(v.operatingExpense, v.operatingIncome),
      car: ratio(stressedCapital, v.rwa),
    },
  };

  return <AppLayout><div className="space-y-8">
    <SectionHeader eyebrow="Stress Testing" title="PSAK 71 Collective ECL Stress Test" description="Manual portfolio stress simulation for collective CKPN by product segment." badge="Showcase V1" />

    <div className="grid gap-6 2xl:grid-cols-2">
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
        <div className="mb-6 flex items-start justify-between"><div><div className="text-xs font-bold uppercase tracking-[.2em] text-cyan-400">01 · Baseline</div><h2 className="mt-2 text-xl font-bold">Current Portfolio</h2><p className="mt-1 text-sm text-slate-400">Input the bank's current collective portfolio position.</p></div><span className={`rounded-full px-3 py-1 text-xs font-semibold ${Math.abs(stageTotal-100)<.01?'bg-emerald-500/10 text-emerald-400':'bg-rose-500/10 text-rose-400'}`}>{Math.abs(stageTotal-100)<.01?'Stage tally OK':`Stage ${stageTotal.toFixed(1)}%`}</span></div>
        <div className="grid gap-4 md:grid-cols-2"><Field label="Product Segment" value={v.segment} onChange={x=>set('segment',x)} /><label className="block"><span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">Reporting Date</span><input type="date" value={v.reportingDate} onChange={e=>set('reportingDate',e.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-3 text-sm text-white outline-none focus:border-cyan-400" /></label></div>
        <div className="mt-5 grid gap-4 md:grid-cols-3"><Field label="Outstanding" value={v.drawn} onChange={x=>set('drawn',x)} suffix="Rp B"/><Field label="Unused Loan" value={v.unused} onChange={x=>set('unused',x)} suffix="Rp B"/><Field label="CCF" value={v.ccf} onChange={x=>set('ccf',x)} suffix="%"/></div>
        <div className="mt-5 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4"><div className="text-xs uppercase tracking-wider text-slate-400">Calculated Baseline EAD</div><div className="mt-1 text-2xl font-black text-cyan-300">{money(liveEad)}</div><div className="mt-1 text-xs text-slate-500">Outstanding + (Unused Loan × CCF)</div></div>
        <div className="mt-6"><h3 className="mb-3 text-sm font-bold text-slate-200">Current Stage Distribution</h3><div className="grid gap-4 md:grid-cols-3"><Field label="Stage 1" value={v.s1} onChange={x=>set('s1',x)} suffix="%"/><Field label="Stage 2" value={v.s2} onChange={x=>set('s2',x)} suffix="%"/><Field label="Stage 3" value={v.s3} onChange={x=>set('s3',x)} suffix="%"/></div></div>
        <div className="mt-5 grid gap-4 md:grid-cols-3"><Field label="Stage 1 · 12M PD" value={v.pd1} onChange={x=>set('pd1',x)} suffix="%"/><Field label="Stage 2 · Lifetime PD" value={v.pd2} onChange={x=>set('pd2',x)} suffix="%"/><Field label="Stage 3 PD" value="100%" disabled /></div>
        <div className="mt-5"><Field label="Forward-Looking LGD · Segment" value={v.lgd} onChange={x=>set('lgd',x)} suffix="%"/></div>
        <div className="mt-6"><div className="mb-3 flex items-center justify-between"><h3 className="text-sm font-bold">Current FLI Scenario Weight</h3><span className={`text-xs ${Math.abs(baseWeightTotal-100)<.01?'text-emerald-400':'text-rose-400'}`}>Total {baseWeightTotal.toFixed(0)}%</span></div><div className="grid gap-4 md:grid-cols-3"><Field label="Upturn" value={v.wu} onChange={x=>set('wu',x)} suffix="%"/><Field label="Baseline" value={v.wb} onChange={x=>set('wb',x)} suffix="%"/><Field label="Downturn" value={v.wd} onChange={x=>set('wd',x)} suffix="%"/></div></div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
        <div className="mb-6"><div className="text-xs font-bold uppercase tracking-[.2em] text-amber-400">02 · Stress</div><h2 className="mt-2 text-xl font-bold">Stress Contributors</h2><p className="mt-1 text-sm text-slate-400">Define the deterioration assumptions for the selected segment.</p></div>
        <div className="grid gap-4 md:grid-cols-2"><Field label="Stage 1 PD Shock" value={v.pd1Shock} onChange={x=>set('pd1Shock',x)} suffix="%"/><Field label="Stage 2 PD Shock" value={v.pd2Shock} onChange={x=>set('pd2Shock',x)} suffix="%"/><Field label="LGD Shock" value={v.lgdShock} onChange={x=>set('lgdShock',x)} suffix="%"/><Field label="Stressed CCF" value={v.stressedCcf} onChange={x=>set('stressedCcf',x)} suffix="%"/></div>
        <div className="mt-7 border-t border-slate-800 pt-6"><h3 className="mb-3 text-sm font-bold">Stage Migration Shock</h3><div className="grid gap-4 md:grid-cols-2"><Field label="Stage 1 → Stage 2 · % of S1" value={v.migration12} onChange={x=>set('migration12',x)} suffix="%"/><Field label="Stage 2 → Stage 3 · % of S2" value={v.migration23} onChange={x=>set('migration23',x)} suffix="%"/></div></div>
        <div className="mt-7 border-t border-slate-800 pt-6"><div className="mb-3 flex items-center justify-between"><h3 className="text-sm font-bold">Stressed FLI Scenario Weight</h3><span className={`text-xs ${Math.abs(stressWeightTotal-100)<.01?'text-emerald-400':'text-rose-400'}`}>Total {stressWeightTotal.toFixed(0)}%</span></div><div className="grid gap-4 md:grid-cols-3"><Field label="Upturn" value={v.swu} onChange={x=>set('swu',x)} suffix="%"/><Field label="Baseline" value={v.swb} onChange={x=>set('swb',x)} suffix="%"/><Field label="Downturn" value={v.swd} onChange={x=>set('swd',x)} suffix="%"/></div></div>
        <div className="mt-7 rounded-2xl border border-slate-800 bg-slate-950/50 p-4"><div className="text-xs font-bold uppercase tracking-wider text-slate-400">Scenario sensitivity · showcase assumption</div><div className="mt-3 grid grid-cols-3 gap-3 text-center text-xs"><div><div className="text-emerald-400">UPTURN</div><div className="mt-1 text-slate-300">PD 0.80× · LGD 0.95×</div></div><div><div className="text-cyan-400">BASELINE</div><div className="mt-1 text-slate-300">PD 1.00× · LGD 1.00×</div></div><div><div className="text-amber-400">DOWNTURN</div><div className="mt-1 text-slate-300">PD 1.25× · LGD 1.10×</div></div></div></div>
      </section>
    </div>

    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
      <div className="mb-5">
        <div className="text-xs font-bold uppercase tracking-[.2em] text-violet-400">03 · Financial Baseline</div>
        <h2 className="mt-2 text-xl font-bold">Profitability & Capital Baseline</h2>
        <p className="mt-1 text-sm text-slate-400">Manual financial inputs for translating additional CKPN into profitability and capital impact.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Field label="Profit" value={v.profit} onChange={x=>set('profit',x)} suffix="Rp B"/>
        <Field label="Total Assets" value={v.totalAssets} onChange={x=>set('totalAssets',x)} suffix="Rp B"/>
        <Field label="Total Equity" value={v.totalEquity} onChange={x=>set('totalEquity',x)} suffix="Rp B"/>
        <Field label="Operating Income" value={v.operatingIncome} onChange={x=>set('operatingIncome',x)} suffix="Rp B"/>
        <Field label="Operating Expense" value={v.operatingExpense} onChange={x=>set('operatingExpense',x)} suffix="Rp B"/>
        <Field label="Regulatory Capital" value={v.regulatoryCapital} onChange={x=>set('regulatoryCapital',x)} suffix="Rp B"/>
        <Field label="Risk Weighted Assets" value={v.rwa} onChange={x=>set('rwa',x)} suffix="Rp B"/>
      </div>
    </section>

    <div>
      <button onClick={run} disabled={!valid} className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-4 font-black text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500"><Play size={18} fill="currentColor"/> RUN ECL STRESS TEST</button>
      {!valid && <p className="mt-3 text-center text-xs text-rose-400">Stage distribution and both scenario weight sets must total 100%.</p>}
    </div>

    {result && <section className="space-y-6 border-t border-slate-800 pt-8">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-emerald-400"><CheckCircle2 size={15}/> Simulation Complete</div><h2 className="mt-2 text-2xl font-black">Executive Stress Results</h2><p className="mt-1 text-sm text-slate-400">{v.segment} · {v.reportingDate}</p></div><span className={`rounded-full px-4 py-2 text-xs font-black ${deltaPct>=50?'bg-rose-500/15 text-rose-300':deltaPct>=20?'bg-amber-500/15 text-amber-300':'bg-emerald-500/15 text-emerald-300'}`}>{deltaPct>=50?'HIGH':deltaPct>=20?'MODERATE':'LOW'} IMPACT</span></div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[["Baseline EAD",money(result.base.totalEad),"Current exposure"],["Baseline CKPN",money(result.base.total),"Current model ECL"],["Stressed CKPN",money(result.stress.total),"Post-stress ECL"],["Δ CKPN",`${delta>=0?'+ ':''}${money(delta)}`,`${deltaPct>=0?'+':''}${deltaPct.toFixed(1)}% vs baseline`]].map(([a,b,c],i)=><div key={a} className={`rounded-2xl border p-5 ${i===3?'border-rose-500/30 bg-rose-500/5':'border-slate-800 bg-slate-900/60'}`}><div className="text-xs font-bold uppercase tracking-wider text-slate-400">{a}</div><div className={`mt-2 text-2xl font-black ${i===2?'text-cyan-300':i===3?'text-rose-300':'text-white'}`}>{b}</div><div className="mt-1 text-xs text-slate-500">{c}</div></div>)}</div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6"><div className="mb-5"><h3 className="text-lg font-bold">CKPN Stress Bridge</h3><p className="text-sm text-slate-400">Standalone directional contributors explaining the movement in CKPN.</p></div><div className="grid items-center gap-4 xl:grid-cols-[1fr_auto_2fr_auto_1fr]"><div className="rounded-xl border border-slate-700 bg-slate-950/60 p-5 text-center"><div className="text-xs text-slate-400">BASELINE CKPN</div><div className="mt-1 text-xl font-black">{money(result.base.total)}</div></div><ArrowRight className="hidden text-slate-600 xl:block"/><div className="space-y-2">{effects.map(([name,val])=><div key={name} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-2.5 text-sm"><span className="text-slate-300">{name}</span><span className={val>=0?'font-bold text-amber-300':'font-bold text-emerald-300'}>{val>=0?'+ ':''}{money(val)}</span></div>)}</div><ArrowRight className="hidden text-slate-600 xl:block"/><div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-5 text-center"><div className="text-xs text-slate-400">STRESSED CKPN</div><div className="mt-1 text-xl font-black text-cyan-300">{money(result.stress.total)}</div></div></div><p className="mt-4 text-xs text-slate-500">Contributor effects are standalone sensitivities; interaction effects mean they are not intended to arithmetically sum to total Δ CKPN.</p></div>

      <div className="grid gap-6 xl:grid-cols-2"><div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6"><h3 className="text-lg font-bold">Stage Migration</h3><p className="mb-5 text-sm text-slate-400">Portfolio composition before and after stress.</p>{["Stage 1","Stage 2","Stage 3"].map((name,i)=>{const bp=result.base.ead[i]/result.base.totalEad*100,sp=result.stress.ead[i]/result.stress.totalEad*100;return <div key={name} className="mb-5"><div className="mb-2 flex justify-between text-sm"><span>{name}</span><span className="text-slate-400">{bp.toFixed(1)}% → <b className="text-white">{sp.toFixed(1)}%</b></span></div><div className="h-2 rounded-full bg-slate-800"><div className="h-2 rounded-full bg-cyan-400" style={{width:`${sp}%`}}/></div></div>})}</div><div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6"><h3 className="text-lg font-bold">Stage-Level ECL Impact</h3><p className="mb-5 text-sm text-slate-400">Baseline vs stressed CKPN by stage.</p>{["Stage 1","Stage 2","Stage 3"].map((name,i)=>{const max=Math.max(...result.stress.ecl,...result.base.ecl,1);return <div key={name} className="mb-5"><div className="mb-2 flex justify-between text-sm"><span>{name}</span><span className="text-slate-400">{money(result.base.ecl[i])} → <b className="text-white">{money(result.stress.ecl[i])}</b></span></div><div className="space-y-1"><div className="h-2 rounded-full bg-slate-800"><div className="h-2 rounded-full bg-slate-500" style={{width:`${result.base.ecl[i]/max*100}%`}}/></div><div className="h-2 rounded-full bg-slate-800"><div className="h-2 rounded-full bg-cyan-400" style={{width:`${result.stress.ecl[i]/max*100}%`}}/></div></div></div>})}</div></div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6"><h3 className="text-lg font-bold">Stress Contributor Analysis</h3><p className="mb-5 text-sm text-slate-400">Standalone sensitivity contribution to collective CKPN.</p><div className="grid gap-3 md:grid-cols-5">{effects.map(([name,val])=><div key={name} className="rounded-xl border border-slate-800 bg-slate-950/50 p-4"><div className="text-xs uppercase tracking-wider text-slate-500">{name}</div><div className="mt-2 text-lg font-black">{val>=0?'+ ':''}{money(val)}</div></div>)}</div></div>

      <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 to-slate-900 p-6"><div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2 text-sm font-bold text-cyan-300"><Zap size={18}/> PRISM RISK INTELLIGENCE</div>{topDriver&&<span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300">Key Driver: {topDriver[0]}</span>}</div><p className="mt-4 max-w-5xl text-sm leading-7 text-slate-300">The stress simulation increases collective CKPN for <b className="text-white">{v.segment}</b> from <b className="text-white">{money(result.base.total)}</b> to <b className="text-cyan-300">{money(result.stress.total)}</b>, equivalent to <b className="text-rose-300">{deltaPct.toFixed(1)}%</b>. The stressed position reflects PD and LGD deterioration, higher utilization of unused facilities through CCF, {v.migration12.toFixed(1)}% Stage 1-to-Stage 2 migration, {v.migration23.toFixed(1)}% Stage 2-to-Stage 3 migration, and a {v.swd.toFixed(0)}% downturn scenario weight.</p></div>

      <div className="overflow-x-auto rounded-2xl border border-slate-800"><table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-slate-900 text-xs uppercase tracking-wider text-slate-400"><tr>{["Stage","Baseline EAD","Stressed EAD","Baseline PD","Stressed PD","Baseline ECL","Stressed ECL","Δ ECL"].map(h=><th key={h} className="px-4 py-3">{h}</th>)}</tr></thead><tbody>{["Stage 1","Stage 2","Stage 3"].map((name,i)=><tr key={name} className="border-t border-slate-800 bg-slate-950/30"><td className="px-4 py-3 font-bold">{name}</td><td className="px-4 py-3">{money(result.base.ead[i])}</td><td className="px-4 py-3">{money(result.stress.ead[i])}</td><td className="px-4 py-3">{pct(result.base.pd[i])}</td><td className="px-4 py-3">{pct(result.stress.pd[i])}</td><td className="px-4 py-3">{money(result.base.ecl[i])}</td><td className="px-4 py-3 font-bold text-cyan-300">{money(result.stress.ecl[i])}</td><td className="px-4 py-3 text-amber-300">+ {money(result.stress.ecl[i]-result.base.ecl[i])}</td></tr>)}</tbody></table></div>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="mb-5">
          <h3 className="text-lg font-bold">Profitability & Capital Impact</h3>
          <p className="text-sm text-slate-400">Transmission of incremental CKPN into earnings, efficiency and capital metrics.</p>
        </div>
        <div className="grid gap-3 md:grid-cols-5">
          {[
            ["ROA", financialImpact.baseline.roa, financialImpact.stressed.roa],
            ["ROE", financialImpact.baseline.roe, financialImpact.stressed.roe],
            ["BOPO", financialImpact.baseline.bopo, financialImpact.stressed.bopo],
            ["CIR", financialImpact.baseline.cir, financialImpact.stressed.cir],
            ["CAR", financialImpact.baseline.car, financialImpact.stressed.car],
          ].map(([name,b,st]) => {
            const base = Number(b), stress = Number(st), d = stress - base;
            return <div key={String(name)} className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">{name}</div>
              <div className="mt-3 flex items-end justify-between gap-2">
                <div><div className="text-[10px] uppercase text-slate-600">Baseline</div><div className="text-lg font-black text-white">{base.toFixed(2)}%</div></div>
                <ArrowRight size={15} className="mb-1 text-slate-600"/>
                <div className="text-right"><div className="text-[10px] uppercase text-slate-600">Stressed</div><div className="text-lg font-black text-cyan-300">{stress.toFixed(2)}%</div></div>
              </div>
              <div className={`mt-3 text-xs font-bold ${d===0?'text-slate-500':((name==="BOPO"&&d>0)||(name!=="BOPO"&&d<0))?'text-rose-300':'text-emerald-300'}`}>
                {d>0?"+":""}{d.toFixed(2)} pp
              </div>
            </div>
          })}
        </div>
        <div className="mt-5 grid gap-2 md:grid-cols-5">
          {["ECL Stress", `CKPN + ${money(additionalCkpn)}`, "Profit ↓", "ROA / ROE ↓ · BOPO ↑", "Capital ↓ · CAR ↓"].map((x,i)=>
            <div key={x} className="relative rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-3 text-center text-xs font-semibold text-slate-300">
              {x}{i<4&&<span className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-cyan-400 md:block">→</span>}
            </div>
          )}
        </div>
        <p className="mt-4 text-xs leading-5 text-slate-500">V1 assumption: additional CKPN reduces profit and regulatory capital; RWA remains unchanged. BOPO absorbs incremental impairment expense. CIR remains unchanged under pure ECL stress because no operating-cost shock is applied.</p>
      </div>

    </section>}
  </div></AppLayout>;
}