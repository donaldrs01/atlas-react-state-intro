import React, { createContext, useState } from "react";

export const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  // Enroll in course function
  const enrollCourse = (course) => {
    setEnrolledCourses((prevCourses) => [...prevCourses, course]); // Add new course to list of enrolled courses
  };

  // Drop a course function
  const dropCourse = (courseNumber) => {
    // Removes course that matches courseID
    setEnrolledCourses((prevCourses) =>
      prevCourses.filter((course) => course.courseNumber !== courseNumber)
    ); // Only keep courses that don't match courseNumber prop inputted
  };

  return (
    // Value prop - passing object with current state of enrolled courses and enroll/drop functions
    // Passed to all children components
    <CourseContext.Provider
      value={{ enrolledCourses, enrollCourse, dropCourse }}
    >
      {children}
    </CourseContext.Provider>
  );
};
