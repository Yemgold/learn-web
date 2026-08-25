



"use client";

import {
  CreditCard,
  Search,
  Download,
  CheckCircle2,
  Clock3,
  XCircle,
  Wallet,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const payments = [
  {
    id: "PAY-1001",
    team: "Future Doctors",
    captain: "John Doe",
    amount: "₦15,000",
    method: "Paystack",
    status: "Successful",
    date: "15 Aug 2026",
  },
  {
    id: "PAY-1002",
    team: "Science Legends",
    captain: "Grace Johnson",
    amount: "₦15,000",
    method: "Flutterwave",
    status: "Pending",
    date: "14 Aug 2026",
  },
  {
    id: "PAY-1003",
    team: "Brain Builders",
    captain: "David James",
    amount: "₦15,000",
    method: "Paystack",
    status: "Failed",
    date: "13 Aug 2026",
  },
];

export default function AdminPaymentsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
              Admin Dashboard
            </span>

            <h1 className="mt-4 text-4xl font-bold">
              Payments
            </h1>

            <p className="mt-3 max-w-3xl text-lg text-slate-600">
              Monitor registration payments, verify
              transactions and manage financial records.
            </p>
          </div>

          <Button
            leftIcon={<Download className="h-4 w-4" />}
          >
            Export Report
          </Button>
        </div>

        {/* Statistics */}
        <div className="mb-10 grid gap-6 md:grid-cols-4">
          <Card className="text-center">
            <Wallet className="mx-auto h-10 w-10 text-green-600" />

            <h2 className="mt-4 text-3xl font-bold">
              ₦2.4M
            </h2>

            <p className="mt-2 text-slate-600">
              Total Revenue
            </p>
          </Card>

          <Card className="text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-green-600" />

            <h2 className="mt-4 text-3xl font-bold">
              162
            </h2>

            <p className="mt-2 text-slate-600">
              Successful
            </p>
          </Card>

          <Card className="text-center">
            <Clock3 className="mx-auto h-10 w-10 text-yellow-500" />

            <h2 className="mt-4 text-3xl font-bold">
              8
            </h2>

            <p className="mt-2 text-slate-600">
              Pending
            </p>
          </Card>

          <Card className="text-center">
            <XCircle className="mx-auto h-10 w-10 text-red-500" />

            <h2 className="mt-4 text-3xl font-bold">
              4
            </h2>

            <p className="mt-2 text-slate-600">
              Failed
            </p>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <Input
            placeholder="Search payment by Team, Captain or Payment ID..."
            leftIcon={<Search className="h-4 w-4" />}
          />
        </Card>

        {/* Payments */}
        <div className="space-y-6">
          {payments.map((payment) => (
            <Card
              key={payment.id}
              hoverable
              className="p-8"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-bold">
                      {payment.team}
                    </h2>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        payment.status === "Successful"
                          ? "bg-green-100 text-green-700"
                          : payment.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-2 text-sm text-slate-600">
                    <p>
                      <strong>Payment ID:</strong>{" "}
                      {payment.id}
                    </p>

                    <p>
                      <strong>Captain:</strong>{" "}
                      {payment.captain}
                    </p>

                    <p>
                      <strong>Date:</strong>{" "}
                      {payment.date}
                    </p>

                    <p>
                      <strong>Gateway:</strong>{" "}
                      {payment.method}
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <CreditCard className="mx-auto h-8 w-8 text-blue-600" />

                  <h3 className="mt-3 text-3xl font-bold">
                    {payment.amount}
                  </h3>

                  <Button
                    variant="outline"
                    className="mt-5"
                  >
                    View Transaction
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}