/**
 * Centralized API service layer.
 * All fetch calls go through this file — no direct fetch() in components.
 * Token is injected automatically on every authenticated request.
 */

const BASE_URL = 'http://localhost:5000/api';

const getHeaders = (token) => ({
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

// Throws an object with { status, message, data } on non-ok responses
const handleResponse = async (res) => {
    const data = await res.json();
    if (!res.ok) {
        const err = new Error(data.message || 'Request failed');
        err.status = res.status;
        err.data = data;
        throw err;
    }
    return data;
};

// ── AUTH ──────────────────────────────────────────────────────────────
export const loginUser = (email, password) =>
    fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
    }).then(handleResponse);

export const registerUser = (payload) =>
    fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload),
    }).then(handleResponse);

// ── PLANS ─────────────────────────────────────────────────────────────
export const fetchPlans = () =>
    fetch(`${BASE_URL}/plans`).then(handleResponse);

export const updatePlanPrice = (token, id, price) =>
    fetch(`${BASE_URL}/plans/${id}`, {
        method: 'PUT',
        headers: getHeaders(token),
        body: JSON.stringify({ price }),
    }).then(handleResponse);

// ── SUBSCRIPTIONS ─────────────────────────────────────────────────────
export const fetchSubscriptions = (token) =>
    fetch(`${BASE_URL}/subscriptions`, { headers: getHeaders(token) }).then(handleResponse);

export const joinPlan = (token, plan_id) =>
    fetch(`${BASE_URL}/subscriptions`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify({ plan_id }),
    }).then(handleResponse);

// ── ATTENDANCE ────────────────────────────────────────────────────────
export const fetchAttendance = (token) =>
    fetch(`${BASE_URL}/attendance`, { headers: getHeaders(token) }).then(handleResponse);

export const checkIn = (token) =>
    fetch(`${BASE_URL}/attendance`, {
        method: 'POST',
        headers: getHeaders(token),
    }).then(handleResponse);

// ── WORKOUTS ──────────────────────────────────────────────────────────
export const fetchMemberWorkout = (token) =>
    fetch(`${BASE_URL}/workouts/member`, { headers: getHeaders(token) }).then(handleResponse);

export const fetchAllWorkouts = (token) =>
    fetch(`${BASE_URL}/workouts`, { headers: getHeaders(token) }).then(handleResponse);

// ── DASHBOARD ─────────────────────────────────────────────────────────
export const fetchAdminDashboard = (token) =>
    fetch(`${BASE_URL}/dashboard/admin`, { headers: getHeaders(token) }).then(handleResponse);

export const fetchTrainerDashboard = (token) =>
    fetch(`${BASE_URL}/dashboard/trainer`, { headers: getHeaders(token) }).then(handleResponse);

// ── ADMIN ─────────────────────────────────────────────────────────────
export const fetchAdminTrainers = (token) =>
    fetch(`${BASE_URL}/admin/trainers`, { headers: getHeaders(token) }).then(handleResponse);

export const fetchAdminMembers = (token) =>
    fetch(`${BASE_URL}/admin/members`, { headers: getHeaders(token) }).then(handleResponse);

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
