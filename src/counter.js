// counter.js

// Fungsi cekNilai
let ekl = 0;
export function cekNilai(tipe, tahun, ekalloyd, rules) {
    const t = tipe.value;
    const th = tahun.value;

    if (rules[t] && rules[t][th]) {
        ekalloyd.value = rules[t][th];
        ekl = rules[t][th];
    } else {
        ekalloyd.value = "";
    }
}

// Fungsi PMT
export function PMT(rate, nper, pv) {
    return (rate * pv) / (1 - Math.pow(1 + rate, -nper));
}

// Fungsi hitung cicilan
export function hitungCicilan(plafond, tahun, blokir) {
    const bungaTahunan = 0.1225;
    const bungaBulanan = bungaTahunan / 12;
    const pokokPinjaman = Number(plafond.dataset.value || 0);
    const tenorBulan = tahun.value * 12;

    const hasil = PMT(bungaBulanan, tenorBulan, -pokokPinjaman);

    blokir.value = Math.abs(Math.round(hasil)).toLocaleString("id-ID");
}

// Fungsi replaceDot (format input ribuan)
export function replaceDot(plafond) {
    let angka = plafond.value.replace(/\D/g, "");
    plafond.dataset.value = angka;
    plafond.value = angka ? Number(angka).toLocaleString("id-ID") : "";
}

// Fungsi hitungProvisi
export function hitungProvisi(plafond, provisi) {
    let nilaiPlafond = Number(plafond.dataset.value || 0);
    let hasil = Math.round(nilaiPlafond * 0.005);

    provisi.dataset.value = hasil;
    provisi.value = hasil.toLocaleString("id-ID");
}
export function hitungBiayaAdmin(admin,tahun){
  let biayaAdmin = Number(30000 * (tahun.value*12));
  admin.value = biayaAdmin.toLocaleString("id-ID");
}
export function hitungBiayaAsuransi(plafond,asuransi){
  let byAss = Number(ekl*plafond.dataset.value/1000);
  asuransi.value = byAss.toLocaleString("id-ID");
}
export function totalPotongan(total, blokir=0, provisi=0, admin=0, asuransi=0) {
    // Pastikan semua parameter berupa angka murni
    const b = Number(String(blokir).replace(/\D/g, "")) || 0;
    const p = Number(String(provisi).replace(/\D/g, "")) || 0;
    const a = Number(String(admin).replace(/\D/g, "")) || 0;
    const as = Number(String(asuransi).replace(/\D/g, "")) || 0;

    // Tambah biaya tetap 250000
    const hasil = b + p + a + as + 250000;

    // Simpan angka asli tanpa titik
    total.dataset.value = hasil;

    // Tampilkan format ribuan
    total.value = hasil.toLocaleString("id-ID");
}

