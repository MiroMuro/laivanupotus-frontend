import { FormHeaderProps } from "../Types/interfaces";
//status is not undefined. It is either "error", "success" or "nada".
const FormHeader = ({ message, status }: FormHeaderProps) => {
  const messageStyles = {
    nada: "",
    error:
      "animate-error-message-fade  text-center text-white border-2 border-gray-400 rounded-md bg-red-600",
    success:
      "animate-success-message-fade  text-center text-white border-2 border-gray-400 rounded-md bg-green-600",
  };

  return (
    <header className="flex flex-col h-1/3 w-full justify-center items-center">
      <h2 className="text-center text-slate-400 italic text-xl">
        It's now or never
      </h2>
      <h1 className="text-center  text-inherit text-3xl">
        Register to play, captain!
      </h1>
      {message && (
        <h1 className={`my-2 p-2 min-h-11 ${messageStyles[status!]}`}>
          {message}
        </h1>
      )}
    </header>
  );
};
export default FormHeader;
