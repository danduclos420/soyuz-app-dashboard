'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useDevStore } from '@/lib/store/dev';
import { X, Type, Move, RotateCcw, Maximize, Palette, Layers, Box, Info, Code, ChevronRight, ChevronDown, Minus, GripHorizontal } from 'lucide-react';
import { useState } from 'react';

const premiumFonts = [
  { name: 'Archivo Black', value: '"Archivo Black", sans-serif' },
  { name: 'Great Vibes', value: '"Great Vibes", cursive' },
  { name: 'Playball', value: '"Playball", cursive' },
  { name: 'Bebas Neue', value: '"Bebas Neue", sans-serif' },
  { name: 'Orbitron', value: '"Orbitron", sans-serif' },
  { name: 'Goldman', value: '"Goldman", cursive' },
  { name: 'Michroma', value: '"Michroma", sans-serif' },
  { name: 'Syncopate', value: '"Syncopate", sans-serif' }
];

export default function StudioSidebar() {
  const { isWixModeActive, selectedElementId, setSelectedElementId, elementStyles, updateElementStyle, elementTree } = useDevStore();
  const [activeTab, setActiveTab] = useState<'props' | 'tree' | 'style' | 'layout'>('props');
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isWixModeActive) return null;

  const currentStyle = (selectedElementId ? elementStyles[selectedElementId] : {}) || {};

  const handleStyleChange = (key: string, value: any) => {
    if (!selectedElementId) return;
    updateElementStyle(selectedElementId, { [key]: value });
    
    // Apply immediately to the DOM element
    const el = document.querySelector(`[data-wix-id="${selectedElementId}"]`) as HTMLElement;
    if (el) {
      if (key === 'fontSize') el.style.fontSize = `${value}px`;
      if (key === 'fontFamily') el.style.fontFamily = value;
      if (key === 'color') el.style.color = value;
      if (key === 'opacity') el.style.opacity = value;
      if (key === 'width') el.style.width = value;
      if (key === 'height') el.style.height = value;
      if (key === 'borderRadius') el.style.borderRadius = `${value}px`;
      if (key === 'letterSpacing') el.style.letterSpacing = `${value}px`;
      if (key === 'boxShadow') el.style.boxShadow = value;
      if (key === 'zIndex') el.style.zIndex = value;
      if (key === 'position') el.style.position = value;
      if (key === 'transform') el.style.transform = value;
      if (key === 'rotate') el.style.transform = `rotate(${value}deg)`;
      if (key === 'scale') {
        const rotate = currentStyle.rotate || 0;
        el.style.transform = `rotate(${rotate}deg) scale(${value})`;
      }
    }
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ x: 400 }}
      animate={{ 
        x: 0,
        height: isMinimized ? 'auto' : 'calc(100vh - 160px)',
        width: isMinimized ? '160px' : '320px'
      }}
      exit={{ x: 400 }}
      className={`fixed top-24 right-6 bg-black/90 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-2xl z-[9998] flex flex-col overflow-hidden transition-all duration-500`}
    >
      {/* HEADER / DRAG HANDLE */}
      <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between cursor-grab active:cursor-grabbing">
        <div className="flex items-center gap-3">
          <GripHorizontal size={14} className="text-white/20" />
          {!isMinimized && (
            <div>
              <h2 className="text-white font-black italic tracking-widest text-[9px] uppercase">SOYUZ STUDIO</h2>
              <p className="text-[7px] text-soyuz font-bold uppercase tracking-widest leading-none">V4.2 PRO</p>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:bg-white/10 transition-all font-black text-lg"
          >
            {isMinimized ? <Maximize size={12} /> : <Minus size={14} />}
          </button>
          {!isMinimized && (
            <button 
              onClick={() => setSelectedElementId(null)}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/40 hover:bg-soyuz hover:text-black transition-all"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {!isMinimized && (
        <>

      {/* TABS */}
      <div className="flex p-2 bg-black/20 gap-1 border-b border-white/5">
        {[
          { id: 'tree', icon: Layers, label: 'TREE' },
          { id: 'props', icon: Move, label: 'PROPS' },
          { id: 'style', icon: Palette, label: 'STYLE' },
          { id: 'layout', icon: Box, label: 'LAYOUT' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl transition-all ${activeTab === tab.id ? 'bg-soyuz/10 border border-soyuz/30 text-soyuz' : 'text-white/20 hover:text-white/60'}`}
          >
            <tab.icon size={12} />
            <span className="text-[7px] font-black uppercase tracking-[0.1em]">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide select-none">
        
        {activeTab === 'tree' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
               <span className="text-[10px] text-white/30 font-black uppercase tracking-widest">WORKSPACE HIERARCHY</span>
               <span className="text-[9px] text-soyuz font-bold uppercase tracking-widest">{elementTree.length} ELEMENTS</span>
            </div>
            <div className="space-y-1.5 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
              {elementTree.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedElementId(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left group ${selectedElementId === item.id ? 'bg-soyuz border-soyuz text-black' : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:border-white/20'}`}
                >
                  <span className="text-[9px] font-black opacity-40 group-hover:opacity-100">
                    {item.tagName === 'DIV' ? '📁' : item.tagName === 'SECTION' ? '🏠' : item.tagName === 'BUTTON' ? '🔘' : '📄'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold uppercase truncate">{item.tagName}</p>
                    {item.text && <p className={`text-[8px] truncate italic ${selectedElementId === item.id ? 'text-black/60' : 'text-white/20 group-hover:text-white/40'}`}>"{item.text}"</p>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedElementId ? (
          <>
            {activeTab === 'props' && (
              <div className="space-y-8">
                {/* PROPERTIES SLIDERS */}
                <div className="flex items-center gap-2 text-[10px] text-white/30 font-black uppercase tracking-widest">
                  <Move size={12} />
                  PROPERTIES
                </div>
                {[
                  { label: 'SCALE', key: 'scale', min: 0.1, max: 3, step: 0.01, unit: 'x', icon: Maximize },
                  { label: 'WIDTH', key: 'width', min: 10, max: 1200, step: 1, unit: 'px', icon: Move },
                  { label: 'HEIGHT', key: 'height', min: 10, max: 1000, step: 1, unit: 'px', icon: Move },
                  { label: 'ROTATE', key: 'rotate', min: -180, max: 180, step: 1, unit: '°', icon: RotateCcw },
                ].map(slider => (
                  <div key={slider.label} className="space-y-4">
                    <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-white/30">
                      <span className="flex items-center gap-2"><slider.icon size={10} /> {slider.label}</span>
                      <span className="text-soyuz">{currentStyle[slider.key] || (slider.key === 'scale' ? 1 : 'AUTO')}{slider.key !== 'scale' && slider.key !== 'rotate' && !currentStyle[slider.key] ? '' : slider.unit}</span>
                    </div>
                    <input 
                      type="range" min={slider.min} max={slider.max} step={slider.step}
                      value={slider.key === 'scale' ? currentStyle[slider.key] || 1 : parseInt(currentStyle[slider.key]) || 400}
                      onChange={(e) => handleStyleChange(slider.key, slider.key === 'scale' ? parseFloat(e.target.value) : (slider.key === 'rotate' ? parseInt(e.target.value) : `${e.target.value}px`))}
                      className="w-full accent-soyuz h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'layout' && (
              <div className="space-y-10">
                {/* POSITIONING */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-[10px] text-white/30 font-black uppercase tracking-widest">
                    <Box size={12} />
                    BOX DYNAMICS
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'STICKY', value: 'sticky' },
                      { label: 'ABSOLUTE', value: 'absolute' },
                      { label: 'FIXED', value: 'fixed' },
                      { label: 'RELATIVE', value: 'relative' },
                    ].map(pos => (
                      <button
                        key={pos.value}
                        onClick={() => handleStyleChange('position', pos.value)}
                        className={`text-[8px] font-black uppercase tracking-widest py-3 rounded-xl border transition-all ${currentStyle.position === pos.value ? 'bg-soyuz border-soyuz text-black' : 'bg-white/5 border-white/5 text-white/40'}`}
                      >
                        {pos.label}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/30">SMART ALIGN</p>
                    <button 
                      onClick={() => {
                        handleStyleChange('left', '50%');
                        handleStyleChange('transform', `translateX(-50%) ${currentStyle.rotate ? `rotate(${currentStyle.rotate}deg)` : ''} ${currentStyle.scale ? `scale(${currentStyle.scale})` : ''}`);
                      }}
                      className="w-full py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase text-white hover:bg-soyuz hover:text-black transition-all"
                    >
                      CENTER HORIZONTALLY
                    </button>
                  </div>
                </div>

                {/* VISIBILITY */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                   <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Z-INDEX (LAYERING)</p>
                   <input 
                      type="range" min="0" max="10000" step="10"
                      value={currentStyle.zIndex || 1}
                      onChange={(e) => handleStyleChange('zIndex', e.target.value)}
                      className="w-full accent-soyuz h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer"
                   />
                </div>
              </div>
            )}

            {activeTab === 'style' && (
              <div className="space-y-10">
                {/* Advanced Typography */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-[10px] text-white/30 font-black uppercase tracking-widest">
                    <Type size={12} />
                    PRO TYPOGRAPHY
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {premiumFonts.slice(0, 4).map(font => (
                      <button
                        key={font.name}
                        onClick={() => handleStyleChange('fontFamily', font.value)}
                        className={`text-[9px] font-black uppercase tracking-widest px-3 py-3 rounded-xl border transition-all ${currentStyle.fontFamily === font.value ? 'bg-soyuz text-black border-soyuz' : 'bg-white/5 text-white/40 border-white/5 hover:bg-white/10'}`}
                      >
                        {font.name.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t border-white/5">
                     <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-white/30">
                        <span>LETTER SPACING</span>
                        <span className="text-soyuz">{currentStyle.letterSpacing || 0}px</span>
                     </div>
                     <input 
                        type="range" min="-5" max="20" step="0.5"
                        value={parseFloat(currentStyle.letterSpacing) || 0}
                        onChange={(e) => handleStyleChange('letterSpacing', parseFloat(e.target.value))}
                        className="w-full accent-soyuz h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer"
                     />
                  </div>
                </div>

                {/* VISUAL EFFECTS */}
                <div className="space-y-6 pt-6 border-t border-white/5">
                  <div className="flex items-center gap-2 text-[10px] text-white/30 font-black uppercase tracking-widest">
                    <Palette size={12} />
                    VISUAL EFFECTS
                  </div>
                  
                  <div className="space-y-4">
                     <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-white/30">
                        <span>CORNER RADIUS</span>
                        <span className="text-soyuz">{currentStyle.borderRadius || 0}px</span>
                     </div>
                     <input 
                        type="range" min="0" max="100" step="1"
                        value={parseInt(currentStyle.borderRadius) || 0}
                        onChange={(e) => handleStyleChange('borderRadius', parseInt(e.target.value))}
                        className="w-full accent-soyuz h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer"
                     />
                  </div>

                  <div className="space-y-4">
                     <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-white/30">
                        <span>DROP SHADOW (SOFT)</span>
                        <span className="text-soyuz">{currentStyle.boxShadow ? 'ACTIVE' : 'OFF'}</span>
                     </div>
                     <div className="grid grid-cols-2 gap-2">
                        <button 
                           onClick={() => handleStyleChange('boxShadow', 'none')}
                           className={`py-3 rounded-xl text-[8px] font-black border transition-all ${!currentStyle.boxShadow || currentStyle.boxShadow === 'none' ? 'bg-soyuz border-soyuz text-black' : 'bg-white/5 border-white/5 text-white/40'}`}
                        >
                           NONE
                        </button>
                        <button 
                           onClick={() => handleStyleChange('boxShadow', '0 10px 30px rgba(0,0,0,0.5)')}
                           className={`py-3 rounded-xl text-[8px] font-black border transition-all ${currentStyle.boxShadow?.includes('30px') ? 'bg-soyuz border-soyuz text-black' : 'bg-white/5 border-white/5 text-white/40'}`}
                        >
                           SOFT GLOW
                        </button>
                     </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-20 py-20">
             <Info size={40} className="text-white/20" />
             <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.3em]">No Selection</p>
                <p className="text-[8px] uppercase tracking-widest">Choose an element from the tree <br /> or click on any component</p>
             </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-white/5 bg-black/40 flex items-center gap-3">
        <button 
          className="flex-1 py-4 bg-soyuz text-black font-black italic uppercase tracking-widest text-[10px] rounded-xl hover:shadow-[0_0_30px_rgba(255,215,0,0.3)] hover:scale-[1.02] active:scale-95 transition-all"
        >
          SYNC TO CODE
        </button>
        <button className="w-12 h-14 bg-white/5 rounded-xl flex items-center justify-center text-white/40 hover:text-white transition-all">
          <Code size={18} />
        </button>
      </div>
      </>
      )}
    </motion.div>
  );
}
