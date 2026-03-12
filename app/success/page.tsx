export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-center px-6">
      <div className="max-w-lg">
        <div className="text-6xl mb-6">✓</div>
        <h1 className="text-4xl font-bold uppercase tracking-widest text-white mb-4">
          ORDER CONFIRMED
        </h1>
        <p className="text-gray-400 text-lg mb-8">
          Thank you for your order. You will receive a confirmation email shortly.
        </p>
        <a
          href="/"
          className="inline-block bg-white text-black font-bold uppercase tracking-widest px-10 py-4 hover:bg-gray-100 transition-all duration-200"
        >
          BACK TO STORE
        </a>
      </div>
    </main>
  );
}
