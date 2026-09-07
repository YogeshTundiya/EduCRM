/**
 * API client to communicate with EduCRM Backend REST API
 * Base URL: http://localhost:5000/api/v1
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('educrm_token') || localStorage.getItem('technoglobe_token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(options?.headers || {})
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export const EduCrmApi = {
  // Auth
  login: (email: string, password: string) =>
    fetchApi<{ admin: any; accessToken: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),

  register: (data: { name: string; email: string; password: string; role?: string }) =>
    fetchApi<{ admin: any; accessToken: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  getMe: () => fetchApi<{ data: any }>('/auth/me'),

  // Courses
  getCourses: (type?: string) =>
    fetchApi<{ data: any[] }>(`/courses${type ? `?type=${type}` : ''}`),

  createCourse: (data: any) =>
    fetchApi<{ data: any }>('/courses', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  // Professors
  getProfessors: (search?: string) =>
    fetchApi<{ data: any[] }>(`/professors${search ? `?search=${encodeURIComponent(search)}` : ''}`),

  createProfessor: (data: any) =>
    fetchApi<{ data: any }>('/professors', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  // Students
  getStudents: (params?: { search?: string; courseId?: string; professorId?: string; status?: string }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.courseId) query.set('courseId', params.courseId);
    if (params?.professorId) query.set('professorId', params.professorId);
    if (params?.status) query.set('status', params.status);
    return fetchApi<{ data: any[]; meta: any }>(`/students?${query.toString()}`);
  },

  createStudent: (data: { name: string; email: string; phone?: string; courseId: string; professorId?: string; startDate: string }) =>
    fetchApi<{ data: any }>('/students', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  // Attendance
  getAttendanceRoster: (courseId: string, date: string) =>
    fetchApi<{ data: any[] }>(`/attendance?courseId=${courseId}&date=${date}`),

  markAttendance: (data: { studentId: string; courseId: string; date: string; status: string; notes?: string }) =>
    fetchApi<{ data: any }>('/attendance', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  // Dashboard
  getDashboardStats: () =>
    fetchApi<{ data: any }>('/dashboard/stats')
};

export const TechnoglobeApi = EduCrmApi;
