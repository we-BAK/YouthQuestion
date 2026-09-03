import { useState } from "react";

import EmailField from "./EmailField";
import PasswordField from "./PasswordField";
import LoginButton from "./LoginButton";

import { loginUser } from "../../services/authService";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await loginUser(email, password);

      console.log("Login successful");

      // We'll redirect to Dashboard later.
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <EmailField
        value={email}
        onChange={setEmail}
      />

      <PasswordField
        value={password}
        onChange={setPassword}
      />

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}

      <LoginButton loading={loading} />
    </form>
  );
};

export default LoginForm;