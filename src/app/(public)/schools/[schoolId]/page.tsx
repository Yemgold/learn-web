


interface SchoolPageProps {
  params: Promise<{
    schoolId: string;
  }>;
}

export default async function SchoolPage({
  params,
}: SchoolPageProps) {
  const { schoolId } = await params;

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold">School</h1>

      <p className="mt-4 text-muted-foreground">
        School ID: {schoolId}
      </p>
    </main>
  );
}