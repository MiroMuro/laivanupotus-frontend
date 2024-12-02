const HeaderBar = () => {
  return (
    <header
      className="bg-battleship-blue h-24 shadow-2xl
  flex flex-row"
    >
      <div className="flex-[2] flex bg-battleship-blue justify-center items-center">
        <a href="https://cooltext.com">
          <img
            src="https://images.cooltext.com/5716699.png"
            width="513"
            height="111"
            alt="BATTLESHIPS"
            title="Cool Text: Logo and Button Generator. Create Your Own Logo: https://cooltext.com "
          />
        </a>
      </div>
      <div className="flex-1 flex bg-battleship-blue justify-center items-center">
        <p className="text-2xl text-white">Play</p>
      </div>
      <div className="flex-1 flex bg-battleship-blue justify-center items-center">
        <p className="text-2xl text-white">Leaderboards</p>
      </div>
      <div className="flex-1 flex bg-battleship-blue justify-center items-center">
        <p className="text-2xl text-white">Login</p>
      </div>
      <div className="flex-1 flex bg-battleship-blue justify-center items-center">
        <p className="text-2xl text-white">Register</p>
      </div>
    </header>
  );
};

export default HeaderBar;
