import { useState, useEffect } from "react";
import { ConnectionEvent } from "../../Types/interfaces";
const OpponentConnectionStatusNotification = ({
  data,
}: {
  data: ConnectionEvent | undefined;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);
  const [messageToShow, setMessageToShow] = useState("");
  //Data tulee tietokannasta.

  useEffect(() => {
    if (data) {
      setIsVisible(true);
      setShouldShow(true);
      setMessageToShow(data.message);

      const timer = setTimeout(() => {
        setIsVisible(false);
        setShouldShow(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [data, setIsVisible]);

  if (!shouldShow) return null;
  //const { status, playerUserName, playerId, message } = data;

  return (
    <div
      className={`opponent-connection-status-slider flex min-h-10 min-w-52 bg-battleship-blue-light ${
        isVisible ? `slide-in` : `slide-out`
      }`}
      onAnimationEnd={() => {
        if (!isVisible) {
          setShouldShow(false);
        }
      }}
    >
      {messageToShow}
    </div>
  );
};

export default OpponentConnectionStatusNotification;
