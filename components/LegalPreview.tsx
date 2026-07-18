import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  FileText,
  Cookie,
  AlertTriangle,
  RotateCcw,
  Megaphone,
} from 'lucide-react';


const legalItems = [
  {
    title: 'Privacy Policy',
    description:
      'Learn how we collect, use, and protect your personal information.',
    href: '/privacy-policy',
    icon: ShieldCheck,
  },

  {
    title: 'Terms & Conditions',
    description:
      'Understand the rules and conditions that guide the use of our platform.',
    href: '/terms-and-conditions',
    icon: FileText,
  },

  {
    title: 'Cookie Policy',
    description:
      'Learn how cookies help us improve experience, security, and services.',
    href: '/cookie-policy',
    icon: Cookie,
  },

  {
    title: 'Disclaimer',
    description:
      'Important information about predictions, accuracy, and user responsibility.',
    href: '/disclaimer',
    icon: AlertTriangle,
  },

  {
    title: 'Refund Policy',
    description:
      'Understand payment conditions, subscriptions, and refund eligibility.',
    href: '/refund-policy',
    icon: RotateCcw,
  },

  {
    title: 'Advertising Policy',
    description:
      'Learn how advertisements support our platform while maintaining transparency.',
    href: '/advertising-policy',
    icon: Megaphone,
  },
];


export default function LegalPreview() {

  return (

    <section
      className="
        relative
        overflow-hidden
        py-20
      "
    >

      <div
        className="
          absolute
          inset-0
          bg-gradient-to-b
          from-transparent
          via-muted/20
          to-transparent
        "
      />


      <div
        className="
          relative
          mx-auto
          max-w-7xl
          px-6
        "
      >


        <div
          className="
            mb-12
            max-w-3xl
          "
        >

          <span
            className="
              text-sm
              font-semibold
              uppercase
              tracking-[0.25em]
              text-primary
            "
          >
            Transparency
          </span>


          <h2
            className="
              mt-4
              text-3xl
              font-black
              md:text-5xl
            "
          >
            Platform Policies & Information
          </h2>


          <p
            className="
              mt-5
              leading-8
              text-muted-foreground
            "
          >
            We believe in providing a transparent and
            trustworthy experience. Explore our policies
            covering privacy, payments, responsible use,
            cookies, and platform guidelines.
          </p>

        </div>



        <div
          className="
            grid
            gap-6
            md:grid-cols-2
            lg:grid-cols-3
          "
        >

          {legalItems.map(
            ({
              title,
              description,
              href,
              icon: Icon,
            }) => (

              <Link
                key={href}
                href={href}
                className="
                  group
                  rounded-3xl
                  border
                  border-border/60
                  bg-background/60
                  p-6
                  backdrop-blur-xl
                  transition
                  hover:-translate-y-1
                  hover:border-primary/40
                "
              >

                <div
                  className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-2xl
                    bg-primary/10
                    text-primary
                  "
                >

                  <Icon
                    className="
                      h-6
                      w-6
                    "
                  />

                </div>



                <h3
                  className="
                    mt-6
                    text-xl
                    font-bold
                  "
                >
                  {title}
                </h3>


                <p
                  className="
                    mt-3
                    text-sm
                    leading-7
                    text-muted-foreground
                  "
                >
                  {description}
                </p>



                <div
                  className="
                    mt-5
                    flex
                    items-center
                    text-sm
                    font-semibold
                    text-primary
                  "
                >

                  Read More

                  <ArrowRight
                    className="
                      ml-2
                      h-4
                      w-4
                      transition
                      group-hover:translate-x-1
                    "
                  />

                </div>


              </Link>

            )
          )}

        </div>


      </div>

    </section>

  );
}