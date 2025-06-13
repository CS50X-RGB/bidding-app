import { Button } from "@heroui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col md:flex-row">
      {/* Left side: Hero */}
      <section className="flex flex-col justify-center p-10 md:w-1/2 bg-[#000000] text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome to BidShow
        </h1>
        <p className="text-lg text-[#c4c4c5] mb-6 max-w-lg">
          BidShow is your powerful bidding platform to create, manage, and win bids transparently. Connect sellers and bidders in real-time.
        </p>
        <div className="rounded-xl overflow-hidden border border-[#3F3F46]">
          {/* <img
            src="https://cdn.pixabay.com/photo/2014/04/03/10/01/gavel-309599_1280.png"
            alt="Bidding platform preview"
            className="w-full h-auto"
          /> */}
        </div>
      </section>

      {/* Right side: Atlas-style CTA card */}
      <section className="flex flex-col justify-center items-center md:w-1/2 p-10 bg-[#000000]">
        <div className="w-full max-w-sm p-8 bg-[#18181B] rounded-2xl shadow-xl border border-[#3F3F46]">
          <h2 className="text-2xl font-semibold mb-4 text-center text-white">
            Get Started
          </h2>
          <p className="text-center text-[#c4c4c5] mb-8">
            Log in to your account and start bidding today.
          </p>
          <Link href="/login">
            <Button className="w-full rounded-lg bg-[#0266DA] text-white">
              Login
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
