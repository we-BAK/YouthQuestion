const PasswordField = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <label
        htmlFor="password"
        className="text-sm font-medium"
      >
        Password
      </label>

      <input
        id="password"
        type="password"
        placeholder="Enter your password"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        required
        className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2"
      />
    </div>
  );
};

export default PasswordField;