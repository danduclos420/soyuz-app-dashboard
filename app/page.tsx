import Navbar from '@/components/Navbar';

export default function HomePage() {
  const tickerText = "STRENGTH IN UNITY, POWER WITH SOYUZ · BREAK THE LIMITS · ";

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20"
        style={{
          backgroundColor: '#0D0D0D',
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)',
        }}>
        <p className="text-gray-400 uppercase tracking-[0.4em] text-sm mb-6">WELCOME TO SOYUZ STORE</p>
        <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-widest text-white mb-4 leading-tight">
          STRENGTH IN UNITY
        </h1>
        <p className="text-2xl md:text-3xl uppercase tracking-wider text-gray-300 mb-12 italic font-light">
          Power with SOYUZ
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a href="#collections" className="bg-white text-black font-bold uppercase tracking-widest px-10 py-4 hover:bg-gray-100 transition-all duration-200">
            SHOP ALL STICKS
          </a>
          <a href="#b2b" className="border border-white text-white font-bold uppercase tracking-widest px-10 py-4 hover:bg-white hover:text-black transition-all duration-200">
            PORTAIL B2B
          </a>
        </div>
      </section>

      {/* TICKER */}
      <div className="bg-white text-black py-4 overflow-hidden">
        <div className="flex w-max" style={{ animation: 'ticker 25s linear infinite' }}>
          {[...Array(10)].map((_, i) => (
            <span key={i} className="mx-10 text-sm font-bold uppercase tracking-widest whitespace-nowrap">
              {tickerText}
            </span>
          ))}
        </div>
      </div>

      {/* COLLECTIONS */}
      <section id="collections" className="py-24 px-6 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold uppercase tracking-widest text-white text-center mb-16">
            OUR COLLECTIONS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'SOYUZ PRO', desc: 'Elite performance stick for pro players', price: 'CAD $299' },
              { name: 'SOYUZ ELITE', desc: 'Premium carbon fiber construction', price: 'CAD $249' },
              { name: 'SOYUZ CORE', desc: 'The perfect balance of power and control', price: 'CAD $199' },
            ].map((product) => (
              <div key={product.name} className="bg-[#0D0D0D] border border-white/10 p-8 hover:border-white/30 transition-all duration-300 group">
                <div className="bg-[#1a1a1a] h-48 mb-6 flex items-center justify-center">
                  <span className="text-gray-600 uppercase tracking-widest text-xs">PRODUCT IMAGE</span>
                </div>
                <h3 className="text-white font-bold uppercase tracking-widest text-lg mb-2">{product.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{product.desc}</p>
                <p className="text-white font-bold mb-6">{product.price}</p>
                <button className="w-full bg-white text-black font-bold uppercase tracking-widest py-3 hover:bg-gray-100 transition-all duration-200 text-sm">
                  ADD TO CART
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* B2B SECTION */}
      <section id="b2b" style={{
        backgroundColor: '#0D0D0D',
        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)',
      }} className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-500 uppercase tracking-[0.4em] text-xs mb-4">PROGRAMME REVENDEUR</p>
          <h2 className="text-4xl font-bold uppercase tracking-widest text-white mb-6">
            DEVENEZ REVENDEUR SOYUZ BC
          </h2>
          <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
            Accédez à nos prix de gros exclusifs et commandez directement via notre portail B2B professionnel.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { icon: '◈', label: 'Prix exclusifs revendeurs' },
              { icon: '◉', label: 'Inventaire en temps réel' },
              { icon: '◎', label: 'Commandes simplifiées' },
              { icon: '◆', label: 'Support dédié' },
            ].map((item) => (
              <div key={item.label} className="border border-white/10 p-6 text-center">
                <div className="text-2xl text-white mb-3">{item.icon}</div>
                <p className="text-gray-400 text-sm uppercase tracking-wider">{item.label}</p>
              </div>
            ))}
          </div>
          <a
            href="https://soyuz-hockey.erplain.app/b2b/login"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-black font-bold uppercase tracking-widest px-12 py-5 hover:bg-gray-100 transition-all duration-200 text-lg"
          >
            ACCÉDER AU PORTAIL B2B →
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black border-t border-white/10 py-12 px-6 text-center">
        <p className="text-white font-bold uppercase tracking-widest text-lg mb-2">SOYUZ BC NORTH AMERICA</p>
        <p className="text-gray-600 text-sm uppercase tracking-widest">Official Partner of the KHL</p>
        <p className="text-gray-700 text-xs mt-6">© 2026 SOYUZ BC North America. All rights reserved.</p>
      </footer>

      {/* TICKER KEYFRAMES */}
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </main>
  );
}
