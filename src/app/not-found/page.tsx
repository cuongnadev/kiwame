import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f0f0f] text-white px-6">
      <h1 className="text-8xl font-extrabold tracking-widest text-red-500 drop-shadow-lg">
        404
      </h1>

      <h2 className="mt-4 text-2xl font-semibold">
        Page Not Found
      </h2>

      <p className="mt-3 text-base text-gray-400 text-center max-w-md">
        Sorry, the page you are looking for doesn’t exist, might have been moved,
        or the channel is unavailable.
      </p>

      <div className="mt-8 flex items-center gap-4">
        <Link
          href="/"
          className="px-6 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 transition font-medium"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
