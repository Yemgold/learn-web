

import {
  HelpCircle,
  Trophy,
  Users,
  BookOpen,
  ChevronRight,
} from "lucide-react";

import { Card } from "@/components/ui/card";

const faqs = [
  {
    icon: <Users className="h-6 w-6 text-blue-600" />,
    question: "Who can participate in JAMB League?",
    answer:
      "Any secondary school student preparing for the UTME can participate. Students compete in teams of three.",
  },
  {
    icon: <BookOpen className="h-6 w-6 text-emerald-600" />,
    question: "How are competitions conducted?",
    answer:
      "Competitions are conducted online using a CBT platform that simulates the real JAMB examination environment.",
  },
  {
    icon: <Trophy className="h-6 w-6 text-amber-500" />,
    question: "Are there prizes for winners?",
    answer:
      "Yes. Top-performing teams receive scholarships, cash prizes, medals, certificates, and national recognition.",
  },
  {
    icon: <HelpCircle className="h-6 w-6 text-purple-600" />,
    question: "How many students make a team?",
    answer:
      "Each team must consist of exactly three students before registration can be completed.",
  },
  {
    icon: <BookOpen className="h-6 w-6 text-sky-600" />,
    question: "Can I practice before competitions?",
    answer:
      "Absolutely. Every registered student has access to practice tests, subject quizzes, and performance analytics.",
  },
  {
    icon: <Users className="h-6 w-6 text-rose-600" />,
    question: "Can schools register multiple teams?",
    answer:
      "Yes. Schools can register multiple teams provided each student belongs to only one team.",
  },
  {
    icon: <HelpCircle className="h-6 w-6 text-indigo-600" />,
    question: "How are rankings calculated?",
    answer:
      "Rankings are based on competition scores, accuracy, completion time, and consistency across multiple competitions.",
  },
  {
    icon: <Trophy className="h-6 w-6 text-yellow-500" />,
    question: "Will participants receive certificates?",
    answer:
      "Yes. Every participant receives a digital certificate, while top-performing teams receive special awards and recognition.",
  },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 py-20 text-white">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-5 py-2 text-sm font-semibold">
            <HelpCircle className="h-4 w-4" />
            Frequently Asked Questions
          </div>

          <h1 className="text-5xl font-bold">
            Everything You Need to Know
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-blue-100">
            Find answers to the most common questions about JAMB
            League, competitions, team registration, practice tests,
            prizes, and rankings.
          </p>
        </div>
      </section>

      {/* FAQs */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid gap-6 lg:grid-cols-2">
          {faqs.map((faq) => (
            <Card
              key={faq.question}
              hoverable
              className="transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-slate-100 p-3">
                  {faq.icon}
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900">
                    {faq.question}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-600">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 pb-20">
        <Card className="bg-blue-600 p-10 text-center text-white">
          <h2 className="text-3xl font-bold">
            Still Have Questions?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-blue-100">
            Our support team is always ready to help you with
            registration, competitions, practice tests, or any other
            enquiries.
          </p>

          <div className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-blue-700 transition hover:bg-blue-50">
            Contact Support
            <ChevronRight className="h-5 w-5" />
          </div>
        </Card>
      </section>
    </main>
  );
}