

interface SchoolPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function SchoolPage({
  params,
}: SchoolPageProps) {
  const { slug } = await params;

  const schoolName = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-6">
      <div className="text-center space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-blue-400">
          Learnyfi School Portal
        </p>

        <h1 className="text-4xl font-bold">
          {schoolName}
        </h1>

        <p className="text-slate-400">
          Welcome to your school portal.
        </p>
      </div>
    </main>
  );
}
