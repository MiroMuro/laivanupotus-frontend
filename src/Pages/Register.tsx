import padlock from "../assets/padlock(2).png";
import user from "../assets/user.png";
import emailIcon from "../assets/mail.png";
import React, { useState } from "react";
import { useAuth } from "../Utils/Authprovider";
import { useNavigate } from "react-router";
import SubmitButton from "../Components/SubmitButton";
import FormInput from "../Components/FormInput";
const Register = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");

    if (!userName || !password || !email) {
      setError("Username, email or password cant be empty!");
      return;
    }
    setIsLoading(true);
    const result = await register(userName, email, password);
    setIsLoading(false);
    if (result.success) {
      navigate("/play");
    } else if (result.message) {
      setError(result.message);
    } else {
      setError(
        "An error occured while registering you in. Please try again later."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-1/4 h-4/5 flex flex-col justify-evenly bg-battleship-blue-light border-4 border-gray-400 rounded-xl
    margin-x-auto text-white p-2"
    >
      <header className="flex flex-col h-1/3 w-full justify-center items-center">
        <h2 className="text-center text-slate-400 italic text-xl">
          It's now or never
        </h2>
        <h1 className="text-center  text-inherit text-3xl">
          Register to play, captain!
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
        imgSrc={emailIcon}
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="text"
      />
      <FormInput
        imgSrc={padlock}
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
      />

      <div className="flex h-1/4 w-full justify-center items-center">
        <SubmitButton title="Register" type="submit" loading={isLoading} />
      </div>
    </form>
  );
};
export default Register;
