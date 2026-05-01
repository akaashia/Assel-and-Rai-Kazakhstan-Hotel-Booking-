import { Route, Switch } from "wouter";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider } from "./lib/auth-context";
import { Header } from "./components/header";
import { HomePage } from "./components/pages/home-page";
import { RoomsPage } from "./components/pages/rooms-page";
import { FavoritesPage } from "./components/pages/favorites-page";
import { ProfilePage } from "./components/pages/profile-page";
import { ChatPage } from "./components/pages/chat-page";
import { LoginPage } from "./components/pages/login-page";
import { RegisterPage } from "./components/pages/register-page";
import { ForgotPasswordPage } from "./components/pages/forgot-password-page";

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Toaster position="top-right" richColors />

        <Switch>
          {/* Auth pages without header */}
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={RegisterPage} />
          <Route
            path="/forgot-password"
            component={ForgotPasswordPage}
          />

          {/* Main app with header */}
          <Route>
            <Header />
            <Switch>
              <Route path="/" component={HomePage} />
              <Route path="/rooms" component={RoomsPage} />
              <Route
                path="/favorites"
                component={FavoritesPage}
              />
              <Route path="/profile" component={ProfilePage} />
              <Route path="/chat" component={ChatPage} />

              {/* 404 */}
              <Route>
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-4xl mb-4">404</h1>
                    <p className="text-muted-foreground mb-6">
                      Бет табылмады
                    </p>
                    <a
                      href="/"
                      className="text-primary hover:underline"
                    >
                      Басты бетке оралу
                    </a>
                  </div>
                </div>
              </Route>
            </Switch>
          </Route>
        </Switch>
      </div>
    </AuthProvider>
  );
}