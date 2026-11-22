(() => {
  const $ = (id) => document.getElementById(id);
  let currentStep = 1;
  const totalSteps = 4;
  const form = $("assessmentForm");
  const steps = [...document.querySelectorAll(".form-step")];
  const rails = [...document.querySelectorAll(".rail-item")];
  const progress = $("progressBar");
  const error = $("formError");
  const installBtn = $("installBtn");
  let deferredPrompt = null;

  function showStep(n) {
    currentStep = n;
    steps.forEach(el => el.classList.toggle("active", Number(el.dataset.step) === n));
    rails.forEach(el => el.classList.toggle("active", Number(el.dataset.rail) === n));
    $("stepCurrent").textContent = String(n).padStart(2, "0");
    progress.style.width = `${n / totalSteps * 100}%`;
    $("backBtn").disabled = n === 1;
    $("nextBtn").hidden = n === totalSteps;
    $("analyzeBtn").hidden = n !== totalSteps;
    error.textContent = "";
  }

  function validateStep() {
    const active = steps.find(el => Number(el.dataset.step) === currentStep);
    const required = [...active.querySelectorAll("[required]")];
    for (const field of required) {
      if (!field.value || (field.type === "number" && Number(field.value) <= 0)) {
        field.focus(); error.textContent = "Mohon lengkapi data yang wajib diisi."; return false;
      }
    }
    if (currentStep === 1 && Number($("age").value) < 18) {
      $("age").focus(); error.textContent = "Usia minimal untuk alur prototipe ini adalah 18 tahun."; return false;
    }
    if (currentStep === 2 && Number($("dbp").value) >= Number($("sbp").value)) {
      $("dbp").focus(); error.textContent = "Periksa kembali tekanan darah sistolik dan diastolik."; return false;
    }
    return true;
  }

  $("nextBtn").addEventListener("click", () => {
    if (validateStep()) showStep(Math.min(totalSteps, currentStep + 1));
  });
  $("backBtn").addEventListener("click", () => showStep(Math.max(1, currentStep - 1)));

  function drawChart() {
    const canvas = $("bpChart");
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(320, rect.width * dpr);
    canvas.height = 190 * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    const w = canvas.width / dpr, h = 190;
    const pad = {l:34,r:12,t:14,b:28};
    const plotW = w-pad.l-pad.r, plotH = h-pad.t-pad.b;
    ctx.clearRect(0,0,w,h);
    ctx.font = "10px DM Sans, sans-serif";
    ctx.fillStyle = "#8c9aa2";
    [100,120,140,160].forEach(v => {
      const y = pad.t + (160-v)/70*plotH;
      ctx.strokeStyle = "#edf1f2"; ctx.beginPath(); ctx.moveTo(pad.l,y); ctx.lineTo(w-pad.r,y); ctx.stroke();
      ctx.fillText(String(v),4,y+3);
    });
    const day = [126,124,123,125,132,140,145,142,138,134,130,128,126];
    const night = [121,119,116,113,110,108,109,112,116,119,121,123,125];
    function line(data,color) {
      ctx.beginPath();
      data.forEach((v,i) => {
        const x=pad.l+i/12*plotW, y=pad.t+(160-v)/70*plotH;
        if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
      });
      ctx.strokeStyle=color;ctx.lineWidth=2.5;ctx.lineJoin="round";ctx.stroke();
    }
    line(day,"#37a99e");line(night,"#8c79c9");
    ["00","04","08","12","16","20","24"].forEach((v,i)=>ctx.fillText(v,pad.l+i/6*plotW-6,h-8));
  }

  function buildResult() {
    const age = Number($("age").value);
    const sbp = Number($("sbp").value);
    const dbp = Number($("dbp").value);
    const nightSbp = Number($("nightSbp").value || 0);
    const pattern = $("nightPattern").value;
    const drug = $("drugName").value.trim() || $("drugClass").value;
    const dizziness = $("dizziness").checked;
    // Transparent prototype heuristic only; this is not a trained or clinically validated ML model.
    let direction = "Perlu evaluasi";
    let reason = "Parameter belum cukup untuk menunjukkan kecenderungan waktu pemberian.";
    if (pattern === "Tidak menurun saat tidur" || pattern === "Meningkat saat tidur" || (nightSbp && nightSbp >= sbp - 5)) {
      direction = "Evaluasi malam";
      reason = "Pola tekanan darah malam yang dilaporkan tidak menunjukkan penurunan yang jelas. Temuan ini dapat menjadi alasan untuk evaluasi lebih lanjut dengan data ABPM dan penilaian klinis.";
    } else if (pattern === "Menurun saat tidur" || (nightSbp && nightSbp < sbp - 10)) {
      direction = "Evaluasi pagi";
      reason = "Data yang dimasukkan menunjukkan penurunan tekanan darah saat tidur. Profil harian dan karakteristik obat tetap perlu ditinjau sebelum menentukan waktu pemberian.";
    } else if (drug.toLowerCase().includes("diuretik")) {
      direction = "Evaluasi pagi";
      reason = "Golongan diuretik sering dipertimbangkan pada pagi hari untuk mengurangi gangguan berkemih pada malam hari. Keputusan tetap perlu disesuaikan dengan jenis obat dan kondisi pasien.";
    }
    let caution = "Ini bukan rekomendasi perubahan jadwal terapi. Interpretasi harus dikonfirmasi dengan data klinis, karakteristik farmakokinetik obat, dan tenaga kesehatan yang berwenang.";
    if (dizziness || age >= 65) caution = "Perhatian: terdapat faktor yang perlu dievaluasi terkait pusing atau risiko jatuh. Penentuan waktu malam memerlukan pertimbangan keselamatan pasien secara khusus. " + caution;
    $("resultDirection").textContent = direction;
    $("resultSummary").textContent = reason;
    $("resultCaution").textContent = caution;
    $("outSbp").textContent = sbp;
    $("outDbp").textContent = dbp;
    $("outDrug").textContent = drug;
    $("resultCard").hidden = false;
    requestAnimationFrame(drawChart);
    $("resultCard").scrollIntoView({behavior:"smooth",block:"start"});
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    buildResult();
  });
  $("resetBtn").addEventListener("click", () => {
    form.reset(); $("resultCard").hidden = true; showStep(1);
    $("analisis").scrollIntoView({behavior:"smooth"});
  });
  $("copyBtn").addEventListener("click", async () => {
    const text = `ChronoTherapy AI — Ringkasan prototipe\nUsia: ${$("age").value} tahun\nTekanan darah: ${$("sbp").value}/${$("dbp").value} mmHg\nObat: ${$("drugName").value || $("drugClass").value}\nArah analisis awal: ${$("resultDirection").textContent}\n${$("resultSummary").textContent}\nCatatan: bukan rekomendasi klinis tervalidasi.`;
    try { await navigator.clipboard.writeText(text); $("copyBtn").textContent = "Tersalin ✓"; setTimeout(()=>$("copyBtn").textContent="Salin ringkasan",1800); }
    catch { $("copyBtn").textContent = "Tidak dapat menyalin"; }
  });

  $("menuToggle").addEventListener("click", () => $("nav").classList.toggle("open"));
  document.querySelectorAll(".nav-link").forEach(a => a.addEventListener("click", () => $("nav").classList.remove("open")));
  window.addEventListener("resize", () => { if (!$("resultCard").hidden) drawChart(); });

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault(); deferredPrompt = e; installBtn.hidden = false;
  });
  installBtn.addEventListener("click", async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt = null; installBtn.hidden = true;
  });
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
    window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
  }
  showStep(1);
})();