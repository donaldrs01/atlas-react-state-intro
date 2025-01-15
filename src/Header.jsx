import React, { useContext } from "react";
import { CourseContext } from "./CourseContext";
import logo from "./assets/logo.png";

export default function Header() {
  const { enrolledCourses } = useContext(CourseContext);

  return (
    <div className="header">
      <img src={logo} alt="logo" className="logo" />
      <div className="enrollment">
        Classes Enrolled: {enrolledCourses.length}
      </div>
    </div>
  );
}
