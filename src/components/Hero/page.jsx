import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";

const Hero = () => {
  const { user } = useAuth();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const formattedTime = currentDateTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const formattedDate = currentDateTime.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return (
    <div className="bg-[#1f2123] p-[4vw] px-[4.2vw] w-full rounded-[3vw] flex ">
      <div className="left flex-1 overflow-hidden flex justify-end flex-col">
        <span className="font-medium text-[4vw]"> Hello👋,</span>
        <p className="text-[5.3vw] font-semibold h-[9vw] overflow-hidden">
          {" "}
          {user ? user?.displayName : "Sandip Sarkar jnks jcscbcjhscj"}
        </p>
      </div>
      <div className="right flex-1 flex justify-end flex-col">
        <p className=" text-end text-[5.5vw] font-semibold">{formattedTime}</p>
        {/* <br /> */}
        <p className=" text-end font-medium text-[4vw]">{formattedDate}</p>
      </div>
    </div>
  );
};

export default Hero;
