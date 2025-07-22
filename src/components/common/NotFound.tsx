import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Page Not Found</p>
      <Link href="/" className="btn btn-primary">
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;