import padlock from "../assets/padlock(2).png";
import user from "../assets/user.png";
import emailIcon from "../assets/mail.png";
import React, { useState } from "react";
import { useAuth } from "../Utils/Authprovider";
import { useNavigate } from "react-router";
import SubmitButton from "../Components/SubmitButton";
import FormInput from "../Components/FormInput";
import FormHeader from "../Components/FormHeader";
import { FormHeaderProps } from "../Types/interfaces";

const Register = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"error" | "success" | "nada">("nada");
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setMessage("");

    if (!userName || !password || !email) {
      setStatus("error");
      setMessage("Username, email or password cant be empty!");
      return;
    }
    setIsLoading(true);
    const result = await register(userName, email, password);
    console.log("The result", result);
    setIsLoading(false);
    if (result.success) {
      handleSuccessfulRegistration();
    } else if (!result.success && result.message) {
      handleError(result.message);
    } else {
      handleError(
        "An error occured while registering you in. Please try again later."
      );
    }
  };

  const handleSuccessfulRegistration = () => {
    let timeLeft = 5;
    setStatus("success");
    const timer = setInterval(() => {
      if (timeLeft === 0) {
        clearInterval(timer);
        navigate("/login");
      } else {
        setMessage(
          `Registration successful! Redirecting to login in ${timeLeft} seconds...`
        );
        timeLeft--;
      }
    }, 1000);
  };

  const handleError = (message: string) => {
    setStatus("error");
    setMessage(message);
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="w-1/4 h-4/5 flex flex-col justify-evenly bg-battleship-blue-light border-4 border-gray-400 rounded-xl
    margin-x-auto text-white p-2"
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
