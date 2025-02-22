import { useRef, useEffect } from "react";
import { EditProfileDialogProps } from "../Types/interfaces";
import { useNavigate } from "react-router-dom";
const DefeatDialog = ({ openModal, closeModal }: EditProfileDialogProps) => {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (openModal) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [openModal]);
  const navigate = useNavigate();
  return (
    <>
      {openModal && (
        <dialog
          ref={ref}
          onCancel={closeModal}
          className="h-1/2 w-1/3 rounded-md border-4 text-white flex flex-col justify-start items-center bg-battleship-blue-light border-gray-400 backdrop:backdrop-blur"
        >
          <h1 className="text-4xl">You lost!</h1>
          <div className="flex flex-1 flex-row w-full h-full text-xl justify-around items-center px-6">
            <div
              className={`bg-battleship-blue-light flex flex-col justify-end border-2 border-gray-400 rounded-xl h-1/4 w-1/4 
        
          transition transform hover:scale-105 active:scale-75`}
            >
              <button
                className={`w-full rounded-xl  h-3/4  bg-battleship-blue p-1 relative cursor-pointer
        `}
                onClick={() => console.log("clicked play again")}
              >
                <p className="text-2xl text-white absolute -top-3 left-1/2 -translate-x-1/2">
                  Play again!
                </p>
              </button>
            </div>
            <div
              className={`bg-battleship-blue-light flex flex-col justify-end border-2 border-gray-400 rounded-xl h-1/4 w-1/4 
        
          transition transform hover:scale-105 active:scale-75`}
            >
              <button
                className={`w-full rounded-xl  h-3/4  bg-battleship-blue p-1 relative cursor-pointer
        `}
                onClick={() => navigate("/")}
              >
                <p className="text-2xl text-white absolute -top-3 left-1/2 -translate-x-1/2">
                  Home
                </p>
              </button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
};
export default DefeatDialog;
