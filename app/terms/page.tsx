'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { useLang } from '@/lib/language-context';
import { LanguageToggle } from '@/components/language-toggle';

const SECTIONS_EN = [
  {
    title: '1. Acceptance of Terms',
    body: `By accessing or using ስሙኒ ዋሌት ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service. We reserve the right to update these terms at any time, and continued use of the Service constitutes acceptance of any changes.`,
  },
  {
    title: '2. Description of Service',
    body: `ስሙኒ ዋሌት is an AI-powered personal finance management platform designed for users in Ethiopia. The Service allows you to track income and expenses, set budget goals, receive AI-generated financial insights, and manage your financial data — all denominated in Ethiopian Birr (ETB).`,
  },
  {
    title: '3. User Accounts',
    body: `You must register for an account to use the Service. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate.`,
  },
  {
    title: '4. Privacy & Data',
    body: `We take your privacy seriously. Your financial data is stored securely using AES-256 encryption. We do not sell, rent, or share your personal data with third parties without your explicit consent, except as required by law. By using the Service, you consent to the collection and use of your data as described in our Privacy Policy.`,
  },
  {
    title: '5. AI-Generated Content',
    body: `The financial insights and recommendations provided by our AI (powered by Llama 3.3) are for informational purposes only and do not constitute professional financial advice. ስሙኒ ዋሌት is not a licensed financial advisor. Always consult a qualified financial professional before making significant financial decisions.`,
  },
  {
    title: '6. Acceptable Use',
    body: `You agree not to misuse the Service. Prohibited activities include: attempting to gain unauthorised access to any part of the Service, uploading malicious code, using the Service for any unlawful purpose, or interfering with the security or integrity of the platform. Violation of these rules may result in immediate account termination.`,
  },
  {
    title: '7. Intellectual Property',
    body: `All content, design, code, and branding associated with ስሙኒ ዋሌት are the intellectual property of the developer (Tedros Milion) and are protected under applicable copyright and trademark laws. You may not reproduce, distribute, or create derivative works without prior written permission.`,
  },
  {
    title: '8. Limitation of Liability',
    body: `To the maximum extent permitted by law, ስሙኒ ዋሌት and its developer shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service, including but not limited to loss of data, financial loss, or business interruption.`,
  },
  {
    title: '9. Termination',
    body: `We reserve the right to suspend or terminate your account at any time for violation of these Terms or for any other reason at our sole discretion. You may also delete your account at any time from your profile settings. Upon termination, your data will be permanently deleted within 30 days.`,
  },
  {
    title: '10. Contact',
    body: `If you have any questions about these Terms of Service, please contact us at tedrosmilion19@gmail.com or reach out via Telegram at @Lataxv72.`,
  },
];

const SECTIONS_AM = [
  {
    title: '1. የውሎች ተቀባይነት',
    body: `ስሙኒ ዋሌትን ("አገልግሎቱ") በመድረስ ወይም በመጠቀም፣ እነዚህን የአገልግሎት ውሎች ለመከተል ተስማምተዋል። ከእነዚህ ውሎች ጋር የማይስማሙ ከሆነ፣ እባክዎ አገልግሎቱን አይጠቀሙ። እነዚህን ውሎች በማንኛውም ጊዜ የማዘመን መብት እንይዛለን፣ እና አገልግሎቱን መቀጠል ማንኛውንም ለውጦች መቀበልን ያመለክታል።`,
  },
  {
    title: '2. የአገልግሎት መግለጫ',
    body: `ስሙኒ ዋሌት በኢትዮጵያ ውስጥ ላሉ ተጠቃሚዎች የተነደፈ AI-የተጎለበተ የግል ፋይናንስ አስተዳደር መድረክ ነው። አገልግሎቱ ገቢ እና ወጪ እንዲከታተሉ፣ የበጀት ግቦችን እንዲያስቀምጡ፣ AI-የተፈጠሩ የፋይናንስ ግንዛቤዎችን እንዲቀበሉ እና የፋይናንስ ውሂብዎን እንዲያስተዳድሩ ያስችልዎታል — ሁሉም በኢትዮጵያ ብር (ETB) የተገለጹ።`,
  },
  {
    title: '3. የተጠቃሚ መለያዎች',
    body: `አገልግሎቱን ለመጠቀም መለያ መመዝገብ አለብዎ። የመግቢያ ምስክርነቶችዎን ሚስጥራዊነት ለመጠበቅ እና በመለያዎ ስር ለሚከሰቱ ሁሉም እንቅስቃሴዎች ኃላፊነት አለብዎ። በምዝገባ ጊዜ ትክክለኛ፣ ወቅታዊ እና ሙሉ መረጃ ለመስጠት እና እንደዚህ ያለውን መረጃ ትክክለኛ ለማድረግ ለማዘመን ተስማምተዋል።`,
  },
  {
    title: '4. ግላዊነት እና ውሂብ',
    body: `ግላዊነትዎን በቁም ነገር እንወስዳለን። የፋይናንስ ውሂብዎ AES-256 ምስጠራን በመጠቀም በደህንነት ተከማችቷል። ያለእርስዎ ግልጽ ፈቃድ የግል ውሂብዎን ለሶስተኛ ወገኖች አንሸጥም፣ አንከራይም ወይም አናናግራም፣ በህግ እንደሚፈለግ በስተቀር። አገልግሎቱን በመጠቀም፣ በግላዊነት ፖሊሲያችን ውስጥ እንደተገለጸው የውሂብዎን ስብስብ እና አጠቃቀም ተስማምተዋል።`,
  },
  {
    title: '5. AI-የተፈጠረ ይዘት',
    body: `በ AI ያለን (በ Llama 3.3 የተጎለበተ) የሚቀርቡት የፋይናንስ ግንዛቤዎች እና ምክሮች ለመረጃ ዓላማዎች ብቻ ናቸው እና ሙያዊ የፋይናንስ ምክር አይደሉም። ስሙኒ ዋሌት ፈቃድ ያለው የፋይናንስ አማካሪ አይደለም። ጉልህ የፋይናንስ ውሳኔዎችን ከማድረግዎ በፊት ሁልጊዜ ብቁ የፋይናንስ ባለሙያን ያማክሩ።`,
  },
  {
    title: '6. ተቀባይነት ያለው አጠቃቀም',
    body: `አገልግሎቱን ላለመጠቀም ተስማምተዋል። የተከለከሉ እንቅስቃሴዎች የሚከተሉትን ያካትታሉ፡ ወደ አገልግሎቱ ማንኛውም ክፍል ፈቃድ ያልተሰጠ መድረሻ ለማግኘት መሞከር፣ ተንኮል አዘል ኮድ መስቀል፣ አገልግሎቱን ለማንኛውም ሕገ-ወጥ ዓላማ መጠቀም፣ ወይም በመድረኩ ደህንነት ወይም ታማኝነት ላይ ጣልቃ መግባት። እነዚህን ደንቦች መጣስ ወዲያውኑ መለያ መዛረጥ ሊያስከትል ይችላል።`,
  },
  {
    title: '7. የአእምሮ ንብረት',
    body: `ከስሙኒ ዋሌት ጋር የተያያዙ ሁሉም ይዘቶች፣ ዲዛይን፣ ኮድ እና የምርት ስም የገንቢው (ቴድሮስ ሚሊዮን) የአእምሮ ንብረት ናቸው እና በሚተገበሩ የቅጂ መብት እና የንግድ ምልክት ህጎች የተጠበቁ ናቸው። ያለቅድመ የፅሁፍ ፈቃድ መባዛት፣ ማሰራጨት ወይም የተዋሃዶ ስራዎችን መፍጠር አይችሉም።`,
  },
  {
    title: '8. የተጠያቂነት ገደብ',
    body: `በህግ በሚፈቀደው ከፍተኛ መጠን፣ ስሙኒ ዋሌት እና ገንቢው ከአገልግሎቱ አጠቃቀም የሚመጡ ማንኛቸውም ቀጥተኛ ያልሆኑ፣ አጋጣሚያዊ፣ ልዩ ወይም ተከታይ ጉዳቶች ተጠያቂ አይሆኑም፣ ይህም የውሂብ ማጣት፣ የፋይናንስ ኪሳራ ወይም የንግድ ማቋረጥን ጨምሮ ግን የተገደበ አይደለም።`,
  },
  {
    title: '9. ማቋረጥ',
    body: `እነዚህን ውሎች በመጣስ ወይም በራሳችን ውሳኔ በማንኛውም ሌላ ምክንያት መለያዎን በማንኛውም ጊዜ የማገድ ወይም የማቋረጥ መብት እንይዛለን። እንዲሁም መለያዎን በማንኛውም ጊዜ ከመገለጫ ቅንብሮችዎ መሰረዝ ይችላሉ። በማቋረጥ ላይ፣ ውሂብዎ በ30 ቀናት ውስጥ ለዘለዓለም ይሰረዛል።`,
  },
  {
    title: '10. ያግኙን',
    body: `ስለእነዚህ የአገልግሎት ውሎች ማንኛውም ጥያቄ ካለዎ፣ እባክዎ በ tedrosmilion19@gmail.com ያግኙን ወይም በቴሌግራም @Lataxv72 ያግኙን።`,
  },
];

export default function TermsPage() {
  const { t, lang } = useLang();
  const SECTIONS = lang === 'am' ? SECTIONS_AM : SECTIONS_EN;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> {t('backToHome')}
          </Link>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <div className="flex items-center gap-2">
              <Image src="/favicon.png" alt="ስሙኒ ዋሌት" width={24} height={24} className="rounded-md" />
              <span className="text-sm font-semibold text-foreground">ስሙኒ ዋሌት</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        {/* Title */}
        <div className="mb-12 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">{t('termsPageTitle')}</p>
          <h1 className="text-4xl font-bold text-foreground">{t('termsOfService')}</h1>
          <p className="text-muted-foreground text-sm">{t('lastUpdated')} {new Date().toLocaleDateString(lang === 'am' ? 'am-ET' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <p className="text-muted-foreground leading-relaxed">
            {t('termsIntro')}
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {SECTIONS.map(({ title, body }) => (
            <div key={title} className="space-y-3">
              <h2 className="text-base font-semibold text-foreground">{title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} ስሙኒ ዋሌት. {t('footerRights')}</p>
          <div className="flex gap-4 text-xs">
            <a href="mailto:tedrosmilion19@gmail.com" className="text-muted-foreground hover:text-foreground transition-colors">tedrosmilion19@gmail.com</a>
            <a href="https://t.me/Lataxv72" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">@Lataxv72</a>
          </div>
        </div>
      </div>
    </div>
  );
}
