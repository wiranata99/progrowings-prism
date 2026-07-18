import { useRef } from "react";

import { usePrismStore } from "../../store/prismStore";

export default function WorkbookUpload() {
  const inputRef = useRef<HTMLInputElement>(null);

  const loadWorkbook = usePrismStore((state) => state.loadWorkbook);
  const isLoading = usePrismStore((state) => state.isLoading);
  const error = usePrismStore((state) => state.error);
  const snapshot = usePrismStore((state) => state.snapshot);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    await loadWorkbook(file);

    event.target.value = "";
  };

  return (
    <div className="space-y-4">
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx"
        className="hidden"
        onChange={handleFileChange}
      />

      <button
        type="button"
        disabled={isLoading}
        onClick={() => inputRef.current?.click()}
        className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? "Processing Workbook..." : "Upload PRISM Workbook"}
      </button>

      {error && (
        <p className="text-sm text-red-400">
          {error}
        </p>
      )}

      {snapshot && !error && (
        <p className="text-sm text-emerald-400">
          Workbook berhasil diproses.
        </p>
      )}
    </div>
  );
}