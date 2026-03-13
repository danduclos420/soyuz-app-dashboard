'use client';

import { useEffect, useRef, useState } from 'react';
import { useDevStore } from '@/lib/store/dev';

export default function WixModeManager() {
  const { isWixModeActive, setSelectedElementId, selectedElementId, updateElementStyle, setElementTree } = useDevStore();
  const activeElement = useRef<HTMLElement | null>(null);
  const resizeType = useRef<string | null>(null);
  const offset = useRef({ x: 0, y: 0 });
  const initialRect = useRef<DOMRect | null>(null);

  // TREE SCANNER
  useEffect(() => {
    if (!isWixModeActive) return;

    const scan = () => {
      const tree: any[] = [];
      const editableElements = document.querySelectorAll('section, div, article, button, h1, h2, h3, p, img');
      
      editableElements.forEach((el) => {
        // EXCLUSIONS
        if (el.closest('header') || el.closest('.fixed')) return;
        
        let wixId = el.getAttribute('data-wix-id');
        if (!wixId) {
          wixId = `wix-${Math.random().toString(36).substring(2, 9)}`;
          el.setAttribute('data-wix-id', wixId);
        }

        tree.push({
          id: wixId,
          tagName: el.tagName,
          text: (el as HTMLElement).innerText?.substring(0, 20) || '',
          className: el.className,
          children: [] // We could do full recursive tree, but let's start flat-list or shallow
        });
      });
      setElementTree(tree);
    };

    scan();
    const interval = setInterval(scan, 2000); // Re-scan periodically for dynamic content
    return () => clearInterval(interval);
  }, [isWixModeActive, setElementTree]);

  useEffect(() => {
    if (!isWixModeActive) {
      document.body.classList.remove('wix-mode-active');
      return;
    }

    document.body.classList.add('wix-mode-active');

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      
      // EXCLUSION
      if (target.closest('header')) return;
      if (target.closest('.fixed')) return;
      
      if (target.closest('.wix-resize-handle')) {
        const handle = target.closest('.wix-resize-handle') as HTMLElement;
        resizeType.current = handle.getAttribute('data-handle');
        const parentId = handle.getAttribute('data-parent-id');
        const parent = document.querySelector(`[data-wix-id="${parentId}"]`) as HTMLElement;
        if (parent) {
          activeElement.current = parent;
          initialRect.current = parent.getBoundingClientRect();
          offset.current = { x: e.clientX, y: e.clientY };
          e.preventDefault();
          e.stopPropagation();
        }
        return;
      }

      // SMART GROUPING: If Alt is held, select the parent container instead of the leaf
      let el = target;
      if (e.altKey) {
        el = el.parentElement as HTMLElement;
        while (el && el !== document.body && !['SECTION', 'DIV', 'ARTICLE'].includes(el.tagName)) {
           el = el.parentElement as HTMLElement;
        }
      } else {
        while (el && el !== document.body && !['DIV', 'SECTION', 'ARTICLE', 'IMG', 'SPAN', 'P', 'H1', 'H2', 'H3', 'BUTTON'].includes(el.tagName)) {
          el = el.parentElement as HTMLElement;
        }
      }

      if (el && el !== document.body) {
        if (!el.getAttribute('data-wix-id')) {
          const id = `wix-${Math.random().toString(36).substring(2, 9)}`;
          el.setAttribute('data-wix-id', id);
        }
        
        const wixId = el.getAttribute('data-wix-id')!;
        setSelectedElementId(wixId);

        activeElement.current = el;
        el.style.transition = 'none';
        el.style.zIndex = '9999';
        el.style.cursor = 'grabbing';
        
        const rect = el.getBoundingClientRect();
        offset.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        };
        
        const style = window.getComputedStyle(el);
        if (style.position === 'static') el.style.position = 'relative';

        e.preventDefault();
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!activeElement.current) return;

      const el = activeElement.current;
      
      if (resizeType.current) {
        const dx = e.clientX - offset.current.x;
        const dy = e.clientY - offset.current.y;
        const rect = initialRect.current!;

        if (resizeType.current.includes('right')) el.style.width = `${rect.width + dx}px`;
        if (resizeType.current.includes('bottom')) el.style.height = `${rect.height + dy}px`;
        if (resizeType.current.includes('left')) {
          el.style.width = `${rect.width - dx}px`;
          el.style.left = `${(parseInt(el.style.left) || 0) + dx}px`;
        }
        if (resizeType.current.includes('top')) {
          el.style.height = `${rect.height - dy}px`;
          el.style.top = `${(parseInt(el.style.top) || 0) + dy}px`;
        }
        return;
      }

      const parent = el.parentElement || document.body;
      const parentRect = parent.getBoundingClientRect();
      
      // Calculate percentage for responsiveness
      const xPercent = ((e.clientX - parentRect.left - offset.current.x) / parentRect.width) * 100;
      const yPercent = ((e.clientY - parentRect.top - offset.current.y) / parentRect.height) * 100;

      el.style.position = 'absolute';
      el.style.left = `${xPercent}%`;
      el.style.top = `${yPercent}%`;
      el.style.margin = '0';
    };

    const handlePointerUp = () => {
      if (activeElement.current) {
        const el = activeElement.current;
        const wixId = el.getAttribute('data-wix-id');
        if (wixId) {
          updateElementStyle(wixId, {
            width: el.style.width,
            height: el.style.height,
            top: el.style.top,
            left: el.style.left
          });
        }
        el.style.cursor = '';
        activeElement.current = null;
        resizeType.current = null;
      }
    };

    const handleDoubleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('header')) return;
      if (target.closest('.fixed.bottom-6.right-6')) return;
      if (target.closest('.fixed.top-24.right-6')) return;

      const currentText = target.innerText;
      const newText = prompt('ÉDITER LE TEXTE:', currentText);
      if (newText !== null) {
        target.innerText = newText;
      }
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('dblclick', handleDoubleClick);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('dblclick', handleDoubleClick);
      document.body.classList.remove('wix-mode-active');
    };
  }, [isWixModeActive, setSelectedElementId]);

  return (
    <>
      {isWixModeActive && selectedElementId && (
        <ResizeHandles wixId={selectedElementId} />
      )}
      <style jsx global>{`
        .wix-mode-active * {
          cursor: grab !important;
          outline: 1px solid transparent;
          transition: outline 0.2s;
        }
        .wix-mode-active *:hover {
          outline: 2px solid rgba(255, 0, 0, 0.4) !important;
          outline-offset: -2px;
        }
        .wix-mode-active [data-wix-id="${selectedElementId}"] {
          outline: 3px solid #CC0000 !important;
          outline-offset: -2px;
          box-shadow: 0 0 20px rgba(255, 0, 0, 0.3);
        }
        .wix-mode-active header, 
        .wix-mode-active header * {
          cursor: default !important;
          user-select: auto !important;
          outline: none !important;
        }
        .wix-mode-active .fixed.bottom-6.right-6,
        .wix-mode-active .fixed.bottom-6.right-6 *,
        .wix-mode-active .fixed.top-24.right-6,
        .wix-mode-active .fixed.top-24.right-6 * {
          cursor: pointer !important;
          outline: none !important;
        }

        .wix-resize-handle {
          position: fixed;
          width: 10px;
          height: 10px;
          background: #CC0000;
          border: 2px solid white;
          border-radius: 50%;
          z-index: 10000;
          cursor: pointer !important;
          box-shadow: 0 0 10px rgba(0,0,0,0.5);
        }
        .wix-resize-handle:hover {
          scale: 1.5;
          background: white;
          border-color: #CC0000;
        }
      `}</style>
    </>
  );
}

function ResizeHandles({ wixId }: { wixId: string }) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const update = () => {
      const el = document.querySelector(`[data-wix-id="${wixId}"]`);
      if (el) setRect(el.getBoundingClientRect());
    };
    update();
    const interval = setInterval(update, 16);
    return () => clearInterval(interval);
  }, [wixId]);

  if (!rect) return null;

  const handles = [
    { type: 'top-left', cursor: 'nw-resize', top: rect.top, left: rect.left },
    { type: 'top-right', cursor: 'ne-resize', top: rect.top, left: rect.right },
    { type: 'bottom-left', cursor: 'sw-resize', top: rect.bottom, left: rect.left },
    { type: 'bottom-right', cursor: 'se-resize', top: rect.bottom, left: rect.right },
    { type: 'top', cursor: 'n-resize', top: rect.top, left: rect.left + rect.width / 2 },
    { type: 'bottom', cursor: 's-resize', top: rect.bottom, left: rect.left + rect.width / 2 },
    { type: 'left', cursor: 'w-resize', top: rect.top + rect.height / 2, left: rect.left },
    { type: 'right', cursor: 'e-resize', top: rect.top + rect.height / 2, left: rect.right },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {handles.map(h => (
        <div
          key={h.type}
          className="wix-resize-handle pointer-events-auto"
          data-handle={h.type}
          data-parent-id={wixId}
          style={{
            top: h.top,
            left: h.left,
            transform: 'translate(-50%, -50%)',
            cursor: h.cursor
          }}
        />
      ))}
    </div>
  );
}
