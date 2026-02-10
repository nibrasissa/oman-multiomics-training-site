/* Oman Multi-Omics Training Programme — interactions (Google Sheets) */
(function () {
  // Google Sheets (Apps Script Web App) endpoint (must end with /exec)
  const GOOGLE_SHEETS_ENDPOINT =
    "https://script.google.com/macros/s/AKfycbwQqK3FcchALT_FtNigldUzJ5o1N3XdLJdtQM8R-NHMDZXunqX833QKp8bPgtrQlfTV4w/exec";

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

  // Year (optional)
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  // Mobile nav
  const menuBtn = $("#menuBtn");
  const mobileNav = $("#mobileNav");
  if (menuBtn && mobileNav) {
    const closeMenu = () => {
      mobileNav.hidden = true;
      menuBtn.setAttribute("aria-expanded", "false");
    };

    menuBtn.addEventListener("click", () => {
      const open = !mobileNav.hidden;
      mobileNav.hidden = open;
      menuBtn.setAttribute("aria-expanded", String(!open));
    });

    $$("#mobileNav a").forEach((a) =>
      a.addEventListener("click", () => closeMenu())
    );

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  }

  // Reveal on scroll (matches CSS: .reveal.is-in)
  const els = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
  } else {
    els.forEach((el) => el.classList.add("is-in"));
  }

  // Dialog helper
  const dialog = $("#dialog");
  const dialogMsg = $("#dialogMsg");
  const dialogClose = $("#dialogClose");
  if (dialogClose) dialogClose.addEventListener("click", () => dialog?.close());

  function showMessage(text) {
    if (dialogMsg) dialogMsg.textContent = text;
    if (dialog && typeof dialog.showModal === "function") dialog.showModal();
    else alert(text);
  }

  // CORS-safe send to Apps Script
  // Uses form-encoded body (works well with Apps Script on GitHub Pages)
  async function sendToSheets(kind, payload) {
    if (!GOOGLE_SHEETS_ENDPOINT || !GOOGLE_SHEETS_ENDPOINT.includes("/exec")) {
      throw new Error("Invalid Google Sheets endpoint (must end with /exec).");
    }

    const data = {
      kind,
      ...payload,
      timestamp: new Date().toISOString(),
      page: location.href,
    };

    const body = new URLSearchParams();
    // Send the full JSON as one field (easy to parse in Apps Script)
    body.append("data", JSON.stringify(data));

    await fetch(GOOGLE_SHEETS_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body,
    });

    // no-cors returns opaque response; if fetch doesn't throw, assume success
    return true;
  }

  // Participant Registration
  const regForm = $("#regForm");
  if (regForm) {
    regForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fd = new FormData(regForm);

      const payload = {
        name: String(fd.get("name") || "").trim(),
        email: String(fd.get("email") || "").trim(),
        affiliation: String(fd.get("affiliation") || "").trim(),
        category: String(fd.get("category") || "").trim(),
        interest: String(fd.get("interest") || "").trim(),
        level: String(fd.get("level") || "").trim(),
        notes: String(fd.get("notes") || "").trim(),
      };

      try {
        await sendToSheets("participant", payload);
        regForm.reset();
        showMessage(
          "Thank you. Your registration has been received. The organizing committee will contact you with confirmation details."
        );
      } catch (err) {
        console.error(err);
        showMessage(
          "We could not submit your registration. Please try again, or contact nabras.almahrami@ochs.edu.om"
        );
      }
    });
  }

  // Sponsor / Partner Interest
  const sponsorForm = $("#sponsorForm");
  if (sponsorForm) {
    sponsorForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fd = new FormData(sponsorForm);

      const payload = {
        org: String(fd.get("org") || "").trim(),
        contact: String(fd.get("contact") || "").trim(),
        sponsorEmail: String(fd.get("sponsorEmail") || "").trim(),
        interestLevel: String(fd.get("interestLevel") || "").trim(),
        message: String(fd.get("message") || "").trim(),
      };

      try {
        await sendToSheets("sponsor", payload);
        sponsorForm.reset();
        showMessage(
          "Thank you. Your sponsorship/partnership interest has been received. The organizing committee will contact you shortly."
        );
      } catch (err) {
        console.error(err);
        showMessage(
          "We could not submit your sponsorship interest. Please try again, or contact nabras.almahrami@ochs.edu.om"
        );
      }
    });
  }

  // Downloads (client-generated)
  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 900);
  }

  $("#downloadChecklist")?.addEventListener("click", () => {
    const txt = [
      "Oman Multi-Omics Training Programme — Pre-work Checklist",
      "",
      "Before the programme:",
      "1) Bring a personal laptop (Windows/macOS/Linux).",
      "2) Ensure at least 20 GB free disk space.",
      "3) Install a modern browser (Chrome/Edge/Firefox).",
      "4) Install a text editor (VS Code recommended).",
      "5) Review basic command line navigation (cd, ls) if needed.",
      "",
      "You will receive official instructions and materials before the programme."
    ].join("\n");
    downloadBlob(new Blob([txt], { type: "text/plain;charset=utf-8" }), "pre-work-checklist.txt");
  });

  $("#downloadBrochure")?.addEventListener("click", () => {
    const w = window.open("", "_blank", "noopener,noreferrer,width=900,height=800");
    if (!w) return alert("Pop-up blocked. Please allow pop-ups to generate the brochure.");

    const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Oman Multi-Omics Training — Brochure</title>
<style>
  body{font-family:Arial,sans-serif;margin:32px;color:#111}
  h1{margin:0 0 6px;font-size:26px}
  .sub{color:#444;margin:0 0 18px}
  .box{border:1px solid #ddd;border-radius:12px;padding:14px 16px;margin:12px 0}
  h2{margin:0 0 8px;font-size:16px}
  ul{margin:8px 0 0}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .kvs{display:grid;grid-template-columns:140px 1fr;gap:6px 10px;margin-top:10px}
  .kvs div:nth-child(odd){font-weight:700;color:#333}
  .muted{color:#555}
  @media print{body{margin:18mm}}
</style>
</head>
<body>
  <h1>Oman Multi-Omics Training Programme</h1>
  <p class="sub">Oman College of Health Sciences (OCHS)</p>

  <div class="box">
    <h2>Key information</h2>
    <div class="kvs">
      <div>Date</div><div>1–3 April</div>
      <div>Venue</div><div>Park Inn by Radisson Muscat, Al Anwar Street, Muscat 111</div>
      <div>Capacity</div><div>Limited</div>
      <div>Fees</div><div>Students: 35 OMR • Professionals: 45 OMR</div>
      <div>Early Bird</div><div>15% discount until 5 March</div>
      <div>Contact</div><div>nabras.almahrami@ochs.edu.om</div>
    </div>
  </div>

  <div class="box">
    <h2>Overview</h2>
    <p class="muted">
      A structured three-day programme covering Genomics, Transcriptomics, Proteomics, and Multi-omics Integration,
      with an emphasis on practical workflows and interpretation in biomedical research and clinical contexts.
    </p>
  </div>

  <div class="box">
    <h2>Programme</h2>
    <ul>
      <li><strong>Day 1:</strong> Opening & Genomics</li>
      <li><strong>Day 2:</strong> Transcriptomics & Proteomics</li>
      <li><strong>Day 3:</strong> Multi-omics Integration & Closing</li>
    </ul>
  </div>

  <p class="muted">Use your browser Print → Save as PDF to export this brochure.</p>
  <script>window.print();</script>
</body>
</html>`;

    w.document.open();
    w.document.write(html);
    w.document.close();
  });

})();
