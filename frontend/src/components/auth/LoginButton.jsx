const LoginButton = ({ loading }) => {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full rounded-md px-4 py-2 font-medium text-white disabled:opacity-50"
    >
      {loading ? "Signing in..." : "Sign In"}
    </button>
  );
};

export default LoginButton;