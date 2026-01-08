// Contacts Module
const contactsUI = {
    form: document.getElementById('contactForm'),
    nameInput: document.getElementById('contactName'),
    emailInput: document.getElementById('contactEmail'),
    phoneInput: document.getElementById('contactPhone'),
    addressInput: document.getElementById('contactAddress'),
    submitBtn: document.getElementById('submitBtn'),
    cancelBtn: document.getElementById('cancelBtn'),
    searchInput: document.getElementById('searchInput'),
    sortSelect: document.getElementById('sortSelect'),
    list: document.getElementById('contactsList'),
    count: document.getElementById('contactCount'),
    pagination: document.getElementById('pagination'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
    pageInfo: document.getElementById('pageInfo'),
    formError: document.getElementById('formError')
};

let currentPage = 1;
let editingId = null;

// Load contacts
async function loadContacts() {
    const search = contactsUI.searchInput.value;
    const sort = contactsUI.sortSelect.value;
    contactsUI.list.innerHTML = '<p class="empty">Loading contacts…</p>';
    const res = await contactsAPI.getAll(currentPage, search, sort);
    if (!res.success) {
        contactsUI.list.innerHTML = '<p class="empty">Could not load contacts.</p>';
        window.showToast(res.message || 'Failed to load contacts', 'error');
        return;
    }
    displayContacts(res.data.contacts);
    updatePagination(res.data.pagination);
}

// Display contacts
function displayContacts(contacts) {
    contactsUI.count.textContent = contacts.length;
    
    if (contacts.length === 0) {
        contactsUI.list.innerHTML = '<p class="empty">No contacts. Add your first one!</p>';
        return;
    }
    
    contactsUI.list.innerHTML = contacts.map(c => `
        <div class="contact-card">
            <div class="contact-name">${c.name}</div>
            <div class="contact-info"><strong>Email:</strong> ${c.email}</div>
            <div class="contact-info"><strong>Phone:</strong> ${c.phone}</div>
            ${c.address ? `<div class="contact-info"><strong>Address:</strong> ${c.address}</div>` : ''}
            <div class="contact-actions">
                <button class="btn-small btn-edit" onclick="editContact(${c.id})">Edit</button>
                <button class="btn-small btn-delete" onclick="deleteContact(${c.id}, this)">Delete</button>
            </div>
        </div>
    `).join('');
}

// Update pagination
function updatePagination(pagination) {
    if (pagination.pages > 1) {
        contactsUI.pagination.classList.remove('hidden');
        contactsUI.pageInfo.textContent = `Page ${pagination.page} of ${pagination.pages}`;
        contactsUI.prevBtn.disabled = pagination.page === 1;
        contactsUI.nextBtn.disabled = pagination.page === pagination.pages;
    } else {
        contactsUI.pagination.classList.add('hidden');
    }
}

// Add/Update contact
contactsUI.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = {
        name: contactsUI.nameInput.value,
        email: contactsUI.emailInput.value,
        phone: contactsUI.phoneInput.value,
        address: contactsUI.addressInput.value
    };
    
    let res;
    try {
        window.setLoading(contactsUI.submitBtn, true, editingId ? 'Updating…' : 'Adding…');
        if (editingId) {
            res = await contactsAPI.update(editingId, data);
            editingId = null;
            contactsUI.submitBtn.textContent = 'Add Contact';
            contactsUI.cancelBtn.classList.add('hidden');
        } else {
            res = await contactsAPI.create(data.name, data.email, data.phone, data.address);
        }
        if (!res.success) {
            contactsUI.formError.textContent = res.message;
            window.showToast(res.message || 'Failed to save contact', 'error');
            return;
        }
        contactsUI.formError.textContent = '';
        contactsUI.form.reset();
        currentPage = 1;
        window.showToast('Contact saved', 'success');
        loadContacts();
    } finally {
        window.setLoading(contactsUI.submitBtn, false);
    }
});

// Edit contact
async function editContact(id) {
    const res = await contactsAPI.get(id);
    const c = res.data;
    
    contactsUI.nameInput.value = c.name;
    contactsUI.emailInput.value = c.email;
    contactsUI.phoneInput.value = c.phone;
    contactsUI.addressInput.value = c.address || '';
    
    editingId = id;
    contactsUI.submitBtn.textContent = 'Update Contact';
    contactsUI.cancelBtn.classList.remove('hidden');
    contactsUI.form.scrollIntoView({ behavior: 'smooth' });
}

// Cancel edit
contactsUI.cancelBtn.addEventListener('click', () => {
    editingId = null;
    contactsUI.form.reset();
    contactsUI.submitBtn.textContent = 'Add Contact';
    contactsUI.cancelBtn.classList.add('hidden');
});

// Delete contact
async function deleteContact(id, btn) {
    if (!confirm('Delete this contact?')) return;
    try {
        window.setLoading(btn, true, 'Deleting…');
        const res = await contactsAPI.delete(id);
        if (res.success) {
            window.showToast('Contact deleted', 'info');
            loadContacts();
        } else {
            window.showToast(res.message || 'Delete failed', 'error');
        }
    } finally {
        window.setLoading(btn, false);
    }
}

// Search
contactsUI.searchInput.addEventListener('input', () => {
    currentPage = 1;
    loadContacts();
});

// Sort
contactsUI.sortSelect.addEventListener('change', () => {
    currentPage = 1;
    loadContacts();
});

// Pagination
contactsUI.prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        loadContacts();
    }
});

contactsUI.nextBtn.addEventListener('click', () => {
    currentPage++;
    loadContacts();
});
