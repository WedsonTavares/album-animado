import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, Location, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Footer } from "../components/Layout/Footer";
import { Input } from "../components/ui/Input";
import Stepper, { Step } from "../components/ui/Stepper";
import GradientText from "../components/ui/GradientText";
import { useAuth } from "../context/AuthContext";
import { login, register as registerUser } from "../services/auth";
import { GoogleLoginButton } from "@/components/GoogleLoginButton";
import ClickSpark from "../components/ui/ClickSpark";

const schema = z.object({
  name: z.string().min(2, "Informe seu nome").optional(),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Mínimo de 6 caracteres"),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  mode: "login" | "register";
}

export function AuthPage({ mode }: Props) {
  const isLogin = mode === "login";
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  const [stepperName, setStepperName] = useState("");
  const [stepperEmail, setStepperEmail] = useState("");
  const [stepperPassword, setStepperPassword] = useState("");
  const [stepperError, setStepperError] = useState<string | null>(null);

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const redirect = (location.state as { from?: Location })?.from?.pathname;
      navigate(redirect || "/albums", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, location.state]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      if (isLogin) {
        return login(data.email, data.password);
      } else {
        return registerUser(data.email, data.password, data.name);
      }
    },
    onSuccess: () => {
      // O AuthContext vai detectar a mudança de sessão automaticamente
      const redirect = (location.state as { from?: Location })?.from?.pathname;
      navigate(redirect || "/albums");
    },
    onError: (error: unknown) => {
      const err = error as { message?: string };
      const message = err.message || (isLogin ? "Não foi possível fazer login. Tente novamente." : "Não foi possível criar a conta. Tente novamente.");
      setStepperError(message);
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    mutation.mutate(values);
  };

  const handleStepperComplete = () => {
    if (stepperName.length < 2) {
      setStepperError("Informe seu nome (mínimo 2 caracteres)");
      return;
    }
    if (!stepperEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(stepperEmail)) {
      setStepperError("Informe um e-mail válido");
      return;
    }
    if (stepperPassword.length < 6) {
      setStepperError("A senha deve ter no mínimo 6 caracteres");
      return;
    }

    setStepperError(null);
    mutation.mutate({
      name: stepperName,
      email: stepperEmail,
      password: stepperPassword,
    });
  };

  const heading = isLogin ? "Bem-vindo de volta" : "Crie sua conta";
  const subheading = isLogin
    ? "Acesse seus álbuns e continue organizando seus momentos favoritos."
    : "Centralize e compartilhe suas fotos com quem importa.";

  return (
    <ClickSpark sparkColor="#8b5cf6" sparkCount={12} sparkRadius={20}>
      <div className="min-h-screen flex flex-col bg-background">
      {/* Back to Home Link */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={18} />
        <span>Voltar ao início</span>
      </Link>

      {/* Main Content - Centered */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="card glass">
            {/* Header */}
            <div className="text-center mb-8">
              <Link to="/" className="inline-flex flex-col items-center gap-3 mb-4">
                <img
                  src="/logo.png"
                  alt="Dr. TIS"
                  className="h-16 w-16 rounded-xl"
                />
                <GradientText className="text-2xl font-bold">
                  Dr. TIS
                </GradientText>
              </Link>
              <h1 className="text-2xl font-bold text-foreground mb-2">{heading}</h1>
              <p className="text-muted-foreground">{subheading}</p>
            </div>

            {/* Form Content */}
            <div className="space-y-6">
              {isLogin ? (
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                  <Input
                    label="E-mail"
                    type="email"
                    placeholder="seu@email.com"
                    required
                    {...register("email")}
                    error={errors.email?.message}
                  />
                  <Input
                    label="Senha"
                    type="password"
                    placeholder="Digite sua senha"
                    required
                    {...register("password")}
                    error={errors.password?.message}
                  />

                  {stepperError && (
                    <p className="text-destructive text-sm text-center">
                      {stepperError}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? "Entrando..." : "Entrar na conta"}
                  </button>
                </form>
              ) : (
                <>
                  <Stepper
                    initialStep={1}
                    onFinalStepCompleted={handleStepperComplete}
                    backButtonText="Voltar"
                    nextButtonText="Continuar"
                    disableStepIndicators={false}
                  >
                    <Step>
                      <div className="py-4">
                        <h3 className="text-lg font-semibold text-foreground mb-1">Como podemos te chamar?</h3>
                        <p className="text-muted-foreground text-sm mb-4">Esse nome aparecerá nos seus álbuns compartilhados.</p>
                        <Input
                          label="Nome completo"
                          placeholder="Digite seu nome"
                          value={stepperName}
                          onChange={(e) => setStepperName(e.target.value)}
                          autoFocus
                        />
                      </div>
                    </Step>
                    <Step>
                      <div className="py-4">
                        <h3 className="text-lg font-semibold text-foreground mb-1">Qual seu e-mail?</h3>
                        <p className="text-muted-foreground text-sm mb-4">Usaremos para login e recuperação de senha.</p>
                        <Input
                          label="E-mail"
                          type="email"
                          placeholder="seu@email.com"
                          value={stepperEmail}
                          onChange={(e) => setStepperEmail(e.target.value)}
                          autoFocus
                        />
                      </div>
                    </Step>
                    <Step>
                      <div className="py-4">
                        <h3 className="text-lg font-semibold text-foreground mb-1">Crie uma senha segura</h3>
                        <p className="text-muted-foreground text-sm mb-4">Mínimo de 6 caracteres para proteger sua conta.</p>
                        <Input
                          label="Senha"
                          type="password"
                          placeholder="Digite sua senha"
                          value={stepperPassword}
                          onChange={(e) => setStepperPassword(e.target.value)}
                          autoFocus
                        />
                      </div>
                    </Step>
                  </Stepper>

                  {(stepperError || mutation.error) && (
                    <p className="text-destructive text-sm text-center">
                      {stepperError || (mutation.error as Error)?.message || "Erro ao criar conta."}
                    </p>
                  )}

                  {mutation.isPending && (
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span>Criando sua conta...</span>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-card text-muted-foreground">ou continue com</span>
              </div>
            </div>

            {/* Social Login */}
            <GoogleLoginButton />

            {/* Switch Mode */}
            <div className="text-center mt-6 text-sm">
              <span className="text-muted-foreground">
                {isLogin ? "Ainda não tem conta? " : "Já tem uma conta? "}
              </span>
              <Link 
                to={isLogin ? "/register" : "/login"} 
                className="text-primary hover:text-primary-hover font-medium transition-colors"
              >
                {isLogin ? "Criar conta grátis" : "Fazer login"}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Always at bottom */}
      <Footer />
    </div>
    </ClickSpark>
  );
}
