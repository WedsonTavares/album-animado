import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AppLayout } from "./components/Layout/AppLayout";

// Lazy load pages for better performance
const LandingPage = lazy(() =>
  import("./pages/LandingPage").then((m) => ({ default: m.LandingPage }))
);
const AuthPage = lazy(() =>
  import("./pages/AuthPage").then((m) => ({ default: m.AuthPage }))
);
const AlbumListPage = lazy(() =>
  import("./pages/AlbumListPage").then((m) => ({ default: m.AlbumListPage }))
);
const AlbumDetailPage = lazy(() =>
  import("./pages/AlbumDetailPage").then((m) => ({ default: m.AlbumDetailPage }))
);
const PublicAlbumPage = lazy(() =>
  import("./pages/PublicAlbumPage").then((m) => ({ default: m.PublicAlbumPage }))
);

// Loading fallback component
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-muted-foreground">Carregando...</span>
      </div>
    </div>
  );
}

const router = createBrowserRouter([
  // Landing page pública
  {
    path: "/",
    element: (
      <Suspense fallback={<PageLoader />}>
        <LandingPage />
      </Suspense>
    ),
  },
  // Rotas de autenticação
  {
    path: "/login",
    element: (
      <Suspense fallback={<PageLoader />}>
        <AuthPage mode="login" />
      </Suspense>
    ),
  },
  {
    path: "/register",
    element: (
      <Suspense fallback={<PageLoader />}>
        <AuthPage mode="register" />
      </Suspense>
    ),
  },
  // Álbum público compartilhado
  {
    path: "/public/album/:token",
    element: (
      <Suspense fallback={<PageLoader />}>
        <PublicAlbumPage />
      </Suspense>
    ),
  },
  // Rotas protegidas
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: "/albums",
            element: (
              <Suspense fallback={<PageLoader />}>
                <AlbumListPage />
              </Suspense>
            ),
          },
          {
            path: "/albums/:id",
            element: (
              <Suspense fallback={<PageLoader />}>
                <AlbumDetailPage />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
