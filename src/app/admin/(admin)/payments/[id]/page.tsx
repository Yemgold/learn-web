





import Link from "next/link";

interface PaymentDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PaymentDetailsPage({
  params,
}: PaymentDetailsPageProps) {
  const { id } = await params;

  // Placeholder data (replace with API call)
  const payment = {
    id,
    transactionRef: `JL-${id.toUpperCase()}-2027`,
    student: "John Doe",
    email: "john@example.com",
    phone: "+234 801 234 5678",
    team: "Future Doctors",
    competition: "JAMB League 2027 National Challenge",
    amount: "₦5,000",
    status: "Successful",
    method: "Paystack",
    paidAt: "20 January 2027 • 10:42 AM",
    createdAt: "20 January 2027 • 10:38 AM",
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/admin/payments"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              ← Back to Payments
            </Link>

            <h1 className="mt-3 text-4xl font-bold text-slate-900">
              Payment Details
            </h1>

            <p className="mt-2 text-slate-600">
              Review payment information and transaction history.
            </p>
          </div>

          <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
            {payment.status}
          </span>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left */}
          <div className="space-y-8 lg:col-span-2">
            {/* Payment */}
            <section className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-semibold">
                Payment Information
              </h2>

              <div className="grid gap-6 md:grid-cols-2">
                <Info
                  label="Transaction Reference"
                  value={payment.transactionRef}
                />

                <Info
                  label="Payment ID"
                  value={payment.id}
                />

                <Info
                  label="Amount"
                  value={payment.amount}
                />

                <Info
                  label="Payment Method"
                  value={payment.method}
                />

                <Info
                  label="Status"
                  value={payment.status}
                />

                <Info
                  label="Paid On"
                  value={payment.paidAt}
                />
              </div>
            </section>

            {/* Student */}
            <section className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-semibold">
                Student Information
              </h2>

              <div className="grid gap-6 md:grid-cols-2">
                <Info
                  label="Student"
                  value={payment.student}
                />

                <Info
                  label="Email"
                  value={payment.email}
                />

                <Info
                  label="Phone"
                  value={payment.phone}
                />

                <Info
                  label="Team"
                  value={payment.team}
                />
              </div>
            </section>

            {/* Competition */}
            <section className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-semibold">
                Competition
              </h2>

              <Info
                label="Competition Name"
                value={payment.competition}
              />
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold">
                Quick Actions
              </h3>

              <div className="mt-6 space-y-3">
                <button className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700">
                  Download Receipt
                </button>

                <button className="w-full rounded-xl border border-slate-300 px-4 py-3 font-semibold transition hover:bg-slate-100">
                  Send Receipt
                </button>

                <button className="w-full rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 font-semibold text-amber-700 transition hover:bg-amber-100">
                  Verify Payment
                </button>

                <button className="w-full rounded-xl border border-red-300 bg-red-50 px-4 py-3 font-semibold text-red-700 transition hover:bg-red-100">
                  Refund Payment
                </button>
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h3 className="mb-5 text-lg font-semibold">
                Audit Log
              </h3>

              <div className="space-y-5">
                <Timeline
                  title="Payment Created"
                  time={payment.createdAt}
                />

                <Timeline
                  title="Payment Verified"
                  time={payment.paidAt}
                />

                <Timeline
                  title="Receipt Generated"
                  time="20 January 2027 • 10:43 AM"
                />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

interface InfoProps {
  label: string;
  value: string;
}

function Info({
  label,
  value,
}: InfoProps) {
  return (
    <div>
      <p className="text-sm font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-base font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
}

interface TimelineProps {
  title: string;
  time: string;
}

function Timeline({
  title,
  time,
}: TimelineProps) {
  return (
    <div className="flex gap-4">
      <div className="mt-2 h-3 w-3 rounded-full bg-blue-600" />

      <div>
        <p className="font-medium text-slate-900">
          {title}
        </p>

        <p className="text-sm text-slate-500">
          {time}
        </p>
      </div>
    </div>
  );
}