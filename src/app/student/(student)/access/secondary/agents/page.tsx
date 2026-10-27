





"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  ShieldCheck,
  Users,
  AlertCircle,
  X,
  UserPlus,
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

/**
 * Directory preview data.
 * The two supplied agent contacts are included below.
 * Other states display an invitation to become a Learnyfi agent.
 */
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
    name: `Become a Learnyfi Agent`,
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
        agent.isRecruitment ? "contact us become an agent" : "available agent",
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
      "Hello, I want to buy a Learnyfi Secondary Plan PIN. Please let me know the price and payment instructions.",
    );

    window.open(
      `https://wa.me/${number}?text=${message}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 sm:py-8 lg:py-10">
        {/* Back navigation */}
        <button
          type="button"
          onClick={() => router.push("/student/access/secondary")}
          className="inline-flex min-h-10 items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to payment
        </button>

        {/* Header */}
        <section className="relative mt-4 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-800 via-blue-700 to-indigo-700 p-5 text-white shadow-lg sm:mt-5 sm:rounded-3xl sm:p-8 lg:p-9">
          <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

          <div className="relative flex items-center gap-4 sm:gap-6">
            <div className="min-w-0 flex-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold">
                <ShieldCheck className="h-4 w-4" />
                Learnyfi PIN agents
              </div>

              <h1 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
                Find a Learnyfi PIN Agent
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
                Find an agent in your state, contact them directly, and ask
                how to purchase your Secondary Plan PIN. If your state has
                no listed agent yet, contact Learnyfi to become an agent.
              </p>
            </div>

            <div className="hidden shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 p-5 sm:flex">
              <Users className="h-10 w-10 lg:h-12 lg:w-12" />
            </div>
          </div>

          <div className="relative mt-6 flex flex-wrap gap-3 border-t border-white/15 pt-5">
            <div className="flex items-center gap-2 text-sm text-blue-50">
              <ShieldCheck className="h-4 w-4" />
              Contact agents directly
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-50">
              <MapPin className="h-4 w-4" />
              Listings across Nigerian states
            </div>
          </div>
        </section>

        {/* Safety notice */}
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:mt-6 sm:p-5">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />

          <div className="text-sm leading-6 text-amber-950">
            <p className="font-bold">Stay safe when buying a PIN</p>
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
              <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">
                Agents by state
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Search by agent name, state, or phone number.
              </p>
            </div>

            <p className="text-sm font-medium text-slate-500">
              {filteredAgents.length}{" "}
              {filteredAgents.length === 1 ? "listing" : "listings"} found
            </p>
          </div>

          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 shadow-sm transition focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100">
            <Search className="h-5 w-5 shrink-0 text-slate-400" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search Ekiti, Ondo, Lagos..."
              aria-label="Search agents by state or name"
              className="min-w-0 flex-1 bg-transparent py-4 text-sm outline-none placeholder:text-slate-400"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </section>

        {/* Agent and recruitment cards */}
        {filteredAgents.length > 0 ? (
          <section className="mt-5 grid grid-cols-1 gap-4 sm:mt-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredAgents.map((agent) => (
              <article
                key={agent.id}
                className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:rounded-3xl sm:p-5"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl sm:h-14 sm:w-14 sm:rounded-2xl ${
                      agent.isRecruitment
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-700"
                    }`}
                  >
                    {agent.isRecruitment ? (
                      <UserPlus className="h-6 w-6" />
                    ) : (
                      <span className="text-sm font-extrabold sm:text-base">
                        {getInitials(agent.name)}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="break-words text-sm font-bold leading-5 text-slate-900 sm:text-base">
                      {agent.isRecruitment
                        ? `Become a Learnyfi Agent`
                        : agent.name}
                    </h3>

                    <span
                      className={`mt-1.5 inline-flex items-center gap-1 text-xs font-semibold ${
                        agent.isRecruitment
                          ? "text-emerald-700"
                          : "text-blue-700"
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

                <div className="mt-5 flex items-start gap-3 text-sm text-slate-600">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800">
                      {agent.state}
                    </p>

                    {agent.city && (
                      <p className="mt-1 text-xs text-slate-500">
                        {agent.city}
                      </p>
                    )}

                    {agent.address && (
                      <p className="mt-1 break-words text-xs leading-5 text-slate-500">
                        {agent.address}
                      </p>
                    )}
                  </div>
                </div>

                {agent.isRecruitment ? (
                  <div className="mt-4 flex-1 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                    <p className="text-sm font-bold text-emerald-900">
                      No agent listed in this state yet?
                    </p>
                    <p className="mt-1 text-sm leading-5 text-emerald-800">
                      Contact us to become a Learnyfi agent and help students
                      in your state access their Secondary Plan.
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 flex-1 rounded-xl bg-slate-50 p-3">
                    <p className="text-xs font-medium text-slate-500">
                      Phone number
                    </p>
                    <p className="mt-1 break-all text-sm font-bold text-slate-900">
                      {agent.phone}
                    </p>
                  </div>
                )}

                <div className="mt-auto grid grid-cols-2 gap-2.5 pt-5">
                  {agent.isRecruitment ? (
                    <div className="col-span-2 flex min-h-11 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-center text-sm font-bold text-emerald-800">
                      <UserPlus className="h-4 w-4 shrink-0" />
                      Contact us to become an agent
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleCall(agent.phone)}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
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
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
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
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-5 py-12 text-center sm:rounded-3xl sm:px-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
              <Search className="h-7 w-7 text-blue-600" />
            </div>

            <h3 className="mt-4 font-bold text-slate-900">
              No matching states or agents
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Try searching for another state or agent name.
            </p>

            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-4 rounded-xl px-4 py-2 text-sm font-bold text-blue-700 hover:bg-blue-50"
            >
              Clear search
            </button>
          </div>
        )}

        {/* PIN purchase instructions */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 sm:mt-10 sm:rounded-3xl sm:p-6">
          <h3 className="font-extrabold text-slate-900">
            What happens after I buy a PIN?
          </h3>

          <ol className="mt-4 grid gap-4 sm:grid-cols-3">
            <li className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-extrabold text-blue-700">
                1
              </span>
              <span className="text-sm leading-6 text-slate-600">
                Contact an agent and confirm the price and payment
                instructions.
              </span>
            </li>

            <li className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-extrabold text-blue-700">
                2
              </span>
              <span className="text-sm leading-6 text-slate-600">
                Complete payment and obtain your PIN from the agent.
              </span>
            </li>

            <li className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-extrabold text-blue-700">
                3
              </span>
              <span className="text-sm leading-6 text-slate-600">
                Return to Learnyfi and redeem the PIN to activate your plan.
              </span>
            </li>
          </ol>

          <div className="mt-6 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => router.push("/student/access/secondary")}
              className="inline-flex min-h-10 items-center gap-2 rounded-xl text-sm font-bold text-blue-700 transition hover:text-blue-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <ArrowLeft className="h-4 w-4" />
              Return to Secondary Plan
            </button>
          </div>
        </section>

        <p className="mt-5 text-center text-xs leading-5 text-slate-400">
          Agent listings and recruitment opportunities are displayed by state.
          Please confirm payment details directly with the agent.
        </p>
      </div>
    </main>
  );
}


















// "use client";

// import {
//   useCallback,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";
// import { useRouter } from "next/navigation";
// import {
//   ArrowLeft,
//   BadgeCheck,
//   Building2,
//   MapPin,
//   MessageCircle,
//   Phone,
//   RefreshCw,
//   Search,
//   ShieldCheck,
//   Users,
//   AlertCircle,
//   LoaderCircle,
//   X,
// } from "lucide-react";

// import { axiosInstance as api } from "@/lib/api/axios";

// /**
//  * IMPORTANT:
//  * Replace this with your actual backend endpoint if the route differs.
//  * The endpoint must return active/authorized agents.
//  */
// const AGENTS_ENDPOINT = "/agents/get-active-agents";

// interface Agent {
//   id: string;
//   name: string;
//   phone: string;
//   whatsappNumber: string;
//   state: string;
//   city: string;
//   address: string;
//   isVerified: boolean;
// }

// type UnknownRecord = Record<string, unknown>;

// function isRecord(value: unknown): value is UnknownRecord {
//   return (
//     typeof value === "object" &&
//     value !== null &&
//     !Array.isArray(value)
//   );
// }

// function getString(
//   record: UnknownRecord,
//   keys: string[],
// ): string {
//   for (const key of keys) {
//     const value = record[key];

//     if (typeof value === "string" && value.trim()) {
//       return value.trim();
//     }

//     if (typeof value === "number") {
//       return String(value);
//     }
//   }

//   return "";
// }

// function getBoolean(
//   record: UnknownRecord,
//   keys: string[],
// ): boolean {
//   for (const key of keys) {
//     const value = record[key];

//     if (typeof value === "boolean") {
//       return value;
//     }
//   }

//   return false;
// }

// function extractAgents(payload: unknown): unknown[] {
//   if (Array.isArray(payload)) {
//     return payload;
//   }

//   if (!isRecord(payload)) {
//     return [];
//   }

//   const directKeys = [
//     "agents",
//     "items",
//     "results",
//     "users",
//   ];

//   for (const key of directKeys) {
//     if (Array.isArray(payload[key])) {
//       return payload[key] as unknown[];
//     }
//   }

//   if (isRecord(payload.data)) {
//     return extractAgents(payload.data);
//   }

//   if (Array.isArray(payload.data)) {
//     return payload.data;
//   }

//   if (isRecord(payload.result)) {
//     return extractAgents(payload.result);
//   }

//   if (Array.isArray(payload.result)) {
//     return payload.result;
//   }

//   return [];
// }

// function normalizeAgent(value: unknown, index: number): Agent | null {
//   if (!isRecord(value)) {
//     return null;
//   }

//   const user = isRecord(value.user) ? value.user : {};
//   const profile = isRecord(value.profile) ? value.profile : {};
//   const location = isRecord(value.location) ? value.location : {};

//   const firstName =
//     getString(value, ["firstName", "first_name"]) ||
//     getString(user, ["firstName", "first_name"]);

//   const lastName =
//     getString(value, ["lastName", "last_name"]) ||
//     getString(user, ["lastName", "last_name"]);

//   const name =
//     getString(value, ["fullName", "name", "displayName"]) ||
//     getString(profile, ["fullName", "name", "displayName"]) ||
//     [firstName, lastName].filter(Boolean).join(" ");

//   const phone =
//     getString(value, [
//       "phone",
//       "phoneNumber",
//       "phone_number",
//       "mobile",
//       "mobileNumber",
//     ]) ||
//     getString(user, [
//       "phone",
//       "phoneNumber",
//       "phone_number",
//       "mobile",
//       "mobileNumber",
//     ]) ||
//     getString(profile, ["phone", "phoneNumber"]);

//   const whatsappNumber =
//     getString(value, [
//       "whatsappNumber",
//       "whatsapp",
//       "whatsAppNumber",
//       "whatsapp_number",
//     ]) ||
//     getString(user, ["whatsappNumber", "whatsapp"]) ||
//     phone;

//   const state =
//     getString(value, ["state", "stateName"]) ||
//     getString(profile, ["state", "stateName"]) ||
//     getString(location, ["state", "stateName"]);

//   const city =
//     getString(value, ["city", "town", "lga"]) ||
//     getString(profile, ["city", "town", "lga"]) ||
//     getString(location, ["city", "town", "lga"]);

//   const address =
//     getString(value, ["address", "officeAddress", "businessAddress"]) ||
//     getString(profile, ["address", "officeAddress", "businessAddress"]) ||
//     getString(location, ["address", "officeAddress"]);

//   const status = (
//     getString(value, ["status", "agentStatus", "accountStatus"]) ||
//     getString(user, ["status", "accountStatus"])
//   ).toLowerCase();

//   // Do not show explicitly inactive or suspended accounts.
//   if (
//     ["inactive", "suspended", "disabled", "blocked"].includes(status)
//   ) {
//     return null;
//   }

//   if (!name && !phone && !whatsappNumber) {
//     return null;
//   }

//   const id =
//     getString(value, ["_id", "id", "agentId", "userId"]) ||
//     getString(user, ["_id", "id", "userId"]) ||
//     `agent-${index}`;

//   const isVerified =
//     getBoolean(value, [
//       "isVerified",
//       "verified",
//       "isAgentVerified",
//       "isApproved",
//       "approved",
//     ]) ||
//     getBoolean(user, ["isVerified", "verified", "isApproved"]) ||
//     getBoolean(profile, ["isVerified", "verified", "isApproved"]);

//   return {
//     id,
//     name: name || "Authorized PIN Agent",
//     phone,
//     whatsappNumber,
//     state,
//     city,
//     address,
//     isVerified,
//   };
// }

// function formatLocation(agent: Agent): string {
//   return [agent.city, agent.state].filter(Boolean).join(", ");
// }

// function toWhatsAppNumber(phone: string): string {
//   let digits = phone.replace(/\D/g, "");

//   // Convert common Nigerian phone formats to international format.
//   if (digits.startsWith("0") && digits.length === 11) {
//     digits = `234${digits.slice(1)}`;
//   } else if (digits.length === 10) {
//     digits = `234${digits}`;
//   }

//   return digits;
// }

// function getInitials(name: string): string {
//   return name
//     .split(/\s+/)
//     .filter(Boolean)
//     .slice(0, 2)
//     .map((part) => part[0].toUpperCase())
//     .join("");
// }

// export default function SecondaryAgentsPage() {
//   const router = useRouter();

//   const [agents, setAgents] = useState<Agent[]>([]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const loadAgents = useCallback(async () => {
//     setLoading(true);
//     setError("");

//     try {
//       const response = await api.get(AGENTS_ENDPOINT);
//       const rawAgents = extractAgents(response.data);

//       const normalizedAgents = rawAgents
//         .map((agent, index) => normalizeAgent(agent, index))
//         .filter((agent): agent is Agent => agent !== null);

//       setAgents(normalizedAgents);
//     } catch (err: unknown) {
//       console.error("Failed to load PIN agents:", err);

//       setAgents([]);
//       setError(
//         "We couldn't load the agents right now. Please try again. If this continues, confirm the agent API endpoint with your backend.",
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     void loadAgents();
//   }, [loadAgents]);

//   const filteredAgents = useMemo(() => {
//     const query = search.trim().toLowerCase();

//     if (!query) {
//       return agents;
//     }

//     return agents.filter((agent) => {
//       const searchableText = [
//         agent.name,
//         agent.phone,
//         agent.whatsappNumber,
//         agent.state,
//         agent.city,
//         agent.address,
//       ]
//         .join(" ")
//         .toLowerCase();

//       return searchableText.includes(query);
//     });
//   }, [agents, search]);

//   function handleCall(phone: string) {
//     if (!phone) return;

//     window.location.href = `tel:${phone.replace(/[^\d+]/g, "")}`;
//   }

//   function handleWhatsApp(phone: string) {
//     const number = toWhatsAppNumber(phone);

//     if (!number) return;

//     const message = encodeURIComponent(
//       "Hello, I want to buy a Learnyfi Secondary Plan PIN. Please let me know the price and payment instructions.",
//     );

//     window.open(
//       `https://wa.me/${number}?text=${message}`,
//       "_blank",
//       "noopener,noreferrer",
//     );
//   }

//   return (
//     <main className="min-h-screen bg-slate-50 text-slate-900">
//       <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
//         {/* Back navigation */}
//         <button
//           type="button"
//           onClick={() => router.push("/student/access/secondary")}
//           className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-blue-700"
//         >
//           <ArrowLeft className="h-4 w-4" />
//           Back to payment
//         </button>

//         {/* Page heading */}
//         <section className="mt-5 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 p-6 text-white shadow-lg sm:p-10">
//           <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
//             <div className="max-w-2xl">
//               <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold">
//                 <ShieldCheck className="h-4 w-4" />
//                 PIN purchase through an agent
//               </div>

//               <h1 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-4xl">
//                 Find a Learnyfi PIN Agent
//               </h1>

//               <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
//                 Find an agent, contact them directly, and ask for
//                 instructions to purchase your Secondary Plan PIN.
//                 After receiving your PIN, redeem it on Learnyfi.
//               </p>
//             </div>

//             <div className="hidden shrink-0 rounded-2xl border border-white/20 bg-white/10 p-5 sm:block">
//               <Users className="h-12 w-12" />
//             </div>
//           </div>
//         </section>

//         {/* Safety notice */}
//         <div className="mt-6 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
//           <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />

//           <div className="text-sm leading-6 text-amber-900">
//             <p className="font-bold">Stay safe when buying a PIN</p>
//             <p className="mt-1">
//               Contact an agent using the details shown here. Confirm the
//               price and payment instructions before paying. Never share
//               your password or OTP with an agent.
//             </p>
//           </div>
//         </div>

//         {/* Search */}
//         <section className="mt-8">
//           <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
//             <div>
//               <h2 className="text-xl font-bold sm:text-2xl">
//                 Available agents
//               </h2>
//               <p className="mt-1 text-sm text-slate-500">
//                 Search by agent name, state, city, or phone number.
//               </p>
//             </div>

//             {!loading && !error && (
//               <p className="text-sm font-medium text-slate-500">
//                 {filteredAgents.length}{" "}
//                 {filteredAgents.length === 1 ? "agent" : "agents"} found
//               </p>
//             )}
//           </div>

//           <div className="mt-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 shadow-sm focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100">
//             <Search className="h-5 w-5 shrink-0 text-slate-400" />

//             <input
//               type="search"
//               value={search}
//               onChange={(event) => setSearch(event.target.value)}
//               placeholder="Try Lagos, Abuja, or an agent's name"
//               aria-label="Search PIN agents"
//               className="min-w-0 flex-1 bg-transparent py-4 text-sm outline-none placeholder:text-slate-400"
//             />

//             {search && (
//               <button
//                 type="button"
//                 onClick={() => setSearch("")}
//                 aria-label="Clear search"
//                 className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
//               >
//                 <X className="h-4 w-4" />
//               </button>
//             )}
//           </div>
//         </section>

//         {/* Loading */}
//         {loading && (
//           <div className="mt-8 flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center">
//             <LoaderCircle className="h-9 w-9 animate-spin text-blue-600" />

//             <p className="mt-4 font-semibold text-slate-800">
//               Loading agents
//             </p>

//             <p className="mt-1 text-sm text-slate-500">
//               Please wait while we find available agents.
//             </p>
//           </div>
//         )}

//         {/* Error */}
//         {!loading && error && (
//           <div className="mt-8 rounded-3xl border border-red-200 bg-white p-6 sm:p-8">
//             <div className="flex items-start gap-3">
//               <div className="rounded-xl bg-red-50 p-3">
//                 <AlertCircle className="h-6 w-6 text-red-600" />
//               </div>

//               <div className="flex-1">
//                 <h3 className="font-bold text-slate-900">
//                   Unable to load agents
//                 </h3>

//                 <p className="mt-2 text-sm leading-6 text-slate-600">
//                   {error}
//                 </p>

//                 <button
//                   type="button"
//                   onClick={() => void loadAgents()}
//                   className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
//                 >
//                   <RefreshCw className="h-4 w-4" />
//                   Try again
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Empty state */}
//         {!loading && !error && agents.length === 0 && (
//           <div className="mt-8 rounded-3xl border border-slate-200 bg-white px-6 py-14 text-center">
//             <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
//               <Users className="h-8 w-8 text-blue-600" />
//             </div>

//             <h3 className="mt-5 text-lg font-bold">
//               No agents available yet
//             </h3>

//             <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
//               There are currently no agents to display. Please try again
//               later or use the online payment option.
//             </p>

//             <button
//               type="button"
//               onClick={() => void loadAgents()}
//               className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold transition hover:bg-slate-50"
//             >
//               <RefreshCw className="h-4 w-4" />
//               Refresh agents
//             </button>
//           </div>
//         )}

//         {/* No search results */}
//         {!loading &&
//           !error &&
//           agents.length > 0 &&
//           filteredAgents.length === 0 && (
//             <div className="mt-8 rounded-3xl border border-slate-200 bg-white px-6 py-14 text-center">
//               <Search className="mx-auto h-10 w-10 text-slate-300" />

//               <h3 className="mt-4 font-bold">No matching agents</h3>

//               <p className="mt-2 text-sm text-slate-500">
//                 Try searching with a different name or location.
//               </p>

//               <button
//                 type="button"
//                 onClick={() => setSearch("")}
//                 className="mt-4 text-sm font-bold text-blue-700 hover:underline"
//               >
//                 Clear search
//               </button>
//             </div>
//           )}

//         {/* Agent cards */}
//         {!loading && !error && filteredAgents.length > 0 && (
//           <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
//             {filteredAgents.map((agent) => {
//               const location = formatLocation(agent);
//               const contactNumber =
//                 agent.whatsappNumber || agent.phone;

//               return (
//                 <article
//                   key={agent.id}
//                   className="flex flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-6"
//                 >
//                   {/* Agent identity */}
//                   <div className="flex items-start gap-4">
//                     <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-lg font-extrabold text-blue-700">
//                       {getInitials(agent.name) || (
//                         <Building2 className="h-6 w-6" />
//                       )}
//                     </div>

//                     <div className="min-w-0 flex-1">
//                       <h3 className="break-words font-bold text-slate-900">
//                         {agent.name}
//                       </h3>

//                       {agent.isVerified && (
//                         <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
//                           <BadgeCheck className="h-4 w-4" />
//                           Verified agent
//                         </span>
//                       )}

//                       {!agent.isVerified && (
//                         <span className="mt-1 inline-flex items-center gap-1 text-xs text-slate-500">
//                           <ShieldCheck className="h-4 w-4" />
//                           Contact details
//                         </span>
//                       )}
//                     </div>
//                   </div>

//                   {/* Location */}
//                   <div className="mt-5 space-y-3">
//                     <div className="flex items-start gap-3 text-sm text-slate-600">
//                       <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

//                       <div>
//                         <p className="font-semibold text-slate-800">
//                           {location || "Location not provided"}
//                         </p>

//                         {agent.address && (
//                           <p className="mt-1 break-words text-xs leading-5 text-slate-500">
//                             {agent.address}
//                           </p>
//                         )}
//                       </div>
//                     </div>

//                     {agent.phone && (
//                       <div className="flex items-center gap-3 text-sm text-slate-600">
//                         <Phone className="h-4 w-4 shrink-0 text-slate-400" />
//                         <span className="break-all">{agent.phone}</span>
//                       </div>
//                     )}
//                   </div>

//                   {/* Contact actions */}
//                   <div className="mt-auto grid grid-cols-2 gap-3 pt-6">
//                     <button
//                       type="button"
//                       onClick={() => handleCall(agent.phone)}
//                       disabled={!agent.phone}
//                       className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40"
//                     >
//                       <Phone className="h-4 w-4" />
//                       Call
//                     </button>

//                     <button
//                       type="button"
//                       onClick={() => handleWhatsApp(contactNumber)}
//                       disabled={!contactNumber}
//                       className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
//                     >
//                       <MessageCircle className="h-4 w-4" />
//                       WhatsApp
//                     </button>
//                   </div>
//                 </article>
//               );
//             })}
//           </section>
//         )}

//         {/* Footer guidance */}
//         <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
//           <h3 className="font-bold text-slate-900">
//             What happens after I buy a PIN?
//           </h3>

//           <ol className="mt-4 grid gap-4 text-sm text-slate-600 sm:grid-cols-3">
//             <li className="flex gap-3">
//               <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-extrabold text-blue-700">
//                 1
//               </span>
//               <span>
//                 Contact an agent and confirm the price and payment
//                 instructions.
//               </span>
//             </li>

//             <li className="flex gap-3">
//               <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-extrabold text-blue-700">
//                 2
//               </span>
//               <span>
//                 Complete payment and obtain your PIN from the agent.
//               </span>
//             </li>

//             <li className="flex gap-3">
//               <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-extrabold text-blue-700">
//                 3
//               </span>
//               <span>
//                 Return to Learnyfi and redeem the PIN to activate your
//                 plan.
//               </span>
//             </li>
//           </ol>

//           <button
//             type="button"
//             onClick={() => router.push("/student/access/secondary")}
//             className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-700 transition hover:text-blue-900"
//           >
//             <ArrowLeft className="h-4 w-4" />
//             Return to Secondary Plan
//           </button>
//         </div>
//       </div>
//     </main>
//   );
// }
