function PrimaryButton({ children, onClick, type = "button", disabled = false }) {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}

export default PrimaryButton;
