const BackgroundImage = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-battleships h-full w-full bg-cover flex flex-col">
      {children}
    </div>
  );
};

export default BackgroundImage;
