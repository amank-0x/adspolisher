import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#eceae4] text-[#141413] px-6 py-16 max-w-md mx-auto">
      <div className="border border-dashed border-neutral-400 rounded-xl p-8 bg-white/50 backdrop-blur-xs text-center">
        <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">Route: /signup</span>
        <h1 className="text-2xl font-bold mt-2">Sign Up — Blank Page</h1>
        <p className="text-sm text-neutral-600 mt-2">
          Create customer account interface.
        </p>

        <div className="mt-6">
          <Link
            href="/auth?mode=signup"
            className="inline-block w-full py-2.5 px-4 bg-black text-white text-xs font-bold rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Go to /auth?mode=signup
          </Link>
        </div>
      </div>
    </div>
  );
}
