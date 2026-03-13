'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface FormLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  onClose?: () => void;
  variant?: 'modal' | 'page';
  maxWidth?: string;
}

/**
 * SOURCE OF TRUTH: Centralized Layout for Forms
 * Rules as per user_global:
 * - Overlay: fixed inset-0 bg-black/60 flex items-center justify-center
 * - Container: flex flex-col h-dvh sm:max-h-[90vh] sm:max-w-2xl bg-[#0A0A0A] rounded-3xl
 * - Content: flex-1 overflow-y-auto px-4 sm:px-6 pb-10
 */
export const FormLayout: React.FC<FormLayoutProps> = ({ 
  children, 
  title, 
  description, 
  onClose, 
  variant = 'modal',
  maxWidth = 'max-w-2xl'
}) => {
  const content = (
    <div className={`flex flex-col bg-[#0A0A0A] border border-white/5 rounded-3xl transition-all shadow-2xl relative overflow-hidden ${
      variant === 'modal' ? 'h-dvh sm:h-auto sm:max-h-[85vh] w-full ' + maxWidth : 'w-full min-h-dvh pt-32 pb-20'
    }`}>
      {/* Background elements for premium feel */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-soyuz/5 blur-3xl pointer-events-none" />
      
      {/* Header */}
      <div className="p-8 sm:p-10 border-b border-white/5">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h2 className="text-2xl font-display italic text-white uppercase tracking-tight">{title}</h2>
            {description && <p className="text-[10px] text-[#444444] font-black uppercase tracking-widest">{description}</p>}
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className="p-2 bg-white/5 border border-white/10 text-white hover:bg-soyuz hover:text-white transition-all rounded-full"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-10 scrollbar-hide">
        {children}
      </div>
    </div>
  );

  if (variant === 'page') {
    return (
      <div className="bg-black min-h-dvh flex flex-col items-center px-6 relative overflow-hidden">
        {/* Background Ambience */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-soyuz/5 blur-[150px] rounded-full" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-white/5 blur-[150px] rounded-full" />
          <div className="absolute inset-0 carbon-texture opacity-5" />
        </div>
        <div className={`w-full ${maxWidth} relative z-10`}>
          {content}
        </div>
      </div>
    );
  }

  // Modal variant
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-6 lg:p-12">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative z-10 w-full flex justify-center"
      >
        {content}
      </motion.div>
    </div>
  );
};
