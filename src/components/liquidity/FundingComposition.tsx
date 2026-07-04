import Panel from "../ui/Panel";
import { fundingComposition } from "../../data/liquidity";
import { getFundingColor } from "../../utils/fundingColor";



export default function FundingComposition() {

  const casa =
  fundingComposition[0].value +
  fundingComposition[1].value;

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
                style={{ width: `${fundingComposition[0].value}%` }}
              />

              <div
                className="bg-sky-500"
                style={{ width: `${fundingComposition[1].value}%` }}
              />

              <div
                className="bg-amber-400"
                style={{ width: `${fundingComposition[2].value}%` }}
              />

            </div>

          </div>

        </div>

        <div className="space-y-5">

          {fundingComposition.map((item) => (

            <div
              key={item.name}
              className="rounded-2xl border border-slate-800 p-4"
            >

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div
                    className={`h-3 w-3 rounded-full ${getFundingColor(item.name)}`}
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
