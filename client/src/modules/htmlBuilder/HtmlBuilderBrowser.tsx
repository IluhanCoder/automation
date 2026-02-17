import React from "react";
import "./HtmlBuilderBrowser.css";

interface HtmlBuilderBrowserProps {
  targetHtml: string;
}

export const HtmlBuilderBrowser: React.FC<HtmlBuilderBrowserProps> = ({
  targetHtml,
}) => {
  const [showCode, setShowCode] = React.useState(false);

  console.log('[HtmlBuilderBrowser] targetHtml:', targetHtml);

  return (
    <div className="html-builder-browser">
      <div className="flex items-center justify-between mb-2">
        <h3 className="browser-title">Завдання - повтори це</h3>
        <button
          onClick={() => setShowCode(!showCode)}
          className="text-xs text-slate-500 hover:text-slate-700 underline"
        >
          {showCode ? "Сховати код" : "Показати код"}
        </button>
      </div>
      <div className="browser-view">
        {!targetHtml ? (
          <div className="text-slate-400 text-center py-8">Завантаження...</div>
        ) : (
          <div 
            className="browser-rendered-html"
            dangerouslySetInnerHTML={{ __html: targetHtml }}
          />
        )}
      </div>
      {showCode && (
        <div className="browser-code">
          <pre>{targetHtml || 'Немає коду'}</pre>
        </div>
      )}
    </div>
  );
};
