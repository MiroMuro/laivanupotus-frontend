import { useAuth } from "../Utils/Authprovider";
import { useState } from "react";
import user from "../assets/user.png";
import mail from "../assets/mail.png";
import calendar from "../assets/calendar.png";
import chart from "../assets/chart.png";
import EditProfileDialog from "../Components/EditProfileDialog";
const Profile = () => {
  const { currentUserInformation } = useAuth();
  if (!currentUserInformation) {
    return <div>Loading...</div>;
  }

  const getAccountAgeInDays = () => {
    let currentDate = new Date();
    let accountCreationDate = new Date(currentUserInformation!.createdAt);
    let differenceInAccountCreation =
      currentDate.getTime() - accountCreationDate.getTime();
    return Math.floor(differenceInAccountCreation / 1000 / 60 / 60 / 24);
  };

  const getWinRate = () => {
    let winRate = (gamesWon! / totalGames!) * 100;
    if (isNaN(winRate)) {
      return "--%";
    }
    return `${winRate.toFixed(2)}%`;
  };

  let accountAgeInDays = getAccountAgeInDays();
  let gamesWon = currentUserInformation?.gamesWon;
  let gamesLost = currentUserInformation?.gamesLost;
  let totalGames = currentUserInformation?.totalGames;
  let winRate = getWinRate();
  const [modal, setModal] = useState(false);

  return (
    <div className="h-3/4 w-1/4 border-4 border-gray-400 bg-battleship-blue-light text-white rounded-xl flex flex-col justify-start items-center">
      <h1 className="text-4xl border-b-4 border-gray-400 text-center w-full py-4">
        Your profile
      </h1>
      <div className="flex flex-1 w-full max-h-20  flex-row justify-between items-center px-6">
        <img
          src={user}
          className="border-2 h-12 w-12 bg-white border-white rounded-xl text-center mx-2 object-cover"
          alt="https://www.flaticon.com/free-icons/logout Logout icons created by Pixel perfect"
          title="logout icons"
        />
        <div className="border-2 rounded-md border-gray-300 w-full p-2">
          <p className="text-xl">{currentUserInformation?.userName}</p>
        </div>

        <div className="flex-initial h-12 w-16 flex flex-col   bg-battleship-blue-light justify-end  border-2 rounded-xl ml-2  border-gray-400  shadow-xl transition transformation ease-in-out 200ms active:scale-75 hover:scale-105">
          <button
            className="h-2/3 bg-battleship-blue rounded-xl p-1 relative"
            onClick={() => setModal(true)}
          >
            Edit
          </button>
        </div>
      </div>
      <div className="flex flex-1 w-full max-h-20  flex-row justify-between items-center px-6">
        <img
          src={mail}
          className="border-2 h-12 w-12 bg-white border-white rounded-xl text-center mx-2 object-cover"
          alt="https://www.flaticon.com/free-icons/logout Logout icons created by Pixel perfect"
          title="logout icons"
        />
        <div className="border-2 rounded-md border-gray-300 w-full p-2">
          <p className="text-xl">{currentUserInformation?.email}</p>
        </div>

        <div className="flex-initial h-12 w-16 flex flex-col   bg-battleship-blue-light justify-end  border-2 rounded-xl ml-2  border-gray-400  shadow-xl transition transformation ease-in-out 200ms active:scale-75 hover:scale-105">
          <button
            className="h-2/3 bg-battleship-blue rounded-xl p-1 relative"
            onClick={() => setModal(true)}
          >
            Edit
          </button>
        </div>
      </div>
      <div className="flex flex-1 w-full max-h-20  flex-row justify-between items-center px-6">
        <img
          src={calendar}
          className="border-2 h-12 w-12 bg-white border-white rounded-xl text-center mx-2 object-cover"
          alt="https://www.flaticon.com/free-icons/logout Logout icons created by Pixel perfect"
          title="logout icons"
        />
        <div className="border-2 rounded-md border-gray-300 w-full p-2">
          <p className="text-xl">
            Your account is: {accountAgeInDays} days old{" "}
          </p>
        </div>
      </div>
      <div className="flex flex-1 w-full max-h-20  flex-row justify-between items-center px-6">
        <img
          src={chart}
          className="border-2 h-12 w-12 bg-white border-white rounded-xl text-center mx-2 object-cover"
          alt="https://www.flaticon.com/free-icons/logout Logout icons created by Pixel perfect"
          title="logout icons"
        />
        <table className="border-2 border-separate rounded-md border-gray-300 w-full p-2">
          <thead className="first:rounded-t-md last:rounded-b-md">
            <tr>
              <th>Games played</th>
              <th>Games lost</th>
              <th>Games won</th>
              <th>Winrate</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-center">{totalGames}</td>
              <td className="text-center">{gamesLost}</td>
              <td className="text-center">{gamesWon}</td>
              <td className="text-center">{winRate}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex flex-1 w-full max-h-20  flex-row justify-between items-center px-6">
        {/*<img
          src={padlock}
          className="border-2 h-12 w-12 bg-white border-white rounded-xl text-center mx-2 object-cover"
          alt="https://www.flaticon.com/free-icons/logout Logout icons created by Pixel perfect"
          title="logout icons"
        />
        <div className="flex flex-row justify-evenly w-full h-full py-2">
          <div className="flex-1 flex flex-col h-full  bg-battleship-blue-light justify-end my-auto border-2 rounded-xl   border-gray-400  shadow-xl transition transformation ease-in-out 200ms active:scale-75 hover:scale-105">
            <button
              className="h-3/4 w-full bg-battleship-blue rounded-xl p-1 relative text-3xl"
              onClick={() => setModal(true)}
            >
              Change password
            </button>
          </div>
        </div>*/}
      </div>
      {modal && (
        <EditProfileDialog
          openModal={modal}
          closeModal={() => setModal(false)}
        />
      )}
    </div>
  );
};
export default Profile;
