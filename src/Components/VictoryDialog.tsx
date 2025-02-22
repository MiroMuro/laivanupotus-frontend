import { useRef, useEffect } from "react";
import { EditProfileDialogProps } from "../Types/interfaces";
import { useNavigate } from "react-router-dom";

const VictoryDialog = ({ openModal, closeModal }: EditProfileDialogProps) => {
  const ref = useRef<HTMLDialogElement>(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (openModal) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [openModal]);
  const closeDialogAndNavigateHome = () => {
    closeModal();
    navigate("/");
  };
  return (
    <>
      {openModal && (
        <dialog
          ref={ref}
          onCancel={closeModal}
          className="slide-down h-1/2 w-1/3 rounded-md border-4 text-white flex flex-col justify-start items-center bg-battleship-blue-light border-gray-400 backdrop:backdrop-blur"
        >
          <h1 className="text-4xl">You won!</h1>
          <div className="flex flex-1 flex-row w-full h-full text-xl justify-around items-center px-6">
            <button
              onClick={() => console.log("clicked play again")}
              className={`bg-battleship-blue-light flex flex-col justify-end border-2 border-gray-400 rounded-xl h-1/4 w-1/4 
        
          transition transform hover:scale-105 active:scale-75`}
            >
              <div
                className={`w-full rounded-xl  h-3/4  bg-battleship-blue p-1 relative cursor-pointer
        `}
              >
                <p className="text-2xl text-white absolute -top-3 left-1/2 -translate-x-1/2">
                  Play again!
                </p>
              </div>
            </button>
            <button
              onClick={() => closeDialogAndNavigateHome()}
              className={`bg-battleship-blue-light flex flex-col justify-end border-2 border-gray-400 rounded-xl h-1/4 w-1/4 
        
          transition transform hover:scale-105 active:scale-75`}
            >
              <div
                className={`w-full rounded-xl  h-3/4  bg-battleship-blue p-1 relative cursor-pointer
        `}
              >
                <p className="text-2xl text-white absolute -top-3 left-1/2 -translate-x-1/2">
                  Home
                </p>
              </div>
            </button>
          </div>
        </dialog>
      )}
    </>
  );
};
export default VictoryDialog;
