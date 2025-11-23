import axios from "axios";

// Base API instance
const API = axios.create({
  baseURL:
    (import.meta && import.meta.env && import.meta.env.VITE_API_URL) ||
    "http://localhost:5000/api",
});

// Ensure POST/PUT requests send JSON by default
API.defaults.headers.post["Content-Type"] = "application/json";
API.defaults.headers.put["Content-Type"] = "application/json";

// Attach JWT token automatically if present
API.interceptors.request.use((req) => {
  const storedUser = localStorage.getItem("someshaUser");
  if (storedUser) {
    const { token } = JSON.parse(storedUser);
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
  }
  return req;
});


// =====================
// User Endpoints
// =====================
export const registerUser = (formData) => API.post("/users/register", formData);
export const loginUser = (formData) => API.post("/users/login", formData);
export const logoutUser = () => API.post("/users/logout");
export const getUserProfile = () => API.get("/users/profile");
export const updateUserProfile = (formData) => API.put("/users/profile", formData);
export const addParentToChild = (formData) => API.post("/users/add-parent-to-child", formData);


// =====================
// Tutor Endpoints
// =====================
export const createTutorProfile = (data) => API.post("/tutors", data);
export const getTutorProfile = (tutorId) => API.get(`/tutors/${tutorId}`);
export const updateTutorProfile = (tutorId, data) =>
  API.put(`/tutors/${tutorId}`, data);
export const getAllTutors = () => API.get("/tutors");


// =====================
// Course Endpoints
// =====================
export const createCourse = (courseData) => API.post("/courses", courseData);
export const getCourses = () => API.get("/courses");
export const getCourseById = (courseId) => API.get(`/courses/${courseId}`);
export const updateCourse = (courseId, courseData) =>
  API.put(`/courses/${courseId}`, courseData);
export const addLessonsToCourse = (courseId, lessonIds) =>
  API.put(`/courses/${courseId}/lessons`, { lessonIds });
export const getCoursesByTutor = (tutorId) =>
  API.get(`/courses/tutor/${tutorId}`);


// =====================
// Enrollment Endpoints
// =====================
export const createEnrollment = (data) => API.post("/enrollments", data);
export const getEnrollmentsByChild = (childId) =>
  API.get(`/enrollments/child/${childId}`);
export const getEnrollmentsByTutor = (tutorId) =>
  API.get(`/enrollments/tutor/${tutorId}`);
export const updateEnrollment = (enrollmentId, data) =>
  API.put(`/enrollments/${enrollmentId}`, data);
export const getEnrollmentsByParent = (parentId) => API.get(`/enrollments/parent/${parentId}`);


// =====================
// Lesson Endpoints
// =====================
export const createLesson = (lessonData) => API.post("/lessons", lessonData);
export const getLessonsByGrade = (grade) => API.get(`/lessons/grade/${grade}`);
export const getLessonsByTutor = (tutorId) =>
  API.get(`/lessons/tutor/${tutorId}`);
export const updateLesson = (lessonId, lessonData) =>
  API.put(`/lessons/${lessonId}`, lessonData);
export const assignLesson = (lessonId, studentIds) =>
  API.post(`/lessons/${lessonId}/assign`, { studentIds });


// =====================
// Progress Endpoints
// =====================
export const createProgress = (data) => API.post("/progress", data);
export const updateProgress = (progressId, updates) =>
  API.put(`/progress/${progressId}`, updates);
export const getProgressByChild = (childId) =>
  API.get(`/progress/child/${childId}`);
export const getProgressByCourse = (courseId) =>
  API.get(`/progress/course/${courseId}`);
export const getProgressByEnrollment = (enrollmentId) =>
  API.get(`/progress/enrollment/${enrollmentId}`);


// =====================
// Admin Endpoints
// =====================
export const verifyTutor = (tutorId) =>
  API.put(`/admin/verify-tutor/${tutorId}`);
export const getUnverifiedTutors = () => API.get("/admin/unverified-tutors");
export const getAllUsers = () => API.get("/admin/users");
export const deleteUser = (userId) => API.delete(`/admin/users/${userId}`);