import { useState, useEffect } from "react";

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");

  // Fetch notifications for the current user (owner)
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_URI}/api/notifications`
        ); // Adjust the endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }
        const data = await response.json();
        setNotifications(data.notifications);
      } catch (err) {
        setError("Failed to load notifications. Please try again.");
      }
    };

    fetchNotifications();
  }, []);

  // Function to handle accept request
  const handleAccept = async (notificationId, ideaId, requesterId) => {
    try {
      // Send accept request to the backend
      const response = await fetch(
        `${process.env.REACT_APP_URI}/api/notifications/accept/${notificationId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ideaId, requesterId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to accept collaboration");
      }

      // Update UI after accepting
      setNotifications((prev) =>
        prev.filter((notification) => notification._id !== notificationId)
      );
    } catch (err) {
      console.error("Error accepting collaboration:", err);
      setError("Failed to accept collaboration. Please try again.");
    }
  };

  // Function to handle reject request
  const handleReject = async (notificationId) => {
    try {
      // Send reject request to the backend
      const response = await fetch(
        `${process.env.REACT_APP_URI}/api/notifications/reject/${notificationId}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to reject collaboration");
      }

      // Update UI after rejecting
      setNotifications((prev) =>
        prev.filter((notification) => notification._id !== notificationId)
      );
    } catch (err) {
      console.error("Error rejecting collaboration:", err);
      setError("Failed to reject collaboration. Please try again.");
    }
  };

  return (
    <div>
      <h1>Notifications</h1>
      {error && <p className="error">{error}</p>}
      <ul>
        {notifications.map((notification) => (
          <li key={notification._id}>
            <p>{`Collaboration request from ${notification.requesterId} for idea: ${notification.ideaId}`}</p>
            <button
              onClick={() =>
                handleAccept(
                  notification._id,
                  notification.ideaId,
                  notification.requesterId
                )
              }
            >
              Accept
            </button>
            <button onClick={() => handleReject(notification._id)}>
              Reject
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NotificationsPage;
