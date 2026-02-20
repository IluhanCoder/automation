import React from "react";
import "./HtmlBuilderPalette.css";

const AVAILABLE_BLOCKS = [
  { id: "block-html", tag: "html" },
  { id: "block-head", tag: "head" },
  { id: "block-body", tag: "body" },
  { id: "block-title", tag: "title" },
  { id: "block-div-red", tag: "div", class: "red" },
  { id: "block-div-blue", tag: "div", class: "blue" },
  { id: "block-div-green", tag: "div", class: "green" },
  { id: "block-h1", tag: "h1", text: "всесвітня історія" },
  { id: "block-p", tag: "p", text: "просто абзац з текстом" },
];

interface HtmlBuilderPaletteProps {
  usedBlockTypes: Set<string>;
  showGreenBlock?: boolean;
}

export const HtmlBuilderPalette: React.FC<HtmlBuilderPaletteProps> = ({
  usedBlockTypes,
  showGreenBlock = true,
}) => {
  const isOuterBlock = (tag: string) => tag === "html" || tag === "head" || tag === "body";

  const getTagColor = (tag: string, className?: string) => {
    if (className === "red") return "#ef4444";
    if (className === "blue") return "#3b82f6";
    if (className === "green") return "#16a34a";
    if (isOuterBlock(tag)) return "#047857";
    return "#334155";
  };

  // Filter available blocks - only show blocks that haven't been used yet
  const availableBlocks = AVAILABLE_BLOCKS.filter(block => {
    if (block.class === "green" && !showGreenBlock) {
      return false;
    }
    const key = `${block.tag}${block.class ? `-${block.class}` : ''}`;
    return !usedBlockTypes.has(key);
  });

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    templateId: string
  ) => {
    console.log("🎬 Palette drag start:", templateId);
    e.dataTransfer.effectAllowed = "move";
    const payload = { source: "palette", templateId };
    const raw = JSON.stringify(payload);
    console.log("📦 Setting data:", { payload, raw });
    e.dataTransfer.setData("application/json", raw);
    e.dataTransfer.setData("text/plain", raw);
  };

  return (
    <div className="html-builder-palette">
      <h3 className="palette-title">Блоки HTML</h3>
      <div className="palette-grid">
        {availableBlocks.length > 0 ? (
          availableBlocks.map((block) => (
            <div
              key={block.id}
              className={`cursor-grab rounded-2xl border-2 px-3 py-2 whitespace-nowrap transition hover:shadow-md active:cursor-grabbing ${
                isOuterBlock(block.tag)
                  ? "border-emerald-300 bg-emerald-50"
                  : "border-slate-400 bg-slate-50"
              }`}
              draggable
              onDragStart={(e) => handleDragStart(e, block.id)}
            >
              <div className="palette-tag">
                {block.tag === "title" ? (
                  <span className="text-sm font-semibold" style={{ color: getTagColor(block.tag, block.class) }}>
                    {"<title>мій сайт</title>"}
                  </span>
                ) : block.tag === "h1" ? (
                  <span className="text-sm font-semibold" style={{ color: getTagColor(block.tag, block.class) }}>
                    {"<h1>всесвітня історія</h1>"}
                  </span>
                ) : block.tag === "p" ? (
                  <span className="text-sm font-semibold" style={{ color: getTagColor(block.tag, block.class) }}>
                    {"<p>просто абзац з текстом</p>"}
                  </span>
                ) : (
                  <>
                    <span className="text-sm font-semibold" style={{ color: getTagColor(block.tag, block.class) }}>
                      {`<${block.tag}${block.class ? ` class="${block.class}"` : ""}>`}
                    </span>
                    <span className="text-slate-500">...</span>
                    <span className="text-sm font-semibold" style={{ color: getTagColor(block.tag, block.class) }}>
                      {`</${block.tag}>`}
                    </span>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="palette-empty">Усі блоки використовуються</div>
        )}
      </div>
    </div>
  );
};
