'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

/**
 * SOURCE OF TRUTH: Centralized Layout for Dashboard Views
 * Rules:
 * - Uses min-h-dvh to ensure full height without rigid h-screen.
 * - Central scrollable area (mainContent).
 * - Consistent spacing and premium aesthetics.
 */
export const PageLayout: React.FC<PageLayoutProps> = ({ 
  children, 
  title, 
  subtitle, 
  actions 
}) => {
  return (
    <div className="bg-black min-h-dvh flex flex-col relative overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-soyuz/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-white/5 blur-[150px] rounded-full" />
        <div className="absolute inset-0 carbon-texture opacity-5" />
      </div>

      <div className="flex-1 flex flex-col pt-32 pb-20 px-6 relative z-10 max-w-7xl mx-auto w-full">
        {/* Header Block */}
        {(title || subtitle || actions) && (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 mb-16 border-b border-white/5 pb-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {subtitle && (
                <span className="inline-block px-3 py-1 bg-soyuz/10 border border-soyuz/20 text-soyuz font-label text-[9px] mb-6 uppercase tracking-[0.2em] rounded-full">
                  {subtitle}
                </span>
              )}
              {title && (
                <h1 className="text-6xl md:text-8xl font-display italic tracking-tighter leading-[0.85] uppercase">
                  {title.split(' ').map((word, i) => (
                    <React.Fragment key={i}>
                      {i === title.split(' ').length - 1 ? (
                        <span className="outline-text-white">{word}</span>
                      ) : (
                        <>{word} </>
                      )}
                      {i % 2 === 1 && <br />}
                    </React.Fragment>
                  ))}
                </h1>
              )}
            </motion.div>

            {actions && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap gap-4"
              >
                {actions}
              </motion.div>
            )}
          </div>
        )}

        {/* Scrollable Main Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide relative">
          {children}
        </div>
      </div>
    </div>
  );
};
