import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

const SECTIONS = [
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

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <div className="flex items-center gap-2">
            <Image src="/favicon.png" alt="ስሙኒ ዋሌት" width={24} height={24} className="rounded-md" />
            <span className="text-sm font-semibold text-foreground">ስሙኒ ዋሌት</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        {/* Title */}
        <div className="mb-12 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">Legal</p>
          <h1 className="text-4xl font-bold text-foreground">Terms of Service</h1>
          <p className="text-muted-foreground text-sm">Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <p className="text-muted-foreground leading-relaxed">
            Please read these Terms of Service carefully before using ስሙኒ ዋሌት. These terms govern your access to and use of our platform.
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
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} ስሙኒ ዋሌት. All rights reserved.</p>
          <div className="flex gap-4 text-xs">
            <a href="mailto:tedrosmilion19@gmail.com" className="text-muted-foreground hover:text-foreground transition-colors">tedrosmilion19@gmail.com</a>
            <a href="https://t.me/Lataxv72" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">@Lataxv72</a>
          </div>
        </div>
      </div>
    </div>
  );
}
