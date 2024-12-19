import padlock from "../assets/padlock(2).png";
import user from "../assets/user.png";
import SubmitButton from "../Components/SubmitButton";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../Utils/Authprovider";
import FormInput from "../Components/FormInput";
import FormHeader from "../Components/FormHeader";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"error" | "success" | "nada">("nada");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setMessage("");
    if (!userName || !password) {
      handleError("Username or password cant be empty!");
      return;
    }
    setIsLoading(true);
    const result = await login(userName, password);
    setIsLoading(false);
    if (result.success) {
      handleSuccessfulLogin();
    } else if (!result.success && result.message) {
      handleError(result.message);
    } else {
      handleError(
        "An error occured while logging you in. Please try again later."
      );
    }
  };

  const handleError = (message: string) => {
    setStatus("error");
    setMessage(message);
  };

  const handleSuccessfulLogin = () => {
    setStatus("success");
    setMessage("Login successful! Redirecting to play page...");
    navigate("/play");
  };

  return (
    <form
      className="w-1/4 h-2/3 flex flex-col justify-evenly bg-battleship-blue-light border-4 border-gray-400 rounded-xl
    margin-x-auto text-white p-2"
      onSubmit={handleSubmit}
    >
      <FormHeader message={message} status={status} />

      <FormInput
        imgSrc={user}
        placeholder="Username"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        type="text"
      />
      <FormInput
        imgSrc={padlock}
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
      />

      <div className="flex h-1/3 w-full justify-center items-center">
        <SubmitButton title="Login" type="submit" loading={isLoading} />
      </div>
    </form>
  );
};
export default Login;
