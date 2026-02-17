import React from "react";
import type { HtmlBlock } from "./HtmlBuilderGame";
import "./HtmlBuilderPreview.css";

interface HtmlBuilderPreviewProps {
  blocks: HtmlBlock[];
}

export const HtmlBuilderPreview: React.FC<HtmlBuilderPreviewProps> = ({
  blocks,
}) => {
  const renderBlock = (block: HtmlBlock): React.ReactNode => {
    const Tag = block.tag as React.ElementType;
    const props: any = { key: block.id };
    
    if (block.class) {
      props.className = block.class;
    }

    const defaultText =
      block.tag === "title"
        ? "мій сайт"
        : block.tag === "div" && block.class === "red"
        ? "Червоний блок"
        : block.tag === "div" && block.class === "blue"
          ? "Синій блок"
          : block.tag === "div" && block.class === "green"
            ? "Зелений блок"
          : "";

    const textContent = block.text ?? defaultText;
    const childrenContent = block.children.map(renderBlock);
    const content: React.ReactNode[] = [];

    if (textContent) {
      content.push(textContent);
    }

    if (childrenContent.length > 0) {
      content.push(...childrenContent);
    }

    return React.createElement(Tag, props, content.length > 0 ? content : null);
  };

  return (
    <div className="html-builder-preview">
      <h3 className="preview-title">Твій результат</h3>
      <div className="preview-browser">
        {blocks.length === 0 ? (
          <div className="preview-empty">Додайте блоки щоб побачити результат</div>
        ) : (
          <div className="preview-html-content">
            {blocks.map(renderBlock)}
          </div>
        )}
      </div>
    </div>
  );
};
