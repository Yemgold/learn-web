


"use client";

import { useMemo, useState } from "react";
import {
  BookOpen,
  Search,
  Download,
  Star,
  Coins,
  ShoppingBag,
  GraduationCap,
  Heart,
  Sparkles,
  Brain,
  Wallet,
  Compass,
  BriefcaseBusiness,
  X,
  CheckCircle2,
  ArrowRight,
  Library,
  Clock,
  ShieldCheck,
  Gift,
} from "lucide-react";

type Book = {
  id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  price: number;
  reward: number;
  rating: number;
  pages: number;
  level: string;
  color: string;
  accent: string;
  symbol: string;
  featured?: boolean;
};

const formatNaira = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);

const categories = [
  { name: "All Books", icon: Library },
  { name: "Academic Success", icon: GraduationCap },
  { name: "Personal Growth", icon: Brain },
  { name: "Motivation", icon: Sparkles },
  { name: "Financial Literacy", icon: Wallet },
  { name: "Life & Purpose", icon: Compass },
  { name: "Entrepreneurship", icon: BriefcaseBusiness },
];

const books: Book[] = [
  {
    id: "study-smarter",
    title: "Study Smarter, Not Harder",
    author: "Learnfi Learning Series",
    category: "Academic Success",
    description:
      "Discover practical study techniques, better reading habits, memory strategies, and exam preparation methods to help you learn more effectively.",
    price: 2500,
    reward: 50,
    rating: 4.9,
    pages: 96,
    level: "Students",
    color: "from-blue-950 to-indigo-700",
    accent: "text-cyan-300",
    symbol: "A+",
    featured: true,
  },
  {
    id: "power-of-habits",
    title: "The Power of Good Habits",
    author: "Learnfi Personal Growth",
    category: "Personal Growth",
    description:
      "Learn how daily routines, self-discipline, consistency, and small positive decisions can shape your future.",
    price: 3000,
    reward: 75,
    rating: 4.8,
    pages: 112,
    level: "All levels",
    color: "from-emerald-950 to-teal-700",
    accent: "text-emerald-300",
    symbol: "GROW",
    featured: true,
  },
  {
    id: "believe-in-yourself",
    title: "Believe in Yourself",
    author: "Learnfi Inspiration",
    category: "Motivation",
    description:
      "Build confidence, overcome self-doubt, handle setbacks, and develop the courage to keep working towards your dreams.",
    price: 2000,
    reward: 40,
    rating: 4.7,
    pages: 84,
    level: "Young adults",
    color: "from-orange-950 to-rose-700",
    accent: "text-orange-200",
    symbol: "RISE",
  },
  {
    id: "moneywise",
    title: "Moneywise for Young People",
    author: "Learnfi Money Skills",
    category: "Financial Literacy",
    description:
      "Understand budgeting, saving, spending wisely, setting financial goals, and developing healthy money habits early in life.",
    price: 3500,
    reward: 100,
    rating: 4.9,
    pages: 124,
    level: "Teenagers & youth",
    color: "from-green-950 to-emerald-700",
    accent: "text-lime-300",
    symbol: "₦",
    featured: true,
  },
  {
    id: "discover-purpose",
    title: "Discover Your Purpose",
    author: "Learnfi Life Series",
    category: "Life & Purpose",
    description:
      "Reflect on your strengths, values, interests, and ambitions as you begin to make intentional choices about your future.",
    price: 2800,
    reward: 60,
    rating: 4.8,
    pages: 104,
    level: "Young adults",
    color: "from-violet-950 to-purple-700",
    accent: "text-purple-200",
    symbol: "WHY?",
  },
  {
    id: "young-entrepreneur",
    title: "The Young Entrepreneur",
    author: "Learnfi Enterprise",
    category: "Entrepreneurship",
    description:
      "Explore how to identify problems, develop useful ideas, understand customers, and take your first steps towards building a business.",
    price: 4000,
    reward: 120,
    rating: 4.8,
    pages: 136,
    level: "Beginners",
    color: "from-amber-950 to-orange-700",
    accent: "text-amber-200",
    symbol: "IDEA",
  },
  {
    id: "leadership",
    title: "Lead with Courage",
    author: "Learnfi Leadership",
    category: "Personal Growth",
    description:
      "Develop communication, teamwork, responsibility, decision-making, and the confidence to positively influence people around you.",
    price: 3200,
    reward: 80,
    rating: 4.7,
    pages: 108,
    level: "Students & youth",
    color: "from-sky-950 to-blue-700",
    accent: "text-sky-200",
    symbol: "LEAD",
  },
  {
    id: "resilience",
    title: "Rise After Every Fall",
    author: "Learnfi Inspiration",
    category: "Motivation",
    description:
      "Learn to respond constructively to disappointment, develop resilience, and turn challenges into opportunities for growth.",
    price: 2200,
    reward: 45,
    rating: 4.6,
    pages: 88,
    level: "All levels",
    color: "from-red-950 to-rose-800",
    accent: "text-rose-200",
    symbol: "RISE",
  },
  {
    id: "communication",
    title: "Speak with Confidence",
    author: "Learnfi Skills Series",
    category: "Personal Growth",
    description:
      "Improve public speaking, listening, writing, presentation skills, and the way you express your ideas clearly.",
    price: 2600,
    reward: 55,
    rating: 4.7,
    pages: 92,
    level: "Students & youth",
    color: "from-fuchsia-950 to-pink-700",
    accent: "text-pink-200",
    symbol: "SPEAK",
  },
  {
    id: "exam-success",
    title: "Your Exam Success Plan",
    author: "Learnfi Study Guides",
    category: "Academic Success",
    description:
      "Create a realistic revision timetable, practise active recall, manage exam anxiety, and prepare more confidently for tests.",
    price: 3500,
    reward: 100,
    rating: 4.9,
    pages: 118,
    level: "Secondary students",
    color: "from-cyan-950 to-blue-800",
    accent: "text-cyan-200",
    symbol: "100%",
    featured: true,
  },
  {
    id: "character",
    title: "Character Is Your Foundation",
    author: "Learnfi Life Series",
    category: "Life & Purpose",
    description:
      "Explore honesty, respect, accountability, kindness, and the everyday decisions that help build strong character.",
    price: 2500,
    reward: 50,
    rating: 4.7,
    pages: 90,
    level: "Young adults",
    color: "from-stone-900 to-amber-800",
    accent: "text-amber-200",
    symbol: "VALUES",
  },
  {
    id: "digital-skills",
    title: "Digital Skills for Tomorrow",
    author: "Learnfi Future Skills",
    category: "Entrepreneurship",
    description:
      "Discover digital productivity, responsible technology use, creative problem-solving, and skills that can support future opportunities.",
    price: 3800,
    reward: 100,
    rating: 4.8,
    pages: 128,
    level: "Beginners",
    color: "from-slate-950 to-indigo-800",
    accent: "text-indigo-200",
    symbol: "NEXT",
  },
];

function BookCover({
  book,
  compact = false,
}: {
  book: Book;
  compact?: boolean;
}) {
  return (
    <div
      className={`relative flex w-full flex-col justify-between overflow-hidden rounded-lg bg-gradient-to-br ${book.color} ${
        compact ? "aspect-[4/5]" : "aspect-[3/4]"
      } p-4 text-white shadow-xl ring-1 ring-white/10`}
    >
      <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full border border-white/15" />
      <div className="absolute -right-7 -top-7 h-24 w-24 rounded-full border border-white/15" />
      <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-white/[0.06]" />

      <div className="relative z-10 flex items-center justify-between">
        <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white/75">
          LEARNFI
        </span>
        <BookOpen size={15} className={book.accent} />
      </div>

      <div className="relative z-10 my-4">
        <div
          className={`mb-3 font-black leading-none tracking-tight ${book.accent} ${
            compact ? "text-2xl" : "text-4xl"
          }`}
        >
          {book.symbol}
        </div>
        <div
          className={`font-black leading-tight tracking-tight ${
            compact ? "text-sm" : "text-lg sm:text-xl"
          }`}
        >
          {book.title}
        </div>
        <div className="mt-3 h-1 w-10 rounded-full bg-white/70" />
      </div>

      <div className="relative z-10 border-t border-white/20 pt-3">
        <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/75">
          Learn • Grow • Succeed
        </p>
      </div>
    </div>
  );
}

export default function BooksPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Books");
  const [sortBy, setSortBy] = useState("featured");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [notice, setNotice] = useState("");
  const [demoOwned, setDemoOwned] = useState<string[]>([]);
  const [showOwnedOnly, setShowOwnedOnly] = useState(false);

  const filteredBooks = useMemo(() => {
    let result = books.filter((book) => {
      const matchesCategory =
        activeCategory === "All Books" ||
        book.category === activeCategory;

      const term = search.trim().toLowerCase();
      const matchesSearch =
        !term ||
        book.title.toLowerCase().includes(term) ||
        book.author.toLowerCase().includes(term) ||
        book.category.toLowerCase().includes(term) ||
        book.description.toLowerCase().includes(term);

      const matchesOwned =
        !showOwnedOnly || demoOwned.includes(book.id);

      return matchesCategory && matchesSearch && matchesOwned;
    });

    if (sortBy === "price-low") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    } else {
      result = [...result].sort(
        (a, b) =>
          Number(Boolean(b.featured)) - Number(Boolean(a.featured)),
      );
    }

    return result;
  }, [activeCategory, search, sortBy, demoOwned, showOwnedOnly]);

  function handleDemoPurchase(book: Book) {
    if (demoOwned.includes(book.id)) {
      setSelectedBook(null);
      setNotice(`"${book.title}" is already in your demo library.`);
      return;
    }

    setDemoOwned((current) => [...current, book.id]);
    setSelectedBook(null);
    setNotice(
      `Demo purchase recorded for "${book.title}". In the live store, the student pays ${formatNaira(book.price)} and receives ${book.reward} CBT Points back after the purchase is confirmed. No real payment or points were processed.`,
    );
  }

  function handleDemoDownload(book: Book) {
    setNotice(
      `"${book.title}" is a sample listing. The actual downloadable book file and download API have not been connected yet.`,
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 pb-16 text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300 ring-1 ring-cyan-400/20">
              <BookOpen size={25} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
                LEARNFI STORE
              </p>
              <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                Books that build your future
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setShowOwnedOnly((value) => !value);
              setActiveCategory("All Books");
              setSearch("");
            }}
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
              showOwnedOnly
                ? "border-cyan-300 bg-cyan-300 text-slate-950"
                : "border-slate-700 bg-slate-900 text-slate-200 hover:border-cyan-400/50"
            }`}
          >
            <Library size={17} />
            My Library ({demoOwned.length})
          </button>
        </div>

        {/* Hero */}
        <section className="relative mb-8 overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-indigo-950 via-slate-900 to-cyan-950 p-6 sm:p-9">
          <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full border border-cyan-400/10" />
          <div className="absolute -right-4 -top-8 h-48 w-48 rounded-full border border-cyan-400/10" />

          <div className="relative grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-bold text-cyan-200">
                <Sparkles size={14} />
                READ. GROW. GET REWARDED.
              </span>

              <h2 className="mt-5 max-w-2xl text-3xl font-black leading-tight sm:text-5xl">
                Invest in your mind.
                <span className="block text-cyan-300">
                  Transform your life.
                </span>
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                Explore books that help you excel academically, build confidence,
                develop life skills, manage money, and discover your potential.
                Purchase a book and earn CBT Points back as a student reward.
              </p>

              <button
                type="button"
                onClick={() => {
                  setActiveCategory("All Books");
                  setShowOwnedOnly(false);
                  document.getElementById("book-catalogue")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-200"
              >
                Explore Books
                <ArrowRight size={17} />
              </button>
            </div>

            <div className="hidden items-center justify-center gap-3 sm:flex">
              <div className="w-32 -rotate-6">
                <BookCover book={books[0]} compact />
              </div>
              <div className="z-10 w-36 -translate-y-5 rotate-3">
                <BookCover book={books[1]} compact />
              </div>
              <div className="w-32 translate-y-3 rotate-6">
                <BookCover book={books[3]} compact />
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <div className="rounded-xl bg-blue-400/10 p-3 text-blue-300">
              <GraduationCap size={22} />
            </div>
            <div>
              <p className="font-bold">Learn Something New</p>
              <p className="mt-1 text-xs text-slate-400">
                Knowledge for school and life
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <div className="rounded-xl bg-amber-400/10 p-3 text-amber-300">
              <Gift size={22} />
            </div>
            <div>
              <p className="font-bold">Earn CBT Points Back</p>
              <p className="mt-1 text-xs text-slate-400">
                Rewards for confirmed purchases
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <div className="rounded-xl bg-emerald-400/10 p-3 text-emerald-300">
              <Download size={22} />
            </div>
            <div>
              <p className="font-bold">Digital Reading</p>
              <p className="mt-1 text-xs text-slate-400">
                Access your purchased books
              </p>
            </div>
          </div>
        </section>

        {/* Purchase and reward explanation */}
        <section className="mb-8 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-emerald-400/10 p-3 text-emerald-300">
              <Coins size={22} />
            </div>
            <div>
              <h3 className="font-bold text-white">
                Pay in Naira. Get CBT Points back.
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Every book has its own Naira price and CBT Point reward.
                Students pay the displayed price to purchase a book. After the
                payment is successfully confirmed, the specified CBT Points
                should be credited to their wallet.
              </p>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                CBT Points are rewards, not the book's purchase price. Reward
                values shown here are sample values and can be adjusted to your
                actual reward policy.
              </p>
            </div>
          </div>
        </section>

        {/* Notice */}
        {notice && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm text-cyan-100">
            <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
            <p className="flex-1 leading-6">{notice}</p>
            <button
              type="button"
              aria-label="Dismiss message"
              onClick={() => setNotice("")}
              className="rounded-lg p-1 hover:bg-white/10"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {/* Catalogue */}
        <section id="book-catalogue" className="scroll-mt-6">
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
              THE BOOKSHELF
            </p>
            <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black sm:text-3xl">
                  {showOwnedOnly
                    ? "My Demo Library"
                    : "Find your next great read"}
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  {showOwnedOnly
                    ? "Books added to your sample library during this session."
                    : "Academic guides, motivation, money skills, and life lessons."}
                </p>
              </div>
              <p className="text-sm text-slate-400">
                {filteredBooks.length} books
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="mb-5 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search titles, topics, or skills..."
                className="w-full rounded-xl border border-slate-800 bg-slate-900 py-3.5 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/10"
              />
            </div>

            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-200 outline-none focus:border-cyan-400/60"
              aria-label="Sort books"
            >
              <option value="featured">Featured first</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
              <option value="rating">Highest rated</option>
            </select>
          </div>

          {/* Categories */}
          <div className="mb-7 flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => {
              const Icon = category.icon;
              const active = activeCategory === category.name;

              return (
                <button
                  key={category.name}
                  type="button"
                  onClick={() => {
                    setActiveCategory(category.name);
                    setShowOwnedOnly(false);
                  }}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-bold transition ${
                    active
                      ? "border-cyan-300 bg-cyan-300 text-slate-950"
                      : "border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-600"
                  }`}
                >
                  <Icon size={15} />
                  {category.name}
                </button>
              );
            })}
          </div>

          {/* Book Grid */}
          {filteredBooks.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filteredBooks.map((book) => {
                const owned = demoOwned.includes(book.id);

                return (
                  <article
                    key={book.id}
                    className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 transition duration-200 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-slate-900"
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedBook(book)}
                      className="relative m-3 mb-0 block text-left"
                      aria-label={`View ${book.title}`}
                    >
                      <BookCover book={book} />

                      {book.featured && (
                        <span className="absolute left-2 top-2 rounded-full bg-amber-300 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-slate-950">
                          Featured
                        </span>
                      )}

                      {owned && (
                        <span className="absolute right-2 top-2 rounded-full bg-emerald-300 px-2 py-1 text-[9px] font-black text-slate-950">
                          DEMO OWNED
                        </span>
                      )}
                    </button>

                    <div className="flex flex-1 flex-col p-3 sm:p-4">
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                        {book.category}
                      </p>

                      <button
                        type="button"
                        onClick={() => setSelectedBook(book)}
                        className="text-left text-sm font-extrabold leading-snug text-white hover:text-cyan-200"
                      >
                        {book.title}
                      </button>

                      <p className="mt-1.5 line-clamp-1 text-xs text-slate-500">
                        {book.author}
                      </p>

                      <div className="mt-3 flex items-center gap-1 text-xs text-amber-300">
                        <Star size={13} fill="currentColor" />
                        <span className="font-bold">{book.rating.toFixed(1)}</span>
                        <span className="text-slate-500">
                          · {book.pages} pages
                        </span>
                      </div>

                      <div className="mt-auto pt-4">
                        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                            Book price
                          </p>
                          <p className="mt-1 text-lg font-black text-white">
                            {formatNaira(book.price)}
                          </p>

                          <div className="my-3 border-t border-slate-800" />

                          <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                            <Gift size={13} />
                            CBT Points back
                          </p>
                          <p className="mt-1 flex items-center gap-1.5 text-sm font-black text-emerald-300">
                            <Coins size={15} />
                            +{book.reward} CBT Points
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedBook(book)}
                          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-cyan-300 hover:text-slate-950"
                        >
                          {owned ? (
                            <>
                              <BookOpen size={14} />
                              View Book
                            </>
                          ) : (
                            <>
                              <ShoppingBag size={14} />
                              View & Purchase
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 px-6 py-16 text-center">
              <BookOpen className="mx-auto text-slate-500" size={36} />
              <h3 className="mt-4 text-lg font-bold">No books found</h3>
              <p className="mt-2 text-sm text-slate-400">
                Try another search term or choose a different category.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All Books");
                  setShowOwnedOnly(false);
                }}
                className="mt-5 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-bold hover:bg-slate-700"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        {/* Reward note */}
        <section className="mt-10 rounded-2xl border border-amber-300/15 bg-amber-300/[0.06] p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-amber-300/10 p-3 text-amber-300">
              <Heart size={22} />
            </div>
            <div>
              <h3 className="font-bold">
                Knowledge is an investment in yourself
              </h3>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                Learnfi brings together books that support academic achievement,
                character development, motivation, financial awareness, and
                personal growth. The Naira prices and CBT Point rewards are
                sample catalogue values. The live system should confirm payment
                before granting access to a book and crediting its reward.
              </p>
            </div>
          </div>
        </section>

        <p className="mt-6 text-center text-xs text-slate-600">
          Sample catalogue · Prices and CBT Point rewards are illustrative.
        </p>
      </div>

      {/* Book Details Modal */}
      {selectedBook && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedBook(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="book-modal-title"
            className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-slate-700 bg-slate-950 shadow-2xl sm:rounded-3xl"
          >
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
              <div className="flex items-center gap-2 text-sm font-bold text-cyan-300">
                <BookOpen size={18} />
                Book Details
              </div>
              <button
                type="button"
                onClick={() => setSelectedBook(null)}
                aria-label="Close book details"
                className="rounded-xl bg-slate-800 p-2 text-slate-300 hover:bg-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid gap-6 p-5 sm:grid-cols-[200px_1fr] sm:p-7">
              <div className="mx-auto w-44 sm:w-full">
                <BookCover book={selectedBook} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                  {selectedBook.category}
                </p>

                <h2
                  id="book-modal-title"
                  className="mt-2 text-2xl font-black leading-tight"
                >
                  {selectedBook.title}
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  By {selectedBook.author}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-2 text-xs text-amber-300">
                    <Star size={13} fill="currentColor" />
                    {selectedBook.rating.toFixed(1)} sample rating
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-2 text-xs text-slate-300">
                    <BookOpen size={13} />
                    {selectedBook.pages} pages
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-2 text-xs text-slate-300">
                    <Clock size={13} />
                    Digital book
                  </span>
                </div>

                <p className="mt-5 text-sm leading-7 text-slate-300">
                  {selectedBook.description}
                </p>

                {/* Price and reward are separate */}
                <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900 p-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Price to purchase this book
                    </p>
                    <p className="mt-2 text-3xl font-black text-white">
                      {formatNaira(selectedBook.price)}
                    </p>
                  </div>

                  <div className="my-4 border-t border-slate-800" />

                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-emerald-400/10 p-3 text-emerald-300">
                      <Gift size={22} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                        CBT Points reward after purchase
                      </p>
                      <p className="mt-1 text-xl font-black text-emerald-300">
                        +{selectedBook.reward} CBT Points
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 text-xs leading-5 text-slate-500">
                    Pay the Naira price. The CBT Points are a separate reward
                    that should be credited after successful payment
                    confirmation.
                  </p>
                </div>

                <div className="mt-5 flex flex-col gap-3">
                  {demoOwned.includes(selectedBook.id) ? (
                    <button
                      type="button"
                      onClick={() => handleDemoDownload(selectedBook)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-300 px-4 py-3 font-bold text-slate-950 transition hover:bg-emerald-200"
                    >
                      <Download size={17} />
                      Open My Book (Demo)
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleDemoPurchase(selectedBook)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 font-bold text-slate-950 transition hover:bg-cyan-200"
                    >
                      <ShoppingBag size={17} />
                      Try Demo Purchase
                    </button>
                  )}

                  <div className="flex items-start gap-2 text-xs leading-5 text-slate-500">
                    <ShieldCheck size={15} className="mt-0.5 shrink-0" />
                    Demo mode only: no actual Naira payment, CBT Point credit,
                    or downloadable book file is processed. The live purchase
                    should verify payment on the server before granting the
                    book and reward.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}