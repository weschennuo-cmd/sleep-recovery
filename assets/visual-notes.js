(() => {
  "use strict";

  const dataset = window.POCOCO_GUIDES;
  const cases = Array.isArray(window.POCOCO_CASES) ? window.POCOCO_CASES : [];
  const slug = document.body.dataset.guide;
  const guide = dataset?.guides?.find((item) => item.slug === slug);
  if (!guide) return;

  const esc = (value) => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

  const byId = new Map(cases.map((item) => [item.id, item]));
  const suggestedShots = {
    "DSK_cb-DyaU": "Film the energetic before, the projector switching on, a wide shot of the child in bed, and the visibly quieter after.",
    "DQkYk1mDkzo": "Capture storytime in a wide or medium shot, add a ceiling-projection detail, and keep the child’s genuine final reaction.",
    "DN6H6SVjqU2": "Show the high-input moment first, then parent-child interaction, soft projection, and one calm shared-room wide shot.",
    "DW1ofFNCD5n": "Frame the creator, book, and projection together; add close-ups of page turns and ceiling detail.",
    "DZ-4NZhxlV1": "Lock one reading-corner wide shot, then add hands, the book, soft furnishings, and one clear ceiling-projection detail.",
    "DOyl4ywEVga": "Film the ritual setup, loading the disc, a wide bathroom scene with a person, and reflections or water under the projection.",
    "DOvtftejmco": "Capture the people using the space, a full-room wide shot, comfort objects, and natural interaction between them.",
    "DOgoxg8CdbG": "Show blankets, headphones, or stim tools, the projector setup, the complete room, and the person settling into it.",
    "DYfDKaWsk6l": "Use a short timeline—movement, bath or reading, dinner, then a shared movie—and save the strongest projection for the rest scenes.",
    "DYSE8hvSXEc": "Connect tea, reading, journaling, and film with the same projection backdrop and a consistent color palette.",
    "DPBwFX5Ek1F": "Capture a desk reset, handwriting or page turns, the product or disc, a wide study setup, and close projection details.",
    "DYAjDCVIcpy": "Lock the camera for matching day and night frames, film the switch-on, then add a person entering or working in the transformed room.",
    "DYevdfpxBmO": "Capture one layered room wide, the coordinated accent lights, foreground desk details, and projection across the background.",
    "DLSTk-nxkTD": "Use a wide desk-and-ceiling shot, warm foreground light, a real working or reading action, and close-ups of galaxy and desk textures."
  };

  document.querySelectorAll(".visual-card").forEach((card, index) => {
    const item = byId.get(guide.visualIds[index]);
    const copy = card.querySelector(".visual-copy");
    if (!item || !copy) return;
    const shots = suggestedShots[item.id] || item.learn;
    copy.innerHTML = `
      <h3>${esc(item.title)}</h3>
      <div class="visual-analysis">
        <div class="visual-point">
          <span class="visual-label">Why it works</span>
          <p>${esc(item.visual)}</p>
        </div>
        <div class="visual-point">
          <span class="visual-label">What they captured</span>
          <p>${esc(item.overview)}</p>
        </div>
        <div class="visual-point">
          <span class="visual-label">Suggested shots</span>
          <p>${esc(shots)}</p>
        </div>
      </div>
      <a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">View original →</a>`;
  });
})();
