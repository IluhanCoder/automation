import React, { useState, useEffect } from "react";
import { HtmlBuilderPalette } from "./HtmlBuilderPalette";
import { HtmlBuilderField } from "./HtmlBuilderField";
import { HtmlBuilderPreview } from "./HtmlBuilderPreview";
import { HtmlBuilderBrowser } from "./HtmlBuilderBrowser";
import "./HtmlBuilderGame.css";

export interface HtmlBlock {
  id: string;
  tag: string;
  class?: string;
  text?: string;
  children: HtmlBlock[];
}

interface HtmlBuilderGameProps {
  question?: {
    levelId: number;
    title: string;
    description: string;
    targetHtml: string;
    rules: string[];
  };
  onSubmit?: (html: string) => void;
  isLoading?: boolean;
}

export const HtmlBuilderGame: React.FC<HtmlBuilderGameProps> = ({
  question,
  onSubmit,
  isLoading = false,
}) => {
  const [blocks, setBlocks] = useState<HtmlBlock[]>([]);

  // Clear blocks when question changes (new level)
  useEffect(() => {
    setBlocks([]);
  }, [question?.levelId]);

  console.log('[HtmlBuilderGame] Rendering with question:', question)

  const handleUpdateBlocks = (updatedBlocks: HtmlBlock[]) => {
    setBlocks(updatedBlocks);
  };

  // Calculate which block types are already used
  const getUsedBlockTypes = (): Set<string> => {
    const used = new Set<string>();
    
    const walkBlocks = (blockArray: HtmlBlock[]) => {
      blockArray.forEach(block => {
        const key = `${block.tag}${block.class ? `-${block.class}` : ''}`;
        used.add(key);
        if (block.children.length > 0) {
          walkBlocks(block.children);
        }
      });
    };
    
    walkBlocks(blocks);
    return used;
  };

  const generateHtml = (block: HtmlBlock): string => {
    const classAttr = block.class ? ` class="${block.class}"` : "";
    const defaultText =
      block.tag === "title"
        ? "мій сайт"
        : block.tag === "h1"
        ? "всесвітня історія"
        : block.tag === "p"
          ? "просто абзац з текстом"
          : block.tag === "div" && block.class === "red"
          ? "Червоний блок"
          : block.tag === "div" && block.class === "blue"
            ? "Синій блок"
            : block.tag === "div" && block.class === "green"
              ? "Зелений блок"
            : "";

    const textContent = block.text ?? defaultText;
    const childrenHtml = block.children.map(generateHtml).join("");
    const content = `${textContent}${childrenHtml}`;
    
    return `<${block.tag}${classAttr}>${content}</${block.tag}>`;
  };

  const getFullHtml = (): string => {
    return blocks.map(generateHtml).join("");
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(getFullHtml());
    }
  };

  const showGreenBlock = question?.targetHtml.includes('class="green"') ?? false;

  return (
    <div className="html-builder-container">
      {/* Top row: Task (Browser) | Preview */}
      <div className="html-builder-top-section">
        <div className="html-builder-browser-section">
          {question && <HtmlBuilderBrowser targetHtml={question.targetHtml} />}
        </div>
        <div className="html-builder-preview-section">
          <HtmlBuilderPreview blocks={blocks} />
        </div>
      </div>

      {/* Bottom row: Palette | Constructor */}
      <div className="html-builder-bottom-section">
        <div className="html-builder-palette-section">
          <HtmlBuilderPalette 
            usedBlockTypes={getUsedBlockTypes()}
            showGreenBlock={showGreenBlock}
          />
        </div>

        <div className="html-builder-constructor-section">
          <HtmlBuilderField
            blocks={blocks}
            onBlocksChange={handleUpdateBlocks}
          />
          <button
            className="html-builder-submit"
            onClick={handleSubmit}
            disabled={isLoading || blocks.length === 0}
          >
            {isLoading ? "Перевіряємо..." : "Перевірити"}
          </button>
        </div>
      </div>
    </div>
  );
};
