const watchlist = [
  {
    priority: "High",
    debtor: "PT Nusantara Konstruksi",
    exposure: "Rp1.28 T",
    dpd: 97,
    coll: 2,
    action: "Review Required",
  },
  {
    priority: "Medium",
    debtor: "PT Maju Trading Indonesia",
    exposure: "Rp845 B",
    dpd: 18,
    coll: 1,
    action: "Enhanced Monitoring",
  },
  {
    priority: "Medium",
    debtor: "PT Agro Makmur",
    exposure: "Rp610 B",
    dpd: 7,
    coll: 2,
    action: "Collateral Update",
  },
];

const priorityStyle = {
  High: "bg-rose-500/15 text-rose-400",
  Medium: "bg-amber-500/15 text-amber-400",
  Low: "bg-emerald-500/15 text-emerald-400",
};

const dpdStyle = (dpd: number) => {
  if (dpd > 90)
    return "bg-rose-500/15 text-rose-400";

  if (dpd > 30)
    return "bg-amber-500/15 text-amber-400";

  return "bg-emerald-500/15 text-emerald-400";
};

const collStyle = (coll: number) => {
  switch (coll) {
    case 1:
      return "bg-emerald-500/15 text-emerald-400";
    case 2:
      return "bg-amber-500/15 text-amber-400";
    case 3:
      return "bg-orange-500/15 text-orange-400";
    case 4:
      return "bg-rose-500/15 text-rose-400";
    default:
      return "bg-red-600/20 text-red-400";
  }
};

export default function WatchlistTable() {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-7">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-400">
            Executive Monitoring
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            Top Watchlist
          </h2>

          <p className="mt-2 text-slate-400">
            Accounts requiring immediate management attention.
          </p>

        </div>

        <div className="text-right">

          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Active Cases
          </p>

          <p className="mt-1 text-3xl font-bold">
            {watchlist.length}
          </p>

        </div>

      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-800">

        <table className="w-full">

          <thead className="bg-slate-800/40">

            <tr className="text-left text-xs uppercase tracking-[0.18em] text-slate-400">

              <th className="px-5 py-4">
                Priority
              </th>

              <th className="px-5 py-4">
                Debtor
              </th>

              <th className="px-5 py-4">
                Exposure
              </th>

              <th className="px-5 py-4 text-center">
                DPD
              </th>

              <th className="px-5 py-4 text-center">
                Coll
              </th>

              <th className="px-5 py-4">
                Next Action
              </th>

            </tr>

          </thead>

          <tbody>

            {watchlist.map((item) => (

              <tr
                key={item.debtor}
                className="border-t border-slate-800 transition-all duration-300 hover:bg-slate-800/30"
              >

                <td className="px-5 py-5">

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      priorityStyle[
                        item.priority as keyof typeof priorityStyle
                      ]
                    }`}
                  >
                    {item.priority}
                  </span>

                </td>

                <td className="px-5 py-5">

                  <div className="font-semibold">
                    {item.debtor}
                  </div>

                </td>

                <td className="px-5 py-5 font-medium">
                  {item.exposure}
                </td>

                <td className="px-5 py-5 text-center">

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${dpdStyle(
                      item.dpd
                    )}`}
                  >
                    {item.dpd} Days
                  </span>

                </td>

                <td className="px-5 py-5 text-center">

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${collStyle(
                      item.coll
                    )}`}
                  >
                    COL {item.coll}
                  </span>

                </td>

                <td className="px-5 py-5">

                  <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400">
                    {item.action}
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}