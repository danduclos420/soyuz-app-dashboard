'use client';

import CardFront from '@/components/affiliate/hockey-card/CardFront';
import { PageLayout } from '@/components/layout/PageLayout';

export default function HockeyCardWorkshop() {
  // Props for the front face only
  const mockProps = {
    firstName: 'DANY',
    lastName: 'SOYUZ',
    rankLabel: 'ADMIN',
    avatarUrl: '/assets/hockey-card/Bottom_underimage_soyuztopdeck.png', // Placeholder or real asset
    photoX: 0,
    photoY: 0,
    zoom: 1,
    editMode: false,
    role: 'admin',
    lotNumber: 1
  };

  return (
    <PageLayout title="HOCKEY CARD - FRONT ONLY" description="Focusing on the nameplate and lot number placement">
      <div className="flex flex-col items-center justify-center min-h-[70vh] py-12">
        
        {/* Isolated Card Front */}
        <div className="relative w-[400px] aspect-[2.5/3.5] bg-black rounded-lg overflow-hidden shadow-2xl scale-110">
          <CardFront {...mockProps} />
        </div>
        
        <div className="mt-16 p-8 bg-surface/50 rounded-3xl border border-white/5 max-w-2xl text-center backdrop-blur-md">
          <h3 className="text-white font-black italic tracking-widest mb-4 uppercase">Solo Workshop Mode</h3>
          <p className="text-white/40 text-sm font-mono uppercase tracking-[0.2em] leading-relaxed">
            LOT NO. Position: 6px Left / 2px Bottom<br/>
            Font Size: 8px Mono<br/>
            Margins: 10px Symmetry (Planned)
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
