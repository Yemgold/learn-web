





import Link from "next/link";
import {
  Handshake,
  Building2,
  Award,
  Users,
  GraduationCap,
  Globe,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const sponsors = [
  {
    name: "Education Partner",
    description:
      "Supporting quality education and nationwide student development.",
  },
  {
    name: "Technology Partner",
    description:
      "Providing the digital infrastructure powering JAMB League.",
  },
  {
    name: "Scholarship Partner",
    description:
      "Funding scholarships and academic excellence awards.",
  },
  {
    name: "Community Partner",
    description:
      "Connecting schools, teachers and students across Nigeria.",
  },
  {
    name: "Media Partner",
    description:
      "Promoting educational awareness and competition highlights.",
  },
  {
    name: "Corporate Sponsor",
    description:
      "Investing in the future of Nigerian students and innovation.",
  },
];

const benefits = [
  "Nationwide brand visibility",
  "Access to thousands of students",
  "CSR and education impact",
  "Brand recognition at competitions",
  "Digital marketing exposure",
  "Partnership with schools",
];

export default function SponsorsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 py-20 text-white">
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <span className="rounded-full bg-white/20 px-5 py-2 text-sm font-semibold">
            Sponsors & Partners
          </span>

          <h1 className="mt-6 text-5xl font-bold">
            Empowering the Next Generation
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-blue-100">
            JAMB League is building Nigeria's largest academic
            competition platform. We partner with organizations,
            institutions and brands that believe in transforming
            education through innovation.
          </p>
        </div>
      </section>

      {/* Statistics */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <Card hoverable className="text-center">
            <GraduationCap className="mx-auto h-12 w-12 text-blue-600" />

            <h2 className="mt-5 text-3xl font-bold">
              25,000+
            </h2>

            <p className="mt-2 text-slate-600">
              Students
            </p>
          </Card>

          <Card hoverable className="text-center">
            <Building2 className="mx-auto h-12 w-12 text-blue-600" />

            <h2 className="mt-5 text-3xl font-bold">
              300+
            </h2>

            <p className="mt-2 text-slate-600">
              Schools
            </p>
          </Card>

          <Card hoverable className="text-center">
            <Users className="mx-auto h-12 w-12 text-blue-600" />

            <h2 className="mt-5 text-3xl font-bold">
              36 States
            </h2>

            <p className="mt-2 text-slate-600">
              National Reach
            </p>
          </Card>

          <Card hoverable className="text-center">
            <Award className="mx-auto h-12 w-12 text-blue-600" />

            <h2 className="mt-5 text-3xl font-bold">
              ₦1M+
            </h2>

            <p className="mt-2 text-slate-600">
              Prize Pool
            </p>
          </Card>
        </div>
      </section>

      {/* Partners */}
      <section className="container mx-auto px-4 py-10">
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-bold">
            Partnership Opportunities
          </h2>

          <p className="mt-4 text-lg text-slate-600">
            Become part of a mission to improve education across
            Nigeria.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {sponsors.map((item) => (
            <Card key={item.name} hoverable>
              <Handshake className="h-12 w-12 text-blue-600" />

              <h3 className="mt-6 text-2xl font-bold">
                {item.name}
              </h3>

              <p className="mt-4 leading-7 text-slate-600">
                {item.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-white py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <Globe className="h-14 w-14 text-blue-600" />

              <h2 className="mt-6 text-4xl font-bold">
                Why Sponsor JAMB League?
              </h2>

              <p className="mt-6 text-lg leading-8 text-slate-600">
                Your organization will directly contribute to
                educational excellence while gaining nationwide
                visibility among students, schools, parents and
                educational institutions.
              </p>
            </div>

            <Card>
              <h3 className="text-2xl font-bold">
                Sponsor Benefits
              </h3>

              <div className="mt-8 space-y-5">
                {benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600" />

                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto max-w-4xl px-4">
          <Card className="bg-gradient-to-r from-blue-700 to-indigo-700 text-center text-white">
            <Handshake className="mx-auto h-14 w-14" />

            <h2 className="mt-6 text-4xl font-bold">
              Become a Sponsor
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100">
              Join us in shaping the future of education by
              supporting talented students across Nigeria.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-white text-blue-700 hover:bg-slate-100"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Contact Us
                </Button>
              </Link>

              <Link href="/about">
                <Button
                  size="lg"
                  variant="outline"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}