





import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  User,
  BookOpen,
  Share2,
  GraduationCap,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPostPage({
  params,
}: BlogPostPageProps) {
  const { slug } = await params;

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 py-20 text-white">
        <div className="container mx-auto max-w-4xl px-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-blue-100 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          <span className="mt-8 inline-flex rounded-full bg-white/20 px-4 py-2 text-sm font-semibold">
            Study Tips
          </span>

          <h1 className="mt-6 text-5xl font-bold leading-tight">
            How to Score 300+ in JAMB
          </h1>

          <div className="mt-8 flex flex-wrap gap-6 text-blue-100">
            <span className="flex items-center gap-2">
              <User className="h-4 w-4" />
              JAMB League Editorial
            </span>

            <span className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              January 12, 2027
            </span>

            <span className="flex items-center gap-2">
              <Clock3 className="h-4 w-4" />
              6 min read
            </span>
          </div>
        </div>
      </section>

      {/* Article */}
      <section className="container mx-auto max-w-4xl px-4 py-16">
        <Card className="overflow-hidden p-0">
          {/* Featured Image */}
          <div className="flex h-80 items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
            <GraduationCap className="h-28 w-28 text-blue-600" />
          </div>

          <div className="p-10">
            <p className="text-lg leading-8 text-slate-700">
              Preparing for JAMB requires consistency, discipline and
              the right strategy. Every year thousands of students sit
              for the examination, but only a small percentage score
              above 300.
            </p>

            <p className="mt-6 text-lg leading-8 text-slate-700">
              Success is not determined by luck—it is achieved through
              proper planning, regular practice and understanding the
              CBT examination environment.
            </p>

            <h2 className="mt-10 text-3xl font-bold">
              1. Create a Study Timetable
            </h2>

            <p className="mt-5 leading-8 text-slate-700">
              Allocate time to each subject every day. Study your weak
              subjects more often while continuously revising your
              strengths.
            </p>

            <h2 className="mt-10 text-3xl font-bold">
              2. Practice CBT Questions Daily
            </h2>

            <p className="mt-5 leading-8 text-slate-700">
              The more CBT questions you answer, the more comfortable
              you become with timing and computer-based examinations.
            </p>

            <h2 className="mt-10 text-3xl font-bold">
              3. Join a Study Team
            </h2>

            <p className="mt-5 leading-8 text-slate-700">
              Learning with friends encourages accountability,
              knowledge sharing and healthy competition.
            </p>

            <h2 className="mt-10 text-3xl font-bold">
              4. Review Your Mistakes
            </h2>

            <p className="mt-5 leading-8 text-slate-700">
              Don't just answer questions. Understand why you got them
              wrong and learn the correct solution.
            </p>

            <h2 className="mt-10 text-3xl font-bold">
              5. Stay Consistent
            </h2>

            <p className="mt-5 leading-8 text-slate-700">
              Success comes from daily improvement. Even studying for
              one hour every day is better than studying only once a
              week.
            </p>

            <blockquote className="mt-10 rounded-2xl border-l-4 border-blue-600 bg-blue-50 p-6 text-lg italic text-slate-700">
              "Consistency beats intensity. Small daily improvements
              lead to outstanding JAMB results."
            </blockquote>

            <div className="mt-12 flex flex-wrap gap-3">
              {[
                "JAMB",
                "Study Tips",
                "CBT",
                "Preparation",
                "Education",
              ].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="mt-12 flex flex-wrap gap-4">
              <Button
                leftIcon={<Share2 className="h-4 w-4" />}
              >
                Share Article
              </Button>

              <Link href="/blog">
                <Button
                  variant="outline"
                  leftIcon={<BookOpen className="h-4 w-4" />}
                >
                  More Articles
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </section>

      {/* Related Posts */}
      <section className="bg-white py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-4xl font-bold">
            Related Articles
          </h2>

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Best Study Timetable",
                slug: "best-study-timetable",
              },
              {
                title: "Common JAMB Mistakes",
                slug: "common-jamb-mistakes",
              },
              {
                title: "CBT Examination Guide",
                slug: "cbt-exam-guide",
              },
            ].map((article) => (
              <Card
                key={article.slug}
                hoverable
                className="flex flex-col"
              >
                <div className="flex h-40 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-blue-100">
                  <BookOpen className="h-14 w-14 text-blue-600" />
                </div>

                <h3 className="mt-6 text-xl font-bold">
                  {article.title}
                </h3>

                <p className="mt-3 text-slate-600">
                  Continue learning with more expert tips for JAMB
                  preparation.
                </p>

                <Link
                  href={`/blog/${article.slug}`}
                  className="mt-6"
                >
                  <Button variant="outline" fullWidth>
                    Read Article
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Debug info - remove when connected to API */}
      <section className="py-10">
        <div className="container mx-auto max-w-4xl px-4">
          <p className="text-center text-sm text-slate-500">
            Current slug: <strong>{slug}</strong>
          </p>
        </div>
      </section>
    </main>
  );
}