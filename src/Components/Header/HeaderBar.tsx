import HeaderButton from "./HeaderButton";
const HeaderBar = () => {
  return (
    <header
      className="bg-battleship-blue h-28 shadow-2xl
  flex flex-row "
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
      <HeaderButton title="Play" type="button" to="play" />
      <HeaderButton title="Leaderboards" type="button" to="leaderboards" />
      <HeaderButton title="Login" type="button" to="login" />
      <HeaderButton title="Register" type="button" to="register" />
    </header>
  );
};

export default HeaderBar;
