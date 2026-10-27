
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  Users,
  AlertCircle,
  X,
  UserPlus,
  GraduationCap,
  LockKeyhole,
} from "lucide-react";

interface Agent {
  id: string;
  name: string;
  phone: string;
  whatsappNumber: string;
  state: string;
  city: string;
  address: string;
  isRecruitment?: boolean;
}

const NIGERIAN_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
  "Federal Capital Territory (FCT)",
];

const AGENTS: Agent[] = [
  {
    id: "ekiti-1",
    name: "Bright Future Learning Hub",
    phone: "07067853764",
    whatsappNumber: "07067853764",
    state: "Ekiti",
    city: "",
    address: "",
  },
  {
    id: "ondo-1",
    name: "Success Point Agents",
    phone: "08062699331",
    whatsappNumber: "08062699331",
    state: "Ondo",
    city: "",
    address: "",
  },
  ...NIGERIAN_STATES.filter(
    (state) => state !== "Ekiti" && state !== "Ondo",
  ).map((state) => ({
    id: `recruitment-${state.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    name: "Become a Learnyfi Agent",
    phone: "",
    whatsappNumber: "",
    state,
    city: "",
    address: "",
    isRecruitment: true,
  })),
];

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function getWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");

  if (digits.startsWith("0") && digits.length === 11) {
    return `234${digits.slice(1)}`;
  }

  if (digits.startsWith("234") && digits.length === 13) {
    return digits;
  }

  if (digits.length === 10) {
    return `234${digits}`;
  }

  return digits;
}

export default function SecondaryAgentsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filteredAgents = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return AGENTS;

    return AGENTS.filter((agent) =>
      [
        agent.name,
        agent.phone,
        agent.whatsappNumber,
        agent.state,
        agent.city,
        agent.address,
        agent.isRecruitment
          ? "contact us become an agent recruitment"
          : "available agent pin",
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [search]);

  function handleCall(phone: string) {
    if (!phone) return;

    window.location.href = `tel:${phone.replace(/[^\d+]/g, "")}`;
  }

  function handleWhatsApp(phone: string) {
    const number = getWhatsAppNumber(phone);

    if (!number) return;

    const message = encodeURIComponent(
      "Hello, I want to buy a Learnyfi Secondary Plan PIN. Please let me know the payment instructions.",
    );

    window.open(
      `https://wa.me/${number}?text=${message}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 sm:py-8 lg:py-10">
        {/* Back navigation */}
        <button
          type="button"
          onClick={() => router.push("/student/access/secondary")}
          className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-sm font-semibold text-slate-300 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to payment
        </button>

        {/* Page header */}
        <section className="relative mt-5 overflow-hidden rounded-3xl border border-indigo-400/20 bg-gradient-to-br from-indigo-950 via-slate-900 to-violet-950 p-5 shadow-2xl shadow-black/20 sm:p-8 lg:p-9">
          <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full bg-indigo-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 left-1/3 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative flex items-center gap-4 sm:gap-6">
            <div className="min-w-0 flex-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-300/20 bg-indigo-400/10 px-3 py-1.5 text-xs font-bold text-indigo-200">
                <ShieldCheck className="h-4 w-4" />
                Learnyfi PIN agents
              </div>

              <h1 className="mt-4 text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
                Find a Learnyfi PIN Agent
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Find an agent in your state, contact them directly, and
                ask how to purchase your Secondary Plan PIN. If your state
                has no listed agent yet, contact Learnyfi to become an agent.
              </p>
            </div>

            <div className="hidden shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] p-5 text-indigo-200 sm:flex">
              <Users className="h-10 w-10 lg:h-12 lg:w-12" />
            </div>
          </div>

          <div className="relative mt-6 flex flex-wrap gap-x-5 gap-y-3 border-t border-white/10 pt-5">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Contact agents directly
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-300">
              <MapPin className="h-4 w-4 text-indigo-300" />
              Listings across Nigerian states
            </div>
          </div>
        </section>

        {/* Safety notice */}
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] p-4 sm:mt-6 sm:p-5">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />

          <div className="text-sm leading-6 text-amber-100/90">
            <p className="font-bold text-amber-200">
              Stay safe when buying a PIN
            </p>

            <p className="mt-1">
              Confirm the price and payment instructions before paying.
              Never share your password or OTP with an agent. Contact the
              agent using the number displayed on this page.
            </p>
          </div>
        </div>

        {/* Search */}
        <section className="mt-7 sm:mt-9">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-black tracking-tight text-white sm:text-2xl">
                Agents by state
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Search by agent name, state, or phone number.
              </p>
            </div>

            <p className="text-sm font-medium text-slate-400">
              <span className="font-bold text-slate-200">
                {filteredAgents.length}
              </span>{" "}
              {filteredAgents.length === 1 ? "listing" : "listings"} found
            </p>
          </div>

          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 px-4 transition focus-within:border-indigo-500/60 focus-within:ring-4 focus-within:ring-indigo-500/10">
            <Search className="h-5 w-5 shrink-0 text-slate-500" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search Ekiti, Ondo, Lagos..."
              aria-label="Search agents by state or name"
              className="min-w-0 flex-1 bg-transparent py-4 text-sm text-white outline-none placeholder:text-slate-500"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-800 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </section>

        {/* Agent directory */}
        {filteredAgents.length > 0 ? (
          <section className="mt-5 grid grid-cols-1 gap-4 sm:mt-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredAgents.map((agent) => (
              <article
                key={agent.id}
                className="flex min-w-0 flex-col rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-lg shadow-black/10 transition duration-200 hover:-translate-y-0.5 hover:border-slate-700 hover:shadow-xl sm:rounded-3xl sm:p-5"
              >
                {/* Agent identity */}
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border sm:h-14 sm:w-14 sm:rounded-2xl ${
                      agent.isRecruitment
                        ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                        : "border-indigo-400/20 bg-indigo-500/10 text-indigo-200"
                    }`}
                  >
                    {agent.isRecruitment ? (
                      <UserPlus className="h-6 w-6" />
                    ) : (
                      <span className="text-sm font-black sm:text-base">
                        {getInitials(agent.name)}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="break-words text-sm font-extrabold leading-6 text-white sm:text-base">
                      {agent.isRecruitment
                        ? "Become a Learnyfi Agent"
                        : agent.name}
                    </h3>

                    <span
                      className={`mt-1.5 inline-flex items-center gap-1 text-xs font-semibold ${
                        agent.isRecruitment
                          ? "text-emerald-300"
                          : "text-indigo-300"
                      }`}
                    >
                      {agent.isRecruitment ? (
                        <>
                          <UserPlus className="h-4 w-4" />
                          Agent opportunity
                        </>
                      ) : (
                        <>
                          <BadgeCheck className="h-4 w-4" />
                          PIN contact
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* State information */}
                <div className="mt-5 flex items-start gap-3 text-sm">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />

                  <div className="min-w-0">
                    <p className="font-bold text-slate-200">
                      {agent.state}
                    </p>

                    {agent.city && (
                      <p className="mt-1 text-xs text-slate-400">
                        {agent.city}
                      </p>
                    )}

                    {agent.address && (
                      <p className="mt-1 break-words text-xs leading-5 text-slate-400">
                        {agent.address}
                      </p>
                    )}
                  </div>
                </div>

                {/* Contact information or recruitment invitation */}
                {agent.isRecruitment ? (
                  <div className="mt-4 flex-1 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.05] p-4">
                    <p className="text-sm font-bold text-emerald-200">
                      No agent listed in this state yet?
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Contact Learnyfi to become an agent and help students
                      in your state access their Secondary Plan.
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 flex-1 rounded-xl border border-slate-800 bg-slate-950/70 p-3.5">
                    <p className="text-xs font-medium text-slate-500">
                      Phone number
                    </p>

                    <p className="mt-1 break-all text-sm font-bold tracking-wide text-slate-200">
                      {agent.phone}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-auto grid grid-cols-2 gap-2.5 pt-5">
                  {agent.isRecruitment ? (
                    <div className="col-span-2 flex min-h-11 items-center justify-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] px-3 py-2.5 text-center text-xs font-bold text-emerald-200 sm:text-sm">
                      <UserPlus className="h-4 w-4 shrink-0" />
                      Contact us to become an agent
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleCall(agent.phone)}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/70 px-3 py-2.5 text-sm font-bold text-slate-200 transition hover:border-indigo-400/40 hover:bg-indigo-500/10 hover:text-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                      >
                        <Phone className="h-4 w-4" />
                        Call
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleWhatsApp(
                            agent.whatsappNumber || agent.phone,
                          )
                        }
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                      >
                        <MessageCircle className="h-4 w-4" />
                        WhatsApp
                      </button>
                    </>
                  )}
                </div>
              </article>
            ))}
          </section>
        ) : (
          <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 px-5 py-12 text-center sm:px-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950">
              <Search className="h-7 w-7 text-indigo-300" />
            </div>

            <h3 className="mt-4 font-extrabold text-white">
              No matching states or agents
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Try searching for another state or agent name.
            </p>

            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-4 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-bold text-slate-200 transition hover:bg-slate-700"
            >
              Clear search
            </button>
          </div>
        )}

        {/* PIN instructions */}
        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:mt-10 sm:rounded-3xl sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-500/10 text-indigo-300">
              <GraduationCap className="h-5 w-5" />
            </div>

            <div>
              <h3 className="font-extrabold text-white">
                What happens after I buy a PIN?
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-400">
                Follow these steps to activate your Secondary Plan.
              </p>
            </div>
          </div>

          <ol className="mt-5 grid gap-4 sm:grid-cols-3">
            <li className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-3.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-indigo-400/20 bg-indigo-500/10 text-xs font-black text-indigo-200">
                1
              </span>

              <span className="text-sm leading-6 text-slate-300">
                Contact an agent and confirm the price and payment
                instructions.
              </span>
            </li>

            <li className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-3.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-indigo-400/20 bg-indigo-500/10 text-xs font-black text-indigo-200">
                2
              </span>

              <span className="text-sm leading-6 text-slate-300">
                Complete payment and obtain your PIN from the agent.
              </span>
            </li>

            <li className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-3.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-indigo-400/20 bg-indigo-500/10 text-xs font-black text-indigo-200">
                3
              </span>

              <span className="text-sm leading-6 text-slate-300">
                Return to Learnyfi and redeem the PIN to activate your plan.
              </span>
            </li>
          </ol>

          <div className="mt-5 border-t border-slate-800 pt-4">
            <button
              type="button"
              onClick={() => router.push("/student/access/secondary")}
              className="inline-flex min-h-10 items-center gap-2 rounded-xl text-sm font-bold text-indigo-300 transition hover:text-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <ArrowLeft className="h-4 w-4" />
              Return to Secondary Plan
            </button>
          </div>
        </section>

        {/* Footer security note */}
        <div className="mt-5 flex items-center justify-center gap-2 px-2 text-center">
          <LockKeyhole className="h-3.5 w-3.5 shrink-0 text-slate-600" />

          <p className="text-xs leading-5 text-slate-500">
            Confirm payment details directly with the agent before sending money.
          </p>
        </div>
      </div>
    </main>
  );
}
