function TextInput({ name, type = "text", value, onChange, placeholder, required = false }) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-300 transition"
    />
  );
}

export default TextInput;
