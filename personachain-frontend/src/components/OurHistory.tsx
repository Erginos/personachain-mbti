'use client';

export default function OurHistory() {
  return (
    <section className="w-full py-20 px-4 bg-slate-800">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          Our Vision
        </h2>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Text */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-purple-300">
              Building the Future of Identity
            </h3>

            <p className="text-slate-300 leading-relaxed text-lg">
              PersonaChain is a revolutionary platform that combines psychology with blockchain technology. We believe that your personality is unique and deserves to be immortalized on the blockchain.
            </p>

            <p className="text-slate-300 leading-relaxed text-lg">
              By taking our MBTI-based assessment, you not only discover yourself but also mint a non-fungible token (NFT) that represents your unique personality type. This NFT is yours forever, stored securely on the Solana blockchain.
            </p>

            <div className="pt-6 space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-2xl text-purple-400">✨</span>
                <div>
                  <h4 className="font-bold text-purple-300">Permanent Records</h4>
                  <p className="text-sm text-slate-400">Your personality NFT is stored forever on the blockchain</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-2xl text-pink-400">🔐</span>
                <div>
                  <h4 className="font-bold text-pink-300">Secure & Decentralized</h4>
                  <p className="text-sm text-slate-400">Built on Solana with transparent, immutable records</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-2xl text-blue-400">🌍</span>
                <div>
                  <h4 className="font-bold text-blue-300">Global Community</h4>
                  <p className="text-sm text-slate-400">Join thousands of personality NFT owners worldwide</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Visual */}
          <div className="relative">
            <div className="relative h-96 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl border border-purple-500/30 overflow-hidden flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🧬</div>
                <h4 className="text-2xl font-bold text-purple-300">Your Digital Identity</h4>
                <p className="text-slate-400 mt-2">Immutable. Unique. Yours.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-20 pt-20 border-t border-slate-700">
          <h3 className="text-2xl font-bold mb-12 text-center text-purple-300">Our Journey</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-2xl font-bold">
                1
              </div>
              <h4 className="font-bold text-purple-300 mb-2">Discovery</h4>
              <p className="text-slate-400">We realized personality is more valuable than ever in the digital age</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-pink-600 to-blue-600 rounded-full flex items-center justify-center text-2xl font-bold">
                2
              </div>
              <h4 className="font-bold text-pink-300 mb-2">Innovation</h4>
              <p className="text-slate-400">Combining MBTI psychology with Solana blockchain technology</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold">
                3
              </div>
              <h4 className="font-bold text-blue-300 mb-2">Impact</h4>
              <p className="text-slate-400">Creating a global community of personality NFT holders</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}