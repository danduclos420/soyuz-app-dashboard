'use client';

import CardFront from '@/components/affiliate/hockey-card/CardFront';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const premiumFonts = [
  { name: 'Archivo Black', value: '"Archivo Black", sans-serif' },
  { name: 'Great Vibes', value: '"Great Vibes", cursive' },
  { name: 'Playball', value: '"Playball", cursive' },
  { name: 'Dancing Script', value: '"Dancing Script", cursive' },
  { name: 'Bebas Neue', value: '"Bebas Neue", sans-serif' },
  { name: 'Montserrat', value: '"Montserrat", sans-serif' },
  { name: 'Orbitron', value: '"Orbitron", sans-serif' },
  { name: 'Cinzel', value: '"Cinzel", serif' },
  { name: 'Permanent Marker', value: '"Permanent Marker", cursive' },
  { name: 'UnifrakturMaguntia', value: '"UnifrakturMaguntia", serif' },
  { name: 'Press Start 2P', value: '"Press Start 2P", cursive' },
  { name: 'Stalinist One', value: '"Stalinist One", cursive' },
  { name: 'Monoton', value: '"Monoton", cursive' },
  { name: 'Faster One', value: '"Faster One", cursive' },
  { name: 'Fascinate Inline', value: '"Fascinate Inline", cursive' },
  { name: 'Ultra', value: '"Ultra", serif' },
  { name: 'Rye', value: '"Rye", cursive' },
  { name: 'Ewert', value: '"Ewert", cursive' },
  { name: 'Fredericka the Great', value: '"Fredericka the Great", cursive' },
  { name: 'Nosifer', value: '"Nosifer", cursive' },
  { name: 'Goldman', value: '"Goldman", cursive' },
  { name: 'Michroma', value: '"Michroma", sans-serif' },
  { name: 'Syncopate', value: '"Syncopate", sans-serif' }
];

const availableComponents = [
  { id: 'card-front', label: 'Front Card', icon: '🃏' },
  { id: 'card-back', label: 'Back Card', icon: '📝' },
  { id: 'packaging', label: 'Packaging', icon: '📦' },
  { id: 'hologram', label: 'Hologram', icon: '✨' }
];

export default function TestCardPage() {
  const [activeTab, setActiveTab] = useState('card-front');
  const [lotNumber, setLotNumber] = useState(1);
  const [studioMode, setStudioMode] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [positions, setPositions] = useState<Record<string, {x: number, y: number}>>({});
  const [styles, setStyles] = useState<Record<string, any>>({
    firstName: { fontSize: 42, scale: 1, rotate: -5, fontFamily: '"Great Vibes", cursive' },
    lastName: { fontSize: 48, scale: 1, rotate: 0, fontFamily: '"Archivo Black", sans-serif' },
    mvp: { scale: 1, rotate: 0 },
    lotNo: { scale: 1, rotate: 0 },
    ambassador: { scale: 1, rotate: 0 },
    photo: { scale: 1, rotate: 0 }
  });
  const [textOverrides, setTextOverrides] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [customPhoto, setCustomPhoto] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [items, setItems] = useState([
    { id: 'photo', label: 'Player Photo' },
    { id: 'firstName', label: 'First Name' },
    { id: 'lastName', label: 'Last Name' },
    { id: 'mvp', label: 'MVP Badge' },
    { id: 'lotNo', label: 'Lot Number' },
    { id: 'ambassador', label: 'Ambassador Text' }
  ]);

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...items];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    setItems(newItems);
  };

  const moveDown = (index: number) => {
    if (index === items.length - 1) return;
    const newItems = [...items];
    [newItems[index + 1], newItems[index]] = [newItems[index], newItems[index + 1]];
    setItems(newItems);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomPhoto(url);
    }
  };

  const handlePositionChange = useCallback((id: string, pos: {x: number, y: number}) => {
    setPositions(prev => ({
      ...prev,
      [id]: {
        x: (prev[id]?.x || 0) + pos.x,
        y: (prev[id]?.y || 0) + pos.y
      }
    }));
    setSelectedId(id);
  }, []);

  const updateStyle = (id: string, key: string, value: any) => {
    setStyles(prev => ({
      ...prev,
      [id]: { ...prev[id], [key]: value }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    console.log("SENDING TO DB...", { positions, styles, textOverrides, items });
    await new Promise(r => setTimeout(r, 1200));
    setIsSaving(false);
    alert("DANY, TA CONFIGURATION EST SAUVEGARDÉE ! 🚀🏒");
  };

  const mockProps = {
    firstName: 'DANY',
    lastName: 'LACOURSIÈRE',
    rankLabel: 'ADMIN',
    avatarUrl: customPhoto || '', 
    photoX: 0,
    photoY: 0,
    zoom: 1,
    editMode: false,
    role: 'admin',
    lotNumber: lotNumber,
    studioMode,
    positions,
    styles,
    textOverrides,
    onPositionChange: handlePositionChange
  };

  return (
    <div className="min-h-screen bg-black flex flex-col p-0 overflow-hidden font-sans select-none">
      {/* Import all the fonts dynamically */}
      <link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Bebas+Neue&family=Cinzel:wght@400;900&family=Dancing+Script:wght@700&family=Ewert&family=Fascinate+Inline&family=Faster+One&family=Fredericka+the+Great&family=Goldman:wght@400;700&family=Great+Vibes&family=Michroma&family=Monoton&family=Montserrat:wght@400;900&family=Nosifer&family=Orbitron:wght@400;900&family=Permanent+Marker&family=Playball&family=Press+Start+2P&family=Rye&family=Stalinist+One&family=Syncopate:wght@400;700&family=Ultra&family=UnifrakturMaguntia&display=swap" rel="stylesheet" />
      
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT: Central Workspace */}
        <div className="flex-1 bg-neutral-900/40 flex flex-col items-center justify-center p-12 relative overflow-hidden backdrop-blur-3xl">
          <div className="absolute inset-0 carbon-texture opacity-5" />
          
          {/* Main Stage */}
          <div className="relative group scale-[1.15] mb-20 origin-center transition-all duration-500">
             <div className="absolute -inset-16 bg-soyuz/10 blur-[120px] opacity-100 group-hover:bg-soyuz/20 transition-all duration-1000" />
             <div 
               className="relative w-[400px] aspect-[2.5/3.5] shadow-[0_0_150px_rgba(0,0,0,1)] rounded-2xl transition-all duration-700"
               onDoubleClick={() => selectedId && setEditingId(selectedId)}
             >
                {activeTab === 'card-front' ? (
                  <CardFront {...mockProps} />
                ) : (
                  <div className="w-full h-full bg-neutral-800 rounded-lg flex flex-col items-center justify-center border border-white/5 space-y-4">
                    <span className="text-6xl grayscale opacity-20">🏒</span>
                    <p className="text-white/20 font-black italic uppercase tracking-[0.3em] text-xs">Component: {activeTab}</p>
                    <p className="text-white/10 text-[8px] font-mono">Development Mode Ready</p>
                  </div>
                )}
             </div>
          </div>

          {/* Component Switcher Menu (Requested by Dan) */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/80 backdrop-blur-2xl p-1.5 rounded-full border border-white/5 shadow-2xl z-[100] scale-110">
             {availableComponents.map(comp => (
               <button
                 key={comp.id}
                 onClick={() => setActiveTab(comp.id)}
                 className={`flex items-center gap-3 px-6 py-3 rounded-full text-[10px] font-black italic uppercase tracking-widest transition-all duration-300 ${activeTab === comp.id ? 'bg-soyuz text-black shadow-[0_0_30px_rgba(255,215,0,0.3)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
               >
                 <span className="text-sm">{comp.icon}</span>
                 <span className="hidden sm:inline">{comp.label}</span>
               </button>
             ))}
          </div>

          {/* Floating Action Tip */}
          <AnimatePresence>
            {selectedId && !editingId && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute top-10 left-1/2 -translate-x-1/2 bg-black/60 border border-white/10 backdrop-blur-xl px-8 py-4 rounded-full text-white/80 text-[10px] font-black italic uppercase tracking-[0.2em] shadow-2xl"
              >
                MODIFIYING <span className="text-soyuz underline underline-offset-4 decoration-2"> {selectedId} </span> — DRAG OR USE SLIDERS
              </motion.div>
            )}
          </AnimatePresence>

          {/* Text Editor Overlay */}
          <AnimatePresence>
            {editingId && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-6"
              >
                <div className="w-full max-w-lg bg-neutral-900 rounded-[2.5rem] p-12 border border-white/10 shadow-[0_0_100px_rgba(255,215,0,0.1)]">
                  <h4 className="text-soyuz font-black italic tracking-[0.2em] mb-10 uppercase text-3xl">EXPERT EDITOR</h4>
                  <p className="text-white/30 text-[10px] uppercase tracking-widest mb-6">Changing content for: {editingId}</p>
                  <input 
                    autoFocus
                    type="text"
                    value={textOverrides[editingId] || (editingId === 'firstName' ? 'DANY' : editingId === 'lastName' ? 'LACOURSIÈRE' : '')}
                    onChange={(e) => setTextOverrides(prev => ({ ...prev, [editingId]: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Enter' && setEditingId(null)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-8 text-white font-display text-3xl focus:border-soyuz/60 outline-none transition-all shadow-inner placeholder:opacity-20"
                    placeholder="Type new content..."
                  />
                  <div className="grid grid-cols-2 gap-4 mt-12">
                    <button 
                      onClick={() => setEditingId(null)}
                      className="w-full py-6 bg-white/5 border border-white/5 text-white/40 font-black italic uppercase tracking-widest rounded-2xl hover:bg-white/10 hover:text-white transition-all transition-duration-300"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => setEditingId(null)}
                      className="w-full py-6 bg-soyuz text-black font-black italic uppercase tracking-widest rounded-2xl hover:shadow-[0_0_40px_rgba(255,215,0,0.4)] transition-all active:scale-95"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT: Studio Sidebar */}
        <div className="w-full md:w-[420px] bg-black border-l border-white/[0.08] flex flex-col h-screen z-[110] shadow-[-20px_0_50px_rgba(0,0,0,0.5)]">
          <div className="p-10 border-b border-white/[0.08]">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-white font-black italic tracking-widest text-2xl uppercase">STUDIO <span className="text-soyuz">3.1</span></h2>
              <div className="px-3 py-1 bg-soyuz/10 border border-soyuz/30 rounded-full">
                <span className="text-[8px] text-soyuz font-black uppercase tracking-widest">Expert Mode</span>
              </div>
            </div>
            <p className="text-white/20 text-[9px] font-mono tracking-[0.4em] uppercase">Soyuz High Frequency Workshop</p>
          </div>

          <div className="flex-1 overflow-y-auto p-8 scrollbar-hide space-y-10">
            {/* Asset Import */}
            <div className="p-8 bg-neutral-900/50 rounded-[2.5rem] border border-white/5 group transition-all duration-500">
              <div className="flex items-center justify-between mb-6">
                 <p className="text-[10px] text-white/30 font-mono uppercase tracking-[0.3em]">Player Asset</p>
                 <span className="text-xs grayscale opacity-50">🖼️</span>
              </div>
              <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-white/10 rounded-3xl cursor-pointer hover:bg-soyuz/5 hover:border-soyuz/40 transition-all group/label">
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <span className="text-4xl mb-3 group-hover/label:scale-125 transition-transform duration-500">📸</span>
                  <p className="text-[10px] font-black italic text-soyuz uppercase tracking-[0.2em] group-hover/label:tracking-[0.3em] transition-all">Import Lacoursière Photo</p>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
              </label>
            </div>

            {/* Layer Stack */}
            <div className="space-y-4">
              <p className="text-[10px] text-white/30 font-mono uppercase tracking-[0.3em] mx-4">Layer Order & Selection</p>
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className={`w-full group flex items-center justify-between p-5 rounded-2xl border transition-all duration-500 ${selectedId === item.id ? 'bg-soyuz/10 border-soyuz shadow-[0_0_40px_rgba(255,215,0,0.1)] ring-1 ring-soyuz/30 z-10' : 'bg-neutral-900/40 border-white/5 hover:border-white/20'}`}
                >
                  <button
                    onClick={() => setSelectedId(item.id)}
                    className="flex items-center gap-5 flex-1 text-left"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-mono transition-all duration-500 ${selectedId === item.id ? 'bg-soyuz text-black scale-110 shadow-lg' : 'bg-white/5 text-white/30 group-hover:bg-white/10'}`}>
                      {index + 1}
                    </div>
                    <span className={`text-xs font-black italic uppercase tracking-widest transition-all ${selectedId === item.id ? 'text-white translate-x-1' : 'text-white/30 group-hover:text-white/60'}`}>
                      {item.label}
                    </span>
                  </button>
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => moveUp(index)} className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white/40 hover:text-soyuz transition-colors border border-white/5">↑</button>
                    <button onClick={() => moveDown(index)} className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white/40 hover:text-soyuz transition-colors border border-white/5">↓</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Property Control Panel */}
            <AnimatePresence mode="wait">
              {selectedId ? (
                <motion.div 
                  key={selectedId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-10 bg-neutral-900 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-5 italic font-black text-6xl pointer-events-none">
                    {selectedId}
                  </div>
                  
                  <div className="flex justify-between items-center mb-12 relative z-10">
                    <h4 className="text-white font-black italic tracking-widest text-xs uppercase border-b-2 border-soyuz pb-2">{selectedId} PROPS</h4>
                    <button 
                      onClick={() => setEditingId(selectedId)}
                      className="text-[10px] font-black italic text-soyuz hover:scale-110 px-4 py-2 bg-soyuz/5 rounded-full transition-all border border-soyuz/20"
                    >
                      EDIT TEXT
                    </button>
                  </div>
                  
                  <div className="space-y-12 relative z-10">
                    {/* Typography Grid */}
                    {(selectedId === 'firstName' || selectedId === 'lastName') && (
                      <div className="space-y-6">
                        <p className="text-[9px] text-white/20 font-mono uppercase tracking-[0.4em]">Font Library</p>
                        <div className="grid grid-cols-1 gap-2 max-h-72 overflow-y-auto pr-3 scrollbar-hide border-b border-white/5 pb-6">
                          {premiumFonts.map(font => (
                            <button
                              key={font.name}
                              onClick={() => updateStyle(selectedId, 'fontFamily', font.value)}
                              style={{ fontFamily: font.value }}
                              className={`w-full text-left px-6 py-5 rounded-2xl text-lg transition-all border ${styles[selectedId]?.fontFamily === font.value ? 'bg-soyuz text-black border-soyuz shadow-xl' : 'bg-white/[0.02] text-white/40 border-white/5 hover:bg-white/5 hover:text-white'}`}
                            >
                              {font.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Numerical Sliders */}
                    <div className="space-y-12">
                      {/* Font Size */}
                      {(selectedId === 'firstName' || selectedId === 'lastName') && (
                        <div className="space-y-5">
                          <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest">
                            <span className="text-white/30">Font Height</span>
                            <span className="text-soyuz font-black text-xs">{styles[selectedId]?.fontSize}px</span>
                          </div>
                          <input 
                            type="range" 
                            min="10" 
                            max="180" 
                            value={styles[selectedId]?.fontSize || 40}
                            onChange={(e) => updateStyle(selectedId, 'fontSize', parseInt(e.target.value))}
                            className="w-full accent-soyuz h-2 bg-white/5 rounded-full appearance-none cursor-pointer"
                          />
                        </div>
                      )}

                      {/* Scale */}
                      <div className="space-y-5">
                        <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest">
                          <span className="text-white/30">Object Scale</span>
                          <span className="text-soyuz font-black text-xs">{(styles[selectedId]?.scale || 1).toFixed(2)}x</span>
                        </div>
                        <input 
                          type="range" 
                          min="0.05" 
                          max="8" 
                          step="0.01"
                          value={styles[selectedId]?.scale || 1}
                          onChange={(e) => updateStyle(selectedId, 'scale', parseFloat(e.target.value))}
                          className="w-full accent-soyuz h-2 bg-white/5 rounded-full appearance-none cursor-pointer"
                        />
                      </div>

                      {/* Rotation */}
                      <div className="space-y-5">
                        <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest">
                          <span className="text-white/30">Rotation Angle</span>
                          <span className="text-soyuz font-black text-xs">{Math.round(styles[selectedId]?.rotate || 0)}°</span>
                        </div>
                        <input 
                          type="range" 
                          min="-180" 
                          max="180" 
                          step="1"
                          value={styles[selectedId]?.rotate || 0}
                          onChange={(e) => updateStyle(selectedId, 'rotate', parseInt(e.target.value))}
                          className="w-full accent-soyuz h-2 bg-white/5 rounded-full appearance-none cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Coordinate Data */}
                    <div className="grid grid-cols-2 gap-4 pt-10 border-t border-white/5">
                      <div className="p-6 bg-black/60 rounded-3xl border border-white/5 text-center">
                        <p className="text-[8px] text-white/20 font-mono uppercase mb-2 tracking-widest">Offset X</p>
                        <p className="text-soyuz font-mono text-xl font-black">{Math.round(positions[selectedId]?.x || 0)}</p>
                      </div>
                      <div className="p-6 bg-black/60 rounded-3xl border border-white/5 text-center">
                        <p className="text-[8px] text-white/20 font-mono uppercase mb-2 tracking-widest">Offset Y</p>
                        <p className="text-soyuz font-mono text-xl font-black">{Math.round(positions[selectedId]?.y || 0)}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="p-16 text-center bg-neutral-900/40 rounded-[3rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-6 group">
                  <span className="text-6xl grayscale opacity-10 group-hover:scale-125 transition-transform duration-700">💎</span>
                  <div className="space-y-2">
                     <p className="text-[10px] text-white/20 font-black italic uppercase tracking-[0.4em]">Engine Standby</p>
                     <p className="text-white/10 text-[8px] font-mono tracking-widest">Please select a layer to adjust</p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Master Save Controller */}
          <div className="p-10 border-t border-white/[0.08] bg-black shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className={`w-full py-6 text-black font-black italic uppercase tracking-[0.4em] rounded-2xl transition-all duration-500 shadow-2xl relative overflow-hidden group ${isSaving ? 'bg-white/10 cursor-not-allowed text-white/20' : 'bg-soyuz hover:scale-[1.03] active:scale-95'}`}
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-x-0 bottom-0 h-1 bg-black/20 group-hover:h-3 transition-all" />
              {isSaving ? (
                <div className="flex items-center justify-center gap-3">
                  <span className="animate-spin text-xl">⚪</span>
                  <span>SYNCING WITH SUPABASE...</span>
                </div>
              ) : 'SAVE EXPERT DESIGN'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
