import WorkbookUpload from "../components/upload/WorkbookUpload";

export default function UploadData() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">
          Upload Data
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Upload PRISM workbook untuk memperbarui data dashboard.
        </p>
      </div>

      <WorkbookUpload />
    </section>
  );
}