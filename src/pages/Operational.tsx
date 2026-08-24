import { useEffect,useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import SectionHeader from "../components/common/SectionHeader";
import OperationalExecutivePanel from "../components/operational/OperationalExecutivePanel";
import OperationalLossTrend from "../components/operational/OperationalLossTrend";
import RiskHeatmap from "../components/operational/RiskHeatmap";
import KRIMonitoring from "../components/operational/KRIMonitoring";
import ControlEffectiveness from "../components/operational/ControlEffectiveness";
import TopOperationalIssues from "../components/operational/TopOperationalIssues";
import AIExecutiveInsight from "../components/operational/AIExecutiveInsight";
import { getOperationalDashboard } from "../services/operationalApi";
type Dashboard=Awaited<ReturnType<typeof getOperationalDashboard>>;
export default function Operational(){const[data,setData]=useState<Dashboard|null>(null);const[error,setError]=useState<string|null>(null);useEffect(()=>{let active=true;getOperationalDashboard().then(v=>{if(active)setData(v)}).catch((e:unknown)=>{if(active)setError(e instanceof Error?e.message:"Failed to load Operational Intelligence.")});return()=>{active=false}},[]);return <AppLayout><div className="space-y-8"><SectionHeader eyebrow="Operational Intelligence" title="Operational Intelligence" description="Enterprise Operational Risk Monitoring and Intelligence" badge={data?"Live":error?"Unavailable":"Loading"}/>{error&&<div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5 text-sm text-rose-200">{error}</div>}<OperationalExecutivePanel data={data?.health.metrics??null}/><OperationalLossTrend data={data?.lossTrend.points??null}/><RiskHeatmap data={data?.heatmap.risks??null}/><ControlEffectiveness data={data?.controls.controls??null}/><TopOperationalIssues data={data?.issues.issues??null}/><KRIMonitoring data={data?.kri.indicators??null}/><AIExecutiveInsight data={data?.executive??null}/></div></AppLayout>}
