'use client';

import { FaWhatsapp } from 'react-icons/fa6';

export function FloatingContact() {
  const whatsappNumber = '2347080033995';

  return (
    <a
      href={`https://wa.me/message/OYUYWOJYMYSUH1`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact us on WhatsApp"
      className="
        fixed
        bottom-6
        right-5
        z-[100]
        flex
        h-14
        w-14
        items-center
        justify-center
        rounded-full
        bg-green-500
        text-white
        shadow-xl
        transition-all
        duration-300
        hover:scale-105
        hover:bg-green-600
        active:scale-95
      "
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-green-500/30" />

      <FaWhatsapp className="relative z-10" size={34} />
    </a>
  );
}