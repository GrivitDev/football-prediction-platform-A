'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  useEffect,
  useState,
} from 'react';

import {
  ChevronDown,
  ChevronRight,
} from 'lucide-react';


interface LegalItem {
  id: string;
  title: string;
}


interface LegalDocument {
  title: string;
  href: string;
  items: LegalItem[];
}


interface LegalTableOfContentsProps {
  documents: LegalDocument[];
}


export default function LegalTableOfContents({
  documents,
}: LegalTableOfContentsProps) {


  const pathname = usePathname();


  const [openDocument, setOpenDocument] =
    useState<string | null>(null);



  const [active, setActive] =
    useState('');



  useEffect(() => {

    const current =
      documents.find(
        (doc) =>
          doc.href === pathname
      );


    if (current) {
      setOpenDocument(current.href);
    }

  }, [pathname, documents]);




  useEffect(() => {

    const current =
      documents.find(
        (doc) =>
          doc.href === pathname
      );


    if (!current) return;



    const sections =
      current.items
        .map((item) =>
          document.getElementById(item.id)
        )
        .filter(Boolean);



    const observer =
      new IntersectionObserver(

        (entries) => {

          entries.forEach((entry) => {

            if (entry.isIntersecting) {
              setActive(entry.target.id);
            }

          });

        },

        {
          rootMargin:
            '-20% 0px -70% 0px',
        }

      );



    sections.forEach((section) => {

      if (section) {
        observer.observe(section);
      }

    });



    return () => {

      sections.forEach((section) => {

        if (section) {
          observer.unobserve(section);
        }

      });

    };


  }, [pathname, documents]);





  return (

<nav
  className="
    max-h-[calc(100vh-8rem)]
    overflow-y-auto
    scrollbar-hide
    rounded-3xl
    border
    bg-background/50
    p-5
    backdrop-blur-xl
  "
>

      <h3
        className="
          mb-5
          text-sm
          font-bold
          uppercase
          tracking-wider
          text-muted-foreground
        "
      >
        Legal Documentation
      </h3>



      <div
        className="
          space-y-2
        "
      >


        {documents.map((document) => {


          const opened =
            openDocument === document.href;



          return (

            <div
              key={document.href}
            >


              <button

                onClick={() =>
                  setOpenDocument(
                    opened
                      ? null
                      : document.href
                  )
                }

                className="
                  flex
                  w-full
                  items-center
                  justify-between
                  rounded-xl
                  px-3
                  py-3
                  text-left
                  text-sm
                  font-semibold
                  transition
                  hover:bg-muted
                "
              >

                <Link
                  href={document.href}
                >
                  {document.title}
                </Link>


                {opened ? (
                  <ChevronDown
                    className="h-4 w-4"
                  />
                ) : (
                  <ChevronRight
                    className="h-4 w-4"
                  />
                )}

              </button>



              {opened && (

                <ul
                  className="
                    mt-2
                    space-y-1
                    border-l
                    pl-4
                  "
                >

                  {document.items.map(
                    (item) => (

                      <li
                        key={item.id}
                      >

                        <Link

                          href={`${document.href}#${item.id}`}

                          className={`
                            block
                            rounded-lg
                            px-3
                            py-2
                            text-sm
                            transition

                            ${
                              active === item.id
                                ? 
                                'bg-primary/10 text-primary font-semibold'
                                :
                                'text-muted-foreground hover:text-foreground'
                            }
                          `}

                        >
                          {item.title}

                        </Link>

                      </li>

                    )
                  )}

                </ul>

              )}

            </div>

          );

        })}


      </div>


    </nav>

  );
}