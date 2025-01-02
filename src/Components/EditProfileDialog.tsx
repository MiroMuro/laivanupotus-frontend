import { useEffect, useRef, useState } from "react";
import { EditProfileDialogProps } from "../Types/interfaces";
const EditProfileDialog = ({
  openModal,
  closeModal,
}: EditProfileDialogProps) => {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (openModal) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [openModal]);

  return (
    <dialog
      ref={ref}
      onCancel={closeModal}
      className="h-3/4 w-1/3 rounded-md border-4 text-white flex flex-col justify-start items-center bg-battleship-blue-light border-gray-400 backdrop:backdrop-blur"
    >
      <h1 className="text-4xl border-b-4 border-gray-400 text-center w-full py-4">
        Edit profile information
      </h1>
      <div className="flex flex-1 w-full max-h-20  flex-row justify-between items-center px-6"></div>
      <div className="flex flex-1 w-full max-h-20  flex-row justify-between items-center px-6"></div>
      <div className="flex flex-1 w-full max-h-20  flex-row justify-between items-center px-6"></div>
      <div className="flex flex-1 w-full max-h-20  flex-row justify-between items-center px-6">
        <button onClick={closeModal}>Cancel</button>
        <button onClick={closeModal}>Submit</button>
      </div>
    </dialog>
  );
};

export default EditProfileDialog;
