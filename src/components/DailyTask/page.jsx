// import React from "react";
import { useRef, useState } from "react";
import { RiTaskLine } from "react-icons/ri";
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { FiPlus } from "react-icons/fi";

const tabs = [
  {
    id: "1",
    author: "John Doe",
  },
  {
    id: "2",
    author: "Jane Smith",
  },
  {
    id: "3",
    author: "Michael Johnson",
  },
  {
    id: "4",
    author: "Emily Davis",
  },
  {
    id: "5",
    author: "Robert Wilson",
  },
  {
    id: "6",
    author: "Learn new Skills/Concepts - related to programming",
  },
  {
    id: "7",
    author: "David Taylor",
  },
  {
    id: "8",
    author: "Jennifer Anderson",
  },
  {
    id: "9",
    author: "Daniel Martinez",
  },
  {
    id: "10",
    author: "Jessica Thomas",
  },
];

const DailyTask = () => {
  const [showActions, setShowActions] = useState({});
  const [contentLeft, setContentLeft] = useState({});
  const touchStartX = useRef({});

  const handleTouchStart = (tabId, e) => {
    touchStartX.current[tabId] = e.touches[0].clientX;
  };

  const handleTouchMove = (tabId, e) => {
    if (
      touchStartX.current[tabId] === null ||
      touchStartX.current[tabId] === undefined
    ) {
      return;
    }

    const deltaX = e.touches[0].clientX - touchStartX.current[tabId];

    if (deltaX < -50) {
      // Swipe left
      setShowActions((prev) => ({ ...prev, [tabId]: true }));
      setContentLeft((prev) => ({ ...prev, [tabId]: -100 }));
    } else if (deltaX > 50) {
      // Swipe right
      setShowActions((prev) => ({ ...prev, [tabId]: false }));
      setContentLeft((prev) => ({ ...prev, [tabId]: 0 }));
    }
  };

  const handleTouchEnd = (tabId) => {
    touchStartX.current[tabId] = null;
  };

  return (
    <div className="mt-[1vw] p-[1vw]">
      {/* --------- task container-------- */}
      <div className="task-container mt-[6vw] w-full border border-[#2a2c2f] rounded-[3vw] overflow-hidden min-h-[125vw] max-h-[138vw] overflow-y-auto relative">
        <div className=" sticky top-0 left-0 z-[5] taskbar h-[15vw] bg-[#1f2123] w-full flex items-center justify-between px-[4vw]">
          {/* ---------------heading------------ */}
          <div className="left">
            <div className="min-w-[28vw] text-[4.5vw] flex items-center gap-1 text-gray-200">
              <RiTaskLine className="text-[5.3vw]" />
              Daily Tasks
            </div>
          </div>
          {/* ---------------heading------------ */}
          <div className="flex items-center justify-center gap-[2.5vw]">
            {" "}
            {/* ----------progress circle--------- */}
            <div className="relative w-[9.5vw] h-[9.5vw]">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* <!-- Background circle --> */}
                <circle
                  className="text-gray-200 stroke-current"
                  strokeWidth="10"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                ></circle>
                {/* <!-- Progress circle --> */}
                <circle
                  className="text-green-500  progress-ring__circle stroke-current"
                  strokeWidth="10"
                  strokeLinecap="round"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  strokeDashoffset="calc(400 - (400 * 45) / 100)"
                ></circle>
              </svg>
              <p className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-gray-200 text-[2vw] font-medium text-center">
                100%
              </p>
            </div>
            {/* ----------progress circle--------- */}
            {/* --------== add new task btn-------------- */}
            <div className="btn">
              <FiPlus className=" text-[5vw] bg-[#2a2c2f] text-gray-200 rounded-[2vw] font-semibold h-[8vw] w-[8vw] p-[1.4vw]" />
            </div>
            {/* --------== add new task btn-------------- */}
          </div>
        </div>
        <div className=" mt-[-.2vw] task-warpper flex flex-col px-[3vw] w-full min-h-full relative">
          {/* ---------------- swipe tabs------------- */}

          {tabs?.length > 0 ? (
            <>
              {tabs?.map((tab, index) => (
                <div
                  key={tab.id}
                  onTouchStart={(e) => handleTouchStart(tab?.id, e)}
                  onTouchMove={(e) => handleTouchMove(tab?.id, e)}
                  onTouchEnd={() => handleTouchEnd(tab.id)}
                  style={{
                    position: "relative",
                    marginBottom: "14vw", // Adjust the spacing between tabs
                  }}
                  className="h-[100%] w-full "
                >
                  <div className="h-full min-h-fit border-b border-[#333537]">
                    <div
                      style={{
                        position: "absolute",
                        left: `${contentLeft[tab.id]}px`,
                        transition: "left 0.3s ease",
                        width: "100%", // Optional: Add a smooth transition
                      }}
                      className="flex items-center"
                    >
                      <div className=" p-[2vw] py-[3.8vw]  flex items-center gap-[2vw]">
                        {/* Your tab content goes here */}
                        <input type="checkbox" name="" id="" />
                        <span>{index + 1}. </span>
                        <p className="w-[75vw] overflow-hidden h-[6vw]">
                          {tab.author}
                        </p>
                      </div>
                    </div>

                    {showActions[tab?.id] && (
                      <div className="absolute right-0 flex items-center justify-center gap-3 h-[12.8vw] px-[4vw] rounded-md">
                        <button
                          onClick={() => console.log(`Edit Tab ${tab.id}`)}
                        >
                          <MdModeEdit className=" text-[4.6vw]" />
                        </button>
                        <button
                          onClick={() => console.log(`Delete Tab ${tab.id}`)}
                        >
                          <MdDelete className=" text-[4.6vw]" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className=" h-[80vw] flex items-center justify-center">
              <p className="text-gray-300">Empty task lists</p>
            </div>
          )}

          {/* ---------------- swipe tabs------------- */}
        </div>
      </div>
      {/* --------- task container-------- */}
    </div>
  );
};

export default DailyTask;
