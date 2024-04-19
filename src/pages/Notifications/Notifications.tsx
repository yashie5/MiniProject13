import { Nav } from "@components/index";
import React, { useEffect, useState } from "react";
import {
  TrendingTopics,
  WhoToFollow,
  Search,
  PostNotification,
  LikeNotification,
  Mention,
} from "@components/index";
import { Button } from "@nextui-org/react";
import { FiSettings } from "react-icons/fi";
import {
  mockNotifications,
  mockLikedNotifications,
  mockMentions,
} from "mockData/mockData";
import { useNavigate } from "react-router-dom";
import { isUserLoggedIn } from "@services/index";
import { followNotification } from "@services/index";
//import { getCurrentUser } from "@services/auth/auth";
import { notificationEmitter } from "@services/index";

interface NotificationsProps {}
const Notifications: React.FC<NotificationsProps> = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [postnotifications] = useState<any[]>(mockNotifications);
  const [likedNotfications] = useState<any[]>(mockLikedNotifications);
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [mentions] = useState<any[]>(mockMentions);
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const getTimeDisplay = (timestamp: string) => {
    const currentTime = new Date();
    const parsedTimestamp = new Date(timestamp);

    const timeDiff = currentTime.getTime() - parsedTimestamp.getTime(); // Get time difference in milliseconds
    const minutesDiff = Math.floor(timeDiff / 60000); // Convert milliseconds to minutes

    let timeDisplay;
    if (minutesDiff < 60) {
      timeDisplay = `${minutesDiff}m`;
    } else {
      const hoursDiff = Math.floor(minutesDiff / 60); // Convert minutes to hours
      if (hoursDiff < 24) timeDisplay = `${hoursDiff}h`;
      else {
        const month = parsedTimestamp.toLocaleString("en-us", {
          month: "short",
        });
        const day = parsedTimestamp.getDate();
        timeDisplay = `${month} ${day}`;
      }
    }

    return timeDisplay;
  };

  useEffect(() => {
    // this is necessary for checking if the user is signed in
    const checkUser = async () => {
      // Check if user is already logged in
      const result = await isUserLoggedIn();
      if (!result) {
        navigate("/home"); // Redirect to home page if user is not logged in
      }
      // Call the async function
      checkUser();
    }

  }, [navigate]);
  const testNotifications = () => {//u can put this evenlistenr inside a useeffect to  make sure its not called multple times, only
    //after unitial render
    // Call the followNotification function to start listening for notifications for user_id = 13
    followNotification(13);
  
    // Listen for the 'new-notification' event and handle it
    notificationEmitter.on('new-notification', (notification) => {
      console.log('Received new notification:', notification);
    });
  };
  testNotifications();
  
  return (
    <div className="w-full h-full flex justify-center align-middle">
      <div className="container flex w-full justify-center dark:bg-black">
        <div className="nav flex justify-end w-1/5 m-0 p-0 mr-[2vh] pr-10">
          <Nav />
        </div>
        <div className="main-content w-2/5 m-0 p-0 border dark:border-neutral-800">
          <div className="flex flex-col w-full m-0 p-0 justify-center">
            {/* Notification Header */}
            <div className="flex justify-between items-center p-2 dark:text-white">
              <h1 className="text-2xl font-bold">Notifications</h1>
              <Button >
                <FiSettings size={18} />
              </Button>
            </div>
            {/* Notifications Tabs */}
            <div className="flex w-full justify-around border-b border-gray-200 dark:border-neutral-800 items-center">
              <div className="w-full">
                <div className="flex ">
                  <button
                    className={`w-1/3 py-4 text-base font-semibold hover:bg-gray-200 ${
                      activeTab === "all" ? "text-blue-500" : "text-gray-500"
                    }`}
                    onClick={() => handleTabClick("all")}
                  >
                    All
                  </button>
                  <button
                    className={`w-1/3 py-4 text-base font-semibold hover:bg-gray-200 ${
                      activeTab === "verified" ? "text-blue-500" : "text-gray-500"
                    }`}
                    onClick={() => handleTabClick("verified")}
                  >
                    Verified
                  </button>
                  <button
                    className={`w-1/3 py-4 text-base font-semibold hover:bg-gray-200 ${
                      activeTab === "mentions" ? "text-blue-500" : "text-gray-500"
                    }`}
                    onClick={() => handleTabClick("mentions")}
                  >
                    Mentions
                  </button>
                </div>
                <div>
                  {activeTab === "all" && (
                    <div>
                      {postnotifications.length === 0 ? (
                        <p className="text-center text-gray-500">
                          You have no notifications
                        </p>
                      ) : (
                        postnotifications.map((notification, index) => (
                          <PostNotification
                            key={index}
                            id={index}
                            description={notification.message}
                            avatarUrl={notification.avatarUrl}
                          />
                        ))
                      )}
                      {" "}
                      {likedNotfications.map((notification, index) => (
                        <LikeNotification
                          key={index}
                          id={index}
                          description={notification.message}
                          tweet={notification.tweet}
                          avatarUrl={notification.avatarUrl}
                        />
                      ))}{" "}
                      {" "}
                      {mentions.map((mention, index) => (
                        <Mention
                          key={index}
                          id={index}
                          name={mention.Name}
                          username={mention.Username}
                          text={mention.Content}
                          imageUrl={mention.avatarUrl}
                          replyToUsername={mention.MentionedUser}
                          saves={1000}
                          comments={100}
                          retweets={100}
                          likes={100}
                          timeDisplay={getTimeDisplay(mention.Created_at)}
                        />
                      ))}
                    </div>
                  )}
                  {activeTab === "verified" && (
                    <div>
                      {likedNotfications.length === 0 ? (
                        <p className="text-center text-gray-500">
                          You have no notifications
                        </p>
                      ) : (
                        likedNotfications.map((notification, index) => (
                          <LikeNotification
                            key={index}
                            id={index}
                            description={notification.message}
                            tweet={notification.tweet}
                            avatarUrl={notification.avatarUrl}
                          />
                        ))
                      )}
                    </div>
                  )}
                  {activeTab === "mentions" && (
                    <div>
                      {mentions.length === 0 ? (
                        <p className="text-center text-gray-500">
                          You have no mentions
                        </p>
                      ) : (
                        mentions.map((mention, index) => (
                          <Mention
                            key={index}
                            id={index}
                            name={mention.Name}
                            username={mention.Username}
                            text={mention.Content}
                            imageUrl={mention.avatarUrl}
                            replyToUsername={mention.MentionedUser}
                            saves={1000}
                            comments={100}
                            retweets={100}
                            likes={100}
                            timeDisplay={getTimeDisplay(mention.Created_at)}
                          />
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="sidebar-right w-1/4 ml-7 mt-2 pl-1 pr-2">
          <div className="mb-3">
            <Search />
          </div>
          <TrendingTopics />
          <WhoToFollow users={[]} />
        </div>
      </div>
    </div>
    
  );
};

export default Notifications;
