import { Poppins } from "next/font/google";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Navbar from "@/components/pages/navbar/navbar";
import Image from "next/image";
import bg from "../public/bg.jpg";
import Link from "next/link";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col p-4 pt-4">
      <Image
        src={bg}
        alt="Background"
        layout="fill"
        objectFit="cover"
        className="fixed inset-0 -z-10"
        style={{ backgroundRepeat: "repeat" }}
      />
      <Navbar />
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-8 text-center space-y-6">
        <h1
          className={cn(
            "text-6xl font-semibold text-white drop-shadow-md",
            font.className
          )}
        >
          Welcome to the Online Judge
        </h1>
        <p className="text-white text-lg">
          Test your coding skills against challenging problems.
        </p>
        <div className="space-y-4">
          <Button variant="default" size="lg" asChild>
            <Link href="/problems">Get Started</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
