




"use client";

import { MessageCircle, ArrowUpRight, Users, BookOpen } from "lucide-react";

const WHATSAPP_CHANNEL_URL =
  "https://whatsapp.com/channel/0029Vb94QrF72WU1tP9Qg13r";

export default function WhatsAppCommunityCard() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-green-200/70 bg-gradient-to-br from-green-50 via-white to-emerald-100 p-5 shadow-sm dark:border-green-900/60 dark:from-slate-900 dark:via-slate-900 dark:to-green-950/40 sm:p-6">
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-green-200/30 blur-2xl dark:bg-green-500/10" />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-600 text-white shadow-md shadow-green-600/20">
            <MessageCircle size={30} />
          </div>

          <div className="min-w-0">
            <span className="mb-2 inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800 dark:bg-green-900/50 dark:text-green-300">
              LEARNYFI COMMUNITY
            </span>

            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl">
              Join Learnyfi on WhatsApp!
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              Stay updated with JAMB and WAEC news, learning resources,
              study tips, and important Learnyfi announcements.
            </p>

            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-600 dark:text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <BookOpen size={14} />
                Exam updates
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users size={14} />
                Student community
              </span>
            </div>
          </div>
        </div>

        <a
          href={WHATSAPP_CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
        >
          <MessageCircle size={18} />
          Follow Our Channel
          <ArrowUpRight size={16} />
        </a>
      </div>
    </section>
  );
}
