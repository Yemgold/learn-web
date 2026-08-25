


import Link from "next/link";
import {
  CalendarDays,
  Clock3,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Newspaper,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const posts = [
  {
    slug: "how-to-score-300-plus-in-jamb",
    title: "How to Score 300+ in JAMB 2027",
    excerpt:
      "Discover practical study techniques, time management strategies, and CBT tips used by top-performing students.",
    category: "Study Tips",
    date: "January 12, 2027",
    readTime: "6 min read",
  },
  {
    slug: "importance-of-team-learning",
    title: "Why Team Learning Improves JAMB Success",
    excerpt:
      "Learn how studying with teammates increases motivation, accountability, and examination performance.",
    category: "Learning",
    date: "January 8, 2027",
    readTime: "5 min read",
  },
  {
    slug: "common-jamb-mistakes",
    title: "10 Common JAMB Mistakes to Avoid",
    excerpt:
      "Avoid the mistakes that prevent thousands of students from reaching their target scores every year.",
    category: "Preparation",
    date: "January 2, 2027",
    readTime: "7 min read",
  },
  {
    slug: "cbt-exam-guide",
    title: "Complete CBT Examination Guide",
    excerpt:
      "Everything you should know before entering the CBT examination hall, from login to submission.",
    category: "CBT",
    date: "December 28, 2026",
    readTime: "8 min read",
  },
  {
    slug: "jamb-league-success-stories",
    title: "Success Stories from Previous Champions",
    excerpt:
      "Meet students whose JAMB League journey helped them secure admission into top Nigerian universities.",
    category: "Success Stories",
    date: "December 20, 2026",
    readTime: "4 min read",
  },
  {
    slug: "best-study-timetable",
    title: "The Ultimate Study Timetable for JAMB",
    excerpt:
      "Build a realistic daily schedule that balances revision, practice tests, and rest.",
    category: "Study Plan",
    date: "December 15, 2026",
    readTime: "6 min read",
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 py-20 text-white">
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <span className="rounded-full bg-white/20 px-5 py-2 text-sm font-semibold">
            JAMB League Blog
          </span>

          <h1 className="mt-6 text-5xl font-bold">
            Learn, Prepare & Succeed
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-blue-100">
            Expert study tips, examination strategies, motivation,
            competition updates, and success stories to help you excel
            in JAMB and beyond.
          </p>
        </div>
      </section>

      {/* Featured */}
      <section className="container mx-auto px-4 py-16">
        <Card hoverable className="overflow-hidden p-0">
          <div className="grid lg:grid-cols-2">
            <div className="flex min-h-[320px] items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
              <GraduationCap className="h-24 w-24 text-blue-600" />
            </div>

            <div className="flex flex-col justify-center p-10">
              <span className="w-fit rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                Featured Article
              </span>

              <h2 className="mt-6 text-4xl font-bold">
                How to Prepare for JAMB Like a Champion
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                Learn the exact preparation strategies used by
                high-performing students and previous JAMB League
                champions to consistently achieve excellent results.
              </p>

              <Link
                href="/blog/how-to-score-300-plus-in-jamb"
                className="mt-8"
              >
                <Button
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Read Article
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </section>

      {/* Articles */}
      <section className="container mx-auto px-4 pb-20">
        <div className="mb-10 flex items-center gap-3">
          <Newspaper className="h-8 w-8 text-blue-600" />

          <h2 className="text-3xl font-bold">
            Latest Articles
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <Card
              key={post.slug}
              hoverable
              className="flex flex-col"
            >
              <div className="flex h-52 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-blue-100">
                <BookOpen className="h-16 w-16 text-blue-600" />
              </div>

              <div className="mt-6">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  {post.category}
                </span>

                <h3 className="mt-4 text-2xl font-bold">
                  {post.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  {post.excerpt}
                </p>

                <div className="mt-6 flex items-center gap-5 text-sm text-slate-500">
                  <span className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    {post.date}
                  </span>

                  <span className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4" />
                    {post.readTime}
                  </span>
                </div>

                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-8 inline-flex"
                >
                  <Button
                    variant="outline"
                    rightIcon={
                      <ArrowRight className="h-4 w-4" />
                    }
                  >
                    Read More
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}