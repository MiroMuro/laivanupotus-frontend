const CancelGameCreationButton = ({
  cancelMatchCreation,
}: {
  cancelMatchCreation: () => void;
}) => {
  return (
    <button
      className={`h-10 w-14 rounded-md absolute bg-red-600 top-0 right-0 m-2 border-gray-400 border-2 text-base`}
      onClick={() => {
        cancelMatchCreation();
      }}
    >
      Cancel
    </button>
  );
};

export default CancelGameCreationButton;
