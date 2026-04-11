'use client';

import { Brain, BarChart3, Target, Bell, MessageSquare, Shield, PieChart, Globe, Sparkles } from 'lucide-react';
import { useLang } from '@/lib/language-context';

const FEATURES_EN = [
  { icon: Brain, title: 'AI-Powered Insights', desc: 'Llama 3.3 analyses your spending patterns and delivers personalised financial recommendations in real time.' },
  { icon: BarChart3, title: 'Advanced Analytics', desc: 'Interactive charts and trend analysis across weekly, monthly, and yearly timeframes.' },
  { icon: Target, title: 'Smart Budget Goals', desc: 'Set savings goals, track progress, and get AI nudges when you\'re off track.' },
  { icon: Bell, title: 'Smart Notifications', desc: 'Get alerted for unusual spending, goal milestones, and monthly summaries.' },
  { icon: MessageSquare, title: 'AI Chat Assistant', desc: 'Ask anything about your finances and get instant, context-aware answers.' },
  { icon: Shield, title: 'Bank-Grade Security', desc: 'JWT authentication, OTP verification, and encrypted data storage.' },
  { icon: PieChart, title: 'Spending Breakdown', desc: 'Visual category breakdowns so you always know where your money goes.' },
  { icon: Globe, title: 'ETB Native Support', desc: 'Built for Ethiopia — all amounts in Ethiopian Birr with local context.' },
];

const FEATURES_AM = [
  { icon: Brain, title: 'AI የፋይናንስ ምክሮች', desc: 'Llama 3.3 የወጪ ሁኔታዎን ይተነትናል እና ግላዊ የፋይናንስ ምክሮችን በቅጽበት ያቀርባል።' },
  { icon: BarChart3, title: 'የላቀ ትንታኔ', desc: 'በሳምንታዊ፣ ወርሃዊ እና ዓመታዊ ጊዜ ማዕቀፎች ውስጥ በይነተገናኝ ገበታዎች እና አዝማሚያ ትንታኔ።' },
  { icon: Target, title: 'ብልህ የበጀት ግቦች', desc: 'የቁጠባ ግቦችን ያስቀምጡ፣ እድገትን ይከታተሉ እና ከመንገድ ሲወጡ AI ማስታወሻዎችን ያግኙ።' },
  { icon: Bell, title: 'ብልህ ማሳወቂያዎች', desc: 'ለተለመደው ያልሆነ ወጪ፣ የግብ ምዕራፎች እና ወርሃዊ ማጠቃለያዎች ማንቂያ ያግኙ።' },
  { icon: MessageSquare, title: 'AI ቻት ረዳት', desc: 'ስለ ፋይናንስዎ ማንኛውንም ነገር ይጠይቁ እና በቅጽበት አውድ-ግንዛቤ ያላቸው መልሶችን ያግኙ።' },
  { icon: Shield, title: 'የባንክ ደረጃ ደህንነት', desc: 'JWT ማረጋገጫ፣ OTP ማረጋገጫ እና የተመሰጠረ የውሂብ ማከማቻ።' },
  { icon: PieChart, title: 'የወጪ ክፍፍል', desc: 'ገንዘብዎ የሚሄድበትን ሁልጊዜ እንዲያውቁ የእይታ ምድብ ክፍፍሎች።' },
  { icon: Globe, title: 'ETB ተወላጅ ድጋፍ', desc: 'ለኢትዮጵያ የተገነባ — ሁሉም መጠኖች በኢትዮጵያ ብር በአካባቢያዊ አውድ።' },
];

export function LandingFeatures() {
  const { t, lang } = useLang();
  const features = lang === 'am' ? FEATURES_AM : FEATURES_EN;

  return (
    <section id="features" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> {t('everythingYouNeed')}
          </div>
          <h2 className="text-4xl font-bold text-foreground">{t('builtForModern')}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">{t('featuresDesc')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className="group p-6 rounded-2xl border border-border bg-card hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300 hover:-translate-y-1 cursor-default"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-200">
                <Icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-2">{title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
