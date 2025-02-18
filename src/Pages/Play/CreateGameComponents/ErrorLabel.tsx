const ErrorLabel = ({ errorMessage }: { errorMessage: string }) => {
  return (
    <label
      className={`absolute -top-16 text-center bg-red-500 border-4 rounded-md border-gray-400 w-full h-14 text-base transition-opacity ease-in duration-700 ${
        errorMessage ? "opacity-100" : "opacity-0"
      }`}
    >
      {errorMessage}
    </label>
  );
};

export default ErrorLabel;
