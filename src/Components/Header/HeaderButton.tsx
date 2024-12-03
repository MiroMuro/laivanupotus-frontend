import { NavLink } from "react-router-dom";
const HeaderButton = ({ title }: { title: string }) => {
  return (
    <NavLink
      className="flex-1 flex flex-col h-5/6 bg-battleship-blue-light justify-end my-auto border-2 rounded-xl mx-2  border-gray-400  shadow-xl transition transformation ease-in-out 200ms active:scale-75"
      to={title.toLocaleLowerCase()}
    >
      <div className="w-full h-3/4 bg-battleship-blue rounded-xl p-1 relative">
        <p className="text-3xl text-white absolute -top-3 left-1/2 -translate-x-1/2">
          {title}
        </p>
      </div>
    </NavLink>
  );
};

export default HeaderButton;
