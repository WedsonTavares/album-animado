import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AlbumListPage } from "./pages/AlbumListPage";
import { AlbumDetailPage } from "./pages/AlbumDetailPage";
import { PublicAlbumPage } from "./pages/PublicAlbumPage";
import { AuthPage } from "./pages/AuthPage";
import { LandingPage } from "./pages/LandingPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AppLayout } from "./components/Layout/AppLayout";

const router = createBrowserRouter([
  // Landing page pública
  { path: "/", element: <LandingPage /> },
  // Rotas de autenticação
  { path: "/login", element: <AuthPage mode="login" /> },
  { path: "/register", element: <AuthPage mode="register" /> },
  // Álbum público compartilhado
  { path: "/public/album/:token", element: <PublicAlbumPage /> },
  // Rotas protegidas
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/albums", element: <AlbumListPage /> },
          { path: "/albums/:id", element: <AlbumDetailPage /> },
        ],
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
