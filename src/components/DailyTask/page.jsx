import React from "react";
import { useEffect, useRef, useState } from "react";
import { RiTaskLine } from "react-icons/ri";
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { FiPlus } from "react-icons/fi";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { BASE_URL } from "../../api/BASE_URL";
import { useAuth } from "../../context/authContext";
import axios from "axios";

import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const tabs = [];

const DailyTask = () => {
  const [showActions, setShowActions] = useState({});
  const [contentLeft, setContentLeft] = useState({});
  const touchStartX = useRef({});
  const { user } = useAuth();

  const [primaryTasks, setPrimaryTasks] = useState(null);

  // const queryClient = useQueryClient();

  function getCurrentDate() {
    // Function to get the current date in "YYYY-MM-DD" format
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const currentDate = getCurrentDate();

  // ----------------GET API-----------------

  const {
    data: getDailyTasks,
    isLoading,
    refetch,
  } = useQuery(["getDailyTasks", user?.email, currentDate], async () => {
    const res = await axios.get(
      `${BASE_URL}/api/getDailyTasks/${user?.email}/${currentDate}`
    );
    return res.data;
  });

  // console.log(getDailyTasks?.dailyTask?.task_lists?.length);
  // ----------------GET API-----------------

  // --------------- POST API----------------

  // Example usage
  const saveNewDate = () => {
    localStorage.setItem("saveddate", currentDate);
  };

  // Effect to handle the API call when the date changes

  useEffect(() => {
    const savedDate = localStorage.getItem("saveddate");
    // console.log(savedDate);

    const fetchData = async () => {
      const res = await axios.get(
        `${BASE_URL}/api/getContantTask/${user?.email}`
      );
      console.log(res?.data?.task_names?.length);
      setPrimaryTasks(res?.data?.task_names?.length);

      // dataFetched(res?.data)
      // return res.data;
    };
    fetchData();

    // console.log(dataFetched)
    // Check if the saved date is different from the current date

    if (primaryTasks > 0) {
      if (savedDate !== currentDate) {
        axios
          .post(`${BASE_URL}/api/createDailyTask`, {
            user_email: user?.email,
            date: currentDate,
          })
          .then((response) => {
            // console.log(response.data);
          })
          .catch((error) => {
            console.log(error);
          });

        saveNewDate();
      }
    }
  }, [currentDate, user?.email]);
  // --------------- POST API----------------

  // ---------------- PUT API TO UPADTE isCompleted filed---------------
  const handleStatusUpdate = async (id, value) => {
    const res = await axios.put(
      `${BASE_URL}/api/updateTask/${id}?date=${currentDate}&user_email=${user?.email}`,
      {
        isCompleted: value,
      }
    );

    if (res.status === 200) {
      await refetch();
      // console.log(res.status);
    }
  };
  // ---------------- PUT API TO UPADTE isCompleted filed---------------

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

  // -------------percentage-------------------
  // console.log(getDailyTasks?.dailyTask?.task_lists?.length || 0);
  const Totalcount = getDailyTasks?.dailyTask?.task_lists?.length || 0;
  const completed = getDailyTasks?.noOfCompletedTasks;
  // console.log(completed)
  // Replace this with your actual completed count

  // Calculate the completion percentage
  const completionPercentage = (completed / Totalcount) * 100;

  // console.log(completionPercentage);

  // -------------percentage-------------------

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
              <CircularProgressbar
                styles={{
                  // Customize the root svg element
                  root: {},
                  // Customize the path, i.e. the "completed progress"
                  path: {
                    // Path color
                    stroke: `rgba(76, 209, 55, ${completionPercentage})`,
                  },
                }}
                value={completionPercentage}
              />

              <p className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-gray-200 text-[2vw] font-medium text-center">
                {completionPercentage}%
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

          {getDailyTasks?.dailyTask?.task_lists?.length > 0 ? (
            <>
              {getDailyTasks?.dailyTask?.task_lists?.map((tab, index) => (
                <div
                  key={tab?._id}
                  onTouchStart={(e) => handleTouchStart(tab?._id, e)}
                  onTouchMove={(e) => handleTouchMove(tab?._id, e)}
                  onTouchEnd={() => handleTouchEnd(tab?._id)}
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
                        left: `${contentLeft[tab?._id]}px`,
                        transition: "left 0.3s ease",
                        width: "100%", // Optional: Add a smooth transition
                      }}
                      className="flex items-center"
                    >
                      <div className=" p-[2vw] py-[3.8vw]  flex items-center gap-[2vw]">
                        {/* Your tab content goes here */}
                        <input
                          onChange={() =>
                            handleStatusUpdate(
                              tab?._id,
                              tab?.isCompleted === false ? true : false
                            )
                          }
                          type="checkbox"
                          checked={tab?.isCompleted === true}
                          name=""
                          id=""
                        />
                        {tab?.isCompleted}
                        <span>{index + 1}. </span>
                        <p
                          className={`w-[75vw] overflow-hidden h-[6vw] ${
                            tab?.isCompleted ? "line-through text-gray-500" : ""
                          }`}
                        >
                          {tab?.name}
                        </p>
                      </div>
                    </div>

                    {showActions[tab?._id] && (
                      <div className="absolute right-0 flex items-center justify-center gap-3 h-[12.8vw] px-[4vw] rounded-md">
                        <button
                          onClick={() => console.log(`Edit Tab ${tab?._id}`)}
                        >
                          <MdModeEdit className=" text-[4.6vw]" />
                        </button>
                        <button
                          onClick={() => console.log(`Delete Tab ${tab?._id}`)}
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
