


"use client";

import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 py-20 text-white">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <span className="inline-flex items-center rounded-full bg-white/20 px-5 py-2 text-sm font-semibold">
            Contact Us
          </span>

          <h1 className="mt-6 text-5xl font-bold">
            We'd Love to Hear From You
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-blue-100">
            Whether you're a student, parent, teacher, or school
            administrator, we're here to answer your questions and help
            you get started with JAMB League.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card hoverable>
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-blue-100 p-3">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">
                    Email
                  </h3>

                  <p className="mt-2 text-slate-600">
                    support@jambleague.ng
                  </p>

                  <p className="text-slate-600">
                    info@jambleague.ng
                  </p>
                </div>
              </div>
            </Card>

            <Card hoverable>
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-green-100 p-3">
                  <Phone className="h-6 w-6 text-green-600" />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">
                    Phone
                  </h3>

                  <p className="mt-2 text-slate-600">
                    +234 800 000 0000
                  </p>

                  <p className="text-slate-600">
                    +234 701 234 5678
                  </p>
                </div>
              </div>
            </Card>

            <Card hoverable>
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-purple-100 p-3">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">
                    Office Address
                  </h3>

                  <p className="mt-2 text-slate-600">
                    Abuja, Nigeria
                  </p>
                </div>
              </div>
            </Card>

            <Card hoverable>
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-amber-100 p-3">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">
                    Working Hours
                  </h3>

                  <p className="mt-2 text-slate-600">
                    Monday - Friday
                  </p>

                  <p className="text-slate-600">
                    8:00 AM - 5:00 PM
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <h2 className="text-3xl font-bold text-slate-900">
                Send Us a Message
              </h2>

              <p className="mt-3 text-slate-600">
                Fill out the form below and we'll get back to you as
                soon as possible.
              </p>

              <form className="mt-8 space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Input
                    label="Full Name"
                    placeholder="Enter your full name"
                    required
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="08012345678"
                />

                <Input
                  label="Subject"
                  placeholder="How can we help?"
                  required
                />

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Message
                  </label>

                  <textarea
                    rows={6}
                    placeholder="Write your message here..."
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  leftIcon={<Send className="h-4 w-4" />}
                >
                  Send Message
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="container mx-auto px-4 pb-20">
        <Card className="overflow-hidden">
          <div className="flex h-80 items-center justify-center rounded-xl bg-slate-100">
            <div className="text-center">
              <MapPin className="mx-auto h-12 w-12 text-slate-400" />

              <h3 className="mt-4 text-xl font-semibold text-slate-700">
                Office Location
              </h3>

              <p className="mt-2 text-slate-500">
                Google Maps integration will be added here.
              </p>
            </div>
          </div>
        </Card>
      </section>
    </main>
  );
}