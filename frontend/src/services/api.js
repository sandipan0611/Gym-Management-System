const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const handleResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) {
        throw { 
            message: data.message || 'Something went wrong', 
            status: response.status,
            notFound: data.notFound || false
        };
    }
    return data;
};

const getHeaders = (token) => {
    const headers = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

// ── AUTH ──────────────────────────────────────────────────────────────
export const login = (email, password) =>
    fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
    }).then(handleResponse);

export const register = (userData) =>
    fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(userData),
    }).then(handleResponse);

// ── PLANS ─────────────────────────────────────────────────────────────
export const getPlans = () =>
    fetch(`${BASE_URL}/plans`).then(handleResponse);

export const updatePlan = (token, id, price) =>
    fetch(`${BASE_URL}/plans/${id}`, {
        method: 'PUT',
        headers: getHeaders(token),
        body: JSON.stringify({ price }),
    }).then(handleResponse);

// ── SUBSCRIPTIONS ──────────────────────────────────────────────────────
export const getSubscriptions = (token) =>
    fetch(`${BASE_URL}/subscriptions`, {
        headers: getHeaders(token),
    }).then(handleResponse);

export const createSubscription = (token, payload) =>
    fetch(`${BASE_URL}/subscriptions`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify(payload),
    }).then(handleResponse);

// ── ATTENDANCE ────────────────────────────────────────────────────────
export const getAttendance = (token, memberId = null) => {
    const url = memberId ? `${BASE_URL}/attendance/${memberId}` : `${BASE_URL}/attendance`;
    return fetch(url, {
        headers: getHeaders(token),
    }).then(handleResponse);
};

export const markAttendance = (token, memberId = null) =>
    fetch(`${BASE_URL}/attendance`, {
        method: 'POST',
        headers: getHeaders(token),
        body: memberId ? JSON.stringify({ member_id: memberId }) : undefined,
    }).then(handleResponse);

// ── WORKOUTS ──────────────────────────────────────────────────────────
export const getWorkouts = (token) =>
    fetch(`${BASE_URL}/workouts`, {
        headers: getHeaders(token),
    }).then(handleResponse);

export const getMemberWorkouts = (token, memberId = null) => {
    const url = memberId ? `${BASE_URL}/workouts/member/${memberId}` : `${BASE_URL}/workouts/member`;
    return fetch(url, {
        headers: getHeaders(token),
    }).then(handleResponse);
};

export const assignWorkout = (token, payload) =>
    fetch(`${BASE_URL}/workouts`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify(payload),
    }).then(handleResponse);

// ── DASHBOARD ────────────────────────────────────────────────────────
export const getTrainerDashboard = (token) =>
    fetch(`${BASE_URL}/dashboard/trainer`, {
        headers: getHeaders(token),
    }).then(handleResponse);

export const getAdminDashboard = (token) =>
    fetch(`${BASE_URL}/dashboard/admin`, {
        headers: getHeaders(token),
    }).then(handleResponse);

// ── ADMIN ─────────────────────────────────────────────────────────────
export const getTrainers = (token) =>
    fetch(`${BASE_URL}/admin/trainers`, {
        headers: getHeaders(token),
    }).then(handleResponse);

export const getMembers = (token) =>
    fetch(`${BASE_URL}/admin/members`, {
        headers: getHeaders(token),
    }).then(handleResponse);

export const hireTrainer = (token, payload) =>
    fetch(`${BASE_URL}/admin/trainers`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify(payload),
    }).then(handleResponse);

export const fireTrainer = (token, userId) =>
    fetch(`${BASE_URL}/admin/trainers/${userId}/fire`, {
        method: 'PUT',
        headers: getHeaders(token),
    }).then(handleResponse);

export const replaceTrainer = (token, userId, payload) =>
    fetch(`${BASE_URL}/admin/trainers/${userId}/replace`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify(payload),
    }).then(handleResponse);

export const assignMember = (token, payload) =>
    fetch(`${BASE_URL}/admin/assignments`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify(payload),
    }).then(handleResponse);

// ── USER ──────────────────────────────────────────────────────────────
export const changePassword = (token, currentPassword, newPassword) =>
    fetch(`${BASE_URL}/users/password`, {
        method: 'PUT',
        headers: getHeaders(token),
        body: JSON.stringify({ currentPassword, newPassword }),
    }).then(handleResponse);

export const getProfile = (token) =>
    fetch(`${BASE_URL}/users/profile`, {
        headers: getHeaders(token),
    }).then(handleResponse);

export const updateProfile = (token, data) =>
    fetch(`${BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: getHeaders(token),
        body: JSON.stringify(data),
    }).then(handleResponse);

// ── HEALTH METRICS ────────────────────────────────────────────────────
export const getMetrics = (token) =>
    fetch(`${BASE_URL}/metrics`, {
        headers: getHeaders(token),
    }).then(handleResponse);

export const addMetric = (token, data) =>
    fetch(`${BASE_URL}/metrics`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify(data),
    }).then(handleResponse);

// ── ADMIN INTELLIGENCE ────────────────────────────────────────────────
export const getSuggestedTrainer = (token) =>
    fetch(`${BASE_URL}/admin/suggested-trainer`, {
        headers: getHeaders(token),
    }).then(handleResponse);
