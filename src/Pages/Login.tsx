import padlock from "../assets/padlock(2).png";
import user from "../assets/user.png";
import HeaderButton from "../Components/Header/HeaderButton";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../Utils/Authprovider";
import FormInput from "../Components/FormInput";
const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");

    if (!userName || !password) {
      setError("Username or password cant be empty!");
      return;
    }

    const result = await login(userName, password);

    if (result.success) {
      navigate("/play");
    } else if (result.message) {
      setError(result.message);
    } else {
      setError(
        "An error occured while logging you in. Please try again later."
      );
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center ">
      <form
        className="w-1/4 h-3/5 flex flex-col justify-evenly bg-battleship-blue-light border-4 border-gray-400 rounded-xl
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
          <HeaderButton title="Login" type="submit" />
        </div>
      </form>
    </div>
  );
};
export default Login;
