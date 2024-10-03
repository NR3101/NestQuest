import Link from "next/link";
import { Home } from "lucide-react";
import { GiBarracksTent } from "react-icons/gi";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center max-h-screen bg-background text-foreground p-4 pt-16">
      <div className="text-center space-y-4 max-w-md w-full">
        <div className="flex justify-center">
          <GiBarracksTent className="w-24 h-24 text-destructive" />
        </div>
        <h1 className="text-5xl font-bold text-destructive">404</h1>
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="text-base text-muted-foreground">
          Oops! The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors"
        >
          <Home className="w-4 h-4 mr-2" />
          Return Home
        </Link>
      </div>
    </div>
  );
}
