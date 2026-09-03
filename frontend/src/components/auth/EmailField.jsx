const EmailField = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <label
        htmlFor="email"
        className="text-sm font-medium"
      >
        Email
      </label>

      <input
        id="email"
        type="email"
        placeholder="Enter your email"
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

export default EmailField;