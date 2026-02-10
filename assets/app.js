/* Oman Multi-Omics Training Programme — interactions */
(function(){
  // Google Sheets (Apps Script Web App) endpoint
  // Replace with your deployed Web App URL (ends with /exec)
  const GOOGLE_SHEETS_ENDPOINT = "https://script.google.com/macros/s/AKfycbwQqK3FcchALT_FtNigldUzJ5o1N3XdLJdtQM8R-NHMDZXunqX833QKp8bPgtrQlfTV4w/exec";

  const $ = (s, el=document) => el.querySelector(s);
  const $$ = (s, el=document) => Array.from(el.querySelectorAll(s));

  // Year
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  // Mobile nav
  const menuBtn = $("#menuBtn");
  const mobileNav = $("#mobileNav");
  if (menuBtn && mobileNav){
    menuBtn.addEventListener("click", () => {
      const isOpen = !mobileNav.hasAttribute("hidden");
      if (isOpen){
        mobileNav.setAttribute("hidden","");
        menuBtn.setAttribute("aria-expanded","false");
      } else {
        mobileNav.removeAttribute("hidden");
        menuBtn.setAttribute("aria-expanded","true");
      }
    });
    $$("#mobileNav a").forEach(a => a.addEventListener("click", () => {
      mobileNav.setAttribute("hidden","");
      menuBtn.setAttribute("aria-expanded","false");
    }));
  }

  // Reveal on scroll
  const els = $$(".reveal");
  if ("IntersectionObserver" in window){
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting){
          e.target.classList.add("is-visible");
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(el => obs.observe(el));
  } else {
    els.forEach(el => el.classList.add("is-visible"));
  }

  // Dialog
  const dialog = $("#dialog");
  const dialogMsg = $("#dialogMsg");
  $("#dialogClose")?.addEventListener("click", () => dialog?.close());

  // Registration (backend -> XLSX)
  const form = $("#regForm");
  if (form){
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const payload = {
        name: String(fd.get("name")||"").trim(),
        email: String(fd.get("email")||"").trim(),
        affiliation: String(fd.get("affiliation")||"").trim(),
        category: String(fd.get("category")||"").trim(),
        interest: String(fd.get("interest")||"").trim(),
        level: String(fd.get("level")||"").trim(),
        notes: String(fd.get("notes")||"").trim(),
      };

      try{
        // Send to Google Sheets via Apps Script (CORS-safe using no-cors)
        await fetch(GOOGLE_SHEETS_ENDPOINT, {
          method: "POST",
          mode: "no-cors",
          headers: {"Content-Type":"text/plain;charset=utf-8"},
          body: JSON.stringify({ kind: "participant", ...payload })
        });

        form.reset();
        if (dialogMsg) dialogMsg.textContent = "Thank you. Your registration has been received. The organizing committee will contact you with confirmation details.";
        dialog?.showModal();
      } catch(err){
        if (dialogMsg) dialogMsg.textContent = "We could not submit your registration. Please try again, or contact us by email.";
        dialog?.showModal();
        console.error(err);
      }
    });
  }
    catch { return []; }
  }

  // Downloads (client-generated)
  $("#downloadChecklist")?.addEventListener("click", () => {
    const txt = [
      "Oman Multi-Omics Training Programme — Pre-work Checklist",
      "",
      "Before the programme:",
      "1) Bring a personal laptop (Windows/macOS/Linux).",
      "2) Ensure at least 20 GB free disk space.",
      "3) Install a modern browser (Chrome/Edge/Firefox).",
      "4) Install: Git (optional), Conda/Miniconda (recommended), and a text editor (VS Code).",
      "5) If you are unfamiliar with command line, review basic navigation (cd, ls, mkdir).",
      "",
      "You will receive official software instructions and a test dataset before the programme."
    ].join("\n");
    downloadBlob(new Blob([txt], {type:"text/plain;charset=utf-8"}), "pre-work-checklist.txt");
  });


  // Sponsor / partner interest (backend -> XLSX)
  const sponsorForm = $("#sponsorForm");
  if (sponsorForm){
    sponsorForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fd = new FormData(sponsorForm);
      const payload = {
        org: String(fd.get("org")||"").trim(),
        contact: String(fd.get("contact")||"").trim(),
        sponsorEmail: String(fd.get("sponsorEmail")||"").trim(),
        phone: String(fd.get("phone")||"").trim(),
        interestLevel: String(fd.get("interestLevel")||"").trim(),
        message: String(fd.get("message")||"").trim(),
      };

      try{
        // Send to Google Sheets via Apps Script (CORS-safe using no-cors)
        await fetch(GOOGLE_SHEETS_ENDPOINT, {
          method: "POST",
          mode: "no-cors",
          headers: {"Content-Type":"text/plain;charset=utf-8"},
          body: JSON.stringify({ kind: "sponsor", ...payload })
        });

        sponsorForm.reset();
        if (dialogMsg) dialogMsg.textContent = "Thank you. Your sponsorship/partnership interest has been received. The organizing committee will contact you shortly.";
        dialog?.showModal();
      } catch(err){
        if (dialogMsg) dialogMsg.textContent = "We could not submit your sponsorship interest. Please try again, or contact us by email.";
        dialog?.showModal();
        console.error(err);
      }
    });
  }


  $("#downloadBrochure")?.addEventListener("click", () => {
    const w = window.open("", "_blank", "noopener,noreferrer,width=900,height=800");
    if (!w) return alert("Pop-up blocked. Please allow pop-ups to generate the brochure.");
    const html = `<!doctype html>
<html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Oman Multi-Omics Training — Brochure</title>
<style>
  body{font-family:Arial,sans-serif;margin:32px;color:#111}
  h1{margin:0 0 6px;font-size:26px}
  .sub{color:#444;margin:0 0 18px}
  .box{border:1px solid #ddd;border-radius:12px;padding:14px 16px;margin:12px 0}
  h2{margin:0 0 8px;font-size:16px}
  ul{margin:8px 0 0}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .kvs{display:grid;grid-template-columns:120px 1fr;gap:6px 10px;margin-top:10px}
  .kvs div:nth-child(odd){font-weight:700;color:#333}
  .muted{color:#555}
  @media print{body{margin:18mm}}
</style></head>
<body>
  <h1>Oman Multi-Omics Training Programme</h1>
  <p class="sub">Oman College of Health Sciences (OCHS)</p>

  <div class="box">
    <h2>Overview</h2>
    <p class="muted">A structured, hands-on programme covering Genomics (NGS), Transcriptomics (RNA-seq), Proteomics (Mass Spec), and optional Multi-omics Integration.</p>
    <div class="kvs">
      <div>Format</div><div>In-person, guided practical sessions</div>
      <div>Audience</div><div>Postgraduate students, laboratory scientists, researchers and healthcare professionals</div>
      <div>Certificate</div><div>Certificate of participation</div>
      <div>Venue</div><div>OCHS – Muscat (confirm details)</div>
    </div>
  </div>

  <div class="grid">
    <div class="box">
      <h2>Tracks</h2>
      <ul>
        <li>Genomics (NGS)</li>
        <li>Transcriptomics (RNA-seq)</li>
        <li>Proteomics (Mass Spec)</li>
        <li>Multi-omics integration (optional)</li>
      </ul>
    </div>
    <div class="box">
      <h2>Requirements</h2>
      <ul>
        <li>Personal laptop</li>
        <li>Basic molecular biology and genetics knowledge</li>
      </ul>
    </div>
  </div>

  <p class="muted">Use your browser Print → Save as PDF to export this brochure.</p>
  <script>window.print();</script>
</body></html>`;
    w.document.open(); w.document.write(html); w.document.close();
  });

  function downloadBlob(blob, filename){
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 900);
  }
})();