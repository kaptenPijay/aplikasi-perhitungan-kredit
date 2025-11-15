import 'bootstrap/dist/css/bootstrap.min.css';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2'

const columns = [
  "Trans Ref","Rekening Lama","Customer","Ccy","Plafon Awal (Migrasi)",
  "Tgl Awal (Migrasi)","Baki Debet (Migrasi)","No Fasilitas","Nilai Fasilitas",
  "Longgar Tarik","Tgl Fasilitas","Fasilitas Exp","Type Loan","Product",
  "Nilai Pencairan","Sisa Pokok","Tunggakan Pokok","Baki Debet","Tunggakan Bunga",
  "Nilai CKPN","Installment","Flat Rate","INT Rate","EIR Rate","Bunga Accrue",
  "Start Date","Maturity Date","Biaya Admin","Biaya Cetak","Biaya Provisi",
  "Provisi Posted","Biaya Asuransi","Biaya Notaris","Biaya Appraisal",
  "Rek Pencairan","Rek Db Pokok","Rek Db Bunga","Kode Bendahara","Terkait",
  "Berelasi","Ass. Jiwa","Premi Ass Jiwa","LBU Portfolio","LBU Kat. Debitur",
  "LBU Sft Kredit","LBU Sektor Ekonomi","LBU Kat. Pengukuran","LBU Or. Penggunaan",
  "SID Sft Kredit","SID Jns. Penggunaan","SID Or. Penggunaan","SID Sektor Ekonomi",
  "Lokasi Proy","Kolektibilitas","Hari Tun","Branch"
];

document.getElementById("processBtn").addEventListener("click", async (event) => {
  const proces = document.getElementById("processBtn");
  const files = document.getElementById("fileInput").files;
  if (!files.length) return Swal.fire({
  icon: "error",
  title: "Oops...",
  text: "Pilih File Dulu",
});
  proces.innerHTML = `<div class="spinner-border text-light" role="status">
  <span class="visually-hidden">Loading...</span></div>`;
  const resultEl = document.getElementById("result");
  resultEl.textContent = "";

  for (let f of files) {
    try {
      const outName = await processFile(f);
      resultEl.innerHTML += `✅ <a href="${outName}" download>${f.name}</a> → Download<br>`;
    } catch (err) {
      resultEl.innerHTML += `❌ ${f.name} ERROR: ${err.message}<br>`;
    }
  }
  proces.innerText = "Process";
});

async function processFile(file) {
  let text;
  if (file.name.endsWith(".txt")) {
    text = await file.text();
  } else if (file.name.endsWith(".xlsx")) {
    const data = await file.arrayBuffer();
    const wb = XLSX.read(data, { type: "array" });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false });
    text = rows.map(r => r.join(" ")).join("\n");
  } else throw new Error("Format file tidak dikenali");

  let lines = text.split(/\r?\n/);
  const hdrRow = lines.findIndex(l => /Trans\s+Ref/i.test(l));
  if (hdrRow === -1) throw new Error("Header 'Trans Ref' tidak ditemukan");

  const headerText = lines[hdrRow];
  let startsByName = [];
  for (let col of columns) {
    const idx = headerText.indexOf(col);
    if (idx >= 0) startsByName.push(idx);
  }
  let starts = Array.from(new Set(startsByName.sort((a,b)=>a-b)));
  if (starts.length < columns.length) {
    const avgWidth = Math.floor((headerText.length - starts[0])/columns.length);
    while (starts.length < columns.length) {
      let nxt = starts[starts.length-1]+avgWidth;
      if (nxt >= headerText.length-1) nxt = headerText.length-1;
      starts.push(nxt);
    }
  }
  starts = starts.slice(0, columns.length);
  starts.push(headerText.length);

  function cutLine(line){
    return starts.slice(0,-1).map((s,i)=>line.substring(s,starts[i+1]).trim());
  }

  let dataLines = lines.slice(hdrRow+1);
  let split = dataLines.map(cutLine);
  let df = split.map(r => {
    const obj = {};
    columns.forEach((c,i)=>obj[c]=r[i]||"");
    return obj;
  });

  // shifting logic
  const numRe=/[-+]?\d{1,3}(?:,\d{3})*(?:\.\d+)?/g;
  const idxBD = columns.indexOf("Baki Debet");
  const idxLast = columns.length-1;
  for(let row of df){
    const val = row["Tunggakan Pokok"];
    if(val && val.trim()){
      const tokens = val.match(numRe)||[];
      if(tokens.length>=2){
        row["Tunggakan Pokok"]=tokens[0];
        for(let j=idxLast;j>idxBD;j--) row[columns[j]]=row[columns[j-1]];
        row["Baki Debet"]=tokens[1];
      }
    }
  }

  df = df.filter(r=>Object.values(r).join("").trim()!=="");
  const ws = XLSX.utils.json_to_sheet(df,{header:columns});
  const wbOut = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wbOut, ws,"Cleaned");

  const outFile = file.name.replace(/\.[^.]+$/,"_cleaned.xlsx");
  XLSX.writeFile(wbOut,outFile);
  return outFile;
}
document.getElementById("clearBtn").addEventListener('click',()=>{
  const result = document.getElementById('result');
  const fileInput = document.getElementById('fileInput');
  fileInput.value = null;
  result.value = "";
  result.innerHTML = "";
})
