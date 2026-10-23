/* =====================================================================
   main.js — Landing page klinik terapi, Bima (NTB)
   JavaScript vanilla, tanpa dependensi. Dimuat dengan atribut defer.
   ===================================================================== */

/* ---------------------------------------------------------------------
   KONFIGURASI — GANTI DATA KLINIK DI SINI SAJA
   Semua link WhatsApp, telepon, email, dan indikator jam buka dibangun
   dari objek ini.
   --------------------------------------------------------------------- */
const CONFIG = {
  clinicName: "Fisioterapi Ratu Alhilwani",
  // Format internasional: tanpa "+", tanpa 0 di depan, tanpa spasi/strip. Contoh: 6281234567890
  waNumber: "6281238986489",
  phone: "+62 812-3898-6489",       // tampil di halaman & dipakai untuk link tel:
  email: "",                      // opsional: isi bila ada, lalu tambahkan elemen [data-mail-link] di HTML
  address: "Jl. Lintas Sumbawa, Desa Tambe, Kec. Bolo, Kabupaten Bima, Nusa Tenggara Barat", // fallback petunjuk arah bila koordinat kosong
  latitude: "-8.5105121",
  longitude: "118.595913",
  utcOffsetHours: 8,              // WITA = UTC+8 (Asia/Makassar)
  // Jam operasional per hari (0 = Minggu ... 6 = Sabtu). null = tutup.
  // HARUS sama dengan tabel jam di index.html dan JSON-LD.
  hours: {
    0: null,
    1: { open: "08:00", close: "16:00" },
    2: { open: "08:00", close: "16:00" },
    3: { open: "08:00", close: "16:00" },
    4: { open: "08:00", close: "16:00" },
    5: { open: "08:00", close: "16:00" },
    6: { open: "08:00", close: "12:00" },
  },
};

(function () {
  "use strict";

  const MINUTES_PER_DAY = 1440;
  const CAROUSEL_INTERVAL_MS = 7000;
  const SCROLL_TOP_THRESHOLD = 600;
  const DAY_NAMES = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  /* ------------------------- Helper umum ------------------------- */

  function safeStorage(action, key, value) {
    try {
      return action === "get" ? localStorage.getItem(key) : localStorage.setItem(key, value);
    } catch (error) {
      return null; // penyimpanan diblokir (mode privat, dll.): abaikan, fitur tetap jalan
    }
  }

  function buildWaUrl(message) {
    return "https://wa.me/" + CONFIG.waNumber + "?text=" + encodeURIComponent(message);
  }

  function resolveMessage(template) {
    return template.replace(/\{clinic\}/g, CONFIG.clinicName);
  }

  /* ------------------ Waktu WITA (bukan jam perangkat) ------------------ */

  function getWitaNow(date = new Date()) {
    const shifted = new Date(date.getTime() + CONFIG.utcOffsetHours * 3600000);
    return {
      day: shifted.getUTCDay(),
      minutes: shifted.getUTCHours() * 60 + shifted.getUTCMinutes(),
      isoDate: shifted.toISOString().slice(0, 10),
    };
  }

  const toMinutes = (hhmm) => {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
  };
  const formatTime = (hhmm) => hhmm.replace(":", ".");

  function getOpenState(date = new Date()) {
    const { day, minutes } = getWitaNow(date);
    const today = CONFIG.hours[day];
    if (today && minutes >= toMinutes(today.open) && minutes < toMinutes(today.close)) {
      return { isOpen: true, closesAt: today.close };
    }
    for (let offset = 0; offset <= 7; offset += 1) {
      const nextDay = (day + offset) % 7;
      const slot = CONFIG.hours[nextDay];
      if (!slot) continue;
      if (offset === 0 && minutes >= toMinutes(slot.open)) continue; // hari ini sudah lewat
      return { isOpen: false, opensAt: slot.open, dayName: DAY_NAMES[nextDay], offset };
    }
    return { isOpen: false };
  }

  function describeOpenState(state) {
    if (state.isOpen) return "Buka sekarang · tutup pukul " + formatTime(state.closesAt) + " WITA";
    if (!state.opensAt) return "Tutup";
    const when = state.offset === 0 ? "hari ini" : state.offset === 1 ? "besok" : state.dayName;
    return "Tutup · buka " + when + " pukul " + formatTime(state.opensAt) + " WITA";
  }

  function initOpenStatus() {
    const badges = $$("[data-open-status]");
    const todayRows = $$(".hours [data-day]");
    if (!badges.length && !todayRows.length) return;

    const update = () => {
      const now = new Date();
      const state = getOpenState(now);
      const text = describeOpenState(state);
      badges.forEach((badge) => {
        badge.classList.toggle("is-open", state.isOpen);
        badge.classList.toggle("is-closed", !state.isOpen);
        const label = $("[data-open-text]", badge);
        if (label) label.textContent = text;
      });
      const today = String(getWitaNow(now).day);
      todayRows.forEach((row) => row.classList.toggle("is-today", row.dataset.day === today));
    };
    update();
    setInterval(update, 60000);
  }

  /* ------------------------- Tema gelap / terang ------------------------- */

  function applyTheme(theme, persist) {
    const root = document.documentElement;
    root.classList.add("theme-anim");
    root.setAttribute("data-theme", theme);
    if (persist) safeStorage("set", "theme", theme);

    // Samakan warna address bar dengan tema aktif (nilai diambil dari CSS variable --bg)
    const bg = getComputedStyle(root).getPropertyValue("--bg").trim();
    $$('meta[name="theme-color"]').forEach((meta) => meta.setAttribute("content", bg));

    const toggle = $("#theme-toggle");
    if (toggle) {
      toggle.setAttribute("aria-label", theme === "dark" ? "Beralih ke mode terang" : "Beralih ke mode gelap");
    }
    window.setTimeout(() => root.classList.remove("theme-anim"), 400);
  }

  function initTheme() {
    const toggle = $("#theme-toggle");
    const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    applyTheme(current, false);

    if (toggle) {
      toggle.addEventListener("click", () => {
        const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
        applyTheme(next, true);
      });
    }

    // Ikuti perubahan pengaturan sistem selama pengguna belum memilih manual
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = (event) => {
      const saved = safeStorage("get", "theme");
      if (saved !== "light" && saved !== "dark") applyTheme(event.matches ? "dark" : "light", false);
    };
    if (media.addEventListener) media.addEventListener("change", onSystemChange);
  }

  /* ------------------------- Link WhatsApp & kontak ------------------------- */

  function initWhatsAppLinks() {
    const fallback = "Halo {clinic}, saya ingin bertanya tentang layanan terapi.";
    $$("[data-wa-message]").forEach((el) => {
      const message = resolveMessage(el.dataset.waMessage || fallback);
      el.setAttribute("href", buildWaUrl(message));
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    });
  }

  function initContactLinks() {
    const phoneDigits = CONFIG.phone.replace(/[^\d+]/g, "");
    $$("[data-tel-link]").forEach((el) => {
      if (phoneDigits) el.setAttribute("href", "tel:" + phoneDigits);
    });
    if (CONFIG.email) {
      $$("[data-mail-link]").forEach((el) => el.setAttribute("href", "mailto:" + CONFIG.email));
      $$('[data-config-text="email"]').forEach((el) => { el.textContent = CONFIG.email; });
    }
    $$('[data-config-text="phone"]').forEach((el) => { el.textContent = CONFIG.phone; });

    const hasCoords = !isNaN(parseFloat(CONFIG.latitude)) && !isNaN(parseFloat(CONFIG.longitude));
    const destination = hasCoords
      ? CONFIG.latitude + "," + CONFIG.longitude
      : CONFIG.address;
    const mapsUrl = "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(destination);
    $$("[data-directions-link]").forEach((el) => el.setAttribute("href", mapsUrl));
  }

  /* ------------------------- Navigasi ------------------------- */

  function initNav() {
    const header = $(".site-header");
    const nav = $("#site-nav");
    const toggle = $("#nav-toggle");
    const desktopQuery = window.matchMedia("(min-width: 1181px)");

    const setMenu = (open) => {
      if (!nav || !toggle) return;
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
    };

    if (toggle && nav) {
      toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
      nav.addEventListener("click", (event) => {
        if (event.target.closest("a")) setMenu(false);
      });
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && nav.classList.contains("is-open")) {
          setMenu(false);
          toggle.focus();
        }
      });
      document.addEventListener("click", (event) => {
        if (nav.classList.contains("is-open") && !event.target.closest(".site-header")) setMenu(false);
      });
      desktopQuery.addEventListener("change", (event) => { if (event.matches) setMenu(false); });
    }

    if (header) {
      const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }
  }

  /* Highlight menu aktif sesuai section yang terlihat */
  function initScrollSpy() {
    if (!("IntersectionObserver" in window)) return;
    const links = $$('.nav a[href^="#"]:not(.btn)');
    const map = new Map();
    links.forEach((link) => {
      const section = document.getElementById(link.getAttribute("href").slice(1));
      if (section) map.set(section, link);
    });
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => link.removeAttribute("aria-current"));
        map.get(entry.target).setAttribute("aria-current", "true");
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    map.forEach((link, section) => observer.observe(section));
  }

  /* Fade-in saat scroll */
  function initReveal() {
    const items = $$(".reveal");
    if (!("IntersectionObserver" in window) || prefersReducedMotion.matches) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    items.forEach((el) => observer.observe(el));
  }

  function initBackToTop() {
    const button = $("#back-to-top");
    if (!button) return;
    const update = () => button.classList.toggle("is-visible", window.scrollY > SCROLL_TOP_THRESHOLD);
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  /* ------------------------- Carousel testimoni ------------------------- */

  function initCarousel(root) {
    const track = $("[data-carousel-track]", root);
    const slides = $$(".slide", track);
    const dotsWrap = $("[data-carousel-dots]", root);
    const prev = $("[data-carousel-prev]", root);
    const next = $("[data-carousel-next]", root);
    const toggle = $("[data-carousel-toggle]", root);
    if (!track || slides.length < 2) return;

    let index = 0;
    let timer = null;
    let userPaused = prefersReducedMotion.matches; // pengguna reduced-motion: tidak auto-play
    let hoverPaused = false;

    const dots = slides.map((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "dot";
      dot.setAttribute("aria-label", "Tampilkan testimoni " + (i + 1));
      dot.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(dot);
      return dot;
    });

    const setActive = (i) => {
      index = i;
      dots.forEach((dot, d) => (d === i ? dot.setAttribute("aria-current", "true") : dot.removeAttribute("aria-current")));
    };

    function goTo(i) {
      const target = (i + slides.length) % slides.length;
      track.scrollTo({ left: slides[target].offsetLeft, behavior: prefersReducedMotion.matches ? "auto" : "smooth" });
      setActive(target);
    }

    // Sinkronkan titik penanda saat pengguna menggeser (swipe) manual
    let ticking = false;
    track.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const nearest = slides.reduce((best, slide, i) =>
          Math.abs(slide.offsetLeft - track.scrollLeft) < Math.abs(slides[best].offsetLeft - track.scrollLeft) ? i : best, 0);
        if (nearest !== index) setActive(nearest);
      });
    }, { passive: true });

    const syncAutoplay = () => {
      const shouldRun = !userPaused && !hoverPaused && !document.hidden;
      window.clearInterval(timer);
      timer = shouldRun ? window.setInterval(() => goTo(index + 1), CAROUSEL_INTERVAL_MS) : null;
      track.setAttribute("aria-live", shouldRun ? "off" : "polite");
    };

    const renderToggle = () => {
      toggle.setAttribute("aria-label", userPaused ? "Putar otomatis" : "Jeda putar otomatis");
      toggle.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#' + (userPaused ? "i-play" : "i-pause") + '"/></svg>';
    };

    prev.addEventListener("click", () => goTo(index - 1));
    next.addEventListener("click", () => goTo(index + 1));
    toggle.addEventListener("click", () => { userPaused = !userPaused; renderToggle(); syncAutoplay(); });
    root.addEventListener("mouseenter", () => { hoverPaused = true; syncAutoplay(); });
    root.addEventListener("mouseleave", () => { hoverPaused = false; syncAutoplay(); });
    root.addEventListener("focusin", () => { hoverPaused = true; syncAutoplay(); });
    root.addEventListener("focusout", () => { hoverPaused = false; syncAutoplay(); });
    track.addEventListener("touchstart", () => { hoverPaused = true; syncAutoplay(); }, { passive: true });
    track.addEventListener("touchend", () => { hoverPaused = false; syncAutoplay(); }, { passive: true });
    document.addEventListener("visibilitychange", syncAutoplay);

    setActive(0);
    renderToggle();
    syncAutoplay();
  }

  /* ------------------------- Form booking → WhatsApp ------------------------- */

  const PHONE_PATTERN = /^(\+62|62|0)8\d{7,12}$/;

  function fillSelects() {
    const sources = { service: "[data-service-name]", therapist: "[data-therapist-name]" };
    const attrs = { service: "serviceName", therapist: "therapistName" };
    $$("select[data-fill]").forEach((select) => {
      const kind = select.dataset.fill;
      $$(sources[kind]).forEach((card) => {
        const value = card.dataset[attrs[kind]];
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        select.appendChild(option);
      });
    });
  }

  function formatDateId(isoDate) {
    const [y, m, d] = isoDate.split("-").map(Number);
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
    }).format(new Date(Date.UTC(y, m - 1, d)));
  }

  function validateBooking(values) {
    const errors = {};
    if (values.name.length < 2) errors.name = "Mohon isi nama Anda (minimal 2 huruf).";
    const phone = values.wa.replace(/[\s\-().]/g, "");
    if (!PHONE_PATTERN.test(phone)) errors.wa = "Nomor WhatsApp tidak valid. Contoh: 081234567890.";
    if (!values.service) errors.service = "Silakan pilih layanan.";
    if (!values.date) errors.date = "Silakan pilih tanggal.";
    else if (values.date < getWitaNow().isoDate) errors.date = "Tanggal tidak boleh sebelum hari ini.";
    if (!values.time) errors.time = "Silakan pilih waktu.";
    if (!values.mode) errors.mode = "Silakan pilih sesi offline atau online.";
    if (!values.consent) errors.consent = "Mohon centang persetujuan untuk melanjutkan.";
    return errors;
  }

  function buildBookingMessage(values) {
    const lines = [
      "Halo " + CONFIG.clinicName + ", saya ingin membuat janji konsultasi.",
      "",
      "*Nama:* " + values.name,
      "*No. WhatsApp:* " + values.wa,
      "*Layanan:* " + values.service,
      "*Fisioterapis:* " + values.therapist,
      "*Jadwal pilihan:* " + formatDateId(values.date) + ", pukul " + formatTime(values.time) + " WITA",
      "*Jenis sesi:* " + values.mode,
    ];
    if (values.note) lines.push("*Keluhan singkat:* " + values.note);
    lines.push("", "Mohon konfirmasi ketersediaan jadwalnya. Terima kasih.");
    return lines.join("\n");
  }

  function initBookingForm() {
    const form = $("#booking-form");
    if (!form) return;
    const status = $("#form-status");
    const dateInput = $("#f-date");
    if (dateInput) dateInput.min = getWitaNow().isoDate; // minimal hari ini menurut WITA

    const readValues = () => {
      const data = new FormData(form);
      const text = (key) => String(data.get(key) || "").replace(/\s+/g, " ").trim();
      return {
        name: text("name"),
        wa: text("wa"),
        service: text("service"),
        therapist: text("therapist") || "Siapa saja yang tersedia",
        date: text("date"),
        time: text("time"),
        mode: text("mode"),
        note: text("note"),
        consent: form.elements.consent.checked,
      };
    };

    const fieldIds = { name: "f-name", wa: "f-wa", service: "f-service", date: "f-date", time: "f-time", consent: "f-consent" };

    const showErrors = (errors) => {
      ["name", "wa", "service", "date", "time", "mode", "consent"].forEach((key) => {
        const slot = document.getElementById("e-" + key);
        if (slot) slot.textContent = errors[key] || "";
        const input = fieldIds[key] ? document.getElementById(fieldIds[key]) : null;
        if (input) {
          if (errors[key]) input.setAttribute("aria-invalid", "true");
          else input.removeAttribute("aria-invalid");
        }
      });
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const values = readValues();
      const errors = validateBooking(values);
      showErrors(errors);

      const firstKey = Object.keys(errors)[0];
      if (firstKey) {
        status.textContent = "Mohon periksa kembali isian yang ditandai.";
        const target = fieldIds[firstKey] ? document.getElementById(fieldIds[firstKey]) : $('input[name="mode"]', form);
        if (target) target.focus();
        return;
      }

      const url = buildWaUrl(buildBookingMessage(values));
      const opened = window.open(url, "_blank", "noopener,noreferrer");
      status.textContent = "";
      const note = document.createTextNode(
        opened ? "WhatsApp dibuka di tab baru. Tekan kirim di sana untuk menyelesaikan. " : "Jika WhatsApp tidak terbuka, "
      );
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = opened ? "Belum terbuka? Klik di sini." : "klik di sini untuk membukanya.";
      status.append(note, link);
    });
  }

  /* ------------------------- Init ------------------------- */

  function init() {
    initTheme();
    initWhatsAppLinks();
    initContactLinks();
    initNav();
    initScrollSpy();
    initReveal();
    initBackToTop();
    initOpenStatus();
    fillSelects();
    initBookingForm();
    $$("[data-carousel]").forEach(initCarousel);
    $$("[data-year]").forEach((el) => { el.textContent = String(new Date().getFullYear()); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
