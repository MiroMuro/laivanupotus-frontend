import { NavLink } from "react-router-dom";
import { HeaderButtonProps } from "../../Types/interfaces";
import { matchPath } from "react-router-dom";
import { useLocation } from "react-router-dom";
const HeaderButton = (props: HeaderButtonProps) => {
  const location = useLocation();
  const isUrlPathActive = !!matchPath(location.pathname, `/${props.to}`);

  return (
    <NavLink
      className={`flex-1 flex flex-col h-5/6  justify-end my-auto border-2 rounded-xl mx-2  border-gray-400  shadow-xl transition transformation ease-in-out duration-200
        ${
          isUrlPathActive
            ? "bg-battleship-blue-dark scale-105 border-white"
            : "bg-battleship-blue-light active:scale-75 hover:scale-105"
        }`}
      to={props.to}
    >
      <button
        type={props.type}
        className={`w-full h-3/4  rounded-xl p-1 relative
          ${
            isUrlPathActive ? "bg-battleship-blue-darker" : "bg-battleship-blue"
          }`}
      >
        <p
          className={`text-3xl  absolute -top-3 left-1/2 -translate-x-1/2
          ${isUrlPathActive ? "text-gray-200" : "text-white"}`}
        >
          {props.title}
        </p>
      </button>
    </NavLink>
  );
};

export default HeaderButton;
