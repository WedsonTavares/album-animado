import { Link } from "react-router-dom";
import { ArrowRight, Image, Share2, Shield, Zap } from "lucide-react";
import { Footer } from "../components/Layout/Footer";
import { Header } from "../components/Layout/Header";
import BounceCards from "../components/ui/BounceCards";
import ClickSpark from "../components/ui/ClickSpark";

export function LandingPage() {
  const cardImages = [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=400&fit=crop"
  ];

  const transformStyles = [
    "rotate(5deg) translate(-150px)",
    "rotate(0deg) translate(-70px)",
    "rotate(-5deg)",
    "rotate(5deg) translate(70px)",
    "rotate(-5deg) translate(150px)"
  ];

  return (
    <ClickSpark sparkColor="#8b5cf6" sparkCount={12} sparkRadius={20}>
      <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Hero Content */}
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6 max-w-4xl mx-auto leading-tight">
            Seus álbuns de fotos,{" "}
            <span className="gradient-text">simples e elegantes.</span>
          </h1>
          
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-10 px-4">
            Crie álbuns, faça upload de fotos e compartilhe momentos especiais 
            com quem você ama. Tudo em um só lugar, com total controle.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link to="/login" className="btn btn-primary text-sm sm:text-base px-6 sm:px-8 py-2.5 sm:py-3 w-full sm:w-auto">
              Começar agora <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* Hero Visual - BounceCards */}
        <div className="flex justify-center items-center -mt-4 mb-6 sm:mb-10 overflow-hidden px-4">
          <div className="w-full flex justify-center">
            <div className="scale-[0.6] sm:scale-75 md:scale-90 lg:scale-100">
              <BounceCards
                images={cardImages}
                containerWidth={600}
                containerHeight={300}
              animationDelay={0.5}
              animationStagger={0.08}
              easeType="elastic.out(1, 0.8)"
              transformStyles={transformStyles}
              enableHover={true}
            />
          </div>
        </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-card/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4 px-4">
              Tudo que você precisa para organizar suas fotos
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto px-4">
              Recursos pensados para facilitar sua vida e proteger suas memórias.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="card hover:border-primary/50 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Image size={24} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Upload Inteligente</h3>
              <p className="text-sm text-muted-foreground">
                Envie várias fotos de uma vez. Detectamos automaticamente cores 
                predominantes e metadados EXIF.
              </p>
            </div>

            <div className="card hover:border-primary/50 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Share2 size={24} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Compartilhamento Fácil</h3>
              <p className="text-sm text-muted-foreground">
                Gere links curtos para compartilhar álbuns com amigos e família. 
                Controle total de quem pode ver.
              </p>
            </div>

            <div className="card hover:border-primary/50 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Shield size={24} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Seguro e Privado</h3>
              <p className="text-sm text-muted-foreground">
                Suas fotos são suas. Upload protegido e armazenamento seguro 
                com backup automático.
              </p>
            </div>

            <div className="card hover:border-primary/50 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Zap size={24} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Rápido e Leve</h3>
              <p className="text-sm text-muted-foreground">
                Interface otimizada para carregar rápido. Visualize suas fotos 
                em alta qualidade sem espera.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 sm:py-12 md:py-16 border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 md:gap-16">
          <div className="text-center">
            <strong className="block text-2xl sm:text-3xl font-bold gradient-text">3 min</strong>
            <span className="text-muted-foreground text-xs sm:text-sm">para criar um álbum</span>
          </div>
          <div className="hidden sm:block w-px h-10 sm:h-12 bg-border" />
          <div className="text-center">
            <strong className="block text-2xl sm:text-3xl font-bold gradient-text">100%</strong>
            <span className="text-muted-foreground text-xs sm:text-sm">controle dos dados</span>
          </div>
          <div className="hidden sm:block w-px h-10 sm:h-12 bg-border" />
          <div className="text-center">
            <strong className="block text-2xl sm:text-3xl font-bold gradient-text">∞</strong>
            <span className="text-muted-foreground text-xs sm:text-sm">memórias guardadas</span>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Pronto para começar?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Crie sua conta gratuitamente e comece a organizar suas memórias hoje.
          </p>
          <Link to="/login" className="btn btn-primary text-base px-8 py-3">
            Criar minha conta <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
    </ClickSpark>
  );
}
