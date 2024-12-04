import padlock from "../assets/padlock(2).png";
import user from "../assets/user.png";
import email from "../assets/mail.png";
const Register = () => {
  return (
    <div className="w-full h-full flex justify-center items-center ">
      <form
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
        <div className="flex flex-row items-center h-1/4 w-full">
          {" "}
          <img
            src={user}
            className="border-2 h-8 w-8 bg-white border-white rounded-xl text-center mx-2 object-cover"
          />
          <input
            placeholder="Username"
            type="text"
            className="bg-none outline-none p-5 rounded-xl text-black h-1/2 w-4/5"
          />{" "}
        </div>
        <div className="flex flex-row items-center h-1/4 w-full">
          {" "}
          <img
            src={email}
            className="border-2 h-8 w-8 bg-white border-white rounded-xl text-center mx-2 object-cover"
          />
          <input
            placeholder="Email"
            type="text"
            className="bg-none outline-none p-5 rounded-xl text-black h-1/2 w-4/5"
          />{" "}
        </div>
        <div className="flex flex-row items-center h-1/4 w-full">
          {" "}
          <img
            src={padlock}
            className="border-2 h-8 w-8 bg-white border-white rounded-xl text-center mx-2 object-cover"
          />
          <input
            placeholder="Password"
            type="password"
            className="bg-none outline-none p-5 rounded-xl text-black h-1/2 w-4/5"
          />{" "}
        </div>
        <div className="flex h-1/4 w-full justify-center items-center">
          <div className="flex-1 flex flex-col  h-5/6 bg-battleship-blue-light justify-end my-auto border-2 cursor-pointer rounded-xl mx-2  border-gray-400  shadow-xl transition transformation ease-in-out 200ms active:scale-75 hover:scale-105">
            <div className="h-3/4 w-full bg-battleship-blue rounded-xl p-1 relative">
              <p className="text-3xl text-white absolute -top-3 left-1/2 -translate-x-1/2">
                Register
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
export default Register;
