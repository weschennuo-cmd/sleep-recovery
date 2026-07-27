(() => {
  "use strict";

  const cases = Array.isArray(window.POCOCO_CASES) ? window.POCOCO_CASES : [];
  const dataset = window.POCOCO_GUIDES;
  const slug = document.body.dataset.guide;
  const guide = dataset?.guides?.find((item) => item.slug === slug);
  if (!guide) return;

  const byId = new Map(cases.map((item) => [item.id, item]));

  function embedUrl(item) {
    const url = String(item?.url || "");
    const platform = String(item?.platform || "").toLowerCase();
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

  document.querySelectorAll(".case-media small").forEach((note) => note.remove());
  document.querySelectorAll(".case-media .media-original").forEach((link) => {
    link.textContent = "Watch original video ↗";
  });

  document.querySelectorAll(".visual-card").forEach((card, index) => {
    const item = byId.get(guide.visualIds[index]);
    const media = card.querySelector(".visual-media");
    const image = media?.querySelector("img");
    if (!item || !media || !image) return;

    const src = image.getAttribute("src") || "";
    const embed = embedUrl(item);
    media.innerHTML = `
      <button class="visual-poster" type="button" aria-label="Play ${item.title.replaceAll('"', "&quot;")}">
        <img src="${src.replaceAll('"', "&quot;")}" alt="" loading="lazy" decoding="async">
        <span class="visual-badge">Visual reference · Play here</span>
        <span class="visual-play-mark" aria-hidden="true">▶</span>
        <span class="visual-play-label">Play visual reference</span>
      </button>`;

    const button = media.querySelector(".visual-poster");
    if (!embed) {
      button.addEventListener("click", () => window.open(item.url, "_blank", "noopener"));
      return;
    }

    button.addEventListener("click", () => {
      const shell = document.createElement("div");
      shell.className = "visual-embed-shell";
      const frame = document.createElement("iframe");
      frame.src = embed;
      frame.title = `Video reference: ${item.title}`;
      frame.loading = "lazy";
      frame.allow = "autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share";
      frame.allowFullscreen = true;
      shell.append(frame);
      button.replaceWith(shell);
    }, { once: true });
  });
})();
