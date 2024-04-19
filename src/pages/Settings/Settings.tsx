import { Nav, AccountInfo, NotificationSettings,DisplaySettings,ChangePassword } from "@components/index";
import  { useEffect, useState } from "react";
import { Link} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { isUserLoggedIn } from "@services/index";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("account");
  const navigate = useNavigate(); // Initialize useNavigate hook
  const renderSettingsContent = () => {
    switch (activeTab) {
      case "account":
        return <AccountInfo />;
      case "Notifications":
        return <NotificationSettings />;
      case "Display":
        return <DisplaySettings/>;
      case "ChangePassword":
        return<ChangePassword/>
      default:
        return null;
    }
  };

  useEffect(() => {
    // this is necessary for checking if the user is signed in
    const checkUser = async () => {
      // Check if user is already logged in
      const result = await isUserLoggedIn();
      if (!result) {
        navigate("/home"); // Redirect to home page if user is not logged in
      }
    }
    
    // Call the async function
    checkUser();
  }, [navigate]);

  return (
    <div className="w-full h-full flex justify-center align-middle">
      <div className="container flex w-full justify-center dark:bg-black">
        <div className="nav flex justify-end w-1/5 m-0 p-0 mr-[2vh] pr-10">
        <Nav />
      </div>
      <div className="main-content flex w-2/5 m-0 p-0 border dark:border-neutral-800">
        <div className="flex flex-col m-0 p-0">
          <div className="p-4 border-b border-gray-300 dark:border-neutral-800">
            <h2 className="text-gray-600 font-semibold">SETTINGS</h2>
          </div>
          <div className="mt-4">
            <div className="hover:bg-gray-100 p-2 rounded-md">
              <Link href="#" onClick={() => setActiveTab("account")}>
                <p className="font-semibold">Your account</p>
              </Link>
            </div>
            <div className="hover:bg-gray-100 p-2 rounded-md">
              <Link href="#" onClick={() => setActiveTab("ChangePassword")}>
                <p className="font-semibold">Change Password</p>
              </Link>
            </div>
            <div className="hover:bg-gray-100 p-2 rounded-md">
              <Link href="#" onClick={() => setActiveTab("Notifications")}>
                <p className="font-semibold">Notification settings</p>
              </Link>
            </div>
            <div className="hover:bg-gray-100 p-2 rounded-md">
              <Link
                href="#"
                onClick={() =>
                  setActiveTab("Display")
                }
              >
                <p className="font-semibold">
                Display
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="sidebar-right w-1/4 ml-7 mt-2 pl-1 pr-2">
        {renderSettingsContent()}
      </div>
    </div>
    </div>
  );
};

export default Settings;
