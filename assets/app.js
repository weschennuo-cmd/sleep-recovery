(() => {
  "use strict";

  const dataset = window.POCOCO_GUIDES;
  const cases = Array.isArray(window.POCOCO_CASES) ? window.POCOCO_CASES : [];
  if (!dataset || !Array.isArray(dataset.guides)) return;

  const esc = (value) => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

  const guideBySlug = new Map(dataset.guides.map((guide) => [guide.slug, guide]));
  const caseById = new Map(cases.map((item) => [item.id, item]));
  const currentSlug = document.body.dataset.guide || "index";
  const isIndex = currentSlug === "index";
  const prefix = isIndex ? "./" : "../";
  const assetPrefix = "./";

  const matchingCases = (slug) =>
    cases.filter((item) => Array.isArray(item.types) && item.types.includes(slug));

  function getEmbedUrl(item) {
    const url = String(item.url || "");
    const platform = String(item.platform || "").toLowerCase();
    if (platform.includes("youtube") || url.includes("youtu")) {
      const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([^?&#/]+)/i);
      return match ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(match[1])}?rel=0` : "";
    }
    if (url.includes("instagram.com")) {
      const kind = url.includes("/p/") ? "p" : "reel";
      return `https://www.instagram.com/${kind}/${encodeURIComponent(item.id)}/embed/`;
    }
    return "";
  }

  function renderNav() {
    const nav = document.querySelector("#type-nav");
    if (!nav) return;
    nav.innerHTML = dataset.guides.map((guide) => {
      const current = guide.slug === currentSlug ? ' aria-current="page"' : "";
      return `<a href="${prefix}${esc(guide.slug)}/"${current}>${esc(guide.short)}</a>`;
    }).join("");
  }

  function renderIndex() {
    const grid = document.querySelector("#guide-index-grid");
    if (!grid) return;
    grid.innerHTML = dataset.guides.map((guide) => {
      const count = matchingCases(guide.slug).length;
      return `
        <a class="guide-index-card" href="./${esc(guide.slug)}/">
          <span class="guide-icon">${esc(guide.icon)}</span>
          <div><h2>${esc(guide.title)}</h2></div>
          <p>${esc(guide.tagline)}</p>
          <span class="guide-count">${count} content references · ${guide.visualIds.length} visual references</span>
        </a>`;
    }).join("");
  }

  function renderHero(guide) {
    document.title = `POCOCO Creator Direction · ${guide.title}`;
    const title = document.querySelector("#guide-title");
    const tagline = document.querySelector("#guide-tagline");
    if (title) title.textContent = guide.title;
    if (tagline) tagline.textContent = guide.tagline;
  }

  function renderAngles(guide) {
    const grid = document.querySelector("#angle-grid");
    if (!grid) return;
    grid.innerHTML = guide.angles.map((angle) => `
      <article class="angle-card">
        <span class="lens">${esc(angle.lens)}</span>
        <h3>${esc(angle.title)}</h3>
        <p>${esc(angle.copy)}</p>
      </article>`).join("");
  }

  function renderFlow(guide) {
    const flow = document.querySelector("#flow-grid");
    if (flow) {
      flow.innerHTML = guide.flow.map((item, index) => `
        <article class="flow-card">
          <span class="flow-index">${String(index + 1).padStart(2, "0")}</span>
          <h3>${esc(item[0])}</h3>
          <p>${esc(item[1])}</p>
        </article>`).join("");
    }

    const messages = document.querySelector("#message-grid");
    if (messages) {
      messages.innerHTML = guide.messages.map((item) => `
        <article class="message-card">
          <strong>${esc(item[0])}</strong>
          <p>${esc(item[1])}</p>
        </article>`).join("");
    }

    const better = document.querySelector("#better-language");
    const avoid = document.querySelector("#avoid-language");
    if (better) better.textContent = guide.language.better;
    if (avoid) avoid.textContent = guide.language.avoid;
  }

  function caseCard(item, index) {
    const extra = index >= dataset.initialVisible ? " is-extra" : "";
    const hidden = index >= dataset.initialVisible ? " hidden" : "";
    const cover = `${assetPrefix}assets/covers/${encodeURIComponent(item.id)}.jpg`;
    const embed = getEmbedUrl(item);
    const playControl = embed
      ? `<button class="media-poster play-inline" type="button" data-embed="${esc(embed)}" aria-label="Play ${esc(item.title)} here">
          <img src="${cover}" alt="" loading="lazy" decoding="async">
          <span class="poster-shade" aria-hidden="true"></span>
          <span class="play-mark" aria-hidden="true">▶</span>
          <span class="play-label">Play here</span>
        </button>`
      : `<a class="media-poster" href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">
          <img src="${cover}" alt="" loading="lazy" decoding="async">
          <span class="poster-shade" aria-hidden="true"></span>
          <span class="play-label">View original</span>
        </a>`;

    return `
      <article class="case-card${extra}" data-case-id="${esc(item.id)}"${hidden}>
        <div class="case-copy">
          <div class="case-topline">
            <span class="platform">${esc(item.platform)}</span>
            <span class="watch-time">${esc(item.watch)}</span>
          </div>
          <h3>${esc(item.title)}</h3>
          <p class="direction">${esc(item.direction)}</p>
          <div class="case-block">
            <span class="block-label">Why it fits</span>
            <p>${esc(item.overview)}</p>
          </div>
          <div class="case-block">
            <span class="block-label">What to borrow</span>
            <p>${esc(item.learn)}</p>
          </div>
        </div>
        <div class="case-media">
          ${playControl}
          <a class="media-original" href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">Open original ↗</a>
          <small>If the player is unavailable, open the original post.</small>
        </div>
      </article>`;
  }

  function activatePlayers(root) {
    root.querySelectorAll(".play-inline").forEach((button) => {
      button.addEventListener("click", () => {
        const src = button.dataset.embed;
        if (!src) return;
        const shell = document.createElement("div");
        shell.className = "embed-shell";
        const frame = document.createElement("iframe");
        frame.src = src;
        frame.title = button.getAttribute("aria-label") || "Video reference";
        frame.loading = "lazy";
        frame.allow = "autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share";
        frame.allowFullscreen = true;
        shell.append(frame);
        button.replaceWith(shell);
      }, { once: true });
    });

    root.querySelectorAll(".media-poster img").forEach((image) => {
      image.addEventListener("error", () => {
        image.closest(".media-poster")?.classList.add("missing");
        image.remove();
      }, { once: true });
    });
  }

  function renderContentCases(guide) {
    const list = matchingCases(guide.slug)
      .sort((a, b) => {
        const ai = guide.featuredIds.indexOf(a.id);
        const bi = guide.featuredIds.indexOf(b.id);
        const ar = ai < 0 ? 999 : ai;
        const br = bi < 0 ? 999 : bi;
        return ar - br || a.title.localeCompare(b.title);
      });

    const grid = document.querySelector("#case-grid");
    const count = document.querySelector("#content-count");
    const button = document.querySelector("#load-more");

    if (grid) {
      grid.innerHTML = list.map(caseCard).join("");
      activatePlayers(grid);
    }
    if (count) count.textContent = `${list.length} references · updated ${dataset.libraryUpdated}`;

    if (button && list.length > dataset.initialVisible) {
      button.classList.add("is-visible");
      button.textContent = `View all ${list.length} content references`;
      button.addEventListener("click", () => {
        const extras = [...document.querySelectorAll(".case-card.is-extra")];
        const shouldOpen = extras.some((card) => card.hidden);
        extras.forEach((card) => { card.hidden = !shouldOpen; });
        button.textContent = shouldOpen
          ? "Show fewer examples"
          : `View all ${list.length} content references`;
        button.setAttribute("aria-expanded", String(shouldOpen));
        if (!shouldOpen) document.querySelector("#content")?.scrollIntoView({ block: "start" });
      });
    }
  }

  function visualCard(item) {
    const cover = `${assetPrefix}assets/covers/${encodeURIComponent(item.id)}.jpg`;
    return `
      <article class="visual-card">
        <div class="visual-media">
          <span class="visual-badge">Visual reference only</span>
          <img src="${cover}" alt="" loading="lazy" decoding="async">
        </div>
        <div class="visual-copy">
          <h3>${esc(item.title)}</h3>
          <p>${esc(item.visual)}</p>
          <a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">View original →</a>
        </div>
      </article>`;
  }

  function renderVisuals(guide) {
    const row = document.querySelector("#visual-row");
    if (!row) return;
    const items = guide.visualIds.map((id) => caseById.get(id)).filter(Boolean);
    row.innerHTML = items.map(visualCard).join("");
    row.querySelectorAll("img").forEach((image) => {
      image.addEventListener("error", () => {
        image.parentElement?.classList.add("missing");
        image.remove();
      }, { once: true });
    });
  }

  function renderGuide() {
    const guide = guideBySlug.get(currentSlug);
    if (!guide) return;
    renderHero(guide);
    renderAngles(guide);
    renderFlow(guide);
    renderContentCases(guide);
    renderVisuals(guide);
    const footer = document.querySelector("#guide-footer");
    if (footer) footer.textContent = guide.footer;
  }

  renderNav();
  if (isIndex) renderIndex();
  else renderGuide();
})();
