interface InfoLabelProps {
  infoMessage: string;
  shouldShowInfoMessage: boolean;
}

const InfoLabel = (props: InfoLabelProps) => {
  const { infoMessage, shouldShowInfoMessage } = props;
  return (
    <label className="absolute top-3 text-xl">
      {shouldShowInfoMessage ? <p>{infoMessage} </p> : ""}
    </label>
  );
};

export default InfoLabel;
