import { useEffect, useRef, useState } from "react";
import { RiTaskLine } from "react-icons/ri";
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { FiPlus } from "react-icons/fi";
import { BASE_URL } from "../../api/BASE_URL";
import axios from "axios";
import { debounce } from "lodash";
import { useAuth } from "../../context/authContext";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useForm, Controller } from "react-hook-form";
import { LuLoader2 } from "react-icons/lu";

const Task = () => {
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [taskNames, setTaskNames] = useState([]);
  const [showActions, setShowActions] = useState({});
  const [contentLeft, setContentLeft] = useState({});
  const [editingTaskId, setEditingTaskId] = useState(null);
  const touchStartX = useRef({});
  const modelRef = useRef();
  const { user } = useAuth();
  const { handleSubmit, control, setValue } = useForm();

  const queryClient = useQueryClient();

  const handleInputChange = debounce((newInputs, oldInputs) => {
    // Only refetch data if the 'user?.email' value has changed
    if (newInputs[1] !== oldInputs[1]) {
      queryClient.invalidateQueries(["tasks", user?.email]);
    }
  }, 300);

  const { data, isLoading } = useQuery(
    ["tasks", user?.email],
    async () => {
      const res = await axios.get(
        `${BASE_URL}/api/getContantTask/${user?.email}`
      );
      // console.log(res.data);
      return res.data;
    },
    {
      enabled: !!user?.email,
      staleTime: 60000,
      onInputChange: handleInputChange,
    }
  );

  // console.log(data);

  // -------------- PUT API -------------
  const updateTaskMutation = useMutation(
    (updatedTask) =>
      axios.put(
        `${BASE_URL}/api/update_constant_particular_task/${editingTaskId}`,
        updatedTask
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["tasks", user?.email]);
        setIsEditing(false);
        setEditingTaskId(null);
        setIsModelOpen(false);
      },
    }
  );

  // -------------- DELETE API----------
  const deleteTaskMutation = useMutation(
    (taskId) => axios.delete(`${BASE_URL}/api/delete_constant_task/${taskId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["tasks", user?.email]);
      },
    }
  );

  // -------------- POST API --------------
  const createTaskMutation = useMutation(
    (newTask) => axios.post(`${BASE_URL}/api/create_constant_tasks`, newTask),
    {
      onSuccess: () => {
        setTaskNames("");
        setIsModelOpen(false);
        queryClient.invalidateQueries(["tasks", user?.email]);
      },
    }
  );

  // --------------- React Query Fetching ----------------
  useEffect(() => {
    queryClient.invalidateQueries(["tasks", user?.email]);
  }, [isModelOpen, isEditing]);

  // --------------- PUT | Edit particular task----------------
  const handleEditParticularTask = (taskId) => {
    const taskToEdit = data?.task_names.find((task) => task._id === taskId);
    setTaskNames(taskToEdit?.name || "");
    setEditingTaskId(taskId);
    setIsModelOpen(true);
    setIsEditing(true);
  };

  const handleUpdateTask = async (formData) => {
    try {
      await updateTaskMutation.mutateAsync({
        name: formData.taskNames[0],
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      await deleteTaskMutation.mutateAsync(taskId);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateTask = async (formData) => {
    console.log(formData);
    try {
      await createTaskMutation.mutateAsync({
        user_email: user?.email,
        task_names: formData.taskNames,
      });
    } catch (error) {
      console.error(error);
    }
  };

  // -------------- PUT API -------------
  const addTaskMutation = useMutation(
    (taskData) =>
      axios.put(
        `${BASE_URL}/api/update_constant_tasks_by_id/${data?._id}`,
        taskData
      ),
    {
      onSuccess: () => {
        setTaskNames("");
        setIsModelOpen(false);
        queryClient.invalidateQueries(["tasks", user?.email]);
      },
    }
  );

  const handleAddTaskInExistingDoc = async () => {
    try {
      await addTaskMutation.mutateAsync({
        task_names: taskNames,
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    queryClient.invalidateQueries(["tasks", user?.email]);
  }, [isModelOpen, isEditing /* other dependencies */]);

  // -------------------- swipe tab------------------

  const debouncedHandleTouchStart = debounce((tabId, e) => {
    handleTouchStart(tabId, e);
  }, 300);

  const debouncedHandleTouchMove = debounce((tabId, e) => {
    handleTouchMove(tabId, e);
  }, 300);

  const debouncedHandleTouchEnd = debounce((tabId) => {
    handleTouchEnd(tabId);
  }, 300);

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
        setIsEditing(false);
        setTaskNames("");
      }
    };

    window.addEventListener("mousedown", handleOutsideClick);

    return () => {
      window.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [modelRef]);

  // -------------------- swipe tab------------------

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
                Set Tasks
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
            {isLoading ? (
              <div className="w-full h-[100vw] flex items-center justify-center gap-1">
                <LuLoader2 className="animate-spin text-xl" /> Loading...
              </div>
            ) : (
              <>
                {" "}
                {data?.task_names?.length > 0 ? (
                  <>
                    {data?.task_names?.map((tab, index) => (
                      <div
                        key={tab?._id}
                        onTouchStart={(e) =>
                          debouncedHandleTouchStart(tab?._id, e)
                        }
                        onTouchMove={(e) =>
                          debouncedHandleTouchMove(tab?._id, e)
                        }
                        onTouchEnd={() => debouncedHandleTouchEnd(tab?._id)}
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
                              {/* <input type="checkbox" name="" id="" /> */}
                              <span>{index + 1}. </span>
                              <p className="w-[75vw] overflow-hidden h-[6vw]">
                                {tab?.name}
                              </p>
                            </div>
                          </div>

                          {showActions[tab?._id] && (
                            <div className="absolute right-0 flex items-center justify-center gap-3 h-[12.8vw] px-[4vw] rounded-md">
                              <button
                                type="button"
                                onClick={() => {
                                  // console.log(`Edit Tab ${tab?._id}`),
                                  setIsEditing(true),
                                    handleEditParticularTask(tab?._id);
                                }}
                              >
                                <MdModeEdit className=" text-[4.6vw]" />
                              </button>
                              <button
                                type="submit"
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
      </div>

      {/* -------------------Model--------------- */}
      <div
        className={` ${
          isModelOpen ? "flex" : "hidden"
        }  fixed top-0 left-0 h-screen w-[100vw] z-[10000000] backdrop-blur-sm  items-center justify-center`}
      >
        <form
          onSubmit={handleSubmit(
            isEditing ? handleUpdateTask : handleCreateTask
          )}
          ref={modelRef}
          className="bg-[#2a2c2f] border border-white/10 w-[90vw] flex flex-col rounded-[3vw] p-[6vw] gap-3"
        >
          <p className=" text-start text-[5.5vw] font-semibold">
            {isEditing ? "Edit Task" : "Add Primary Task"}
          </p>
          <Controller
            name="taskNames"
            control={control}
            defaultValue={isEditing ? taskNames : ""}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="bg-transparent border rounded-[1vw] w-full p-[1.8vw]"
                placeholder="1. Task Name..."
                onChange={(e) => {
                  setTaskNames(e.target.value.split(","));
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
                  onClick={isEditing ? handleUpdateTask : handleCreateTask}
                  className="p-2 px-4 bg-[#1f2123] rounded-[1vw] font-medium active:scale-95"
                >
                  {isEditing ? "Update" : "Add"}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={
                    data && data?._id
                      ? handleAddTaskInExistingDoc
                      : handleCreateTask
                  }
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

export default Task;
