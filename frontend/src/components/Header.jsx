import { gymUsLogo } from "../assets/index.js";
import { loggedInNavigation, navigation } from "../constans/index.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "./Button.jsx";
import MenuSvg from "../assets/svg/MenuSvg.jsx";
import { HamburgerMenu } from "./design/Header.jsx";
import { useState } from "react";
import {
  disablePageScroll,
  enablePageScroll,
} from "scroll-lock/dist/scroll-lock.js";
import { isLoggedIn, logout } from "../Utils/Auth.jsx";

const Header = () => {
  const pathName = useLocation();
  const navigate = useNavigate();
  const [openNavigation, setOpenNavigation] = useState(false);
  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false);
      enablePageScroll();
    } else {
      setOpenNavigation(true);
      disablePageScroll();
    }
  };
  const handleClick = () => {
    if (!openNavigation) return;
    enablePageScroll();
    setOpenNavigation(false);
  };

  const menuItems = isLoggedIn() ? loggedInNavigation : navigation;
  return (
    <div
      className={`fixed top-0 left-0 z-50 w-full border-b
        border-n-6 lg:bg-n-8/90 lg-backdrop-blur-sm
        ${openNavigation ? "bg-n-8 " : "bg-n-8/90 backdrop-blur-sm"}`}
    >
      <div className={"flex items-center px-5 lg:px-7.5 xl:px-10 max-lg:py-4"}>
        <a className="block w-[12rem] xl:mr-8" href={"/"}>
          <img src={gymUsLogo} width={190} height={40} alt={"GymUs"} />
        </a>
        <nav
          className={`${openNavigation ? "flex" : "hidden"} fixed top-[5rem] left-0 right-0 bottom-0 
            bg-n-8 lg:static lg:flex lg:mx-auto lg:bg-transparent`}
        >
          <div
            className={
              "relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row"
            }
          >
            {menuItems.map((item) => (
              <a
                key={item.id}
                href={item.url}
                onClick={() => {
                  handleClick();
                  if (item.title === "LogOut") {
                    logout();
                  } else if (item.title === "My account") {
                    navigate("/account");
                  }
                }}
                className={`block relative font-code text-2xl uppercase
                text-n-1 transition-colors hover:text-color-1 
                ${item.onlyMobile ? "lg:hidden" : ""} 
                px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-xs lg:font-semibold
                ${item.url === pathName.hash ? "z-2 lg:text-n1" : "lg:text-n-1/50"} lg:leading-5
                lg:hover:text-n-1 xl:px-12`}
              >
                {item.title}
              </a>
            ))}
          </div>
          <HamburgerMenu />
        </nav>
        {isLoggedIn() ? (
          <>
            <a
              className="button hidden mr-8 text-n-1/50 transition-colors hover:text-n-1 lg:block"
              onClick={() => {
                logout();
                window.location.href = "/";
              }}
            >
              Log Out
            </a>
            <Button className="hidden lg:flex" href="/account">
              My account
            </Button>
          </>
        ) : (
          <>
            <a
              href="/signup"
              className="button hidden mr-8 text-n-1/50 transition-colors hover:text-n-1 lg:block"
            >
              New Account
            </a>
            <Button className="hidden lg:flex" href="/login">
              Sign in
            </Button>
          </>
        )}

        <Button
          className={"ml-auto lg:hidden"}
          px={"px-3"}
          onClick={toggleNavigation}
        >
          <MenuSvg openNavigation={openNavigation}></MenuSvg>
        </Button>
      </div>
    </div>
  );
};
export default Header;
