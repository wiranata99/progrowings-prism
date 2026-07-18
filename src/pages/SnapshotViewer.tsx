import { usePrismStore } from "../store/prismStore";

export default function SnapshotViewer() {
  const snapshot = usePrismStore((state) => state.snapshot);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">
          Snapshot Viewer
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Developer view untuk memeriksa output PrismSnapshot.
        </p>
      </div>

      {!snapshot ? (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-300">
          Snapshot belum tersedia. Upload workbook terlebih dahulu.
        </div>
      ) : (
        <pre className="max-h-[75vh] overflow-auto rounded-xl border border-slate-800 bg-slate-950 p-5 text-xs leading-6 text-emerald-400">
          {JSON.stringify(snapshot, null, 2)}
        </pre>
      )}
    </section>
  );
}