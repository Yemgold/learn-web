


"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Plus,
  Search,
  Upload,
  ImagePlus,
  FileText,
  Coins,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Star,
  X,
  CheckCircle2,
  AlertCircle,
  Library,
  GraduationCap,
  Wallet,
  Compass,
  BriefcaseBusiness,
  Sparkles,
  Heart,
  Loader2,
} from "lucide-react";

type BookStatus = "DRAFT" | "PUBLISHED";

type AdminBook = {
  id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  price: number;
  reward: number;
  audience: string;
  pages: number;
  featured: boolean;
  status: BookStatus;
  coverUrl: string;
  coverName: string;
  fileName: string;
  fileSize: number;
};

type BookForm = {
  title: string;
  author: string;
  category: string;
  description: string;
  price: string;
  reward: string;
  audience: string;
  pages: string;
  featured: boolean;
  status: BookStatus;
};

const CATEGORIES = [
  "Academic Success",
  "Personal Growth",
  "Motivation",
  "Financial Literacy",
  "Life & Purpose",
  "Entrepreneurship",
];

const EMPTY_FORM: BookForm = {
  title: "",
  author: "",
  category: "Academic Success",
  description: "",
  price: "",
  reward: "",
  audience: "Students",
  pages: "",
  featured: false,
  status: "DRAFT",
};

const SAMPLE_BOOKS: AdminBook[] = [
  {
    id: "sample-1",
    title: "Study Smarter, Not Harder",
    author: "Learnfi Learning Series",
    category: "Academic Success",
    description:
      "Practical study techniques, memory strategies, and exam preparation advice.",
    price: 2500,
    reward: 50,
    audience: "Secondary students",
    pages: 96,
    featured: true,
    status: "PUBLISHED",
    coverUrl: "",
    coverName: "",
    fileName: "study-smarter.pdf",
    fileSize: 0,
  },
  {
    id: "sample-2",
    title: "The Power of Good Habits",
    author: "Learnfi Personal Growth",
    category: "Personal Growth",
    description:
      "Learn how daily routines and self-discipline can shape your future.",
    price: 3000,
    reward: 75,
    audience: "Students & youth",
    pages: 112,
    featured: true,
    status: "DRAFT",
    coverUrl: "",
    coverName: "",
    fileName: "power-of-habits.pdf",
    fileSize: 0,
  },
];

const formatNaira = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);

const formatFileSize = (bytes: number) => {
  if (!bytes) return "Size unavailable";
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(0)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const CATEGORY_ICONS: Record<string, typeof BookOpen> = {
  "Academic Success": GraduationCap,
  "Personal Growth": BookOpen,
  Motivation: Sparkles,
  "Financial Literacy": Wallet,
  "Life & Purpose": Compass,
  Entrepreneurship: BriefcaseBusiness,
};

export default function AdminBooksPage() {
  const [books, setBooks] = useState<AdminBook[]>(SAMPLE_BOOKS);
  const [form, setForm] = useState<BookForm>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [showForm, setShowForm] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [bookFile, setBookFile] = useState<File | null>(null);
  const [existingCoverUrl, setExistingCoverUrl] = useState("");
  const [existingCoverName, setExistingCoverName] = useState("");
  const [existingBookName, setExistingBookName] = useState("");
  const [existingBookSize, setExistingBookSize] = useState(0);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const coverPreview = useMemo(
    () => (coverFile ? URL.createObjectURL(coverFile) : existingCoverUrl),
    [coverFile, existingCoverUrl],
  );

  useEffect(() => {
    if (!coverFile) return;

    const previewUrl = URL.createObjectURL(coverFile);
    return () => URL.revokeObjectURL(previewUrl);
  }, [coverFile]);

  const filteredBooks = useMemo(() => {
    const term = search.trim().toLowerCase();

    return books.filter((book) => {
      const matchesSearch =
        !term ||
        book.title.toLowerCase().includes(term) ||
        book.author.toLowerCase().includes(term) ||
        book.category.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "ALL" || book.status === statusFilter;

      const matchesCategory =
        categoryFilter === "ALL" || book.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [books, search, statusFilter, categoryFilter]);

  const publishedCount = books.filter(
    (book) => book.status === "PUBLISHED",
  ).length;

  const draftCount = books.filter((book) => book.status === "DRAFT").length;

  const totalRewards = books.reduce((sum, book) => sum + book.reward, 0);

  function updateForm<K extends keyof BookForm>(
    key: K,
    value: BookForm[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleCoverChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file for the book cover.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("The cover image must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }

    setError("");
    setCoverFile(file);
  }

  function handleBookFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const extension = file.name.split(".").pop()?.toLowerCase();
    const allowedExtensions = ["pdf", "epub"];

    if (!extension || !allowedExtensions.includes(extension)) {
      setError("Please upload a PDF or EPUB book file.");
      event.target.value = "";
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setError("The book file must be 100 MB or smaller.");
      event.target.value = "";
      return;
    }

    setError("");
    setBookFile(file);
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setCoverFile(null);
    setBookFile(null);
    setExistingCoverUrl("");
    setExistingCoverName("");
    setExistingBookName("");
    setExistingBookSize(0);
    setShowForm(false);
    setError("");
  }

  function openNewBookForm() {
    resetForm();
    setNotice("");
    setShowForm(true);
  }

  function openEditForm(book: AdminBook) {
    setEditingId(book.id);
    setForm({
      title: book.title,
      author: book.author,
      category: book.category,
      description: book.description,
      price: String(book.price),
      reward: String(book.reward),
      audience: book.audience,
      pages: String(book.pages || ""),
      featured: book.featured,
      status: book.status,
    });

    setCoverFile(null);
    setBookFile(null);
    setExistingCoverUrl(book.coverUrl);
    setExistingCoverName(book.coverName);
    setExistingBookName(book.fileName);
    setExistingBookSize(book.fileSize);
    setError("");
    setNotice("");
    setShowForm(true);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");

    const price = Number(form.price);
    const reward = Number(form.reward);
    const pages = Number(form.pages || 0);

    if (!form.title.trim() || !form.author.trim()) {
      setError("Enter the book title and author.");
      return;
    }

    if (!form.description.trim()) {
      setError("Enter a description for the book.");
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      setError("Enter a valid Naira selling price greater than zero.");
      return;
    }

    if (!Number.isInteger(reward) || reward < 0) {
      setError("CBT Point rewards must be a whole number of zero or more.");
      return;
    }

    if (!Number.isInteger(pages) || pages < 0) {
      setError("Enter a valid page count.");
      return;
    }

    if (!editingId && !bookFile) {
      setError("Please select the actual PDF or EPUB book file.");
      return;
    }

    setSaving(true);

    try {
      const currentBook = editingId
        ? books.find((book) => book.id === editingId)
        : undefined;

      const newBook: AdminBook = {
        id: editingId || `book-${Date.now()}`,
        title: form.title.trim(),
        author: form.author.trim(),
        category: form.category,
        description: form.description.trim(),
        price,
        reward,
        audience: form.audience,
        pages,
        featured: form.featured,
        status: form.status,
        coverUrl: coverFile
          ? URL.createObjectURL(coverFile)
          : existingCoverUrl,
        coverName: coverFile?.name || existingCoverName,
        fileName: bookFile?.name || existingBookName,
        fileSize: bookFile?.size || existingBookSize,
      };

      if (editingId) {
        setBooks((current) =>
          current.map((book) =>
            book.id === editingId ? newBook : book,
          ),
        );
        setNotice(
          "Book details updated in this page's temporary demo state.",
        );
      } else {
        setBooks((current) => [newBook, ...current]);
        setNotice(
          "Book added to the temporary demo catalogue. The selected file has not been uploaded to a server.",
        );
      }

      resetForm();
    } catch {
      setError("Unable to save the book. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function togglePublished(book: AdminBook) {
    const nextStatus: BookStatus =
      book.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";

    setBooks((current) =>
      current.map((item) =>
        item.id === book.id ? { ...item, status: nextStatus } : item,
      ),
    );

    setNotice(
      `"${book.title}" changed to ${nextStatus} in the temporary demo state.`,
    );
  }

  function deleteBook(book: AdminBook) {
    const confirmed = window.confirm(
      `Remove "${book.title}" from this demo catalogue?`,
    );

    if (!confirmed) return;

    setBooks((current) => current.filter((item) => item.id !== book.id));

    if (editingId === book.id) resetForm();

    setNotice(`"${book.title}" was removed from the temporary demo catalogue.`);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page header */}
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300 ring-1 ring-cyan-400/20">
              <Library size={25} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
                LEARNFI ADMIN
              </p>
              <h1 className="mt-1 text-2xl font-black sm:text-3xl">
                Books Management
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Upload books, set selling prices, and configure student rewards.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={openNewBookForm}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-200"
          >
            <Plus size={18} />
            Add New Book
          </button>
        </header>

        {/* Demo warning */}
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-400/20 bg-amber-400/[0.06] p-4">
          <AlertCircle size={19} className="mt-0.5 shrink-0 text-amber-300" />
          <div>
            <p className="text-sm font-bold text-amber-200">
              Upload interface preview
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-400">
              This version previews selected files and updates the page's
              temporary state. It does not permanently store uploaded files,
              update the student catalogue, or save changes to your database.
              Backend upload and storage integration are required for that.
            </p>
          </div>
        </div>

        {/* Statistics */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={BookOpen}
            label="Total Books"
            value={books.length.toString()}
            color="cyan"
          />
          <StatCard
            icon={CheckCircle2}
            label="Published"
            value={publishedCount.toString()}
            color="emerald"
          />
          <StatCard
            icon={FileText}
            label="Drafts"
            value={draftCount.toString()}
            color="amber"
          />
          <StatCard
            icon={Coins}
            label="Configured Rewards"
            value={`${totalRewards.toLocaleString()} pts`}
            color="violet"
          />
        </section>

        {/* Notifications */}
        {notice && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm text-cyan-100">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
            <p className="flex-1 leading-6">{notice}</p>
            <button
              type="button"
              onClick={() => setNotice("")}
              aria-label="Dismiss notice"
              className="rounded-lg p-1 hover:bg-white/10"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <p className="flex-1 leading-6">{error}</p>
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
              className="rounded-lg p-1 hover:bg-white/10"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Upload form */}
        {showForm && (
          <section className="mb-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
            <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-black">
                  {editingId ? "Edit Book" : "Upload a New Book"}
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Enter the book details, price, reward, and digital files.
                </p>
              </div>

              <button
                type="button"
                onClick={resetForm}
                aria-label="Close book form"
                className="rounded-xl bg-slate-800 p-2 text-slate-300 hover:bg-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-7 p-5 sm:p-6">
              {/* File uploads */}
              <div>
                <h3 className="mb-4 text-sm font-bold text-white">
                  Book files
                </h3>

                <div className="grid gap-5 md:grid-cols-2">
                  {/* Cover upload */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-200">
                      Book cover image
                    </label>

                    <label className="flex min-h-64 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-700 bg-slate-950/70 p-4 text-center transition hover:border-cyan-400/50">
                      {coverPreview ? (
                        <img
                          src={coverPreview}
                          alt="Book cover preview"
                          className="max-h-56 max-w-full rounded-lg object-contain"
                        />
                      ) : (
                        <>
                          <ImagePlus size={35} className="text-slate-500" />
                          <p className="mt-3 text-sm font-bold">
                            Choose cover image
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            PNG, JPG, or WebP · Maximum 5 MB
                          </p>
                        </>
                      )}

                      <span className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-xs font-bold">
                        <Upload size={14} />
                        Select Image
                      </span>

                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverChange}
                        className="sr-only"
                      />
                    </label>

                    {(coverFile || existingCoverName) && (
                      <div className="mt-2 flex items-center justify-between gap-2 text-xs text-slate-400">
                        <span className="truncate">
                          {coverFile?.name || existingCoverName}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setCoverFile(null);
                            setExistingCoverUrl("");
                            setExistingCoverName("");
                          }}
                          className="shrink-0 text-red-300 hover:text-red-200"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Digital book upload */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-200">
                      Digital book file <span className="text-red-300">*</span>
                    </label>

                    <label className="flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950/70 p-5 text-center transition hover:border-cyan-400/50">
                      <div className="rounded-2xl bg-cyan-400/10 p-4 text-cyan-300">
                        <FileText size={34} />
                      </div>

                      <p className="mt-4 max-w-full break-all text-sm font-bold">
                        {bookFile?.name || existingBookName || "Select your book file"}
                      </p>

                      <p className="mt-2 text-xs text-slate-500">
                        PDF or EPUB · Maximum 100 MB
                      </p>

                      {bookFile && (
                        <p className="mt-2 text-xs text-emerald-300">
                          {formatFileSize(bookFile.size)} selected
                        </p>
                      )}

                      {!bookFile && existingBookName && (
                        <p className="mt-2 text-xs text-slate-500">
                          {formatFileSize(existingBookSize)} · Existing demo entry
                        </p>
                      )}

                      <span className="mt-4 inline-flex items-center gap-2 rounded-lg bg-cyan-300 px-4 py-2.5 text-xs font-black text-slate-950">
                        <Upload size={15} />
                        {existingBookName ? "Replace Book File" : "Upload Book File"}
                      </span>

                      <input
                        type="file"
                        accept=".pdf,.epub,application/pdf,application/epub+zip"
                        onChange={handleBookFileChange}
                        className="sr-only"
                      />
                    </label>

                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      Select the actual book students will receive after
                      purchase. A filename alone does not upload a book to your
                      server.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-800" />

              {/* Book information */}
              <div>
                <h3 className="mb-4 text-sm font-bold text-white">
                  Book information
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Book title" required>
                    <input
                      value={form.title}
                      onChange={(event) =>
                        updateForm("title", event.target.value)
                      }
                      placeholder="e.g. Study Smarter, Not Harder"
                      required
                      maxLength={180}
                      className={inputClass}
                    />
                  </FormField>

                  <FormField label="Author or publisher" required>
                    <input
                      value={form.author}
                      onChange={(event) =>
                        updateForm("author", event.target.value)
                      }
                      placeholder="Enter author or publisher"
                      required
                      maxLength={150}
                      className={inputClass}
                    />
                  </FormField>

                  <FormField label="Category" required>
                    <select
                      value={form.category}
                      onChange={(event) =>
                        updateForm("category", event.target.value)
                      }
                      className={inputClass}
                    >
                      {CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </FormField>

                  <FormField label="Target audience">
                    <select
                      value={form.audience}
                      onChange={(event) =>
                        updateForm("audience", event.target.value)
                      }
                      className={inputClass}
                    >
                      <option>Primary students</option>
                      <option>Secondary students</option>
                      <option>University students</option>
                      <option>Students & youth</option>
                      <option>Teenagers & youth</option>
                      <option>Young adults</option>
                      <option>All readers</option>
                    </select>
                  </FormField>

                  <div className="sm:col-span-2">
                    <FormField label="Description" required>
                      <textarea
                        value={form.description}
                        onChange={(event) =>
                          updateForm("description", event.target.value)
                        }
                        placeholder="Explain what students will learn from this book..."
                        required
                        rows={4}
                        maxLength={2000}
                        className={`${inputClass} resize-y`}
                      />
                    </FormField>
                  </div>

                  <FormField label="Number of pages">
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={form.pages}
                      onChange={(event) =>
                        updateForm("pages", event.target.value)
                      }
                      placeholder="e.g. 96"
                      className={inputClass}
                    />
                  </FormField>
                </div>
              </div>

              <div className="border-t border-slate-800" />

              {/* Pricing and rewards */}
              <div>
                <h3 className="mb-1 text-sm font-bold text-white">
                  Selling price & student reward
                </h3>
                <p className="mb-4 text-xs leading-5 text-slate-400">
                  The selling price is what the student pays in Naira. The CBT
                  Points are a separate reward credited after confirmed payment.
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Selling price (₦)" required>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-emerald-300">
                        ₦
                      </span>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={form.price}
                        onChange={(event) =>
                          updateForm("price", event.target.value)
                        }
                        placeholder="2500"
                        required
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-slate-500">
                      The amount the student pays for this book.
                    </p>
                  </FormField>

                  <FormField label="CBT Points reward" required>
                    <div className="relative">
                      <Coins
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-300"
                      />
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={form.reward}
                        onChange={(event) =>
                          updateForm("reward", event.target.value)
                        }
                        placeholder="50"
                        required
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-slate-500">
                      Points to credit after successful payment.
                    </p>
                  </FormField>
                </div>

                <div className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                    Student purchase preview
                  </p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-xs text-slate-400">Student pays</p>
                      <p className="mt-1 text-2xl font-black text-white">
                        {formatNaira(Number(form.price) || 0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">
                        Student receives after payment
                      </p>
                      <p className="mt-1 text-xl font-black text-emerald-300">
                        +{Number(form.reward) || 0} CBT Points
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-800" />

              {/* Publication settings */}
              <div>
                <h3 className="mb-4 text-sm font-bold text-white">
                  Publication settings
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Catalogue status">
                    <select
                      value={form.status}
                      onChange={(event) =>
                        updateForm("status", event.target.value as BookStatus)
                      }
                      className={inputClass}
                    >
                      <option value="DRAFT">Draft — hidden from students</option>
                      <option value="PUBLISHED">
                        Published — intended for student store
                      </option>
                    </select>
                  </FormField>

                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(event) =>
                        updateForm("featured", event.target.checked)
                      }
                      className="h-4 w-4 accent-cyan-300"
                    />
                    <div>
                      <p className="text-sm font-bold">Feature this book</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Highlight it in the student catalogue.
                      </p>
                    </div>
                    <Star
                      size={18}
                      className="ml-auto shrink-0 text-amber-300"
                    />
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse gap-3 border-t border-slate-800 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-bold text-slate-300 transition hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-300 px-6 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <Loader2 size={17} className="animate-spin" />
                  ) : (
                    <Upload size={17} />
                  )}
                  {editingId ? "Save Book Changes" : "Add Book to Catalogue"}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Catalogue management */}
        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50">
          <div className="border-b border-slate-800 p-5 sm:p-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2 className="text-lg font-black">Book Catalogue</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Manage titles, selling prices, rewards, and publication status.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="relative sm:col-span-1">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search books..."
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-cyan-400/50"
                  />
                </div>

                <select
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                  aria-label="Filter by category"
                  className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm outline-none focus:border-cyan-400/50"
                >
                  <option value="ALL">All categories</option>
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  aria-label="Filter by status"
                  className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm outline-none focus:border-cyan-400/50"
                >
                  <option value="ALL">All statuses</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="DRAFT">Draft</option>
                </select>
              </div>
            </div>
          </div>

          {filteredBooks.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <BookOpen size={35} className="mx-auto text-slate-600" />
              <h3 className="mt-4 font-bold">No books found</h3>
              <p className="mt-2 text-sm text-slate-500">
                Try another search or add a new book.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[900px] text-left">
                  <thead className="border-b border-slate-800 bg-slate-950/70">
                    <tr className="text-[11px] uppercase tracking-wider text-slate-500">
                      <th className="px-5 py-4">Book</th>
                      <th className="px-4 py-4">Category</th>
                      <th className="px-4 py-4">Selling price</th>
                      <th className="px-4 py-4">CBT reward</th>
                      <th className="px-4 py-4">Book file</th>
                      <th className="px-4 py-4">Status</th>
                      <th className="px-5 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredBooks.map((book) => {
                      const CategoryIcon =
                        CATEGORY_ICONS[book.category] || BookOpen;

                      return (
                        <tr
                          key={book.id}
                          className="transition hover:bg-slate-800/20"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-12 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-700 bg-slate-800 text-cyan-300">
                                {book.coverUrl ? (
                                  <img
                                    src={book.coverUrl}
                                    alt=""
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <BookOpen size={19} />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="max-w-56 truncate text-sm font-bold">
                                  {book.title}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                  {book.author}
                                </p>
                                {book.featured && (
                                  <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-amber-300">
                                    <Star size={10} fill="currentColor" />
                                    Featured
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <span className="inline-flex items-center gap-2 text-xs text-slate-300">
                              <CategoryIcon
                                size={15}
                                className="text-cyan-300"
                              />
                              {book.category}
                            </span>
                          </td>

                          <td className="px-4 py-4 text-sm font-black text-white">
                            {formatNaira(book.price)}
                          </td>

                          <td className="px-4 py-4">
                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-400/10 px-2.5 py-1.5 text-xs font-bold text-emerald-300">
                              <Coins size={13} />
                              +{book.reward}
                            </span>
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex max-w-40 items-center gap-2">
                              <FileText
                                size={16}
                                className="shrink-0 text-slate-500"
                              />
                              <span className="truncate text-xs text-slate-400">
                                {book.fileName || "No file"}
                              </span>
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <StatusPill status={book.status} />
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex justify-end gap-1">
                              <ActionButton
                                label="Edit book"
                                onClick={() => openEditForm(book)}
                                icon={Pencil}
                              />
                              <ActionButton
                                label={
                                  book.status === "PUBLISHED"
                                    ? "Unpublish book"
                                    : "Publish book"
                                }
                                onClick={() => togglePublished(book)}
                                icon={
                                  book.status === "PUBLISHED" ? EyeOff : Eye
                                }
                              />
                              <ActionButton
                                label="Delete book"
                                onClick={() => deleteBook(book)}
                                icon={Trash2}
                                danger
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="grid gap-3 p-4 md:hidden">
                {filteredBooks.map((book) => (
                  <article
                    key={book.id}
                    className="rounded-xl border border-slate-800 bg-slate-950/70 p-4"
                  >
                    <div className="flex gap-3">
                      <div className="flex h-24 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-700 bg-slate-800 text-cyan-300">
                        {book.coverUrl ? (
                          <img
                            src={book.coverUrl}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <BookOpen size={22} />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <StatusPill status={book.status} />
                          {book.featured && (
                            <Star
                              size={14}
                              className="text-amber-300"
                              fill="currentColor"
                            />
                          )}
                        </div>

                        <h3 className="mt-2 text-sm font-black">{book.title}</h3>
                        <p className="mt-1 text-xs text-slate-500">
                          {book.author}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {book.category}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-slate-900 p-3">
                        <p className="text-[10px] text-slate-500">
                          Selling price
                        </p>
                        <p className="mt-1 font-black">
                          {formatNaira(book.price)}
                        </p>
                      </div>
                      <div className="rounded-lg bg-slate-900 p-3">
                        <p className="text-[10px] text-slate-500">
                          CBT reward
                        </p>
                        <p className="mt-1 font-black text-emerald-300">
                          +{book.reward} points
                        </p>
                      </div>
                    </div>

                    <p className="mt-3 truncate text-xs text-slate-500">
                      <FileText
                        size={13}
                        className="mr-1 inline"
                      />
                      {book.fileName || "No book file"}
                    </p>

                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => openEditForm(book)}
                        className="inline-flex items-center justify-center gap-1 rounded-lg bg-slate-800 px-2 py-2.5 text-xs font-bold"
                      >
                        <Pencil size={13} />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => togglePublished(book)}
                        className="inline-flex items-center justify-center gap-1 rounded-lg bg-slate-800 px-2 py-2.5 text-xs font-bold"
                      >
                        {book.status === "PUBLISHED" ? (
                          <EyeOff size={13} />
                        ) : (
                          <Eye size={13} />
                        )}
                        {book.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteBook(book)}
                        className="inline-flex items-center justify-center gap-1 rounded-lg bg-red-400/10 px-2 py-2.5 text-xs font-bold text-red-300"
                      >
                        <Trash2 size={13} />
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>

        {/* Admin guidance */}
        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/50 p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-violet-400/10 p-3 text-violet-300">
              <ShieldIcon />
            </div>
            <div>
              <h3 className="font-bold">Purchase and reward rules</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                The backend should store the book, protect the digital file,
                verify payment, grant access to the purchaser, and credit the
                configured CBT Point reward exactly once. The browser should
                never be trusted to confirm payment or credit points directly.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/10";

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-200">
        {label}
        {required && <span className="ml-1 text-red-300">*</span>}
      </label>
      {children}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof BookOpen;
  label: string;
  value: string;
  color: "cyan" | "emerald" | "amber" | "violet";
}) {
  const colors = {
    cyan: "bg-cyan-400/10 text-cyan-300",
    emerald: "bg-emerald-400/10 text-emerald-300",
    amber: "bg-amber-400/10 text-amber-300",
    violet: "bg-violet-400/10 text-violet-300",
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-400">{label}</p>
        <div className={`rounded-xl p-2.5 ${colors[color]}`}>
          <Icon size={20} />
        </div>
      </div>
      <p className="mt-4 text-2xl font-black tracking-tight">{value}</p>
    </div>
  );
}

function StatusPill({ status }: { status: BookStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
        status === "PUBLISHED"
          ? "bg-emerald-400/10 text-emerald-300"
          : "bg-amber-400/10 text-amber-300"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === "PUBLISHED" ? "bg-emerald-300" : "bg-amber-300"
        }`}
      />
      {status}
    </span>
  );
}

function ActionButton({
  label,
  onClick,
  icon: Icon,
  danger = false,
}: {
  label: string;
  onClick: () => void;
  icon: typeof Pencil;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`rounded-lg p-2 transition ${
        danger
          ? "text-red-300 hover:bg-red-400/10"
          : "text-slate-400 hover:bg-slate-800 hover:text-cyan-300"
      }`}
    >
      <Icon size={16} />
    </button>
  );
}

function ShieldIcon() {
  return <Heart size={22} />;
}