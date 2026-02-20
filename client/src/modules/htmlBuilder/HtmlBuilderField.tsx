import React, { useState, useRef } from "react";
import type { HtmlBlock } from "./HtmlBuilderGame";
import "./HtmlBuilderField.css";

declare global {
  interface Window {
    __draggedBlockPath?: number[];
    __draggedFromPalette?: boolean;
    __draggedTemplateId?: string;
  }
}

// Must match palette templates
const BLOCK_TEMPLATES: Record<string, { tag: string; class?: string; text?: string }> = {
  "block-html": { tag: "html" },
  "block-head": { tag: "head" },
  "block-body": { tag: "body" },
  "block-title": { tag: "title", text: "мій сайт" },
  "block-div-red": { tag: "div", class: "red" },
  "block-div-blue": { tag: "div", class: "blue" },
  "block-div-green": { tag: "div", class: "green" },
  "block-h1": { tag: "h1", text: "всесвітня історія" },
  "block-p": { tag: "p", text: "просто абзац з текстом" },
};

type DragPayload =
  | { source: "palette"; templateId: string }
  | { source: "field"; path: number[] };

interface HtmlBuilderFieldProps {
  blocks: HtmlBlock[];
  onBlocksChange: (blocks: HtmlBlock[]) => void;
}

export const HtmlBuilderField: React.FC<HtmlBuilderFieldProps> = ({
  blocks,
  onBlocksChange,
}) => {
  const getTagColor = (className?: string) => {
    if (className === "red") return "#ef4444";
    if (className === "blue") return "#3b82f6";
    if (className === "green") return "#16a34a";
    return "#334155";
  };

  const [hoverZone, setHoverZone] = useState<string | null>(null);

  // Track successful drops - if no drop-zone was activated, block gets deleted
  const dragPayloadRef = useRef<DragPayload | null>(null);
  const dropSuccessfulRef = useRef(false);

  const parseDragPayload = (event: React.DragEvent<HTMLDivElement>): DragPayload | null => {
    const jsonRaw = event.dataTransfer.getData("application/json");
    const textRaw = event.dataTransfer.getData("text/plain");
    const raw = jsonRaw || textRaw;
    console.log("📦 parseDragPayload:", { jsonRaw, textRaw, raw });
    if (raw) {
      try {
        const payload = JSON.parse(raw) as DragPayload;
        dragPayloadRef.current = payload;
        console.log("✅ Payload parsed:", payload);
        return payload;
      } catch {
        console.log("❌ Parse error, using ref:", dragPayloadRef.current);
        return dragPayloadRef.current;
      }
    }
    console.log("❌ No raw data, using ref:", dragPayloadRef.current);
    return dragPayloadRef.current;
  };

  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    payload: DragPayload
  ) => {
    console.log("🎬 handleDragStart:", payload);
    event.stopPropagation();
    event.dataTransfer.effectAllowed = "move";
    const raw = JSON.stringify(payload);
    event.dataTransfer.setData("application/json", raw);
    event.dataTransfer.setData("text/plain", raw);
    dragPayloadRef.current = payload;
    dropSuccessfulRef.current = false;
  };

  type RemoveResult = { node: HtmlBlock | null; next: HtmlBlock[] };

  const removeNodeAtPath = (
    nodes: HtmlBlock[],
    path: number[]
  ): RemoveResult => {
    if (path.length === 0) {
      return { node: null, next: nodes };
    }

    const index = path[0];
    if (path.length === 1) {
      const node = nodes[index] ?? null;
      const next = nodes.filter((_, i) => i !== index);
      return { node, next };
    }

    const current = nodes[index];
    if (!current) {
      return { node: null, next: nodes };
    }

    const result = removeNodeAtPath(current.children, path.slice(1));
    const nextNodes = [...nodes];
    nextNodes[index] = { ...current, children: result.next };
    return { node: result.node, next: nextNodes };
  };

  const insertNodeAtPath = (
    nodes: HtmlBlock[],
    path: number[],
    node: HtmlBlock,
    position: "before" | "inside"
  ): HtmlBlock[] => {
    if (position === "inside") {
      if (path.length === 0) {
        return [...nodes, node];
      }
      const index = path[0];
      const current = nodes[index];
      if (!current) {
        return nodes;
      }
      const nextChildren = insertNodeAtPath(
        current.children,
        path.slice(1),
        node,
        "inside"
      );
      const next = [...nodes];
      next[index] = { ...current, children: nextChildren };
      return next;
    }

    if (path.length === 0) {
      return [node, ...nodes];
    }

    const index = path[0];
    if (path.length === 1) {
      const next = [...nodes];
      next.splice(index, 0, node);
      return next;
    }

    const current = nodes[index];
    if (!current) {
      return nodes;
    }
    const nextChildren = insertNodeAtPath(
      current.children,
      path.slice(1),
      node,
      position
    );
    const next = [...nodes];
    next[index] = { ...current, children: nextChildren };
    return next;
  };

  const insertNodeInsideAtIndex = (
    nodes: HtmlBlock[],
    path: number[],
    node: HtmlBlock,
    childIndex: number
  ): HtmlBlock[] => {
    if (path.length === 0) {
      const next = [...nodes];
      next.splice(childIndex, 0, node);
      return next;
    }

    const index = path[0];
    const current = nodes[index];
    if (!current) {
      return nodes;
    }

    if (path.length === 1) {
      const nextChildren = [...current.children];
      nextChildren.splice(childIndex, 0, node);
      const next = [...nodes];
      next[index] = { ...current, children: nextChildren };
      return next;
    }

    const nextChildren = insertNodeInsideAtIndex(
      current.children,
      path.slice(1),
      node,
      childIndex
    );
    const next = [...nodes];
    next[index] = { ...current, children: nextChildren };
    return next;
  };

  const createBlock = (templateId: string): HtmlBlock | null => {
    const template = BLOCK_TEMPLATES[templateId];
    if (!template) return null;

    return {
      id: `block-${Date.now()}-${Math.random()}`,
      tag: template.tag,
      class: template.class,
      text: template.text,
      children: [],
    };
  };

  const handleDragEnd = () => {
    setHoverZone(null);

    // If drop was unsuccessful and it was from the field, delete the block
    if (!dropSuccessfulRef.current && dragPayloadRef.current) {
      const payload = dragPayloadRef.current;

      if (payload.source === "field") {
        const removed = removeNodeAtPath(blocks, payload.path);
        if (removed.node) {
          onBlocksChange(removed.next);
        }
      }
    }

    dropSuccessfulRef.current = false;
    dragPayloadRef.current = null;
  };

  const isDescendantPath = (targetPath: number[], sourcePath: number[]): boolean => {
    if (targetPath.length <= sourcePath.length) {
      return false;
    }
    return sourcePath.every((value, index) => value === targetPath[index]);
  };

  const moveNodeTo = (
    payload: DragPayload,
    targetParentPath: number[],
    targetIndex: number
  ) => {
    // New block from palette
    if (payload.source === "palette") {
      const block = createBlock(payload.templateId);
      if (!block) return;

      const updated = insertNodeInsideAtIndex(
        blocks,
        targetParentPath,
        block,
        targetIndex
      );
      onBlocksChange(updated);
      return;
    }

    // Move existing field block
    let adjustedTargetParent = targetParentPath;
    const movingParentPath = payload.path.slice(0, -1);

    // Check if moving within same sibling list (same parent and same depth)
    if (
      movingParentPath.length === targetParentPath.length &&
      movingParentPath.every(
        (value, index) => value === targetParentPath[index]
      )
    ) {
      const movingIndex = payload.path[payload.path.length - 1];
      const targetIndexAtParent = targetParentPath[movingParentPath.length];

      if (
        typeof targetIndexAtParent === "number" &&
        movingIndex < targetIndexAtParent
      ) {
        adjustedTargetParent = [...targetParentPath];
        adjustedTargetParent[movingParentPath.length] = targetIndexAtParent - 1;
      }
    }

    // Check if moving INTO a sibling block (targetParent is one level deeper)
    if (targetParentPath.length === movingParentPath.length + 1) {
      const targetParentOfTarget = targetParentPath.slice(0, -1);
      if (
        targetParentOfTarget.every(
          (value, index) => value === movingParentPath[index]
        )
      ) {
        // They share the same parent - check if we need to adjust
        const movingIndex = payload.path[payload.path.length - 1];
        const targetBlockIndex = targetParentPath[targetParentPath.length - 1];
        
        if (movingIndex < targetBlockIndex) {
          // After removing moving block, target block will shift down
          adjustedTargetParent = [...targetParentPath];
          adjustedTargetParent[adjustedTargetParent.length - 1] = targetBlockIndex - 1;
        }
      }
    }

    // Check for invalid moves (self or descendant)
    // Use original targetParentPath for validation, not adjustedTargetParent
    const isSelfOrDescendant =
      targetParentPath.length >= payload.path.length &&
      payload.path.every((value, index) => value === targetParentPath[index]);
    const isDescendant = isDescendantPath(targetParentPath, payload.path);

    console.log("🔍 Move validation:", {
      "payload.path": JSON.stringify(payload.path),
      "targetParentPath": JSON.stringify(targetParentPath),
      "adjustedTargetParent": JSON.stringify(adjustedTargetParent),
      "movingParentPath": JSON.stringify(movingParentPath),
      isSelfOrDescendant,
      isDescendant,
      "length comparison": `${targetParentPath.length} >= ${payload.path.length}`,
      "every check": payload.path.every((value, index) => value === targetParentPath[index])
    });

    if (isSelfOrDescendant || isDescendant) {
      console.log("❌ Invalid move detected - returning early");
      return;
    }

    const removed = removeNodeAtPath(blocks, payload.path);
    if (!removed.node) {
      return;
    }

    let nextIndex = targetIndex;
    const sameParent =
      payload.path.length === targetParentPath.length + 1 &&
      payload.path
        .slice(0, -1)
        .every((value, index) => value === targetParentPath[index]);

    if (sameParent) {
      const movingIndex = payload.path[payload.path.length - 1];
      if (movingIndex < nextIndex) {
        nextIndex -= 1;
      }
    }

    const updated = insertNodeInsideAtIndex(
      removed.next,
      adjustedTargetParent,
      removed.node,
      nextIndex
    );
    onBlocksChange(updated);
  };

  const handleDropTo = (
    event: React.DragEvent<HTMLDivElement>,
    parentPath: number[],
    insertIndex: number
  ) => {
    console.log("🎯 handleDropTo called:", { parentPath, insertIndex });
    event.preventDefault();
    event.stopPropagation();
    const payload = parseDragPayload(event);
    if (!payload) {
      console.log("❌ No payload found in handleDropTo");
      return;
    }
    console.log("✅ Payload found, moving:", payload);
    setHoverZone(null);
    dropSuccessfulRef.current = true;
    moveNodeTo(payload, parentPath, insertIndex);
  };

  const handleRemoveBlock = (id: string) => {
    const removeFromArray = (arr: HtmlBlock[]): HtmlBlock[] => {
      return arr
        .filter((b) => b.id !== id)
        .map((b) => ({
          ...b,
          children: removeFromArray(b.children),
        }));
    };
    onBlocksChange(removeFromArray(blocks));
  };

  const renderBlock = (
    block: HtmlBlock,
    path: number[],
    depth: number = 0
  ): React.ReactNode => {
    const hasChildren = block.children.length > 0;
    const pathStr = path.join("-");
    const slotKey = (slotIndex: number) => `inside-slot:${pathStr}:${slotIndex}`;
    const inlineClosing =
      block.tag === "img" ||
      block.tag === "br" ||
      block.tag === "hr" ||
      block.tag === "input";
    const canHaveChildren = !inlineClosing && block.tag !== "title" && block.tag !== "h1" && block.tag !== "p";

    const renderInsideSlot = (slotIndex: number) => (
      <div
        className={`rounded transition ${
          hoverZone === slotKey(slotIndex) 
            ? "h-8 bg-emerald-300 border-2 border-emerald-400" 
            : "h-3 bg-transparent border-0"
        }`}
        data-slot-index={slotIndex}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          e.dataTransfer.dropEffect = "move";
          setHoverZone(slotKey(slotIndex));
        }}
        onDrop={(e) => handleDropTo(e, path, slotIndex)}
      />
    );

    return (
      <div
        className="rounded-2xl border-2 border-slate-400 bg-slate-50 px-3 py-2"
        style={{ marginLeft: `${path.length * 16}px` }}
        data-node-path={pathStr}
        draggable
        onDragStart={(e) => handleDragStart(e, { source: "field", path })}
        onDragEnd={handleDragEnd}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          e.dataTransfer.dropEffect = "move";
        }}
        key={block.id}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold" style={{ color: getTagColor(block.class) }}>
            {block.tag === "title"
              ? `<title>${block.text ?? "мій сайт"}</title>`
              : `<${block.tag}${block.class ? ` class="${block.class}"` : ""}>`}
          </span>
          <button
            className="ml-2 text-slate-400 hover:text-rose-600 transition"
            onClick={() => handleRemoveBlock(block.id)}
            title="Видалити"
          >
            ✕
          </button>
        </div>

        {canHaveChildren && hasChildren && (
          <div className="mt-1 space-y-1">
            {renderInsideSlot(0)}
            {block.children.map((child, childIndex) => (
              <React.Fragment key={child.id}>
                {renderBlock(child, [...path, childIndex], depth + 1)}
                {renderInsideSlot(childIndex + 1)}
              </React.Fragment>
            ))}
          </div>
        )}

        {!hasChildren && canHaveChildren ? (
          <div
            className={`mt-1 rounded-xl border border-dashed px-2 py-1 text-xs transition ${
              hoverZone === slotKey(0)
                ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                : "border-slate-200 text-slate-400"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.dataTransfer.dropEffect = "move";
              setHoverZone(slotKey(0));
            }}
            onDrop={(e) => handleDropTo(e, path, 0)}
          >
            Перетягніть тег всередину цього блоку
          </div>
        ) : null}

        {block.tag !== "title" ? (
          <div className="mt-2">
            {!inlineClosing ? (
              <span className="text-sm font-semibold" style={{ color: getTagColor(block.class) }}>
                {`</${block.tag}>`}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  };

  const renderRootDropZone = (position: number) => (
    <div
      className={`rounded transition-all ${
        hoverZone === `root:${position}` 
          ? "h-10 bg-emerald-300 border-2 border-emerald-400" 
          : "h-3 bg-transparent border-0"
      }`}
      data-drop-zone={`root:${position}`}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = "move";
        console.log("🎯 Root drop-zone onDragOver:", position);
        setHoverZone(`root:${position}`);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("👋 Root drop-zone onDragLeave:", position);
        setHoverZone(null);
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("💧 Root drop-zone onDrop:", position);
        handleDropTo(e, [], position);
      }}
    />
  );

  return (
    <div className="flex flex-col gap-2 w-full flex-1 overflow-hidden">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-0">Конструктор</h3>
      <div className="flex-1 overflow-y-auto bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg p-3 space-y-2">
        {blocks.length === 0 ? (
          <div
            className={`flex items-center justify-center rounded-lg border-2 border-dashed transition-all min-h-48 ${
              hoverZone === 'root:0'
                ? 'bg-emerald-100 border-emerald-400'
                : 'bg-white border-slate-300'
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.dataTransfer.dropEffect = "move";
              console.log("🎯 Empty field drop-zone onDragOver");
              setHoverZone('root:0');
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("👋 Empty field drop-zone onDragLeave");
              setHoverZone(null);
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("💧 Empty field drop-zone onDrop");
              handleDropTo(e, [], 0);
            }}
          >
            <div className="text-slate-400 text-center text-sm">
              Перетягніть блоки сюди
            </div>
          </div>
        ) : (
          <>
            {renderRootDropZone(0)}
            {blocks.map((block, idx) => (
              <React.Fragment key={block.id}>
                {renderBlock(block, [idx])}
                {renderRootDropZone(idx + 1)}
              </React.Fragment>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
