'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export default function CookieConsent() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');

    /* No authentication token: the banner is already visible. */
    if (!token) {
      setVisible(true);
      setCheckingAuth(false);
      return;
    }

    /*
     * Authentication token exists.
     * Verify that it is a valid, non-expired JWT.
     */
    try {
      const decoded = jwtDecode<{ exp?: number }>(token);

      const expired =
        typeof decoded.exp === 'number' &&
        decoded.exp * 1000 <= Date.now();

      if (expired) {
        Cookies.remove('token');
        setVisible(true);
      } else {
        setVisible(false);
      }
    } catch {
      /*
       * Invalid token means the visitor should be treated
       * as logged out.
       */
      Cookies.remove('token');
      setVisible(true);
    }

    setCheckingAuth(false);

  }, []);

  /*
   * Do not render anything while authentication state
   * is being checked. This prevents a logged-in user from
   * seeing the banner briefly during hydration.
   */
  if (checkingAuth || !visible) {
    return null;
  }

  const saveConsent = () => {
    /*
     * Intentionally do NOT save anything to localStorage.
     *
     * The banner disappears for the current page session,
     * but will appear again on a future visit/page load.
     */
    setVisible(false);
  };

  return (
    <div
      className="
        fixed
        bottom-4
        left-4
        right-4
        z-[200]
        mx-auto
        max-w-5xl
        rounded-3xl
        border
        border-border
        bg-background/90
        p-6
        shadow-2xl
        backdrop-blur-xl
      "
    >
      <div
        className="
          flex
          flex-col
          gap-5
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >
        <div
          className="
            max-w-3xl
          "
        >
          <h3
            className="
              text-lg
              font-bold
              text-foreground
            "
          >
            We value your privacy
          </h3>

          <p
            className="
              mt-2
              text-sm
              text-muted-foreground
            "
          >
            We use cookies to improve your experience,
            maintain security, analyze website usage, and
            support advertising services. You can manage
            your preferences at any time.
          </p>

          <Link
            href="/cookie-policy"
            className="
              mt-3
              inline-block
              text-sm
              font-semibold
              text-primary
              hover:underline
            "
          >
            Read our Cookie Policy
          </Link>
        </div>

        <div
          className="
            flex
            gap-3
          "
        >
          <button
            type="button"
            onClick={saveConsent}
            className="
              rounded-xl
              border
              border-border
              px-5
              py-3
              text-sm
              font-semibold
              text-foreground
              transition
              hover:bg-muted
            "
          >
            Reject
          </button>

          <button
            type="button"
            onClick={saveConsent}
            className="
              rounded-xl
              bg-primary
              px-5
              py-3
              text-sm
              font-semibold
              text-primary-foreground
              transition
              hover:opacity-90
            "
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}