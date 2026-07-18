import {
  LegalTableOfContents,
  LegalBreadcrumb,
} from '@/components/legal';

import {
  legalNavigation,
} from '@/data/legal/navigation';


interface LegalContentLayoutProps {
  title: string;
  children: React.ReactNode;
}


export default function LegalContentLayout({
  title,
  children,
}: LegalContentLayoutProps) {

  return (
    <div
      className="
        grid
        gap-10
        lg:grid-cols-[280px_1fr]
      "
    >

      <aside
        className="
          lg:sticky
          lg:top-24
          lg:h-fit
        "
      >

        <LegalTableOfContents
          documents={legalNavigation}
        />

      </aside>



      <main>

        <LegalBreadcrumb
          current={title}
        />


        <div>
          {children}
        </div>


      </main>


    </div>
  );
}