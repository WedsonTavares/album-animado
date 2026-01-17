import { Link } from "react-router-dom";
import GradientText from "../ui/GradientText";
import StarBorder from "../ui/StarBorder";

interface HeaderProps {
  showAuthButtons?: boolean;
}

export function Header({ showAuthButtons = true }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-xl">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
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
        {showAuthButtons && (
          <div className="flex items-center gap-4">
            <StarBorder as={Link} to="/login">
              Entrar
            </StarBorder>
            <Link 
              to="/register" 
              className="btn btn-primary"
            >
              Criar conta
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
