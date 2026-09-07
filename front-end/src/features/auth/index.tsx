import LoginPage from "./ui/LoginPage";
import RegisterPage from "./ui/RegisterPage";

type AuthPageProps = {
  mode: "login" | "signup";
};

export function AuthPage({ mode }: AuthPageProps) {
  if (mode === "signup") return <RegisterPage />;
  return <LoginPage />;
}

export { LoginPage, RegisterPage };
