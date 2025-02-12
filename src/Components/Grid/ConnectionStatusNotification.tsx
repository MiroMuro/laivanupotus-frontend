import { useState, useEffect } from "react";
const ConnectionStatusNotification = ({
  connected,
}: {
  connected: boolean;
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldShow, setShouldShow] = useState(true);

  useEffect(() => {
    const initialTimer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    return () => clearTimeout(initialTimer);
  }, []);

  useEffect(() => {
    if (!connected) {
      setShouldShow(true);
      setIsVisible(true);
    }
  }, [connected]);

  if (!shouldShow) return null;

  return (
    <div
      className={`connection-status-slider bg-battleship-blue-light ${
        isVisible ? "slide-in" : "slide-out"
      }`}
      onAnimationEnd={() => {
        if (!isVisible) {
          setShouldShow(false);
        }
      }}
    >
      {connected ? "Connected" : "Disconnected"}
    </div>
  );
};

export default ConnectionStatusNotification;
