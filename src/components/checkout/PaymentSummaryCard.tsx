



"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  CheckCircle2,
  CreditCard,
  LoaderCircle,
  MapPin,
  MessageCircle,
  Phone,
  RefreshCw,
  Search,
  ShieldCheck,
  Ticket,
  Users,
} from "lucide-react";

import { SECONDARY_PLAN } from "@/constants/secondary-plan";
import { useCreatePaymentIntent } from "@/hooks/payment/useCreatePayment";
import { useAuthStore } from "@/stores";
import { api } from "@/lib/api/axios";

/*
 * IMPORTANT:
 * Confirm this endpoint with your backend developer.
 * Do not use this route until your backend implements it.
 */
const ACTIVE_AGENTS_ENDPOINT = "/agents/get-active-agents";

interface Agent {
  _id?: string;
  id?: string;
  agentId?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  phone?: string;
  phoneNumber?: string;
  whatsappNumber?: string;
  whatsapp?: string;
  state?: string;
  city?: string;
  address?: string;
  status?: string;
  isActive?: boolean;
  isVerified?: boolean;
}

interface AgentsResponse {
  success?: boolean;
  message?: string;
  data?:
    | Agent[]
    | {
        agents?: Agent[];
        agentsObj?: Agent[];
        items?: Agent[];
        results?: Agent[];
      };
}

type PaymentMethod = "online" | "agent";

function getAgents(payload: AgentsResponse): Agent[] {
  const data = payload?.data;

  if (Array.isArray(data)) {
    return data;
  }

  if (!data || typeof data !== "object") {
    return [];
  }

  return (
    data.agents ??
    data.agentsObj ??
    data.items ??
    data.results ??
    []
  );
}

function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

function normalizePhone(value?: string) {
  if (!value) return "";

  const trimmed = value.trim();

  if (trimmed.startsWith("+")) {
    return `+${trimmed.slice(1).replace(/\D/g, "")}`;
  }

  return trimmed.replace(/\D/g, "");
}

function getWhatsAppNumber(agent: Agent) {
  const number = normalizePhone(
    agent.whatsappNumber ||
      agent.whatsapp ||
      agent.phoneNumber ||
      agent.phone,
  );

  if (!number) return "";

  // Convert Nigerian local numbers to international format.
  if (number.startsWith("0") && number.length === 11) {
    return `234${number.slice(1)}`;
  }

  if (number.startsWith("234")) {
    return number;
  }

  return number;
}

function getAgentName(agent: Agent) {
  const fullName = [agent.firstName, agent.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || agent.name || "Learnyfi Agent";
}

function getAgentLocation(agent: Agent) {
  return [agent.city, agent.state]
    .filter(Boolean)
    .join(", ");
}

export default function PaymentSummaryCard() {
  const { user } = useAuthStore();

  const {
    loading,
    error,
    initializePayment,
  } = useCreatePaymentIntent();

  const [method, setMethod] =
    useState<PaymentMethod>("online");

  const [agents, setAgents] = useState<Agent[]>([]);
  const [search, setSearch] = useState("");
  const [isLoadingAgents, setIsLoadingAgents] =
    useState(false);
  const [agentError, setAgentError] = useState("");
  const [agentsLoaded, setAgentsLoaded] = useState(false);

  const total = formatNaira(SECONDARY_PLAN.price);

  async function loadAgents() {
    setIsLoadingAgents(true);
    setAgentError("");

    try {
      const response = await api.get<AgentsResponse>(
        ACTIVE_AGENTS_ENDPOINT,
      );

      if (response.data?.success === false) {
        throw new Error(
          response.data.message ||
            "Unable to load agents.",
        );
      }

      const fetchedAgents = getAgents(response.data);

      // The backend should return active agents only.
      // Filter again when a status or activity flag is supplied.
      const activeAgents = fetchedAgents.filter((agent) => {
        if (agent.isActive === false) return false;

        if (
          agent.status &&
          !["active", "approved"].includes(
            agent.status.toLowerCase(),
          )
        ) {
          return false;
        }

        return true;
      });

      setAgents(activeAgents);
      setAgentsLoaded(true);
    } catch (err) {
      console.error("Failed to load Learnyfi agents:", err);

      setAgents([]);
      setAgentsLoaded(false);
      setAgentError(
        err instanceof Error
          ? err.message
          : "We could not load agents. Please try again.",
      );
    } finally {
      setIsLoadingAgents(false);
    }
  }

  useEffect(() => {
    if (method === "agent" && !agentsLoaded) {
      void loadAgents();
    }
    // loadAgents is intentionally called when the agent tab is selected.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [method, agentsLoaded]);

  const filteredAgents = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return agents;

    return agents.filter((agent) => {
      const searchableText = [
        getAgentName(agent),
        agent.agentId,
        agent.phone,
        agent.phoneNumber,
        agent.whatsappNumber,
        agent.state,
        agent.city,
        agent.address,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [agents, search]);

  return (
    <aside className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-5 sm:p-7">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <ShieldCheck className="h-6 w-6" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Payment Summary
            </h2>
            <p className="text-sm text-slate-500">
              Choose how to get your plan access.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Paying as
          </p>

          <p className="mt-1 font-semibold text-slate-900">
            {[user?.firstName, user?.lastName]
              .filter(Boolean)
              .join(" ") || "Student"}
          </p>

          <p className="break-all text-sm text-slate-500">
            {user?.email || "Your account"}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">
              Secondary Plan
            </p>
            <p className="text-xs text-slate-400">
              1 year of access
            </p>
          </div>

          <p className="text-2xl font-extrabold text-slate-900">
            {total}
          </p>
        </div>
      </div>

      <div className="p-5 sm:p-7">
        <h3 className="font-bold text-slate-900">
          Select payment method
        </h3>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setMethod("online")}
            className={`rounded-2xl border p-4 text-left transition ${
              method === "online"
                ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <CreditCard
              className={`h-6 w-6 ${
                method === "online"
                  ? "text-blue-600"
                  : "text-slate-500"
              }`}
            />

            <p className="mt-3 font-bold text-slate-900">
              Pay online
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Pay through our payment gateway.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setMethod("agent")}
            className={`rounded-2xl border p-4 text-left transition ${
              method === "agent"
                ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <Users
              className={`h-6 w-6 ${
                method === "agent"
                  ? "text-blue-600"
                  : "text-slate-500"
              }`}
            />

            <p className="mt-3 font-bold text-slate-900">
              Buy from agent
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Contact an authorized agent for a PIN.
            </p>
          </button>
        </div>

        {method === "online" && (
          <div className="mt-5">
            {error && (
              <div
                role="alert"
                className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={initializePayment}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <LoaderCircle className="h-5 w-5 animate-spin" />
              ) : (
                <CreditCard className="h-5 w-5" />
              )}

              {loading
                ? "Initializing payment..."
                : `Pay ${total} online`}
            </button>

            <p className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="h-4 w-4" />
              Secure online checkout
            </p>
          </div>
        )}

        {method === "agent" && (
          <div className="mt-6">
            <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4">
              <Ticket className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

              <div>
                <p className="font-semibold text-slate-900">
                  Buy your PIN from an agent
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Contact an active Learnyfi agent to arrange
                  payment and receive your Secondary Plan PIN.
                  Redeem your PIN on Learnyfi to activate access.
                </p>

                <p className="mt-2 text-sm font-bold text-slate-900">
                  Plan price: {total}
                </p>
              </div>
            </div>

            <div className="relative mt-5">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search agent, city or state..."
                aria-label="Search agents by name, city or state"
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {isLoadingAgents && (
              <div className="flex flex-col items-center py-10 text-center">
                <LoaderCircle className="h-8 w-8 animate-spin text-blue-600" />

                <p className="mt-3 text-sm font-medium text-slate-700">
                  Loading available agents...
                </p>
              </div>
            )}

            {!isLoadingAgents && agentError && (
              <div
                role="alert"
                className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4"
              >
                <p className="text-sm text-red-700">
                  {agentError}
                </p>

                <button
                  type="button"
                  onClick={() => void loadAgents()}
                  className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-red-700 hover:underline"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try again
                </button>
              </div>
            )}

            {!isLoadingAgents &&
              !agentError &&
              filteredAgents.length === 0 && (
                <div className="mt-4 rounded-2xl border border-dashed border-slate-300 px-5 py-8 text-center">
                  <Users className="mx-auto h-9 w-9 text-slate-400" />

                  <p className="mt-3 font-semibold text-slate-800">
                    {agents.length === 0
                      ? "No agents available"
                      : "No matching agents"}
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {agents.length === 0
                      ? "There are no active agents to display right now. Please try again later or pay online."
                      : "Try another name, city or state."}
                  </p>
                </div>
              )}

            {!isLoadingAgents &&
              !agentError &&
              filteredAgents.length > 0 && (
                <div className="mt-4 space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {filteredAgents.length}{" "}
                    {filteredAgents.length === 1
                      ? "agent"
                      : "agents"}{" "}
                    available
                  </p>

                  {filteredAgents.map((agent, index) => {
                    const key =
                      agent._id ||
                      agent.id ||
                      agent.agentId ||
                      `${getAgentName(agent)}-${index}`;

                    const name = getAgentName(agent);
                    const location = getAgentLocation(agent);
                    const phone =
                      agent.phoneNumber || agent.phone || "";
                    const whatsapp = getWhatsAppNumber(agent);

                    const whatsappMessage = encodeURIComponent(
                      `Hello ${name}, I want to purchase a Learnyfi Secondary Plan PIN. Please let me know how to proceed. The displayed plan price is ${total}.`,
                    );

                    return (
                      <article
                        key={key}
                        className="rounded-2xl border border-slate-200 p-4 transition hover:border-blue-200"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                            <Users className="h-6 w-6" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="font-bold text-slate-900">
                                {name}
                              </h4>

                              {agent.isVerified && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-700">
                                  <BadgeCheck className="h-3.5 w-3.5" />
                                  Verified
                                </span>
                              )}
                            </div>

                            {agent.agentId && (
                              <p className="mt-1 text-xs text-slate-400">
                                Agent ID: {agent.agentId}
                              </p>
                            )}

                            {location && (
                              <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                                <MapPin className="h-4 w-4 shrink-0" />
                                {location}
                              </p>
                            )}

                            {agent.address && (
                              <p className="mt-1 text-xs leading-5 text-slate-500">
                                {agent.address}
                              </p>
                            )}

                            {phone && (
                              <p className="mt-2 text-sm text-slate-600">
                                {phone}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-2">
                          {phone ? (
                            <a
                              href={`tel:${normalizePhone(phone)}`}
                              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                              <Phone className="h-4 w-4" />
                              Call agent
                            </a>
                          ) : (
                            <button
                              type="button"
                              disabled
                              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-100 px-3 py-3 text-sm font-semibold text-slate-300"
                            >
                              <Phone className="h-4 w-4" />
                              No phone
                            </button>
                          )}

                          {whatsapp ? (
                            <a
                              href={`https://wa.me/${whatsapp}?text=${whatsappMessage}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-3 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
                            >
                              <MessageCircle className="h-4 w-4" />
                              WhatsApp
                            </a>
                          ) : (
                            <button
                              type="button"
                              disabled
                              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-3 py-3 text-sm font-semibold text-slate-400"
                            >
                              <MessageCircle className="h-4 w-4" />
                              No WhatsApp
                            </button>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}

            <div className="mt-5 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-800">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />

              <p>
                Pay only the official plan price unless Learnyfi
                explicitly publishes an authorized fee. Never
                share your PIN publicly. Learnyfi must verify
                the PIN before activating your plan.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setMethod("online")}
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to online payment
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}












// "use client";

// import { CreditCard } from "lucide-react";
// import { SECONDARY_PLAN } from "@/constants/secondary-plan";
// import { useCreatePaymentIntent } from "@/hooks/payment/useCreatePayment";
// import { useAuthStore } from "@/stores";

// export default function PaymentSummaryCard() {
//   const { user } = useAuthStore();

//   const {
//     loading,
//     error,
//     initializePayment,
//   } = useCreatePaymentIntent();

//   const total = new Intl.NumberFormat("en-NG", {
//     style: "currency",
//     currency: "NGN",
//     maximumFractionDigits: 0,
//   }).format(SECONDARY_PLAN.price);

//   return (
//     <aside className="rounded-3xl border bg-white p-7">
//       <h2 className="font-bold text-slate-900">
//         Payment Summary
//       </h2>

//       <div className="mt-6">
//         <p className="text-xs uppercase text-slate-400">
//           Paying as
//         </p>

//         <p className="mt-1 font-semibold">
//           {user?.firstName} {user?.lastName}
//         </p>

//         <p className="text-sm text-slate-500">
//           {user?.email}
//         </p>
//       </div>

//       <div className="mt-6 border-t pt-6">
//         <div className="flex justify-between">
//           <span>Total</span>

//           <span className="text-2xl font-bold">
//             {total}
//           </span>
//         </div>
//       </div>

//       {error && (
//         <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
//           {error}
//         </div>
//       )}

//       <button
//         type="button"
//         onClick={initializePayment}
//         disabled={loading}
//         className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 font-bold text-white disabled:bg-blue-400"
//       >
//         <CreditCard className="h-5 w-5" />

//         {loading
//           ? "Redirecting..."
//           : `Pay ${total}`}
//       </button>
//     </aside>
//   );
// }