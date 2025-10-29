// ⚠️ WARNING: API client for communicating with the backend server.
// ⚠️ WARNING: Ensure VITE_API_URL environment variable is set in production.
// API client for communicating with the backend server
// Updated to ensure Netlify build works correctly
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper function to handle API requests
const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request error for ${endpoint}:`, error);
    throw error;
  }
};

// Students API
export const studentsApi = {
  getAll: () => apiRequest('/students'),
  getById: (id) => apiRequest(`/students/${id}`),
  create: (data) => apiRequest('/students', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiRequest(`/students/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiRequest(`/students/${id}`, {
    method: 'DELETE',
  }),
};

// Packages API
export const packagesApi = {
  getAll: () => apiRequest('/packages'),
  getById: (id) => apiRequest(`/packages/${id}`),
  create: (data) => apiRequest('/packages', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiRequest(`/packages/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiRequest(`/packages/${id}`, {
    method: 'DELETE',
  }),
};

// Courses API
export const coursesApi = {
  getByPackageId: (packageId) => apiRequest(`/packages/${packageId}/courses`),
  create: (packageId, data) => apiRequest(`/packages/${packageId}/courses`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (packageId, courseId, data) => apiRequest(`/packages/${packageId}/courses/${courseId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (packageId, courseId) => apiRequest(`/packages/${packageId}/courses/${courseId}`, {
    method: 'DELETE',
  }),
};

// Videos API
export const videosApi = {
  getByCourseId: (packageId, courseId) => apiRequest(`/packages/${packageId}/courses/${courseId}/videos`),
  create: (packageId, courseId, data) => apiRequest(`/packages/${packageId}/courses/${courseId}/videos`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (packageId, courseId, videoId, data) => apiRequest(`/packages/${packageId}/courses/${courseId}/videos/${videoId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (packageId, courseId, videoId) => apiRequest(`/packages/${packageId}/courses/${courseId}/videos/${videoId}`, {
    method: 'DELETE',
  }),
};

// Purchases API
export const purchasesApi = {
  getAll: () => apiRequest('/purchases'),
  create: (data) => apiRequest('/purchases', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiRequest(`/purchases/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
};

// Withdrawals API
export const withdrawalsApi = {
  getAll: () => apiRequest('/withdrawals'),
  update: (id, data) => apiRequest(`/withdrawals/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
};