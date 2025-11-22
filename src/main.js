import 'bootstrap/dist/css/bootstrap.min.css';
import { cekNilai, hitungCicilan, replaceDot, hitungProvisi, hitungBiayaAdmin, hitungBiayaAsuransi, totalPotongan, sisaGaji, estimasiBersihDiterima } from './counter.js';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2'

document.addEventListener("DOMContentLoaded",()=>{
const tahun = document.getElementById("tahun");
const tipe = document.getElementById("tipe_credit");
const ekalloyd = document.getElementById("ekalloyd");
const plafond = document.getElementById("plafond");
const provisi = document.getElementById("provisi");
const admin = document.getElementById("admin");
const asuransi = document.getElementById("asuransi");
const blokir = document.getElementById("blokir");
const total = document.getElementById("total");
const salary = document.getElementById("salary");
const newAngsuran = document.getElementById("new_angsuran");
const gajiTersisa = document.getElementById("sisa_gaji");
const estimasiBersih = document.getElementById("estimasiBersih");

for (let i = 1; i <= 20; i++) {
    tahun.insertAdjacentHTML("beforeend", `
        <option value="${i}">${i} Tahun</option>
    `);
}
tipe.innerHTML = `
                  <option value="">Tipe Kredit</option>
                  <option value="pns">Konsumtif PNS</option>
                  <option value="prapen">Konsumtif Prapen</option>
                  <option value="pensiun">Konsumtif Pensiun</option>
`
const rules = {
    "pns": {
        "1": 2.56,
        "2": 4.98,
        "3": 7.02,
        "4": 8.87,
        "5": 10.62,
        "6": 13.85,
        "7": 15.53,
        "8": 18.99,
        "9": 20.45,
        "10": 22.63,
        "11": 24.36,
        "12": 27.75,
        "13": 30.97,
        "14": 31.90,
        "15": 33.58,
        "16": 43.90,
        "17": 47.65,
        "18": 49.08,
        "19": 51.37,
        "20": 53.76,
    },
    "prapen": {
        "1": 5.14,
        "2": 9.45,
        "3": 15.83,
        "4": 19.39,
        "5": 24.90,
        "6": 27.01,
        "7": 29.85,
        "8": 32.11,
        "9": 35.10,
        "10": 38.21,
        "11": 41.05,
        "12": 44.38,
        "13": 46.08,
        "14": 48.23,
        "15": 50.49,
        "16": 52.60,
        "17": 56.05,
        "18": 58.43,
        "19": 60.92,
        "20": 62.88,
    },
    "pensiun": {
         "1": 5.50,
        "2": 11.00,
        "3": 16.50,
        "4": 22.00,
        "5": 27.50,
        "6": 33.00,
        "7": 38.50,
        "8": 44.00,
        "9": 49.50,
        "10": 55.00,
        "11": 60.50,
        "12": 66.00,
        "13": 71.50,
        "14": 77.00,
        "15": 82.50,
    }
};

// Event listener
plafond.addEventListener("keyup", () => {
    replaceDot(plafond);
    hitungCicilan(plafond, tahun, blokir, newAngsuran);
    hitungProvisi(plafond, provisi);
    hitungBiayaAdmin(admin,tahun);
    hitungBiayaAsuransi(plafond,asuransi);
    totalPotongan(total,blokir.value,provisi.dataset.value,admin.value,asuransi.value)
    estimasiBersihDiterima(plafond,total,estimasiBersih)
});

tahun.addEventListener("change", () => {
    cekNilai(tipe, tahun, ekalloyd, rules);
    hitungCicilan(plafond, tahun, blokir, newAngsuran);
    hitungBiayaAsuransi(plafond,asuransi);
    hitungBiayaAdmin(admin,tahun);
    totalPotongan(total,blokir.value,provisi.dataset.value,admin.value,asuransi.value)
    estimasiBersihDiterima(plafond,total,estimasiBersih)
});
tipe.addEventListener("change", () => {
  cekNilai(tipe, tahun, ekalloyd, rules)
  hitungBiayaAsuransi(plafond,asuransi);
  totalPotongan(total,blokir.value,provisi.dataset.value,admin.value,asuransi.value)
  estimasiBersihDiterima(plafond,total,estimasiBersih)
});
salary.addEventListener("keyup",()=>{
    replaceDot(salary);
    sisaGaji(salary,newAngsuran,gajiTersisa)
})
})