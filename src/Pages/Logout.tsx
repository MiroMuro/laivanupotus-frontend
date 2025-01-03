import logoutpng from "../assets/logout.png";
import { useAuth } from "../Utils/Authprovider";
import { useNavigate } from "react-router";

const Logout = () => {
  const { logout } = useAuth();
  const { currentUserInformation } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <>
      <div className="w-1/4 py-8 h-2/3 flex flex-col justify-evenly items-center bg-battleship-blue-light border-gray-400 border-4 rounded-xl text-white">
        <>
          <div className="flex flex-col items-center">
            <img
              src={logoutpng}
              className="border-2 h-16 w-16 bg-white border-white rounded-xl text-center mx-2 object-cover"
              alt="https://www.flaticon.com/free-icons/logout Logout icons created by Pixel perfect"
              title="logout icons"
            />
            <h1 className="text-3xl">Logout</h1>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-2xl">
              Hello{" "}
              {`${
                !!currentUserInformation
                  ? currentUserInformation.userName
                  : "user."
              }`}
            </p>
            <p className="text-xl">
              Are you sure you want to logout from Battleships?
            </p>
          </div>
          <div className="flex flex-row justify-evenly w-full h-1/5 px-2">
            <div className="flex-1 flex flex-col h-full  bg-battleship-blue-light justify-end my-auto border-2 rounded-xl mx-2  border-gray-400  shadow-xl transition transformation ease-in-out 200ms active:scale-75 hover:scale-105">
              <button
                className="h-3/4 w-full bg-battleship-blue rounded-xl p-1 relative text-3xl"
                onClick={() => handleLogout()}
              >
                Yes
              </button>
            </div>
            <div className="flex-1 flex flex-col h-full  bg-battleship-blue-light justify-end my-auto border-2 rounded-xl mx-2  border-gray-400  shadow-xl transition transformation ease-in-out 200ms active:scale-75 hover:scale-105">
              <button
                className="h-3/4 w-full bg-battleship-blue rounded-xl p-1 relative text-3xl"
                onClick={() => navigate(-1)}
              >
                No
              </button>
            </div>
          </div>
        </>
      </div>
    </>
  );
};
export default Logout;
