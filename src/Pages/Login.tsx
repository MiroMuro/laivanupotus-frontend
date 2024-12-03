const Login = () => {
  return (
    <div className="w-full h-full flex justify-center items-center ">
      <form
        className="w-1/3 h-2/5 flex flex-col justify-evenly bg-battleship-blue-light border-4 border-black rounded-xl
    margin-x-auto text-white p-2"
      >
        <div className="flex h-1/3 w-full"> Username</div>
        <div className="flex h-1/3 w-full"> Password</div>
        <div className="flex h-1/3 w-full justify-center items-center">
          <div className="flex-1 flex flex-col  h-5/6 bg-battleship-blue-light justify-end my-auto border-2 cursor-pointer rounded-xl mx-2  border-gray-400  shadow-xl transition transformation ease-in-out 200ms active:scale-75 hover:scale-105">
            <div className="h-3/4 w-full bg-battleship-blue rounded-xl p-1 relative">
              <p className="text-3xl text-white absolute -top-3 left-1/2 -translate-x-1/2">
                Login
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
export default Login;
