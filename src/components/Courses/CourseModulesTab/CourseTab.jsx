import React, { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { LuDot } from "react-icons/lu";
import { CiStreamOn } from "react-icons/ci";
import python from "../../../assets/python.png"; // Sample image

const CourseTab = ({ course }) => {
  const [expandedWeek, setExpandedWeek] = useState(null);
  const [expandedDay, setExpandedDay] = useState(null);

  return (
    <div>
      {course.schedule.map((weekData, weekIndex) => (
        <div key={weekIndex}>
          {/* Week Section */}
          <div
            className="flex justify-between border border-slate-300 items-center p-2 rounded-xl select-none cursor-pointer"
            onClick={() =>
              setExpandedWeek(expandedWeek === weekIndex ? null : weekIndex)
            }
          >
            <div className="p-2 text-md flex space-x-4">
              <span className="font-bold text-lg"> {weekData.week} -</span>
              <span className="text-slate-700"> {weekData.dateRange} </span>
            </div>
            <div className="p-2 rounded-full">
              {expandedWeek === weekIndex ? <FaMinus /> : <FaPlus />}
            </div>
          </div>

          {/* Days Inside a Week */}
          {expandedWeek === weekIndex &&
            weekData.days.map((dayData, dayIndex) => (
              <div key={dayIndex}>
                <div
                  className="my-2 flex justify-between border border-slate-300 p-2 rounded-md select-none cursor-pointer"
                  onClick={() =>
                    setExpandedDay(expandedDay === dayIndex ? null : dayIndex)
                  }
                >
                  <div className="p-2 text-sm">
                    <span className="font-bold text-md">{dayData.day} -</span>
                    <span className="text-slate-700"> {dayData.date}</span>
                  </div>
                  <div className="p-2 rounded-full">
                    {expandedDay === dayIndex ? <FaMinus /> : <FaPlus />}
                  </div>
                </div>

                {/* Classes Inside a Day */}
                {expandedDay === dayIndex &&
                  dayData.classes.map((classData, classIndex) => (
                    <div
                      key={classIndex}
                      className="m-3 my-5 flex items-center space-x-3"
                    >
                      <img
                        src={classData.image || python} // Default to Python if no image
                        className="w-14 pointer-events-none"
                        alt={classData.subject}
                      />
                      <div>
                        <h1 className="font-medium text-lg">
                          {classData.subject} - {classData.topic}
                        </h1>
                        <div className="flex items-center space-x-3">
                          <h6 className="text-gray-800 font-light">
                            {classData.time}
                          </h6>
                          <LuDot />
                          {classData.isLive ? (
                            <h6 className="flex items-center text-red-600 cursor-pointer">
                              Live{" "}
                              <CiStreamOn className="text-2xl text-red-600" />
                            </h6>
                          ) : (
                            <h6 className="text-green-500 cursor-pointer">
                              Recorded
                            </h6>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

export default CourseTab;
