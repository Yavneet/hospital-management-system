const BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

export function getToken() {
	return localStorage.getItem('hms_token');
}

export function getRole() {
	return localStorage.getItem('hms_role');
}

export function getName() {
	return localStorage.getItem('hms_name');
}

export function loginSave(token, role, name) {
	if (token) {
		localStorage.setItem('hms_token', token);
		localStorage.setItem('token', token);
	}
	if (role) {
		localStorage.setItem('hms_role', role);
		localStorage.setItem('role', role);
	}
	if (name) {
		localStorage.setItem('hms_name', name);
		localStorage.setItem('name', name);
	}
}

export function logout() {
	localStorage.removeItem('hms_token');
	localStorage.removeItem('token');
	localStorage.removeItem('hms_role');
	localStorage.removeItem('role');
	localStorage.removeItem('hms_name');
	localStorage.removeItem('name');
}

export async function apiFetch(path, options = {}) {
	const url = path.startsWith('http') ? path : `${BASE}${path.startsWith('/') ? '' : '/'}${path}`;
	const headers = options.headers ? { ...options.headers } : {};
	const token = getToken();
	if (token) headers['Authorization'] = `Bearer ${token}`;
	const opts = { ...options, headers };
	const res = await fetch(url, opts);
	if (!res.ok) {
		let body = null;
		try { body = await res.json(); } catch (e) { /* ignore */ }
		const msg = (body && body.message) || `Request failed: ${res.status}`;
		const err = new Error(msg);
		err.status = res.status;
		err.body = body;
		throw err;
	}
	try { return await res.json(); } catch (e) { return null; }
}
