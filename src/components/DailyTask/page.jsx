import { useEffect, useRef, useState } from "react";
import { RiTaskLine } from "react-icons/ri";
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { FiPlus } from "react-icons/fi";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { BASE_URL } from "../../api/BASE_URL";
import { useAuth } from "../../context/authContext";
import axios from "axios";
import { LuLoader2 } from "react-icons/lu";

import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Controller, useForm } from "react-hook-form";

const DailyTask = () => {
  const [showActions, setShowActions] = useState({});
  const [contentLeft, setContentLeft] = useState({});
  const touchStartX = useRef({});
  const { user } = useAuth();
  const [primaryTasks, setPrimaryTasks] = useState(null);

  const modelRef = useRef();
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [taskNames, setTaskNames] = useState("");
  const { handleSubmit, control, setValue } = useForm();
  const queryClient = useQueryClient();

  function getCurrentDate() {
    // Function to get the current date in "YYYY-MM-DD" format
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const currentDate = getCurrentDate();

  // Example usage
  const saveNewDate = () => {
    localStorage.setItem("saveddate", currentDate);
  };
  const savedDate = localStorage.getItem("saveddate");

  const saveEmail = () => {
    localStorage.setItem("saveemail", user?.email);
  };

  const savedEmail = localStorage.getItem("saveemail");
  console.log(savedEmail);
  // ----------------GET API-----------------

  const {
    data: getDailyTasks,
    isLoading,
    refetch,
  } = useQuery(["getDailyTasks", user?.email, currentDate], async () => {
    const res = await axios.get(
      `${BASE_URL}/api/getDailyTasks/${user?.email}/${currentDate}`
    );
    if (res.data?.dailyTask?.task_lists?.length > 0) {
      saveNewDate();
      saveEmail();
    }
    return res.data;
  });

  // console.log(getDailyTasks?.dailyTask?.task_lists?.length);
  // ----------------GET API-----------------

  // --------------- POST API----------------

  // Effect to handle the API call when the date changes

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/getContantTask/${user?.email}`
      );
      // console.log(res?.data?.task_names?.length);
      setPrimaryTasks(res?.data?.task_names?.length);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const updateDailyTask = async () => {
      if (primaryTasks > 0) {
        try {
          await axios.post(`${BASE_URL}/api/createDailyTask`, {
            user_email: user?.email,
            date: currentDate,
          });
          saveNewDate();
          saveEmail();
        } catch (error) {
          console.error("Error creating daily task:", error);
        }
      }
    };

    updateDailyTask();

    fetchData();
  }, []);

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

  // ---------------- PUT API TO  ADD MORE TASK--------------------
  // console.log(currentDate)
  const addTaskMutation = useMutation(
    (updatedTask) =>
      axios.put(
        `${BASE_URL}/api/updateTask/${user?.email}/${currentDate}`,
        updatedTask
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["tasks", user?.email]);
        setIsEditing(false);
        // setEditingTaskId(null);
        refetch();
        setIsModelOpen(false);
      },
    }
  );

  const handleAddTask = async (formData) => {
    console.log(formData?.taskNames[0]);
    try {
      await addTaskMutation.mutateAsync({
        name: formData?.taskNames[0],
        isCompleted: false,
      });
    } catch (error) {
      console.error(error);
    }
  };

  // ---------------- PUT API TO  ADD MORE TASK--------------------

  // ------------------ PUT EDIT TASK-----------------------
  const editTaskMutation = useMutation(
    (newTask) => axios.post(`${BASE_URL}/api/create_constant_tasks`, newTask),
    {
      onSuccess: () => {
        setTaskNames("");
        setIsModelOpen(false);
        queryClient.invalidateQueries(["tasks", user?.email]);
      },
    }
  );

  const handleEditTask = async (formData) => {
    console.log(formData);
    try {
      await editTaskMutation.mutateAsync({
        user_email: user?.email,
        task_names: formData.taskNames,
      });
    } catch (error) {
      console.error(error);
    }
  };
  // ------------------ PUT EDIT TASK-----------------------

  // ------------------- DELETE API-------------------------
  const deleteTaskMutation = useMutation(
    (taskId) =>
      axios.delete(
        `${BASE_URL}/api/deleteTask/${user?.email}/${currentDate}/${taskId}`
      ),
    {
      onSuccess: () => {
        refetch();
        queryClient.invalidateQueries(["tasks", user?.email]);
      },
    }
  );

  const handleTaskDelete = async (taskId) => {
    try {
      await deleteTaskMutation.mutateAsync(taskId);
    } catch (error) {
      console.error(error);
    }
  };
  // ------------------- DELETE API-------------------------

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modelRef.current && !modelRef.current.contains(event.target)) {
        setIsModelOpen(false);
        setIsEditing(false);
        setTaskNames("");
      }
    };

    window.addEventListener("mousedown", handleOutsideClick);

    return () => {
      window.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [modelRef]);

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
  const completionPercentage = ((completed / Totalcount) * 100).toFixed(0);

  // Define color based on completionPercentage
  let pathColor;
  if (completionPercentage <= 33.3) {
    pathColor = "rgb(239 68 68)";
  } else if (completionPercentage <= 66.6) {
    pathColor = "rgb(234 179 8)";
  } else {
    pathColor = "rgb(34 197 94)";
  }

  // console.log(completionPercentage);

  // -------------percentage-------------------

  return (
    <div className="mt-[1vw] p-[1vw]">
      {/* --------- task container-------- */}
      <div className="task-container mt-[6vw] w-full border border-[#2a2c2f] rounded-[3vw] overflow-hidden min-h-[140vw] max-h-[140vw] overflow-y-auto relative">
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
                    stroke: pathColor,
                  },
                }}
                value={completionPercentage}
              />

              <p className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-gray-200 text-[2vw] font-medium text-center">
                {completionPercentage ? completionPercentage : 0}%
              </p>
            </div>
            {/* ----------progress circle--------- */}
            {/* --------== add new task btn-------------- */}
            <div onClick={() => setIsModelOpen(true)} className="btn">
              <FiPlus className=" text-[5vw] bg-[#2a2c2f] text-gray-200 rounded-[2vw] font-semibold h-[8vw] w-[8vw] p-[1.4vw]" />
            </div>
            {/* --------== add new task btn-------------- */}
          </div>
        </div>

        <div className=" mt-[-.2vw] task-warpper flex flex-col px-[3vw] w-full min-h-full relative">
          {/* ---------------- swipe tabs------------- */}
          {isLoading ? (
            <div className="w-full h-[100vw] flex items-center justify-center gap-1">
              <LuLoader2 className="animate-spin text-xl" /> Loading...
            </div>
          ) : (
            <>
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
                                tab?.isCompleted
                                  ? "line-through text-gray-500"
                                  : ""
                              }`}
                            >
                              {tab?.name}
                            </p>
                          </div>
                        </div>

                        {showActions[tab?._id] && (
                          <div className="absolute right-0 flex items-center justify-center gap-3 h-[12.8vw] px-[4vw] rounded-md">
                            <button
                              onClick={() =>
                                console.log(`Edit Tab ${tab?._id}`)
                              }
                            >
                              {/* <MdModeEdit className=" text-[4.6vw]" /> */}
                            </button>
                            <button
                              onClick={() =>
                                // console.log(`Delete Tab ${tab?._id}`)
                                handleTaskDelete(tab?._id)
                              }
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
            </>
          )}

          {/* ---------------- swipe tabs------------- */}
        </div>
      </div>
      {/* --------- task container-------- */}

      {/* -------------------Model--------------- */}
      <div
        className={` ${
          isModelOpen ? "flex" : "hidden"
        }  fixed top-0 left-0 h-screen w-[100vw] z-[10000000] backdrop-blur-sm  items-center justify-center`}
      >
        <form
          onSubmit={handleSubmit(handleAddTask)}
          ref={modelRef}
          className="bg-[#2a2c2f] border border-white/10 w-[90vw] flex flex-col rounded-[3vw] p-[6vw] gap-3"
        >
          <p className=" text-start text-[5.2vw] font-medium">
            {isEditing ? "Edit Task" : "Daily Task"}
          </p>
          <Controller
            name="taskNames"
            control={control}
            // defaultValue={isEditing ? taskNames : ""}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="bg-transparent border rounded-[1vw] w-full p-[1.8vw]"
                placeholder="Task Name"
                onChange={(e) => {
                  setTaskNames(e.target.value);
                  setValue("taskNames", e.target.value.split(","));
                }}
              />
            )}
          />

          <div className="btns flex w-full justify-end gap-3">
            <div
              onClick={() => setIsModelOpen(false)}
              className="p-2 px-4 bg-[#1f2123] rounded-[1vw] font-medium active:scale-95"
            >
              Cancle
            </div>

            {isEditing ? (
              <>
                {" "}
                <button
                  // onClick={isEditing ? handleUpdateTask : handleCreateTask}
                  className="p-2 px-4 bg-[#1f2123] rounded-[1vw] font-medium active:scale-95"
                >
                  {isEditing ? "Update" : "Add"}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleAddTask}
                  className="p-2 px-4 bg-[#1f2123] rounded-[1vw] font-medium active:scale-95"
                >
                  Add
                </button>
              </>
            )}
          </div>
        </form>
      </div>
      {/* -------------------Model--------------- */}
    </div>
  );
};

export default DailyTask;
