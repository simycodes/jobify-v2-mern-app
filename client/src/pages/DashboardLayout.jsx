import { Outlet, redirect, useLoaderData, useNavigate } from "react-router-dom";
import StyledSectionWrapper from "../assets/wrappers/Dashboard";
import { BigSidebar, Navbar, SmallSidebar } from "../components";
import { createContext, useContext, useState } from "react";
import { checkDefaultTheme } from "../App";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

const DashBoardContext = createContext();

// This function is initialized to the loader property in the app router and is run before
// this page/component is loaded/open. Fetches data before it's even loaded
export const DashboardLayoutLoader = async() => {
  try {
    const { data } = await customFetch.get("/users/current-user");
    return data;
  } catch (error) {
    return redirect("/");
  }
};

const DashboardLayout = () => {
  const { user } = useLoaderData();
  const navigate = useNavigate();

  const [showSidebar, setShowSidebar] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(checkDefaultTheme());

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const toggleDarkTheme = () => {
    const newDarkTheme = !isDarkTheme;
    setIsDarkTheme(newDarkTheme);
    document.body.classList.toggle("dark-theme", newDarkTheme);
    localStorage.setItem("darkTheme", newDarkTheme);
  };

  const logoutUser = async () => {
    navigate("/");
    await customFetch.get("/auth/logout");
    toast.success("Logout Successful");
  };

  return (
    <DashBoardContext.Provider
      value={{
        user,
        showSidebar,
        isDarkTheme,
        toggleDarkTheme,
        toggleSidebar,
        logoutUser,
      }}
    >
      <StyledSectionWrapper>
        <main className="dashboard">
          {/* SmallSidebar displays on small screen and BigSidebar on large screens */}
          <SmallSidebar />
          <BigSidebar />

          {/* second column on large screen */}
          <div>
            <Navbar />
            <div className="dashboard-page">
              <Outlet context={ {user} }/>
            </div>
          </div>
        </main>
      </StyledSectionWrapper>
    </DashBoardContext.Provider>
  );
};

export const useDashboardContext = () => useContext(DashBoardContext);
export default DashboardLayout;
