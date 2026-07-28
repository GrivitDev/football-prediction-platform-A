import Navbar from '@/components/navbar/navbar';
import Footer from '@/components/footer';
import CookieConsent from '@/components/CookieConsent';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        min-h-screen
        w-full
        overflow-x-hidden
      "
    >

      <Navbar />

      <main
        className="
          w-full
        "
      >
        {children}
      </main>

      <CookieConsent />

      <Footer />

    </div>
  );
}