'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname,useRouter } from 'next/navigation';

import {
  Menu,
  Home,
  Newspaper,
  Info,
  LayoutDashboard,
  User,
  Settings,
  LogOut,
  Trophy,
  Users,
  PlusCircle,
  List,
  FileText,
  CreditCard,
  Megaphone,
  Gift,
  TicketPercent,
  TrendingUp,
  ShoppingCart,
} from 'lucide-react';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

import { Button } from '@/components/ui/button';

import { useAuth } from '@/providers/auth-provider';

import ThemeSwitcher from './ThemeSwitcher';



export default function MobileMenu() {

  const pathname = usePathname();

  const router = useRouter();

  const {
    user,
    logout,
  } = useAuth();



  const publicLinks = [
    {
      name:'Home',
      href:'/',
      icon:Home,
    },
    {
      name:'Live Scores',
      href:'/livescore',
      icon:Trophy,
    },
    {
      name:'Articles',
      href:'/articles',
      icon:Newspaper,
    },
    {
      name:'About',
      href:'/about',
      icon:Info,
    },
  ];



  const adminLinks = [

    {
      title:'Overview',
      items:[
        {
          name:'Dashboard',
          href:'/admin',
          icon:LayoutDashboard,
        },
      ],
    },

    {
      title:'Predictions',
      items:[
        {
          name:'Create Prediction',
          href:'/admin/create-prediction',
          icon:PlusCircle,
        },
        {
          name:'Manage Predictions',
          href:'/admin/predictions',
          icon:List,
        },
      ],
    },


    {
      title:'Content',
      items:[
        {
          name:'Create Article',
          href:'/admin/create-article',
          icon:FileText,
        },
        {
          name:'Manage Articles',
          href:'/admin/articles',
          icon:FileText,
        },
      ],
    },


    {
      title:'Management',
      items:[
        {
          name:'Users',
          href:'/admin/users',
          icon:Users,
        },
        {
          name:'Subscriptions',
          href:'/admin/subscriptions',
          icon:CreditCard,
        },
        {
          name:'Ads',
          href:'/admin/ads',
          icon:Megaphone,
        },
        {
          name:'Promos',
          href:'/admin/promos',
          icon:Gift,
        },
        {
          name:'Referrals',
          href:'/admin/referrals',
          icon:TicketPercent,
        },
      ],
    },

  ];



  const userLinks = [

    {
      name:'Dashboard',
      href:'/dashboard',
      icon:LayoutDashboard,
    },

    {
      name:'My Predictions',
      href:'/dashboard/predictions',
      icon:TrendingUp,
    },

    {
      name:'My Purchases',
      href:'/dashboard/purchases',
      icon:ShoppingCart,
    },

    {
      name:'Referrals & Promos',
      href:'/dashboard/referrals',
      icon:Gift,
    },

    {
      name:'My Profile',
      href:'/dashboard/profile',
      icon:User,
    },

    {
      name:'Settings',
      href:'/dashboard/settings',
      icon:Settings,
    },

  ];



  const linkClass = (active:boolean) => `
    group
    flex
    items-center
    gap-3
    rounded-2xl
    px-4
    py-3
    text-sm
    transition-all
    duration-300

    ${
      active
        ? `
          border
          border-primary/20
          bg-primary/10
          text-primary
          shadow-lg
          shadow-primary/10
        `
        : `
          text-muted-foreground
          hover:bg-accent
          hover:text-foreground
        `
    }
  `;



  return (

    <div className="lg:hidden">

      <Sheet>


        <SheetTrigger asChild>

          <Button
            variant="ghost"
            size="icon"
            className="
              rounded-xl
              hover:bg-primary/10
            "
          >

            <Menu size={24}/>

          </Button>

        </SheetTrigger>



        <SheetContent
          side="right"
          className="
            flex
            w-[340px]
            flex-col
            border-border/60
            bg-background/95
            p-0
            backdrop-blur-2xl
          "
        >


          {/* Glow */}

          <div
            className="
              pointer-events-none
              absolute
              -top-20
              right-0
              h-60
              w-60
              rounded-full
              bg-primary/20
              blur-[100px]
            "
          />



          {/* HEADER */}

          <SheetHeader
            className="
              border-b
              border-border/60
              px-6
              py-6
            "
          >

            <SheetTitle>

              <Link
                href="/"
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <Image
                  src="/logo.png"
                  alt="PredictPro"
                  width={42}
                  height={42}
                  className="rounded-xl"
                />


                <div>

                  <p
                    className="
                      text-lg
                      font-black
                      tracking-tight
                    "
                  >
                    PredictPro
                  </p>

                  <p
                    className="
                      text-xs
                      text-muted-foreground
                    "
                  >
                    Smart Football Intelligence
                  </p>

                </div>

              </Link>

            </SheetTitle>

          </SheetHeader>




          {/* SCROLL AREA */}

          <div
            className="
              flex-1
              overflow-y-auto
              px-5
              py-6
              scrollbar-hide
            "
          >


            <div className="space-y-2">


              <p
                className="
                  px-3
                  text-xs
                  font-semibold
                  uppercase
                  tracking-widest
                  text-muted-foreground
                "
              >
                Explore
              </p>


              {
                publicLinks.map(link => {

                  const Icon = link.icon;

                  return (

                    <SheetClose
                      asChild
                      key={link.href}
                    >

                      <Link
                        href={link.href}
                        className={linkClass(
                          pathname === link.href
                        )}
                      >

                        <Icon size={19}/>

                        {link.name}

                      </Link>

                    </SheetClose>

                  );

                })
              }


            </div>


{/* THEME */}

<div
  className="
    mt-8
    space-y-3
  "
>

  <div
    className="
      border-t
      border-border/60
    "
  />


  <p
    className="
      px-3
      text-xs
      font-semibold
      uppercase
      tracking-widest
      text-muted-foreground
    "
  >
    Theme
  </p>


  <div
    className="
      rounded-2xl
      border
      border-border/60
      bg-muted/30
      px-3
      py-2
    "
  >

    <ThemeSwitcher />

  </div>


</div>

            {
              user && (

                <div
                  className="
                    mt-8
                    space-y-4
                  "
                >

                  <div
                    className="
                      border-t
                      border-border/60
                    "
                  />


                  <p
                    className="
                      px-3
                      text-xs
                      font-semibold
                      uppercase
                      tracking-widest
                      text-muted-foreground
                    "
                  >
                    {
                      user.role === 'admin'
                        ? 'Administration'
                        : 'Account'
                    }
                  </p>


                  {
                    user.role === 'admin'
                      ? adminLinks.map(section => (

                          <div
                            key={section.title}
                            className="space-y-2"
                          >

                            <p
                              className="
                                px-3
                                text-[11px]
                                font-semibold
                                uppercase
                                tracking-wider
                                text-muted-foreground/70
                              "
                            >
                              {section.title}
                            </p>


                            {
                              section.items.map(link => {

                                const Icon = link.icon;

                                return (

                                  <SheetClose
                                    asChild
                                    key={link.href}
                                  >

                                    <Link
                                      href={link.href}
                                      className={linkClass(
                                        pathname === link.href
                                      )}
                                    >

                                      <Icon size={19}/>

                                      {link.name}

                                    </Link>

                                  </SheetClose>

                                );

                              })
                            }

                          </div>

                        ))

                      : userLinks.map(link => {

                          const Icon = link.icon;

                          return (

                            <SheetClose
                              asChild
                              key={link.href}
                            >

                              <Link
                                href={link.href}
                                className={linkClass(
                                  pathname === link.href
                                )}
                              >

                                <Icon size={19}/>

                                {link.name}

                              </Link>

                            </SheetClose>

                          );

                        })
                  }


                </div>

              )
            }


          </div>





          {/* FOOTER */}

          <div
            className="
              border-t
              border-border/60
              p-5
            "
          >

            {
              !user ? (

                <div className="space-y-3">

                  <SheetClose asChild>
                    <Link
                      href="/login"
                      className="
                        block
                        rounded-2xl
                        border
                        border-border
                        py-3
                        text-center
                      "
                    >
                      Login
                    </Link>
                  </SheetClose>


                  <SheetClose asChild>
                    <Link
                      href="/register"
                      className="
                        block
                        rounded-2xl
                        bg-primary
                        py-3
                        text-center
                        font-semibold
                        text-primary-foreground
                      "
                    >
                      Register
                    </Link>
                  </SheetClose>


                </div>

              ) : (

                <Button
                  onClick={async()=>{

                    await logout();

                    router.push('/login');

                  }}
                  className="
                    w-full
                    rounded-2xl
                  "
                >

                  <LogOut size={18}/>

                  Logout

                </Button>

              )
            }

          </div>



        </SheetContent>


      </Sheet>

    </div>

  );

}