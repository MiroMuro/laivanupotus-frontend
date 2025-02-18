interface CreateGameButtonProps {
  handleCreateGame: () => Promise<void>;
  creatingGameLoading: boolean;
}
const CreateGameButton = (props: CreateGameButtonProps) => {
  const { handleCreateGame, creatingGameLoading } = props;
  return (
    <div className=" flex flex-col h-1/2 w-2/5 bg-battleship-blue-light justify-end my-auto border-2 rounded-xl mx-2  border-gray-400  shadow-xl transition transformation ease-in-out 200ms active:scale-75 hover:scale-105">
      <button
        className="h-3/4 w-full bg-battleship-blue rounded-xl p-1 relative text-xl"
        onClick={() => handleCreateGame()}
      >
        <h1>
          {creatingGameLoading ? (
            <div text-xl className="loading-dots">
              Creating game
              <span></span>
              <span></span>
              <span></span>
            </div>
          ) : (
            <>Create a game</>
          )}
        </h1>
      </button>
    </div>
  );
};

export default CreateGameButton;
