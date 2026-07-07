import Panel from "../ui/Panel";
import StatusBadge from "../ui/StatusBadge";

const issues = [
  {
    risk: "Cyber Attack",
    owner: "IT Security",
    exposure: "Rp96 B",
    due: "3 Days",
    status: "Open",
  },
  {
    risk: "Internal Fraud",
    owner: "Operations",
    exposure: "Rp74 B",
    due: "7 Days",
    status: "In Progress",
  },
  {
    risk: "System Failure",
    owner: "IT Operations",
    exposure: "Rp51 B",
    due: "14 Days",
    status: "Mitigated",
  },
  {
    risk: "Settlement Error",
    owner: "Treasury",
    exposure: "Rp23 B",
    due: "21 Days",
    status: "Monitoring",
  },
];

const badgeStatus = (
  status: string
): "success" | "warning" | "danger" => {
  switch (status) {
    case "Mitigated":
      return "success";

    case "Open":
      return "danger";

    default:
      return "warning";
  }
};

export default function TopOperationalIssues() {
  return (
    <Panel
      title="Top Operational Issues"
      subtitle="Highest priority operational risks"
    >
      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b border-slate-800 text-left text-xs uppercase tracking-[0.15em] text-slate-500">

              <th className="pb-4">Risk</th>
              <th className="pb-4">Owner</th>
              <th className="pb-4">Exposure</th>
              <th className="pb-4">Due</th>
              <th className="pb-4">Status</th>

            </tr>

          </thead>

          <tbody>

            {issues.map((item) => (

              <tr
                key={item.risk}
                className="border-b border-slate-800 transition hover:bg-slate-800/40"
              >

                <td className="py-5 font-medium">
                  {item.risk}
                </td>

                <td>{item.owner}</td>

                <td className="font-semibold text-amber-400">
                  {item.exposure}
                </td>

                <td>{item.due}</td>

                <td>

                  <StatusBadge
                    status={badgeStatus(item.status)}
                    text={item.status}
                  />

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </Panel>
  );
}