import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { CgMenuGridO } from "react-icons/cg";
// import { MdOutlineWbSunny } from "react-icons/md";
// import { MdNightlight } from "react-icons/md";
// import useDarkMode from "../../context/themeContext";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/authContext";
import { MdVerifiedUser } from "react-icons/md";
import {
  RiHistoryFill,
  RiHome2Line,
  RiTaskLine,
  RiLogoutCircleRLine,
} from "react-icons/ri";

const Navbar = () => {
  const navigate = useNavigate();
  // const { toggleTheme } = useDarkMode();
  const navRef = useRef();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { user } = useAuth();

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  const handleToggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsNavOpen(false);
      }
    };

    window.addEventListener("mousedown", handleOutsideClick);

    return () => {
      window.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [navRef]);

    console.log(user?.email);
  return (
    <div className=" top-0 bg-[#151618] px-4 p-[5vw] w-full flex items-center justify-between z-[100]">
      <Link to="/" className="left flex items-center justify-center gap-2">
        <img src="/48.webp" className="w-[6.5vw]" alt="" />
        <span className="uppercase text-[5vw] font-semibold">trackz</span>
      </Link>
      <div className="right flex items-center gap-[4vw] justify-self-center">
        {/* <div onClick={toggleTheme}>
          <MdOutlineWbSunny className="hidden text-[5.3vw] dark:flex cursor-pointer text-black dark:text-white" />
          <MdNightlight className="visible text-[5.3vw] dark:hidden cursor-pointer text-black dark:text-white" />
        </div> */}
        <CgMenuGridO
          onClick={() => handleToggleNav(true)}
          className="text-[6.5vw]"
        />
      </div>

      {/* ----------------side navbar content----------- */}
      <div
        className={`fixed z-[100000000] transition top-0 ${
          isNavOpen ? "right-0" : "right-[-100%]"
        }  w-[100vw] flex items-start justify-end `}
      >
        <div
          ref={navRef}
          className="w-[80vw] bg-[#1f2123] h-screen  p-5 border-l border-white/10"
        >
          {/* ----------profile---------- */}
          <div className="toppart flex items-center gap-[3vw] border-b border-gray-400 rounded-[1px] pb-[5vw]">
            <img
              src={
                user
                  ? user?.reloadUserInfo?.photoUrl
                  : "https://i.postimg.cc/FKVKrHwn/default.jpg"
              }
              className="w-[11.5vw] h-[11.5vw] rounded-full"
              alt=""
            />
            <div>
              <p className="text-[4.2vw] font-medium">
                {user ? user?.displayName : "Sandip Sarkar"}
              </p>
              <p className="text-[3vw] font-medium flex items-center justify-center gap-[1vw]">
                {user ? user.email : "sarkarsandip97740@gmail.com"}{" "}
                <span>
                  <MdVerifiedUser className="text-green-500 text-[3vw]" />
                </span>
              </p>
            </div>
          </div>
          {/* ----------profile---------- */}

          {/* ----------- nav links--------- */}
          <div className="mt-[5vw]">
            <ul className=" space-y-[2.1vw]">
              <Link
                onClick={() => handleToggleNav(false)}
                to={"/"}
                className="text-[]"
              >
                <li className=" flex items-center justify-start gap-[3.5vw] text-[4.2vw] hover:bg-[#2a2c2f] p-[3vw] px-[3.5vw] rounded-[3vw]">
                  <RiHome2Line className="text-[4.8vw]" />
                  Home
                </li>
              </Link>
              <Link onClick={() => handleToggleNav(false)} to={"/task"}>
                <li className=" flex items-center justify-start gap-[3.5vw] text-[4.2vw] hover:bg-[#2a2c2f] p-[3vw] px-[3.5vw] rounded-[3vw]">
                  <RiTaskLine className="text-[4.8vw]" />
                  Task
                </li>
              </Link>
              <Link onClick={() => handleToggleNav(false)} to={"/history"}>
                <li className=" flex items-center justify-start gap-[3.5vw] text-[4.2vw] hover:bg-[#2a2c2f] p-[3vw] px-[3.5vw] rounded-[3vw]">
                  <RiHistoryFill className="text-[4.8vw]" />
                  History
                </li>
              </Link>
              <Link
                onClick={() => {
                  handleLogout(), handleToggleNav(false);
                }}
              >
                <li className=" flex items-center justify-start gap-[3.5vw] text-[4.2vw] hover:bg-[#2a2c2f] p-[3vw] px-[3.5vw] rounded-[3vw]">
                  <RiLogoutCircleRLine className="text-[4.8vw]" />
                  Logout
                </li>
              </Link>
            </ul>
          </div>
          {/* ----------- nav links--------- */}
        </div>
      </div>
      {/* ----------------side navbar content----------- */}

      {/* ------------- style--------- */}
      <style>{`
        html {
          overflow-y: ${isNavOpen ? "hidden" : "visible"};
        }
      `}</style>
    </div>
  );
};

export default Navbar;
