import React, { useState } from 'react';

declare global {
  interface Window {
    __draggedBlockData?: string;
    __draggedBlockType?: string;
  }
}

export default function DragDropDebugPage() {
  const [log, setLog] = useState<string[]>([]);
  const [block, setBlock] = useState<{ tag: string; class?: string } | null>(null);

  const addLog = (msg: string) => {
    console.log(msg);
    setLog((prev) => [...prev.slice(-99), msg]); // Keep last 100 lines
  };

  const handleDragStart = (e: React.DragEvent) => {
    const blockData = JSON.stringify({ tag: 'html' });
    addLog(`[dragstart] effectAllowed: ${e.dataTransfer.effectAllowed}`);
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('x-palette-block', blockData);
    addLog(`[dragstart] Set x-palette-block to: ${blockData}`);
    window.__draggedBlockData = blockData;
    window.__draggedBlockType = 'palette';
    addLog('[dragstart] Saved to window');
  };

  const handleDragEnd = () => {
    addLog('[dragend]');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    addLog(`[dragover] dropEffect: ${e.dataTransfer.dropEffect}`);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    addLog(`[drop] Types: ${Array.from(e.dataTransfer.types).join(', ')}`);

    const paletteData = e.dataTransfer.getData('x-palette-block');
    addLog(`[drop] x-palette-block: "${paletteData}"`);

    if (!paletteData && window.__draggedBlockType === 'palette' && window.__draggedBlockData) {
      const data = window.__draggedBlockData;
      addLog(`[drop] Using window fallback: "${data}"`);
      try {
        const b = JSON.parse(data);
        setBlock(b);
        addLog(`[drop] SUCCESS set block: ${JSON.stringify(b)}`);
      } catch (e) {
        addLog(`[drop] ERROR parsing: ${e}`);
      }
    } else if (paletteData) {
      try {
        const b = JSON.parse(paletteData);
        setBlock(b);
        addLog(`[drop] SUCCESS set block: ${JSON.stringify(b)}`);
      } catch (e) {
        addLog(`[drop] ERROR parsing: ${e}`);
      }
    } else {
      addLog('[drop] No data found');
    }
  };

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px', minHeight: '100vh' }}>
      <div style={{ flex: 1 }}>
        <h2>Palette</h2>
        <div
          draggable
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          style={{
            padding: '10px',
            border: '1px solid #333',
            cursor: 'grab',
            backgroundColor: '#f0f0f0',
            marginBottom: '20px',
          }}
        >
          &lt;html&gt;
        </div>
      </div>

      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{
          flex: 1,
          border: '2px dashed #ccc',
          padding: '20px',
          minHeight: '400px',
          backgroundColor: '#fafafa',
        }}
      >
        <h2>Constructor</h2>
        {block ? (
          <div style={{ padding: '10px', border: '1px solid #333', backgroundColor: '#fff' }}>
            &lt;{block.tag}&gt;
          </div>
        ) : (
          <p style={{ color: '#999' }}>Drop items here...</p>
        )}
      </div>

      <div
        style={{
          flex: 1,
          backgroundColor: '#222',
          color: '#0f0',
          border: '1px solid #0f0',
          overflow: 'auto',
          fontFamily: 'monospace',
          fontSize: '12px',
          padding: '10px',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
        }}
      >
        <h2 style={{ color: '#0f0' }}>Log</h2>
        {log.map((line, idx) => (
          <div key={idx}>{line}</div>
        ))}
      </div>
    </div>
  );
}
