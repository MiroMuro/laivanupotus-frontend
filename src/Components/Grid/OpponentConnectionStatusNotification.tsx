import { useState, useEffect } from "react";
const OpponentConnectionStatusNotification = ({
  message,
}: {
  message: string;
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldShow, setShouldShow] = useState(true);
  console.log("THIS IS THE MESSAGE IN OPPONENT CONNECTIONSTAUS", message);
  useEffect(() => {
    const initialTimer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    return () => clearTimeout(initialTimer);
  }, []);

  useEffect(() => {
    if (!message) {
      setShouldShow(true);
      setIsVisible(true);
    }
  }, [message]);

  if (!shouldShow) return null;

  return (
    <div
      className={`opponent-connection-status-slider bg-battleship-blue-light ${
        isVisible ? "slide-in" : "slide-out"
      }`}
      onAnimationEnd={() => {
        if (!isVisible) {
          setShouldShow(false);
        }
      }}
    >
      {message
        ? `Connected ${message}`
        : `Disconnected. Reconnecting... ${message}`}
    </div>
  );
};

export default OpponentConnectionStatusNotification;
