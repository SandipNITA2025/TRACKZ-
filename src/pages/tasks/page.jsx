import { useEffect, useRef, useState } from "react";
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
const Task = () => {
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showActions, setShowActions] = useState({});
  const [contentLeft, setContentLeft] = useState({});
  const touchStartX = useRef({});
  const modelRef = useRef();

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

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modelRef.current && !modelRef.current.contains(event.target)) {
        setIsModelOpen(false);
      }
    };

    window.addEventListener("mousedown", handleOutsideClick);

    return () => {
      window.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [modelRef]);
  return (
    <div className="w-full mx-auto mt-[3vw] px-[3vw] max-h-screen">
      <div className="mt-[1vw] p-[1vw]">
        {/* --------- task container-------- */}
        <div className="task-container mt-[0vw] w-full border border-[#2a2c2f] rounded-[3vw] overflow-hidden min-h-[125vw] max-h-[160vw] overflow-y-auto relative">
          <div className=" sticky top-0 left-0 z-[5] taskbar h-[15vw] bg-[#1f2123] w-full flex items-center justify-between px-[4vw]">
            {/* ---------------heading------------ */}
            <div className="left">
              <div className="min-w-[28vw] text-[4.5vw] flex items-center gap-1 text-gray-200">
                <RiTaskLine className="text-[5.3vw]" />
                Primary Tasks
              </div>
            </div>
            {/* ---------------heading------------ */}
            <div className="flex items-center justify-center gap-[2.5vw]">
              {/* --------== add new task btn-------------- */}
              <div
                onClick={() => setIsModelOpen(true)}
                className="btn active:scale-95"
              >
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
                          {/* <input type="checkbox" name="" id="" /> */}
                          <span>{index + 1}. </span>
                          <p className="w-[75vw] overflow-hidden h-[6vw]">
                            {tab.author}
                          </p>
                        </div>
                      </div>

                      {showActions[tab?.id] && (
                        <div className="absolute right-0 flex items-center justify-center gap-3 h-[12.8vw] px-[4vw] rounded-md">
                          <button
                            type="button"
                            onClick={() => {
                              console.log(`Edit Tab ${tab.id}`),
                                setIsEditing(true);
                            }}
                          >
                            <MdModeEdit className=" text-[4.6vw]" />
                          </button>
                          <button
                            type="submit"
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

      {/* -------------------Model--------------- */}
      <div
        className={` ${
          isModelOpen ? "flex" : "hidden"
        }  fixed top-0 left-0 h-screen w-[100vw] z-[10000000] backdrop-blur-sm  items-center justify-center`}
      >
        <form
          ref={modelRef}
          className="bg-[#2a2c2f] border border-white/10 w-[90vw] flex flex-col rounded-[3vw] p-[6vw] gap-3"
        >
          <p className=" text-start text-[5.5vw] font-semibold">
            Add Primary Task
          </p>
          <input
            type="text"
            className="bg-transparent border rounded-[1vw] w-full p-[1.8vw]"
            placeholder="1. Task Name..."
            name=""
            id=""
          />
          <div className="btns flex w-full justify-end gap-3">
            <div
              onClick={() => setIsModelOpen(false)}
              className="p-2 px-4 bg-[#1f2123] rounded-[1vw] font-medium active:scale-95"
            >
              Cancle
            </div>
            <div className="p-2 px-4 bg-[#1f2123] rounded-[1vw] font-medium active:scale-95">
              Add
            </div>
          </div>
        </form>
      </div>
      {/* -------------------Model--------------- */}
    </div>
  );
};

export default Task;
