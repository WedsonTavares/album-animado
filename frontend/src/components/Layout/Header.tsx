import { Link } from "react-router-dom";
import GradientText from "../ui/GradientText";
import StarBorder from "../ui/StarBorder";

interface HeaderProps {
  showAuthButtons?: boolean;
}

export function Header({ showAuthButtons = true }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 sm:gap-3">
          <img
            src="/logo.png"
            alt="Dr. TIS"
            className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-xl"
          />
          <div className="hidden sm:block">
            <GradientText className="font-bold text-xl sm:text-2xl">
              Dr. TIS
            </GradientText>
          </div>
        </Link>
        {showAuthButtons && (
          <div className="flex items-center gap-2 sm:gap-4">
            <StarBorder as={Link} to="/login" className="text-sm sm:text-base">
              Entrar
            </StarBorder>
            <Link 
              to="/register" 
              className="btn btn-primary text-sm sm:text-base px-3 sm:px-4"
            >
              <span className="hidden sm:inline">Criar conta</span>
              <span className="sm:hidden">Criar</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
