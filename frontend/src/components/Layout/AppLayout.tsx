import { LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Footer } from "./Footer";
import ClickSpark from "../ui/ClickSpark";
import GradientText from "../ui/GradientText";

export function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getInitials = (name?: string | null, email?: string | null) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return email?.slice(0, 2).toUpperCase() || "U";
  };

  useEffect(() => {
    if (!isUserMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isUserMenuOpen]);

  return (
    <ClickSpark sparkColor="#8b5cf6" sparkCount={12} sparkRadius={20}>
      <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/albums" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Dr. TIS"
              className="h-14 w-14 rounded-xl"
            />
            <div className="hidden sm:block">
              <GradientText className="font-bold text-2xl">
                Dr. TIS
              </GradientText>
            </div>
          </Link>
          
          {user && (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setIsUserMenuOpen((open) => !open)}
                className="flex items-center gap-3 rounded-xl px-2 py-1.5 text-left hover:bg-card/80 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                  {getInitials(user.name, user.email)}
                </div>
                <span className="hidden sm:block text-sm text-foreground">
                  {user.name || user.email}
                </span>
              </button>
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-2xl border border-border/60 bg-card/95 backdrop-blur-xl shadow-lg shadow-black/10">
                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-sm text-destructive hover:bg-destructive/10 focus:outline-none focus:ring-2 focus:ring-destructive/30"
                  >
                    <LogOut size={16} />
                    <span>Sair</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 container mx-auto px-6 py-8">
        <Outlet />
      </main>
      
      <Footer />
    </div>
    </ClickSpark>
  );
}
