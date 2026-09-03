import LoginHeader from "./LoginHeader";
import LoginForm from "./LoginForm";

const LoginCard = () => {
  return (
    <div className="w-full max-w-md space-y-6 rounded-xl border bg-white p-8 shadow-sm">
      <LoginHeader />

      <LoginForm />
    </div>
  );
};

export default LoginCard;