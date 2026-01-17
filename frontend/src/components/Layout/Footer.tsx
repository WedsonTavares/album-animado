import GradientText from "../ui/GradientText";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="py-6 border-t border-border bg-background">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Dr. TIS"
            className="h-10 w-10 rounded-lg"
          />
          <span className="text-muted-foreground text-sm hidden sm:inline">
            Seus momentos, organizados com carinho.
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Feito por</span>
          <GradientText className="font-semibold">
            Wedson Tavares
          </GradientText>
          <span>© {year}</span>
        </div>
      </div>
    </footer>
  );
}
