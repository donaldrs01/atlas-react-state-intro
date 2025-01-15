import React, { useState, useEffect, useContext } from "react";
import { CourseContext } from "./CourseContext";

// SchoolCatalog component
export default function SchoolCatalog() {
  // State variables
  const { enrolledCourses, enrollCourse, dropCourse } =
    useContext(CourseContext);
  const [courses, setCourses] = useState([]);
  const [filter, setFilter] = useState("");
  const [sortField, setSortField] = useState("courseNumber");
  const [sortDirection, setSortDirection] = useState("asc");
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 5;

  // Fetch course data
  useEffect(() => {
    fetch("/api/courses.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error with request");
        }
        return response.json(); // Convert resposne to JSON
      })
      .then((data) => {
        setCourses(data); // Update course state with fetched data
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  }, []); // Empty array assures this only runs once on component mount

  // Sorting helper function
  const handleSortingChange = (field) => {
    // Toggle sorting direction if same field clicked again
    const newDirection =
      sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDirection);
    setPage(1); // Reset to first page after sorting
  };

  // Search and filter course data
  const filteredAndSortedCourses = courses
    .filter(
      (course) =>
        course.courseNumber.toLowerCase().includes(filter.toLowerCase()) ||
        course.courseName.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => {
      // Sort data based on selected field and direction
      if (typeof a[sortField] === "string") {
        // For strings, use localCompare
        return (
          a[sortField].localeCompare(b[sortField]) *
          (sortDirection === "desc" ? -1 : 1)
        );
      } else {
        // For number fields, use subraction method
        return (
          (a[sortField] - b[sortField]) * (sortDirection === "desc" ? -1 : 1)
        );
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedCourses.length / PAGE_SIZE);
  // Get current page data by slicing the filtered/sorted array
  const currentPageData = filteredAndSortedCourses.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  // Variables to track page boundaries (enable and disable buttons)
  const hasMore = page < totalPages; // checks if there are more pages
  const hasLess = page > 1; // checks if there are previous pages

  return (
    <div className="school-catalog">
      <h1>School Catalog</h1>
      <input
        type="text"
        placeholder="Search by Course Number or by Course Name"
        onChange={(e) => setFilter(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSortingChange("trimester")}>Trimester</th>
            <th onClick={() => handleSortingChange("courseNumber")}>
              Course Number
            </th>
            <th onClick={() => handleSortingChange("courseName")}>
              Courses Name
            </th>
            <th onClick={() => handleSortingChange("semesterCredits")}>
              Semester Credits
            </th>
            <th onClick={() => handleSortingChange("totalClockHours")}>
              Total Clock Hours
            </th>
            <th>Enroll</th>
          </tr>
        </thead>
        <tbody>
          {currentPageData.map((course) => (
            <tr key={course.courseNumber}>
              <td>{course.trimester}</td>
              <td>{course.courseNumber}</td>
              <td>{course.courseName}</td>
              <td>{course.semesterCredits}</td>
              <td>{course.totalClockHours}</td>
              <td>
                <button onClick={() => enrollCourse(course)}>Enroll</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button disabled={!hasLess} onClick={() => setPage(page - 1)}>
          Previous
        </button>
        <button disabled={!hasMore} onClick={() => setPage(page + 1)}>
          Next
        </button>
        <p>
          Page {page} of {totalPages}
        </p>
      </div>
    </div>
  );
}
