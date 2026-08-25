



import {
  Camera,
  Trophy,
  Users,
  GraduationCap,
  Award,
  Image as ImageIcon,
} from "lucide-react";

import { Card } from "@/components/ui/card";

const gallery = [
  {
    id: 1,
    title: "National Championship",
    category: "Competition",
  },
  {
    id: 2,
    title: "Winning Team",
    category: "Awards",
  },
  {
    id: 3,
    title: "Students During CBT",
    category: "Competition",
  },
  {
    id: 4,
    title: "Prize Presentation",
    category: "Awards",
  },
  {
    id: 5,
    title: "School Representatives",
    category: "Schools",
  },
  {
    id: 6,
    title: "Opening Ceremony",
    category: "Events",
  },
  {
    id: 7,
    title: "Top Performing Teams",
    category: "Leaderboard",
  },
  {
    id: 8,
    title: "Training Session",
    category: "Practice",
  },
  {
    id: 9,
    title: "National Finals",
    category: "Competition",
  },
];

const stats = [
  {
    title: "Photos",
    value: "500+",
    icon: Camera,
  },
  {
    title: "Competitions",
    value: "30+",
    icon: Trophy,
  },
  {
    title: "Students",
    value: "25,000+",
    icon: GraduationCap,
  },
  {
    title: "Schools",
    value: "300+",
    icon: Users,
  },
];

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 py-20 text-white">
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <span className="rounded-full bg-white/20 px-5 py-2 text-sm font-semibold">
            Gallery
          </span>

          <h1 className="mt-6 text-5xl font-bold">
            Moments That Inspire
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-blue-100">
            Explore memorable moments from JAMB League competitions,
            award ceremonies, training sessions, schools, and student
            achievements across Nigeria.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <Card
                key={item.title}
                hoverable
                className="text-center"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
                  <Icon className="h-8 w-8 text-blue-600" />
                </div>

                <h2 className="mt-6 text-3xl font-bold">
                  {item.value}
                </h2>

                <p className="mt-2 text-slate-600">
                  {item.title}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="container mx-auto px-4 pb-20">
        <div className="mb-10">
          <h2 className="text-3xl font-bold">
            Photo Gallery
          </h2>

          <p className="mt-3 text-slate-600">
            Highlights from competitions and events.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {gallery.map((photo) => (
            <Card
              key={photo.id}
              hoverable
              className="overflow-hidden p-0"
            >
              {/* Image Placeholder */}
              <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-blue-100 to-slate-200">
                <ImageIcon className="h-20 w-20 text-slate-400" />
              </div>

              <div className="p-6">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  {photo.category}
                </span>

                <h3 className="mt-4 text-xl font-bold">
                  {photo.title}
                </h3>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Awards */}
      <section className="bg-white py-20">
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <Award className="mx-auto h-14 w-14 text-yellow-500" />

          <h2 className="mt-6 text-4xl font-bold">
            Celebrating Excellence
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            Every competition creates unforgettable memories. Our
            gallery showcases the dedication, teamwork, achievements,
            and excitement experienced by thousands of students
            participating in JAMB League.
          </p>
        </div>
      </section>
    </main>
  );
}