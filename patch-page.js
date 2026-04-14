const fs = require('fs');
let c = fs.readFileSync('app/page.tsx', 'utf8');

// Find the neural banner section boundaries
const START = '\r\n\r\n        <div className="relative overflow-hidden">';
const si = c.indexOf(START);

// Find the closing </div> of this section (before py-16)
const py16 = c.indexOf('py-16 border-y');
const chunk = c.substring(0, py16);
const ei = chunk.lastIndexOf('        </div>');

if (si === -1 || ei === -1) {
  console.log('MARKERS NOT FOUND si:', si, 'ei:', ei);
  process.exit(1);
}

const before = c.substring(0, si);
const after = c.substring(ei + '        </div>'.length);

const NEW = `

        <div className="relative overflow-hidden">
          <NeuralBackground />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020d0a] via-[#041a10] to-[#020d0a]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_50%_50%,rgba(52,211,153,0.07),transparent)]" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 py-14">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Left — video */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/30 via-accent/20 to-emerald-500/30 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative rounded-3xl overflow-hidden border border-emerald-500/20 shadow-2xl shadow-emerald-500/10">
                  <video src="/wallet.mp4" autoPlay muted loop playsInline className="w-full h-auto block" style={{ maxHeight: '480px', objectFit: 'cover' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020d0a]/40 via-transparent to-transparent pointer-events-none" />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-card/90 backdrop-blur-md border border-emerald-500/30 rounded-2xl px-4 py-3 shadow-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold text-emerald-400">Ethiopian Birr</span>
                  </div>
                  <p className="text-sm font-black text-white mt-0.5">ስሙኒ ዋሌት</p>
                </div>
              </div>
              {/* Right — content */}
              <div className="flex flex-col items-start gap-6">
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/5 backdrop-blur-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400/80 text-[11px] font-semibold uppercase tracking-[0.2em]">{t('bannerOfficial')}</span>
                </div>
                <div className="space-y-3">
                  <p className="text-white/40 text-base sm:text-lg font-light tracking-wide">{t('bannerTagline')}</p>
                  <p className="text-white text-4xl sm:text-5xl font-black tracking-tight leading-none drop-shadow-[0_0_30px_rgba(52,211,153,0.3)]">{t('bannerTitle')}</p>
                  <p className="text-emerald-400 text-xl sm:text-2xl font-bold tracking-wide">{t('bannerSubtitle')}</p>
                </div>
                <div className="flex items-center gap-3 w-52">
                  <div className="flex-1 h-px bg-emerald-500/20" />
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <div className="flex-1 h-px bg-emerald-500/20" />
                </div>
                {user ? (
                  <Link href="/dashboard" className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-emerald-500 text-black font-bold text-sm hover:bg-emerald-400 transition-all shadow-[0_0_30px_rgba(52,211,153,0.35)] hover:shadow-[0_0_45px_rgba(52,211,153,0.5)] hover:-translate-y-0.5">
                    {t('dashboard')} <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <Link href="/login" className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-emerald-500 text-black font-bold text-sm hover:bg-emerald-400 transition-all shadow-[0_0_30px_rgba(52,211,153,0.35)] hover:shadow-[0_0_45px_rgba(52,211,153,0.5)] hover:-translate-y-0.5">
                    {t('bannerCTA')} <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
                <div className="flex flex-wrap gap-4">
                  {['AI-Powered', 'ETB Native', 'Bank-Grade Security', 'Free to Start'].map(tag => (
                    <div key={tag} className="flex items-center gap-1.5 text-white/50 text-[11px] font-semibold uppercase tracking-widest">
                      <Check className="w-3 h-3 text-emerald-500" /> {tag}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>`;

fs.writeFileSync('app/page.tsx', before + NEW + after, 'utf8');
console.log('SUCCESS - video section inserted, file length:', (before + NEW + after).length);
