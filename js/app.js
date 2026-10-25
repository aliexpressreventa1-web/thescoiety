(() => {
  "use strict";

  const SITE = window.SITE || {};
  const MODULES = window.CURRICULUM || [];
  const CODE = window.INDICATORS || {};

  /* ---------- Storage (safe) ---------- */
  const KEY = "society.";
  const store = {
    get(k, fallback) {
      try {
        const v = localStorage.getItem(KEY + k);
        return v == null ? fallback : JSON.parse(v);
      } catch (e) { return fallback; }
    },
    set(k, v) {
      try { localStorage.setItem(KEY + k, JSON.stringify(v)); } catch (e) { /* private mode etc. */ }
    },
  };

  /* ---------- Flat lesson index ---------- */
  const LESSONS = [];
  MODULES.forEach((mod) => {
    mod.lessons.forEach((lesson) => {
      lesson.module = mod;
      lesson.index = LESSONS.length;
      lesson.video = parseVideo(lesson.url);
      LESSONS.push(lesson);
    });
  });
  const byId = new Map(LESSONS.map((l) => [l.id, l]));

  const state = {
    completed: new Set(store.get("completed", []).filter((id) => byId.has(id))),
    saved: store.get("saved", []).filter((id) => byId.has(id)),
    notes: store.get("notes", {}),
    open: new Set(store.get("open", [])),
    savedOpen: store.get("savedOpen", true),
    current: null,
    notesOpen: false,
  };
  const persist = () => {
    store.set("completed", [...state.completed]);
    store.set("saved", state.saved);
    store.set("notes", state.notes);
    store.set("open", [...state.open]);
    store.set("savedOpen", state.savedOpen);
  };

  /* ---------- Helpers ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function parseVideo(url) {
    if (!url) return null;
    let u;
    try { u = new URL(url); } catch (e) { return null; }
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = u.pathname.slice(1).split("/")[0];
      return { kind: "youtube", id, embed: `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`, thumb: `https://i.ytimg.com/vi/${id}/mqdefault.jpg`, label: "YouTube" };
    }
    if (host.endsWith("youtube.com")) {
      const list = u.searchParams.get("list");
      const v = u.searchParams.get("v") || (u.pathname.startsWith("/embed/") ? u.pathname.split("/")[2] : null);
      if (v) return { kind: "youtube", id: v, embed: `https://www.youtube-nocookie.com/embed/${v}?rel=0&modestbranding=1`, thumb: `https://i.ytimg.com/vi/${v}/mqdefault.jpg`, label: "YouTube" };
      if (list) return { kind: "playlist", id: list, embed: `https://www.youtube-nocookie.com/embed/videoseries?list=${list}&rel=0`, thumb: null, label: "YouTube" };
    }
    if (host.endsWith("loom.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop().replace(/[^a-zA-Z0-9]/g, "");
      const thumb = (window.LOOM_THUMBS || {})[id] || store.get("loomThumb." + id, null);
      return { kind: "loom", id, url, embed: `https://www.loom.com/embed/${id}?hide_owner=true&hide_share=true&hideEmbedTopBar=true`, thumb, label: "Loom" };
    }
    return null;
  }

  const ICONS = {
    chev: '<svg class="chev" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M6 9l6 6 6-6"/></svg>',
    done: '<svg viewBox="0 0 24 24" width="18" height="18"><circle cx="12" cy="12" r="10" fill="currentColor"/><path d="M7.5 12.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    todo: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/></svg>',
    active: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4" fill="currentColor" stroke="none"/></svg>',
    play: '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M7 4l13 8-13 8z"/></svg>',
    check: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    bookmark: (filled) => `<svg viewBox="0 0 24 24" width="13" height="13" fill="${filled ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`,
    notes: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-6"/><path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>',
    ext: '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
    copy: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/></svg>',
    download: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M7 10l5 5 5-5M4 21h16"/></svg>',
    target: '<svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.5"/></svg>',
    left: '<span aria-hidden="true">←</span>',
    right: '<span aria-hidden="true">→</span>',
  };

  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toast.t);
    toast.t = setTimeout(() => el.classList.remove("show"), 1800);
  }

  /* ---------- Static text ---------- */
  function renderStatic() {
    $("#brandTop").textContent = SITE.brandTop || "THE SOCIETY";
    $("#brandBottom").textContent = SITE.brandBottom || "Lecture Portal";
    $("#siteTitle").textContent = SITE.title || "The Society Curriculum";
    $("#siteSubtitle").textContent = SITE.subtitle || "";
    $("#mainSiteLink").href = SITE.mainSiteUrl || "#";
  }

  /* ---------- Progress ---------- */
  function renderProgress() {
    const total = LESSONS.length;
    const done = state.completed.size;
    const pct = total ? Math.round((done / total) * 100) : 0;
    $("#progressPct").textContent = pct + "%";
    $("#progressFill").style.width = pct + "%";
    $("#progressBar").setAttribute("aria-valuenow", String(pct));
    $("#progressCount").textContent = `${done}/${total} lessons completed`;
  }

  /* ---------- Thumbnails ---------- */
  function thumbHTML(lesson) {
    const mod = lesson.module;
    if (lesson.thumb === "indicators") {
      return `<span class="thumb white"><span class="thumb-fallback">Indicators</span></span>`;
    }
    const v = lesson.video;
    const fallback = v && v.kind === "playlist"
      ? `<span class="thumb-fallback"><span class="big">▶</span>Playlist</span>`
      : `<span class="thumb-fallback"><span class="big">${mod.icon || "▶"}</span>${esc(mod.num != null ? "Lesson" : "Intro")}</span>`;
    const cls = mod.gold ? "thumb gold-thumb" : "thumb";
    if (v && v.thumb) {
      return `<span class="${cls}">${fallback}<img src="${v.thumb}" alt="" loading="lazy" onerror="this.remove()"></span>`;
    }
    return `<span class="${cls}">${fallback}</span>`;
  }

  /** Loom thumbnails need a signed URL; resolve any missing ones through Loom's oEmbed API. */
  function resolveLoomThumbs() {
    LESSONS.forEach(async (lesson) => {
      const v = lesson.video;
      if (!v || v.kind !== "loom" || v.thumb || lesson.thumb) return;
      try {
        const res = await fetch("https://www.loom.com/v1/oembed?url=" + encodeURIComponent(v.url));
        const data = await res.json();
        if (!data.thumbnail_url) return;
        v.thumb = data.thumbnail_url.replace(/\.gif$/, ".jpg");
        store.set("loomThumb." + v.id, v.thumb);
        document.querySelectorAll(`.lesson-row[data-lesson="${lesson.id}"] .thumb`).forEach((el) => {
          el.insertAdjacentHTML("beforeend", `<img src="${v.thumb}" alt="" loading="lazy" onerror="this.remove()">`);
        });
      } catch (e) { /* offline: keep the fallback tile */ }
    });
  }

  /* ---------- Sidebar ---------- */
  function moduleCount(mod) {
    const done = mod.lessons.filter((l) => state.completed.has(l.id)).length;
    return { done, total: mod.lessons.length };
  }

  function lessonRowHTML(lesson) {
    const kind = lesson.setup ? "Setup" : lesson.video && lesson.video.kind === "playlist" ? "Playlist" : "Video";
    return `
      <button class="lesson-row" type="button" data-lesson="${lesson.id}">
        ${thumbHTML(lesson)}
        <span class="row-text">
          <span class="row-title">${esc(lesson.title)}</span>
          <span class="row-meta">${kind}</span>
        </span>
        <span class="row-status" aria-hidden="true"></span>
      </button>`;
  }

  function renderModules() {
    const list = $("#moduleList");
    let html = "";
    let lastGroup = null;
    MODULES.forEach((mod) => {
      if (lastGroup && mod.group !== lastGroup) html += `<div class="divider" role="separator"></div>`;
      lastGroup = mod.group;
      const isOpen = state.open.has(mod.id);
      const badge = mod.num != null
        ? `<span class="mod-badge"><span class="ico">${mod.icon || ""}</span><span class="sep"></span>${mod.num}</span>`
        : `<span class="mod-badge"><span class="ico">${mod.icon || ""}</span></span>`;
      html += `
        <section class="module${mod.gold ? " gold" : ""}${isOpen ? " open" : ""}" data-module="${mod.id}">
          <button class="module-head" type="button" aria-expanded="${isOpen}">
            ${badge}
            <span class="mod-title">${mod.gold ? "★ " : ""}${esc(mod.title)}</span>
            ${mod.badge ? `<span class="mod-pill">${ICONS.target} ${esc(mod.badge)}</span>` : ""}
            <span class="mod-count"></span>
            ${ICONS.chev}
          </button>
          <div class="module-body">${mod.lessons.map(lessonRowHTML).join("")}</div>
        </section>`;
    });
    list.innerHTML = html;
    syncSidebar();
  }

  /** Update counts / active / completed markers without rebuilding the DOM. */
  function syncSidebar() {
    document.querySelectorAll(".module").forEach((el) => {
      const mod = MODULES.find((m) => m.id === el.dataset.module);
      const { done, total } = moduleCount(mod);
      const c = el.querySelector(".mod-count");
      c.textContent = `${done}/${total}`;
      c.classList.toggle("done", done === total && !mod.gold);
    });
    document.querySelectorAll(".lesson-row").forEach((row) => {
      const id = row.dataset.lesson;
      const isDone = state.completed.has(id);
      const isActive = state.current && state.current.id === id;
      row.classList.toggle("active", !!isActive);
      if (isActive) row.setAttribute("aria-current", "true"); else row.removeAttribute("aria-current");
      const st = row.querySelector(".row-status");
      st.classList.toggle("done", isDone);
      st.innerHTML = isDone ? ICONS.done : isActive ? ICONS.active : ICONS.todo;
    });
  }

  function setModuleOpen(modId, open) {
    const el = document.querySelector(`.module[data-module="${modId}"]`);
    if (!el) return;
    el.classList.toggle("open", open);
    el.querySelector(".module-head").setAttribute("aria-expanded", String(open));
    if (open) state.open.add(modId); else state.open.delete(modId);
    persist();
  }

  /* ---------- Saved lessons ---------- */
  function renderSaved() {
    $("#savedCount").textContent = state.saved.length;
    const body = $("#savedBody");
    const head = $("#savedToggle");
    head.setAttribute("aria-expanded", String(state.savedOpen));
    body.hidden = !state.savedOpen;
    if (!state.saved.length) {
      body.innerHTML = `<p class="saved-empty">No saved lessons yet. Tap <b>Save</b> on any lesson to bookmark it here.</p>`;
      return;
    }
    body.innerHTML = state.saved.map((id) => lessonRowHTML(byId.get(id))).join("");
    syncSidebar();
  }

  /* ---------- Lesson panel ---------- */
  function playerHTML(video, title) {
    if (!video) return `<div class="player"></div>`;
    return `<div class="player"><iframe src="${video.embed}" title="${esc(title)}" loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
      referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>`;
  }

  function setupHTML(lesson) {
    return `<div class="setup">${lesson.setup.map((ind, i) => {
      const v = parseVideo(ind.video);
      return `
      <div class="indicator">
        <div class="ind-label">${esc(ind.label)}</div>
        <div class="ind-name">${esc(ind.name)}</div>
        <p class="ind-blurb">${esc(ind.blurb)}</p>
        <ol class="steps">
          <li class="step">
            <span class="step-num">1</span>
            <div>
              <div class="step-title">Watch the install video</div>
              ${playerHTML(v, ind.name)}
              <a class="text-link" href="${esc(ind.video)}" target="_blank" rel="noopener">Open video in Loom ${ICONS.ext}</a>
            </div>
          </li>
          <li class="step">
            <span class="step-num">2</span>
            <div>
              <div class="step-title">Copy the indicator code</div>
              <div class="row">
                <button class="btn btn-primary btn-sm" type="button" data-copy="${ind.code}">${ICONS.copy} Copy code</button>
                <button class="btn btn-sm" type="button" data-download="${ind.code}" data-file="${esc(ind.file)}">${ICONS.download} Download file</button>
              </div>
              <button class="link-btn" type="button" data-viewcode="${i}" aria-expanded="false">View code ▾</button>
              <pre class="code-view" id="code-${i}" hidden>${esc(CODE[ind.code] || "// Code not found")}</pre>
            </div>
          </li>
          <li class="step">
            <span class="step-num">3</span>
            <div>
              <div class="step-title">Add it to TradingView</div>
              <ul>
                <li>Open a chart and click <b>Pine Editor</b> at the bottom.</li>
                <li>Delete everything in the editor and paste the code.</li>
                <li>Click <b>Save</b>, then <b>Add to chart</b>.</li>
              </ul>
              <a class="btn btn-sm" href="https://www.tradingview.com/chart/" target="_blank" rel="noopener">Open TradingView ${ICONS.ext}</a>
            </div>
          </li>
        </ol>
      </div>`;
    }).join("")}</div>`;
  }

  function renderLesson() {
    const lesson = state.current;
    const panel = $("#lessonPanel");
    if (!lesson) { panel.innerHTML = ""; return; }
    const mod = lesson.module;
    const isDone = state.completed.has(lesson.id);
    const isSaved = state.saved.includes(lesson.id);
    const prev = LESSONS[lesson.index - 1];
    const next = LESSONS[lesson.index + 1];
    const desc = lesson.desc || (mod.num != null ? `Module ${mod.num} · ${mod.title}` : mod.title.replace(/-/g, " "));
    const note = state.notes[lesson.id] || "";

    panel.classList.toggle("is-gold", !!mod.gold);
    panel.innerHTML = `
      <div class="lesson-top">
        <div class="lesson-heading">
          <span class="lesson-kicker">Lesson ${lesson.index + 1} ${ICONS.play}
            ${mod.gold ? `<span class="gold-tag">★ TTP MODEL</span>` : ""}</span>
          <h2>${esc(lesson.title)}</h2>
          <p class="lesson-desc">${esc(desc)}</p>
        </div>
        <div class="lesson-actions">
          <button class="chip-btn${isDone ? " on-complete" : ""}" type="button" data-action="complete" aria-pressed="${isDone}">
            ${ICONS.check} ${isDone ? "Completed" : "Mark complete"}</button>
          <button class="chip-btn${isSaved ? " on-save" : ""}" type="button" data-action="save" aria-pressed="${isSaved}">
            ${ICONS.bookmark(isSaved)} ${isSaved ? "Saved" : "Save"}</button>
          <button class="chip-btn${state.notesOpen ? " on-notes" : ""}" type="button" data-action="notes" aria-expanded="${state.notesOpen}">
            ${ICONS.notes} Notes${note ? " •" : ""}</button>
        </div>
      </div>
      <div class="notes" id="notesBox" ${state.notesOpen ? "" : "hidden"}>
        <textarea id="notesInput" placeholder="Write your notes for this lesson… (saved automatically on this device)">${esc(note)}</textarea>
        <div class="notes-meta" id="notesMeta">${note ? "Saved" : ""}</div>
      </div>
      ${lesson.setup ? setupHTML(lesson) : playerHTML(lesson.video, lesson.title)}
      <div class="lesson-foot">
        <a class="btn btn-primary" href="${esc(lesson.url)}" target="_blank" rel="noopener">Watch Lesson ${ICONS.ext}</a>
        <div class="nav-btns">
          <button class="btn" type="button" data-action="prev" ${prev ? "" : "disabled"}>${ICONS.left} Prev</button>
          <button class="btn" type="button" data-action="next" ${next ? "" : "disabled"}>Next ${ICONS.right}</button>
        </div>
      </div>`;

    const input = $("#notesInput");
    input.addEventListener("input", () => {
      clearTimeout(input.t);
      $("#notesMeta").textContent = "Saving…";
      input.t = setTimeout(() => {
        const val = input.value;
        if (val.trim()) state.notes[lesson.id] = val; else delete state.notes[lesson.id];
        persist();
        $("#notesMeta").textContent = val.trim() ? "Saved" : "";
      }, 400);
    });
  }

  /* ---------- Navigation ---------- */
  function openLesson(id, { scroll = false, updateHash = true } = {}) {
    const lesson = byId.get(id) || LESSONS[0];
    if (!lesson) return;
    state.current = lesson;
    store.set("last", lesson.id);
    if (!state.open.has(lesson.module.id)) setModuleOpen(lesson.module.id, true);
    if (updateHash && location.hash !== "#/" + lesson.id) history.replaceState(null, "", "#/" + lesson.id);
    renderLesson();
    syncSidebar();
    document.title = `${lesson.title} · ${SITE.brandBottom || "Lecture Portal"}`;
    if (scroll && window.matchMedia("(max-width: 559px)").matches) {
      $("#lessonPanel").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function toggleComplete() {
    const l = state.current;
    if (state.completed.has(l.id)) {
      state.completed.delete(l.id);
      toast("Marked as not completed");
    } else {
      state.completed.add(l.id);
      const { done, total } = moduleCount(l.module);
      if (state.completed.size === LESSONS.length) toast("🏆 Curriculum completed!");
      else if (done === total) toast(`Module complete: ${l.module.title}`);
      else toast("Lesson completed ✓");
    }
    persist();
    renderProgress();
    renderLesson();
    syncSidebar();
  }

  function toggleSave() {
    const id = state.current.id;
    const i = state.saved.indexOf(id);
    if (i >= 0) { state.saved.splice(i, 1); toast("Removed from saved"); }
    else { state.saved.push(id); state.savedOpen = true; toast("Saved to bookmarks"); }
    persist();
    renderSaved();
    renderLesson();
  }

  /* ---------- Copy / download ---------- */
  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand("copy"); } catch (err) { ok = false; }
      ta.remove();
      return ok;
    }
  }

  function downloadText(text, filename) {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  /* ---------- Events ---------- */
  function bindEvents() {
    document.addEventListener("click", async (e) => {
      const head = e.target.closest(".module-head");
      if (head) {
        const modEl = head.closest(".module");
        setModuleOpen(modEl.dataset.module, !modEl.classList.contains("open"));
        return;
      }
      const row = e.target.closest(".lesson-row");
      if (row) { openLesson(row.dataset.lesson, { scroll: true }); return; }

      const act = e.target.closest("[data-action]");
      if (act) {
        const a = act.dataset.action;
        if (a === "complete") toggleComplete();
        else if (a === "save") toggleSave();
        else if (a === "notes") {
          state.notesOpen = !state.notesOpen;
          renderLesson();
          if (state.notesOpen) $("#notesInput").focus();
        } else if (a === "prev" && state.current.index > 0) openLesson(LESSONS[state.current.index - 1].id);
        else if (a === "next" && state.current.index < LESSONS.length - 1) openLesson(LESSONS[state.current.index + 1].id);
        return;
      }

      const copyBtn = e.target.closest("[data-copy]");
      if (copyBtn) {
        const ok = await copyText(CODE[copyBtn.dataset.copy] || "");
        toast(ok ? "Code copied — paste it in the Pine Editor" : "Couldn't copy, use Download instead");
        return;
      }
      const dl = e.target.closest("[data-download]");
      if (dl) { downloadText(CODE[dl.dataset.download] || "", dl.dataset.file); return; }

      const view = e.target.closest("[data-viewcode]");
      if (view) {
        const pre = $("#code-" + view.dataset.viewcode);
        pre.hidden = !pre.hidden;
        view.setAttribute("aria-expanded", String(!pre.hidden));
        view.textContent = pre.hidden ? "View code ▾" : "Hide code ▴";
      }
    });

    $("#savedToggle").addEventListener("click", () => {
      state.savedOpen = !state.savedOpen;
      persist();
      renderSaved();
    });

    $("#themeToggle").addEventListener("click", () => {
      const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem("society.theme", next); } catch (e) {}
    });

    window.addEventListener("hashchange", () => {
      const id = location.hash.replace(/^#\/?/, "");
      if (byId.has(id) && (!state.current || state.current.id !== id)) openLesson(id, { updateHash: false });
    });

    // Keyboard: ← / → to move between lessons (ignored while typing).
    document.addEventListener("keydown", (e) => {
      if (e.target.closest("input, textarea, [contenteditable]") || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "ArrowRight" && state.current.index < LESSONS.length - 1) openLesson(LESSONS[state.current.index + 1].id);
      if (e.key === "ArrowLeft" && state.current.index > 0) openLesson(LESSONS[state.current.index - 1].id);
    });
  }

  /* ---------- Init ---------- */
  function init() {
    renderStatic();
    renderProgress();
    renderModules();
    renderSaved();
    bindEvents();
    resolveLoomThumbs();
    const fromHash = location.hash.replace(/^#\/?/, "");
    const last = store.get("last", null);
    const firstOpen = LESSONS.find((l) => !state.completed.has(l.id));
    const start = byId.has(fromHash) ? fromHash : byId.has(last) ? last : (firstOpen || LESSONS[0]).id;
    openLesson(start);
  }

  init();
})();
