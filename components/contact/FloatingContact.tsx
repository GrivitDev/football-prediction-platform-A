'use client';

import { useState } from 'react';
import {
  FaWhatsapp,
  FaPhone,
  FaEnvelope,
  FaXmark,
  FaComments,
} from 'react-icons/fa6';

export function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);

  const whatsappNumber = '07080033995';
  const phoneNumber = '09019469887';
  const email = 'honestpredictinfo@gmail.com';

  const contactOptions = [
    {
      label: 'WhatsApp Chat',
      description: 'Chat with us directly',
      icon: FaWhatsapp,
      href: `https://wa.me/${whatsappNumber}`,
      color: 'bg-green-500',
    },
    {
      label: 'Call Us',
      description: phoneNumber,
      icon: FaPhone,
      href: `tel:${phoneNumber}`,
      color: 'bg-blue-500',
    },
    {
      label: 'Email Us',
      description: email,
      icon: FaEnvelope,
      href: `mailto:${email}`,
      color: 'bg-primary',
    },
  ];

  return (
    <div className="fixed bottom-6 right-5 z-[100] flex flex-col items-end gap-3">
      {/* Contact Options */}
      {isOpen && (
        <div className="w-[280px] overflow-hidden rounded-2xl border border-border bg-card/95 p-3 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          {/* Header */}
          <div className="mb-3 flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Contact Support
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                How would you like to reach us?
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close contact options"
              className="rounded-full p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <FaXmark size={14} />
            </button>
          </div>

          {/* Options */}
          <div className="space-y-2">
            {contactOptions.map((option) => {
              const Icon = option.icon;

              return (
                <a
                  key={option.label}
                  href={option.href}
                  target={
                    option.label === 'WhatsApp Chat' ? '_blank' : undefined
                  }
                  rel={
                    option.label === 'WhatsApp Chat'
                      ? 'noopener noreferrer'
                      : undefined
                  }
                  className="flex items-center gap-3 rounded-xl border border-border/50 p-3 transition-all hover:border-primary/30 hover:bg-muted/60"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white ${option.color}`}
                  >
                    <Icon size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      {option.label}
                    </p>

                    <p className="truncate text-xs text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>

          <p className="mt-3 text-center text-[10px] text-muted-foreground">
            We are here to help you.
          </p>
        </div>
      )}

      {/* Floating Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Close contact menu' : 'Open contact menu'}
        aria-expanded={isOpen}
        className={`group relative flex h-14 w-14 items-center justify-center rounded-full shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 ${
          isOpen
            ? 'bg-primary text-primary-foreground'
            : 'bg-green-500 text-white'
        }`}
      >
        {/* Pulse Effect */}
        {!isOpen && (
          <span className="absolute inset-0 animate-ping rounded-full bg-green-500/40" />
        )}

        <span className="relative z-10">
          {isOpen ? (
            <FaXmark size={25} />
          ) : (
            <FaWhatsapp size={35} />
          )}
        </span>
      </button>
    </div>
  );
}