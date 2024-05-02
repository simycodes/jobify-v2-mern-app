import StyledAsideWrapper from "../assets/wrappers/BigSidebar";
import NavLinks from "./NavLinks";
import Logo from "./Logo";
import { useDashboardContext } from "../pages/DashboardLayout";

const BigSidebar = () => {
  const { showSidebar, toggleSidebar } = useDashboardContext();

  return (
    <StyledAsideWrapper>
      <div
        className={
          showSidebar? "sidebar-container" : "sidebar-container show-sidebar"
        }
      >
        <div className="content">
          <header>
            <Logo />
          </header>
          
          <NavLinks isBigSidebar/>
          {/* <NavLinks isBigSidebar={true}/> -- same as above code for boolean props */}
          {/* presence of props being true and absence means its false (prop is not passed) */}
        </div>
      </div>
    </StyledAsideWrapper>
  );
};
export default BigSidebar;
