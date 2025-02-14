import { useState, useEffect } from "react";
import { useWebSocket } from "../../Utils/WebSocketProvider";
const ConnectionStatusNotification = () => {
  const context = useWebSocket();
  const { connected } = context;

  console.log("Connected in ConnectionStatusNotification", connected);
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
      {connected ? "Connected" : "Disconnected. Reconnecting..."}
    </div>
  );
};

export default ConnectionStatusNotification;
