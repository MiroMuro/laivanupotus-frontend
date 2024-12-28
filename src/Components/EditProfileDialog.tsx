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
      className="h-3/4 w-1/3 rounded-md border-4 border-gray-400 backdrop:backdrop-blur"
    >
      <h1 className="text-3xl">Hello world</h1>
      <button onClick={closeModal}>Close</button>
    </dialog>
  );
};

export default EditProfileDialog;
