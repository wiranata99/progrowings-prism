import ExecutivePanel from "../common/ExecutivePanel";

export default function ProfitabilityExecutivePanel() {
  return (
    <ExecutivePanel
      title="Profitabilitas Bank"
      generatedAt="Generated 08:00 WIB"
      summary="Kinerja profitabilitas Bank masih menunjukkan tren positif. Peningkatan Asset Yield berhasil mengimbangi kenaikan Cost of Fund sehingga Net Interest Margin tetap berada di atas target RBB."
      attention={[
        "Cost of Fund mengalami kenaikan dibanding bulan sebelumnya.",
        "BOPO meningkat akibat kenaikan beban operasional.",
        "Pertumbuhan kredit produktif masih menjadi kontributor utama pendapatan bunga.",
      ]}
      recommendations={[
        "Optimalkan penghimpunan CASA untuk menekan Cost of Fund.",
        "Review pricing kredit pada segmen dengan spread rendah.",
        "Lanjutkan efisiensi biaya operasional non-produktif.",
      ]}
      assessment="Secara keseluruhan profitabilitas Bank masih berada dalam kondisi sehat dan diperkirakan tetap mampu mencapai target RBB hingga akhir tahun."
      confidence="Confidence 97%"
      status="Profitability Remains Healthy"
    />
  );
}