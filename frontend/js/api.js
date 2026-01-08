// API Configuration
const API = 'http://localhost:5000/api';

let token = localStorage.getItem('token');

async function apiCall(endpoint, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API}${endpoint}`, {
        ...options,
        headers
    });

    return response.json();
}

// Auth API
const authAPI = {
    register: (username, email, password) =>
        apiCall('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, email, password })
        }),
    
    login: (email, password) =>
        apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        }),
    
    getMe: () => apiCall('/auth/me')
};

// Contacts API
const contactsAPI = {
    getAll: (page = 1, search = '', sort = 'created_at') =>
        apiCall(`/contacts?page=${page}&search=${search}&sort_by=${sort}`),
    
    get: (id) => apiCall(`/contacts/${id}`),
    
    create: (name, email, phone, address) =>
        apiCall('/contacts', {
            method: 'POST',
            body: JSON.stringify({ name, email, phone, address })
        }),
    
    update: (id, data) =>
        apiCall(`/contacts/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),
    
    delete: (id) =>
        apiCall(`/contacts/${id}`, { method: 'DELETE' })
};
