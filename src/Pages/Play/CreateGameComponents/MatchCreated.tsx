const MatchCreated = () => {
  return (
    <div className="text-xl flex p-2">
      Game created. Waiting for an opponent to join
      <div className="loading-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>{" "}
    </div>
  );
};

export default MatchCreated;
