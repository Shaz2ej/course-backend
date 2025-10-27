import { studentsApi, packagesApi, coursesApi, videosApi, purchasesApi, withdrawalsApi } from './apiClient';

// Utility function to convert timestamp to JavaScript Date
export const convertTimestamp = (timestamp) => {
  // If it's already a date string, return as is
  if (typeof timestamp === 'string') {
    return timestamp;
  }
  // If it's a timestamp object, convert to ISO string
  if (timestamp && typeof timestamp === 'object' && timestamp.seconds) {
    return new Date(timestamp.seconds * 1000).toISOString();
  }
  // Default to current date
  return new Date().toISOString();
};

// Students CRUD operations
export const getStudents = async () => {
  try {
    return await studentsApi.getAll();
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
};

export const getStudentById = async (id) => {
  try {
    return await studentsApi.getById(id);
  } catch (error) {
    console.error('Error fetching student:', error);
    throw error;
  }
};

export const createStudent = async (studentData) => {
  try {
    return await studentsApi.create(studentData);
  } catch (error) {
    console.error('Error creating student:', error);
    throw error;
  }
};

export const updateStudent = async (id, updates) => {
  try {
    return await studentsApi.update(id, updates);
  } catch (error) {
    console.error('Error updating student:', error);
    throw error;
  }
};

export const deleteStudent = async (id) => {
  try {
    return await studentsApi.delete(id);
  } catch (error) {
    console.error('Error deleting student:', error);
    throw error;
  }
};

// Packages CRUD operations
export const getPackages = async () => {
  try {
    return await packagesApi.getAll();
  } catch (error) {
    console.error('Error fetching packages:', error);
    throw error;
  }
};

export const getPackageById = async (id) => {
  try {
    return await packagesApi.getById(id);
  } catch (error) {
    console.error('Error fetching package:', error);
    throw error;
  }
};

export const createPackage = async (packageData) => {
  try {
    return await packagesApi.create(packageData);
  } catch (error) {
    console.error('Error creating package:', error);
    throw error;
  }
};

export const updatePackage = async (id, updates) => {
  try {
    return await packagesApi.update(id, updates);
  } catch (error) {
    console.error('Error updating package:', error);
    throw error;
  }
};

export const deletePackage = async (id) => {
  try {
    return await packagesApi.delete(id);
  } catch (error) {
    console.error('Error deleting package:', error);
    throw error;
  }
};

// Courses CRUD operations (as subcollection of packages)
export const getCoursesByPackageId = async (packageId) => {
  try {
    return await coursesApi.getByPackageId(packageId);
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

export const createCourseInPackage = async (packageId, courseData) => {
  try {
    return await coursesApi.create(packageId, courseData);
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

export const updateCourseInPackage = async (packageId, courseId, updates) => {
  try {
    return await coursesApi.update(packageId, courseId, updates);
  } catch (error) {
    console.error('Error updating course:', error);
    throw error;
  }
};

export const deleteCourseFromPackage = async (packageId, courseId) => {
  try {
    return await coursesApi.delete(packageId, courseId);
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
};

// Videos CRUD operations (as subcollection of courses)
export const getVideosByCourseId = async (packageId, courseId) => {
  try {
    return await videosApi.getByCourseId(packageId, courseId);
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }
};

export const createVideoInCourse = async (packageId, courseId, videoData) => {
  try {
    return await videosApi.create(packageId, courseId, videoData);
  } catch (error) {
    console.error('Error creating video:', error);
    throw error;
  }
};

export const updateVideoInCourse = async (packageId, courseId, videoId, updates) => {
  try {
    return await videosApi.update(packageId, courseId, videoId, updates);
  } catch (error) {
    console.error('Error updating video:', error);
    throw error;
  }
};

export const deleteVideoFromCourse = async (packageId, courseId, videoId) => {
  try {
    return await videosApi.delete(packageId, courseId, videoId);
  } catch (error) {
    console.error('Error deleting video:', error);
    throw error;
  }
};

// Purchases CRUD operations
export const getPurchases = async () => {
  try {
    return await purchasesApi.getAll();
  } catch (error) {
    console.error('Error fetching purchases:', error);
    throw error;
  }
};

export const createPurchase = async (purchaseData) => {
  try {
    return await purchasesApi.create(purchaseData);
  } catch (error) {
    console.error('Error creating purchase:', error);
    throw error;
  }
};

export const updatePurchase = async (id, updates) => {
  try {
    return await purchasesApi.update(id, updates);
  } catch (error) {
    console.error('Error updating purchase:', error);
    throw error;
  }
};

// Withdrawals CRUD operations
export const getWithdrawals = async () => {
  try {
    return await withdrawalsApi.getAll();
  } catch (error) {
    console.error('Error fetching withdrawals:', error);
    throw error;
  }
};

export const updateWithdrawal = async (id, updates) => {
  try {
    return await withdrawalsApi.update(id, updates);
  } catch (error) {
    console.error('Error updating withdrawal:', error);
    throw error;
  }
};