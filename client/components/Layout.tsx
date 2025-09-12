import { Link, NavLink } from "react-router-dom";
import { Activity, Map as MapIcon, NotebookPen } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-sky-50/60 text-foreground">
      <header className="sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-500 to-sky-500 grid place-items-center text-white">
              <Activity className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <div className="font-extrabold tracking-tight">Smart Community Health</div>
              <div className="text-xs text-muted-foreground">Monitoring & Early Warning</div>
            </div>
          </Link>
          <nav className="flex items-center gap-2">
            <Nav to="/" label="Dashboard" />
            <Nav to="/reports" label="Symptom Reports" icon={<NotebookPen className="h-4 w-4" />} />
            <Nav to="/map" label="Map View" icon={<MapIcon className="h-4 w-4" />} />
          </nav>
        </div>
      </header>
      <main className="container py-6 sm:py-8">{children}</main>
      <footer className="border-t mt-10">
        <div className="container py-6 text-xs text-muted-foreground flex items-center justify-between">
          <span>© {new Date().getFullYear()} Smart Community Health</span>
          <span>Built for resilience • Water & Health</span>
        </div>
      </footer>
    </div>
  );
}

function Nav({ to, label, icon }: { to: string; label: string; icon?: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        cn(
          "px-3 py-2 rounded-md text-sm font-medium inline-flex items-center gap-2 transition-colors",
          isActive
            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
        )
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}
