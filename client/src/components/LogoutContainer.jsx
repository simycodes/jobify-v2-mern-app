import { FaUserCircle, FaCaretDown } from "react-icons/fa";
import StyledDivWrapper from "../assets/wrappers/LogoutContainer";
import { useState } from "react";
import { useDashboardContext } from "../pages/DashboardLayout";

const LogoutContainer = () => {
  const [showLogout, setShowLogout] = useState(false);
  const { user, logoutUser } = useDashboardContext();

  return (
    <StyledDivWrapper>
      <button
        type="button"
        className="btn logout-btn"
        onClick={()=> setShowLogout(!showLogout)}
        // onMouseEnter={() => setShowLogout(true)}
        // onMouseLeave={() => setTimeout(() => setShowLogout(false), 3000)}
      >
        {user.avatar ? (
          <img src={user.avatar} alt="avatar" className="img" />
        ) : (
          <FaUserCircle />
        )}
        {user?.name}
        <FaCaretDown />
      </button>

      <div className={showLogout ? "dropdown show-dropdown" : "dropdown"}>
        <button type="button" className="dropdown-btn" onClick={logoutUser}>
          logout
        </button>
      </div>
    </StyledDivWrapper>
  );
};
export default LogoutContainer;
