// import React from "react";
import { useRef, useState } from "react";
import { RiHistoryFill, RiTaskLine } from "react-icons/ri";
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { FiPlus } from "react-icons/fi";

const tabs = [
  {
    id: "1",
    date: "2022-01-01",
  },
  {
    id: "2",
    date: "2022-01-02",
  },
  {
    id: "3",
    date: "2022-01-03",
  },
  {
    id: "4",
    date: "2022-01-04",
  },
  {
    id: "5",
    date: "2022-01-05",
  },
  {
    id: "6",
    date: "2022-01-06",
  },
  {
    id: "7",
    date: "2022-01-07",
  },
  {
    id: "8",
    date: "2022-01-08",
  },
  {
    id: "9",
    date: "2022-01-09",
  },
  {
    id: "10",
    date: "2022-01-10",
  },
  {
    id: "11",
    date: "2022-01-11",
  },
  {
    id: "12",
    date: "2022-01-12",
  },
  {
    id: "13",
    date: "2022-01-13",
  },
  {
    id: "14",
    date: "2022-01-14",
  },
  {
    id: "15",
    date: "2022-01-15",
  },
  {
    id: "16",
    date: "2022-01-16",
  },
  {
    id: "17",
    date: "2022-01-17",
  },
  {
    id: "18",
    date: "2022-01-18",
  },
  {
    id: "19",
    date: "2022-01-19",
  },
  {
    id: "20",
    date: "2022-01-20",
  },
  {
    id: "21",
    date: "2022-01-21",
  },
  {
    id: "22",
    date: "2022-01-22",
  },
  {
    id: "23",
    date: "2022-01-23",
  },
  {
    id: "24",
    date: "2022-01-24",
  },
  {
    id: "25",
    date: "2022-01-25",
  },
  {
    id: "26",
    date: "2022-01-26",
  },
  {
    id: "27",
    date: "2022-01-27",
  },
  {
    id: "28",
    date: "2022-01-28",
  },
  {
    id: "29",
    date: "2022-01-29",
  },
  {
    id: "30",
    date: "2022-01-30",
  },
];

const History = () => {
  return (
    <div className="w-full mx-auto mt-[3vw] px-[3vw] max-h-screen">
      <div className="bg-[#1f2123] p-[4vw] px-[4.2vw] w-full rounded-[3vw] flex ">
        <div className="left flex-1 overflow-hidden flex flex-col">
          <p className="font-medium text-[5.2vw]"> Overall Progress</p>
          <div>
            {/* indicator */}
            <div className=" flex items-center justify-start gap-1 text-[3vw]">
              <div className="dot w-[1.3vw] rounded-full h-[1.3vw] bg-green-500"></div>{" "}
              <span>Excellent</span>
            </div>
            {/* indicator */}
            {/* indicator */}
            <div className=" flex items-center justify-start gap-1 text-[3vw]">
              <div className="dot w-[1.3vw] rounded-full h-[1.3vw] bg-yellow-500"></div>{" "}
              <span>Good</span>
            </div>
            {/* indicator */}
            <div className=" flex items-center justify-start gap-1 text-[3vw]">
              <div className="dot w-[1.3vw] rounded-full h-[1.3vw] bg-red-500"></div>{" "}
              <span>Bad</span>
            </div>
            {/* indicator */}
          </div>
        </div>
        <div className="right flex-1 flex justify-center items-end flex-col">
          {/* ----------progress circle--------- */}
          <div className="relative w-[18vw] h-[18vw]">
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
            <p className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-gray-200 text-[3vw] font-medium text-center">
              100%
            </p>
          </div>
          {/* ----------progress circle--------- */}
        </div>
      </div>

      {/* ----------- Last 30 days--------------- */}
      <div className="mt-[1vw] p-[1vw]">
        {/* --------- task container-------- */}
        <div className="task-container mt-[6vw] w-full border border-[#2a2c2f] rounded-[3vw] overflow-hidden min-h-[125vw] max-h-[138vw] overflow-y-auto relative">
          <div className=" sticky top-0 left-0 z-[5] taskbar h-[15vw] bg-[#1f2123] w-full flex items-center justify-between px-[4vw]">
            {/* ---------------heading------------ */}
            <div className="left">
              <div className="min-w-[28vw] text-[4.5vw] flex items-center gap-1 text-gray-200">
                <RiHistoryFill className="text-[5.3vw]" />
                Last 30days
              </div>
            </div>
            {/* ---------------heading------------ */}
          </div>
          <div className=" mt-[-.2vw] task-warpper flex flex-col px-[3vw] w-full min-h-full relative">
            {/* ---------------- swipe tabs------------- */}

            {tabs?.length > 0 ? (
              <>
                {tabs?.map((tab, index) => (
                  <div
                    key={tab.id}
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
                          transition: "left 0.3s ease",
                          width: "100%", // Optional: Add a smooth transition
                        }}
                        className="flex items-center"
                      >
                        {/* ------------------------------ */}
                        <div className=" p-[2vw] py-[3.8vw]  flex items-center justify-between gap-[2vw] w-[100%]">
                          <div className="flex items-center gap-[2vw] font-medium">
                            <span>{index + 1}. </span>
                            <p className="w-[]  overflow-hidden h-[6vw]">
                              {tab.date}
                            </p>
                          </div>
                          {/* ----------progress circle--------- */}
                          <div className="relative w-[9.5vw] h-[9.5vw]">
                            <svg
                              className="w-full h-full"
                              viewBox="0 0 100 100"
                            >
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
                        </div>
                        {/* ------------------------------ */}
                      </div>
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
      {/* ----------- Last 30 days--------------- */}
    </div>
  );
};

export default History;
