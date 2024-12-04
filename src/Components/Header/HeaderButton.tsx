import { NavLink } from "react-router-dom";
import { HeaderButtonProps } from "../../Types/interfaces";
const HeaderButton = (props: HeaderButtonProps) => {
  return (
    <NavLink
      className="flex-1 flex flex-col h-5/6 bg-battleship-blue-light justify-end my-auto border-2 rounded-xl mx-2  border-gray-400  shadow-xl transition transformation ease-in-out 200ms active:scale-75 hover:scale-105"
      to={props.to}
    >
      <button
        type={props.type}
        className="w-full h-3/4 bg-battleship-blue rounded-xl p-1 relative"
      >
        <p className="text-3xl text-white absolute -top-3 left-1/2 -translate-x-1/2">
          {props.title}
        </p>
      </button>
    </NavLink>
  );
};

export default HeaderButton;
