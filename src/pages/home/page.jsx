// import React from "react";
import Hero from "../../components/Hero/page";
import DailyTask from "../../components/DailyTask/page";

const Home = () => {
  return (
    <div className="w-full mx-auto mt-[3vw] px-[3vw] max-h-screen">
      <Hero />
      <DailyTask />
    </div>
  );
};

export default Home;
