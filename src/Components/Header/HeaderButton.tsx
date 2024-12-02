const HeaderButton = ({ title }: { title: string }) => {
  return (
    <div className="flex-1 flex flex-col  bg-battleship-blue-light justify-end  border-x-2  border-gray-400">
      <div className="w-full h-3/4 bg-battleship-blue rounded-xl p-1 relative">
        <p className="text-3xl text-white absolute -top-3 left-1/2 -translate-x-1/2">
          {title}
        </p>
      </div>
    </div>
  );
};

export default HeaderButton;
