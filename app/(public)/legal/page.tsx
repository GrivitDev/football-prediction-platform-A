import type { Metadata } from 'next';
import Link from 'next/link';

import { LegalReadingProgress } from '@/components/legal';
import {
  LegalAccordionProvider,
  LegalSectionGroup,
} from '@/components/legal/LegalAccordionContext';

import { termsContent, termsToc } from '@/data/legal/terms';
import { privacyContent, privacyToc } from '@/data/legal/privacy';
import { cookiesContent, cookiesToc } from '@/data/legal/cookies';
import { disclaimerContent, disclaimerToc } from '@/data/legal/disclaimer';
import {
  responsibleGamblingContent,
  responsibleGamblingToc,
} from '@/data/legal/responsible-gambling';
import { refundPolicyContent, refundPolicyToc } from '@/data/legal/refund-policy';
import {
  advertisingPolicyContent,
  advertisingPolicyToc,
} from '@/data/legal/advertising-policy';
import { ownershipContent, ownershipToc } from '@/data/legal/ownership';

export const metadata: Metadata = {
  title: 'Terms of Use | HonestPredict.com',
  description:
    'Terms of use, privacy, subscriptions, refunds, disclaimers, responsible gambling, and other policies for HonestPredict.com.',
};

const groups = [
  { id: 'terms', title: 'Terms of Use', items: termsToc },
  { id: 'privacy', title: 'Privacy Policy', items: privacyToc },
  { id: 'cookies', title: 'Cookie Policy', items: cookiesToc },
  { id: 'disclaimer', title: 'Disclaimer', items: disclaimerToc },
  { id: 'responsible-gambling', title: 'Responsible Gambling', items: responsibleGamblingToc },
  { id: 'refund-policy', title: 'Refund Policy', items: refundPolicyToc },
  { id: 'advertising-policy', title: 'Advertising Policy', items: advertisingPolicyToc },
  { id: 'ownership', title: 'Ownership Information', items: ownershipToc },
];

const contentByGroup = {
  terms: termsContent,
  privacy: privacyContent,
  cookies: cookiesContent,
  disclaimer: disclaimerContent,
  'responsible-gambling': responsibleGamblingContent,
  'refund-policy': refundPolicyContent,
  'advertising-policy': advertisingPolicyContent,
  ownership: ownershipContent,
};



export default function LegalPage() {
  return (
    <>
      <LegalReadingProgress />
      <main className="mx-auto w-full max-w-[1600px] px-3 pb-8 pt-5 sm:px-6 sm:pb-12 sm:pt-8 xl:px-10">
        <header className="mb-5 border-b border-border pb-4 sm:mb-7 sm:pb-5">
          <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            HonestPredict.com
          </p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Terms of Use</h1>
          <p className="mt-2 max-w-3xl text-sm leading-5 text-muted-foreground">
            Terms and policies governing access to and use of HonestPredict.com.
          </p>
          <p className="mt-2 text-[11px] text-muted-foreground">Last updated: 15 October 2026</p>
        </header>

        <div className="grid min-w-0 grid-cols-1 items-start gap-5 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-8 xl:grid-cols-[270px_minmax(0,1fr)] xl:gap-10">


          <div className="min-w-0 space-y-4 sm:space-y-5">

            <div className="rounded-md border border-border bg-muted/20 px-3 py-3 text-xs leading-5 text-muted-foreground sm:px-4 sm:py-4">
              <p>
                By accessing or using HonestPredict.com, creating an account, or purchasing a subscription or prediction, you agree to the applicable terms below.
              </p>
              <p className="mt-2 border-t border-border pt-2 text-foreground/90">
                <strong className="font-semibold">Age and gambling disclaimer:</strong>{' '}
                This platform is not intended for anyone below 18 years of age or the higher minimum legal age applicable in their jurisdiction. You must meet the legal age requirement before using our services for betting-related purposes. Football predictions are for informational purposes only. Gambling involves financial risk, losses are possible, and no result or profit is guaranteed. Gamble responsibly and never stake money you cannot afford to lose.
              </p>
            </div>

            <article className="min-w-0 rounded-md border border-border bg-background px-3 sm:px-5">
              <LegalAccordionProvider>
                {groups.map((group, index) => (
                  <section key={group.id} className="scroll-mt-20">
                    <h2 className="border-b border-border py-3 text-sm font-semibold tracking-tight sm:text-[15px]">
                      <span className="mr-2 text-xs font-normal text-muted-foreground">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      {group.title}
                    </h2>
                    <LegalSectionGroup prefix={group.id}>
                      {contentByGroup[group.id as keyof typeof contentByGroup]}
                    </LegalSectionGroup>
                  </section>
                ))}
              </LegalAccordionProvider>
              <footer className="border-t border-border py-4 text-[11px] leading-5 text-muted-foreground">
                HonestPredict.com is owned and operated by Emco Digital Company. Website development and technical support are provided by GriviTech Company. For questions about these terms or policies, use the contact section of the website.
              </footer>
            </article>
          </div>
        </div>
      </main>
    </>
  );
}
