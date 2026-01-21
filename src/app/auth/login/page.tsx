import { LoginFormView } from "./LoginFormView";
import { handleLogin } from "./actions";

export default function Login() {
  return (
    <div className="bg-(--background)">
      <LoginFormView action={handleLogin} />;
    </div>
  );
}
