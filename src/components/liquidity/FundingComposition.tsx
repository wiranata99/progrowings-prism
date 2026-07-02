import Panel from "../ui/Panel";

const funding = [
  {
    name: "Current Account",
    value: 14,
    amount: "Rp8.5 T",
    color: "bg-cyan-500",
  },
  {
    name: "Saving Account",
    value: 28,
    amount: "Rp16.9 T",
    color: "bg-sky-500",
  },
  {
    name: "Time Deposit",
    value: 58,
    amount: "Rp35.1 T",
    color: "bg-amber-400",
  },
];

export default function FundingComposition() {

  const casa = funding[0].value + funding[1].value;

  return (

    <Panel title="Funding Composition">

      <div className="space-y-8">

        <div>

          <div className="mb-3 flex items-center justify-between">

            <span className="text-lg font-semibold">

              CASA Ratio

            </span>

            <span className="text-3xl font-bold text-cyan-400">

              {casa}%

            </span>

          </div>

          <div className="h-5 overflow-hidden rounded-full bg-slate-800">

            <div className="flex h-full">

              <div
                className="bg-cyan-500"
                style={{ width: `${funding[0].value}%` }}
              />

              <div
                className="bg-sky-500"
                style={{ width: `${funding[1].value}%` }}
              />

              <div
                className="bg-amber-400"
                style={{ width: `${funding[2].value}%` }}
              />

            </div>

          </div>

        </div>

        <div className="space-y-5">

          {funding.map((item) => (

            <div
              key={item.name}
              className="rounded-2xl border border-slate-800 p-4"
            >

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div
                    className={`h-3 w-3 rounded-full ${item.color}`}
                  />

                  <span className="font-medium">

                    {item.name}

                  </span>

                </div>

                <span className="font-bold">

                  {item.value}%

                </span>

              </div>

              <div className="mt-2 text-sm text-slate-400">

                Outstanding {item.amount}

              </div>

            </div>

          ))}

        </div>

      </div>

    </Panel>

  );

}