const BackgroundImage = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-battleships h-full w-full bg-cover">{children}</div>
  );
};

export default BackgroundImage;
