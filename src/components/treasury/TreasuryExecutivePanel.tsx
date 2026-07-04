import ExecutivePanel from "../common/ExecutivePanel";

export default function TreasuryExecutivePanel() {
  return (
    <ExecutivePanel
      title="Treasury Portfolio Brief"
      generatedAt="Generated 08:00 WIB"
      summary="Portfolio investasi Bank masih berada dalam kondisi sehat. Pendapatan treasury meningkat didukung oleh penurunan yield obligasi pemerintah sehingga menghasilkan unrealized gain pada portofolio FVOCI. Duration portofolio tetap berada dalam limit yang disetujui ALCO."
      attention={[
        "Duration portofolio meningkat dibanding bulan sebelumnya.",
        "Yield SUN tenor panjang mulai mengalami volatilitas.",
        "Komposisi HTM masih sesuai strategi investasi Bank.",
      ]}
      recommendations={[
        "Monitor pergerakan yield SUN 10 tahun.",
        "Optimalkan strategi reinvestment pada tenor menengah.",
        "Review duration positioning menjelang rapat ALCO.",
      ]}
      assessment="Kinerja treasury diperkirakan tetap positif sepanjang kuartal berjalan selama volatilitas pasar obligasi tetap terkendali."
      confidence="Confidence 95%"
      status="Treasury Portfolio Remains Stable"
    />
  );
}