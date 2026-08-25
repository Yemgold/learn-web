



"use client";

import {
  Mail,
  Clock3,
  CheckCircle2,
  XCircle,
  UserPlus,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const invitations = [
  {
    id: "1",
    team: "Future Doctors",
    captain: "John Doe",
    email: "john@example.com",
    status: "Pending",
    sentAt: "2 hours ago",
  },
  {
    id: "2",
    team: "Science Legends",
    captain: "Grace Johnson",
    email: "grace@example.com",
    status: "Pending",
    sentAt: "Yesterday",
  },
];

export default function TeamInvitationsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto max-w-6xl px-4 py-10">
        {/* Header */}
        <div className="mb-10">
          <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
            Student Portal
          </span>

          <h1 className="mt-4 text-4xl font-bold">
            Team Invitations
          </h1>

          <p className="mt-3 max-w-3xl text-lg text-slate-600">
            Accept or decline invitations from team captains.
            You must belong to only one team before joining a
            competition.
          </p>
        </div>

        {/* Empty State */}
        {invitations.length === 0 ? (
          <Card className="py-16 text-center">
            <Mail className="mx-auto h-16 w-16 text-slate-300" />

            <h2 className="mt-6 text-2xl font-bold">
              No Invitations
            </h2>

            <p className="mt-3 text-slate-600">
              You don't have any pending team invitations.
            </p>
          </Card>
        ) : (
          <div className="space-y-6">
            {invitations.map((invite) => (
              <Card
                key={invite.id}
                hoverable
                className="p-8"
              >
                <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <UserPlus className="h-8 w-8 text-blue-600" />

                      <div>
                        <h2 className="text-2xl font-bold">
                          {invite.team}
                        </h2>

                        <p className="text-slate-600">
                          Invitation from{" "}
                          <strong>
                            {invite.captain}
                          </strong>
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 space-y-2 text-sm text-slate-600">
                      <p>
                        <strong>Email:</strong>{" "}
                        {invite.email}
                      </p>

                      <p className="flex items-center gap-2">
                        <Clock3 className="h-4 w-4" />
                        Sent {invite.sentAt}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                      leftIcon={
                        <CheckCircle2 className="h-4 w-4" />
                      }
                    >
                      Accept
                    </Button>

                    <Button
                      variant="outline"
                      leftIcon={
                        <XCircle className="h-4 w-4" />
                      }
                    >
                      Decline
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}