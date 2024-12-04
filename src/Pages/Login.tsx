import padlock from "../assets/padlock(2).png";
import user from "../assets/user.png";
import SubmitButton from "../Components/SubmitButton";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../Utils/Authprovider";
import FormInput from "../Components/FormInput";
const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    console.log("IN THE HANDLE SUBMIT");
    if (!userName || !password) {
      setError("Username or password cant be empty!");
      return;
    }
    setIsLoading(true);
    const result = await login(userName, password);
    setIsLoading(false);
    if (result.success) {
      navigate("/play");
    } else if (result.message) {
      setError(result.message);
    } else {
      setError(
        "An error occured while logging you in. Please try again later."
      );
    }

    console.log("The result", result);
    console.log("THe error", error);
  };

  return (
    <div className="w-full h-full flex justify-center items-center ">
      <form
        className="w-1/4 h-2/3 flex flex-col justify-evenly bg-battleship-blue-light border-4 border-gray-400 rounded-xl
    margin-x-auto text-white p-2"
        onSubmit={handleSubmit}
      >
        <header className="flex flex-col h-1/3 w-full justify-center items-center">
          <h2 className="text-center text-slate-400 italic text-xl">
            It's now or never
          </h2>
          <h1 className="text-center  text-inherit text-3xl">
            Login to play, captain!
          </h1>
          <div>{error}</div>
        </header>

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
    </div>
  );
};
export default Login;
