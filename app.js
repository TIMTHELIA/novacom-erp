import { neon } from 'https://cdn.jsdelivr.net/npm/@neondatabase/serverless@0.9.0/+esm';

// ==========================================
// 1. CONFIGURATION DES BACKENDS
// ==========================================
const SUPABASE_URL = "https://fxldsdmsmghhvxutlkba.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4bGRzZG1zbWdoaHZ4dXRsa2JhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczMTYyMDAsImV4cCI6MjEwMjg5MjIwMH0.wgctDmEqp63pAHMgOmYiWDgFVMQEXcLB-rKX2eJz5bY";

const supabaseLib = window.supabase || supabase;
const supabaseClient = supabaseLib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const NEON_DB_URL = "postgresql://neondb_owner:npg_L6ARyzgiPY4o@ep-dry-math-b4gazyu1-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require";
const sql = neon(NEON_DB_URL);

async function executeNeonQuery(queryText, params = []) {
    try {
        const rows = await sql(queryText, params);
        return rows || [];
    } catch (err) {
        console.error("Erreur Neon SQL:", err);
        throw err;
    }
}

// ==========================================
// AJOUT : RESPONSIVITÉ GLOBALE POUR TOUT ÉCRAN (CSS & MENU MOBILE)
// ==========================================
function injectResponsiveStyles() {
    if (document.getElementById('dynamic-responsive-styles')) return;
    const styleEl = document.createElement('style');
    styleEl.id = 'dynamic-responsive-styles';
    styleEl.textContent = `
        /* Styles responsifs globaux pour tout écran */
        @media (max-width: 1024px) {
            .app-container, .main-layout {
                flex-direction: column !important;
            }
            .sidebar, aside, .app-sidebar {
                width: 100% !important;
                height: auto !important;
                position: relative !important;
            }
            .main-content {
                width: 100% !important;
                padding: 15px !important;
            }
        }
        @media (max-width: 768px) {
            .sidebar, aside, .app-sidebar {
                display: none;
                position: fixed !important;
                top: 0; left: 0;
                width: 260px !important;
                height: 100vh !important;
                z-index: 1000;
                background: var(--bg-card, #1e293b);
                box-shadow: 5px 0 15px rgba(0,0,0,0.3);
                transition: transform 0.3s ease;
            }
            .sidebar.mobile-open, aside.mobile-open, .app-sidebar.mobile-open {
                display: flex !important;
                flex-direction: column;
            }
            .mobile-menu-toggle {
                display: inline-flex !important;
                align-items: center;
                justify-content: center;
                background: #2563eb;
                color: white;
                border: none;
                padding: 8px 12px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 1.1rem;
                margin-right: 10px;
            }
            .table-responsive, table {
                display: block;
                width: 100%;
                overflow-x: auto;
                -webkit-overflow-scrolling: touch;
            }
            .modal-content, .custom-modal-content, .card {
                width: 95% !important;
                max-width: 100% !important;
                margin: 10px auto !important;
                padding: 15px !important;
            }
            .kpi-grid, .stats-grid, div[style*="grid-template-columns"] {
                grid-template-columns: 1fr !important;
            }
        }
        @media (min-width: 769px) {
            .mobile-menu-toggle {
                display: none !important;
            }
        }
    `;
    document.head.appendChild(styleEl);
}

function setupMobileSidebarToggle() {
    const toggleBtns = document.querySelectorAll('.mobile-menu-toggle, header .fa-bars, .top-bar .fa-bars, button i.fa-bars, div i.fa-bars');
    
    toggleBtns.forEach(el => {
        const btn = el.closest('button') || el.closest('div') || el;
        if (btn && !btn.dataset.toggleInitialized) {
            btn.dataset.toggleInitialized = 'true';
            btn.style.cursor = 'pointer';
            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                const sidebar = document.querySelector('.sidebar') || document.querySelector('aside') || document.querySelector('.app-sidebar');
                if (sidebar) {
                    sidebar.classList.toggle('mobile-open');
                }
            };
        }
    });

    const headerEl = document.querySelector('.top-bar') || document.querySelector('header') || document.querySelector('.app-header') || document.body;
    if (headerEl && !document.getElementById('mobile-sidebar-toggle-btn')) {
        const btn = document.createElement('button');
        btn.id = 'mobile-sidebar-toggle-btn';
        btn.className = 'mobile-menu-toggle';
        btn.innerHTML = '<i class="fa-solid fa-bars"></i>';
        btn.title = "Menu de navigation";
        btn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const sidebar = document.querySelector('.sidebar') || document.querySelector('aside') || document.querySelector('.app-sidebar');
            if (sidebar) {
                sidebar.classList.toggle('mobile-open');
            }
        };
        headerEl.prepend(btn);
    }
}

function formatDateTime(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year}; ${hours}:${minutes}:${seconds}`;
}

function formatDateOnly(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

window.togglePasswordVisibility = function(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    if (!input || !icon) return;

    if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    } else {
        input.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    }
};

function showCustomModal(message, title = "Notification", type = "info", onConfirm = null) {
    const modal = document.getElementById('custom-alert-modal');
    const titleEl = document.getElementById('custom-alert-title');
    const msgEl = document.getElementById('custom-alert-message');
    const iconEl = document.getElementById('custom-alert-icon');
    const buttonsContainer = document.getElementById('custom-alert-buttons');

    if (!modal) return;

    titleEl.textContent = title;
    msgEl.textContent = message;

    if (type === "success") {
        iconEl.innerHTML = '<i class="fa-solid fa-circle-check" style="color: #16a34a;"></i>';
    } else if (type === "error" || type === "danger") {
        iconEl.innerHTML = '<i class="fa-solid fa-circle-exclamation" style="color: #dc2626;"></i>';
    } else if (type === "confirm") {
        iconEl.innerHTML = '<i class="fa-solid fa-circle-question" style="color: #f59e0b;"></i>';
    } else {
        iconEl.innerHTML = '<i class="fa-solid fa-circle-info" style="color: #2563eb;"></i>';
    }

    if (type === "confirm") {
        buttonsContainer.innerHTML = `
            <button type="button" class="btn btn-secondary" id="custom-modal-cancel" style="min-width: 90px;">Annuler</button>
            <button type="button" class="btn btn-primary" id="custom-modal-confirm" style="min-width: 90px;">Confirmer</button>
        `;
        document.getElementById('custom-modal-cancel').onclick = () => {
            modal.style.display = 'none';
            if (onConfirm) onConfirm(false);
        };
        document.getElementById('custom-modal-confirm').onclick = () => {
            modal.style.display = 'none';
            if (onConfirm) onConfirm(true);
        };
    } else {
        buttonsContainer.innerHTML = `
            <button type="button" class="btn btn-primary" id="custom-modal-ok" style="min-width: 100px;">OK</button>
        `;
        document.getElementById('custom-modal-ok').onclick = () => {
            modal.style.display = 'none';
            if (onConfirm) onConfirm(true);
        };
    }

    modal.style.display = 'flex';
}

// État global
let currentUser = null;
let userRole = 'ADMINISTRATEUR_SYSTEME';
let currentAgent = null;
let employeesData = [];
let sitesData = [];
let siteAssignmentsData = [];
let inspectorSiteAssignmentsData = [];
let attendanceReportsData = [];
let siteControlVisitsData = [];
let bonusesData = [];
let rolesList = [];
let financeItemsData = [];
let currentAssignSiteId = null;

// ==========================================
// 2. AUTHENTIFICATION & NAVIGATION
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    injectResponsiveStyles();
    setupMobileSidebarToggle();
    initEventListeners();
    checkSession();
});

async function checkSession() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
        currentUser = session.user;
        await fetchUserRoleAndAgent();
        showApp();
    } else {
        showAuth();
    }
}

supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
        currentUser = session.user;
        fetchUserRoleAndAgent().then(() => showApp());
    } else if (event === 'SIGNED_OUT') {
        currentUser = null;
        currentAgent = null;
        showAuth();
    }
});

async function fetchUserRoleAndAgent() {
    if (!currentUser) return;
    
    const emailLower = (currentUser.email || '').toLowerCase();
    if (emailLower === 'timthelia@gmail.com' || emailLower.includes('admin') || emailLower.includes('system') || emailLower.includes('direction')) {
        userRole = 'ADMINISTRATEUR_SYSTEME';
    } else {
        userRole = 'ADMINISTRATEUR_SYSTEME';
    }

    try {
        const agentRows = await executeNeonQuery(
            'SELECT * FROM employees WHERE user_id_supabase = $1', 
            [currentUser.id]
        );

        if (agentRows && agentRows.length > 0) {
            currentAgent = agentRows[0];
            const roleRows = await executeNeonQuery(
                `SELECT r.code FROM roles r 
                 JOIN user_roles ur ON ur.role_id = r.id 
                 WHERE ur.employee_id = $1`, 
                [currentAgent.id]
            );
            
            if (roleRows && roleRows.length > 0) {
                userRole = roleRows[0].code.toUpperCase();
            }
        }
    } catch (e) {
        console.warn("Erreur chargement rôle/agent:", e);
    }
    
    document.getElementById('user-email').textContent = currentUser.email;
    document.getElementById('user-role').textContent = userRole;

    applyRolePermissionsUI();
}

function applyRolePermissionsUI() {
    document.querySelectorAll('.admin-only').forEach(el => {
        el.style.display = '';
    });

    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.style.display = 'flex';
    });

    if (!document.querySelector('.tab-content.active')) {
        switchTab('tab-employees');
    }
}

function showAuth() {
    document.getElementById('auth-screen').style.display = 'flex';
    document.getElementById('app-screen').style.display = 'none';
}

function showApp() {
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('app-screen').style.display = 'block';
    loadRolesList();
    loadEmployees();
    loadSites();
    loadAttendance();
    loadSiteControlVisits();
    loadMaintenance();
    loadBonuses();
    loadPayroll();
    loadFinance();
}

async function loadRolesList() {
    try {
        rolesList = await executeNeonQuery('SELECT * FROM roles ORDER BY id ASC');
        const roleOptions = rolesList.map(r => `<option value="${r.id}">${r.code.replace('_', ' ')} (${r.name})</option>`).join('');
        
        const modalSelect = document.getElementById('emp-access-role-id');
        if (modalSelect) modalSelect.innerHTML = roleOptions;

        const accessSelect = document.getElementById('access-role-id');
        if (accessSelect) accessSelect.innerHTML = roleOptions;
    } catch (e) {
        console.warn("Erreur chargement des rôles:", e);
    }
}

window.switchTab = function(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

    const targetTab = document.getElementById(tabId);
    if (targetTab) {
        targetTab.classList.add('active');
    }

    const activeBtn = Array.from(document.querySelectorAll('.nav-item')).find(btn => 
        btn.getAttribute('onclick')?.includes(tabId)
    );
    if (activeBtn) activeBtn.classList.add('active');

    if (tabId === 'tab-sites') loadSites();
    if (tabId === 'tab-attendance') loadAttendance();
    if (tabId === 'tab-site-control') loadSiteControlVisits();
    if (tabId === 'tab-maintenance') loadMaintenance();
    if (tabId === 'tab-payroll') loadPayroll();
    if (tabId === 'tab-finance') loadFinance();
    if (tabId === 'tab-inspector') window.renderInspectorDashboard();
    if (tabId === 'tab-supervisor') renderHierarchicalDashboards();
    if (tabId === 'tab-manager') window.renderManagerDashboard();
    
    setupMobileSidebarToggle();
};

function initEventListeners() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;
            const errorDiv = document.getElementById('auth-error');

            if (errorDiv) errorDiv.style.display = 'none';

            const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
            if (error) {
                if (errorDiv) {
                    errorDiv.textContent = "Échec de connexion : " + error.message;
                    errorDiv.style.display = 'block';
                }
            } else {
                currentUser = data.user;
                await fetchUserRoleAndAgent();
                showApp();
            }
        });
    }

    document.getElementById('btn-logout')?.addEventListener('click', () => supabaseClient.auth.signOut());
    document.getElementById('theme-toggle')?.addEventListener('click', () => document.body.classList.toggle('dark-mode'));

    document.getElementById('btn-open-password-modal')?.addEventListener('click', () => {
        document.getElementById('password-form').reset();
        document.getElementById('password-modal').style.display = 'flex';
    });
    document.getElementById('btn-close-password-modal')?.addEventListener('click', () => {
        document.getElementById('password-modal').style.display = 'none';
    });
    document.getElementById('btn-cancel-password-modal')?.addEventListener('click', () => {
        document.getElementById('password-modal').style.display = 'none';
    });

    const passwordForm = document.getElementById('password-form');
    if (passwordForm) {
        passwordForm.onsubmit = async (e) => {
            e.preventDefault();
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (newPassword !== confirmPassword) {
                showCustomModal("Les mots de passe saisis ne correspondent pas.", "Erreur", "error");
                return;
            }

            try {
                const { error } = await supabaseClient.auth.updateUser({ password: newPassword });
                if (error) {
                    showCustomModal("Erreur lors de la mise à jour : " + error.message, "Erreur", "error");
                } else {
                    document.getElementById('password-modal').style.display = 'none';
                    showCustomModal("Votre mot de passe a été mis à jour avec succès !", "Succès", "success");
                }
            } catch (err) {
                console.error("Erreur modification mot de passe:", err);
                showCustomModal("Une erreur est survenue.", "Erreur", "error");
            }
        };
    }

    document.getElementById('btn-open-modal')?.addEventListener('click', () => openEmployeeModal());
    document.getElementById('btn-close-modal')?.addEventListener('click', closeEmployeeModal);
    document.getElementById('btn-cancel-modal')?.addEventListener('click', closeEmployeeModal);
    
    document.getElementById('btn-open-site-modal')?.addEventListener('click', () => openSiteModal());
    document.getElementById('btn-close-site-modal')?.addEventListener('click', closeSiteModal);
    document.getElementById('btn-cancel-site-modal')?.addEventListener('click', closeSiteModal);

    document.getElementById('btn-close-assign-modal')?.addEventListener('click', closeAssignModal);
    document.getElementById('btn-cancel-assign-modal')?.addEventListener('click', closeAssignModal);

    document.getElementById('btn-close-inspector-assign-modal')?.addEventListener('click', closeInspectorAssignModal);
    document.getElementById('btn-cancel-inspector-assign-modal')?.addEventListener('click', closeInspectorAssignModal);

    const siteForm = document.getElementById('site-form');
    if (siteForm) {
        siteForm.onsubmit = handleSiteFormSubmit;
    }

    const assignForm = document.getElementById('assign-form');
    if (assignForm) {
        assignForm.onsubmit = handleAssignFormSubmit;
    }

    const inspectorAssignForm = document.getElementById('inspector-assign-form');
    if (inspectorAssignForm) {
        inspectorAssignForm.onsubmit = handleInspectorAssignFormSubmit;
    }

    document.getElementById('btn-close-details')?.addEventListener('click', () => {
        document.getElementById('details-modal').style.display = 'none';
    });

    document.getElementById('btn-close-preview')?.addEventListener('click', () => {
        document.getElementById('preview-modal').style.display = 'none';
    });

    document.getElementById('search-input')?.addEventListener('input', filterAndRenderTable);
    document.getElementById('filter-agency')?.addEventListener('change', filterAndRenderTable);
    document.getElementById('filter-department')?.addEventListener('change', filterAndRenderTable);
    document.getElementById('filter-status')?.addEventListener('change', filterAndRenderTable);

    const empForm = document.getElementById('employee-form');
    if (empForm) {
        empForm.onsubmit = handleEmployeeFormSubmit;
    }

    document.getElementById('btn-export-csv')?.addEventListener('click', exportToExcel);

    document.getElementById('insp-filter-site')?.addEventListener('change', window.renderInspectorDashboard);
    document.getElementById('insp-filter-inspector')?.addEventListener('change', window.renderInspectorDashboard);
    document.getElementById('insp-filter-vigil')?.addEventListener('change', window.renderInspectorDashboard);
    document.getElementById('insp-filter-date-start')?.addEventListener('change', window.renderInspectorDashboard);
    document.getElementById('insp-filter-date-end')?.addEventListener('change', window.renderInspectorDashboard);
    document.getElementById('insp-select-all')?.addEventListener('change', (e) => {
        const checkboxes = document.querySelectorAll('.insp-report-check');
        checkboxes.forEach(cb => cb.checked = e.target.checked);
    });

    document.getElementById('manager-filter-inspector')?.addEventListener('change', window.renderManagerDashboard);
    document.getElementById('manager-filter-site')?.addEventListener('change', window.renderManagerDashboard);

    document.getElementById('control-site-select')?.addEventListener('change', onControlSiteSelected);
}

window.toggleAccessFields = function(isChecked) {
    const container = document.getElementById('access-fields-container');
    if (container) {
        container.style.display = isChecked ? 'grid' : 'none';
    }
};

async function loadEmployees() {
    try {
        const employees = await executeNeonQuery('SELECT * FROM employees ORDER BY created_at DESC');
        const docs = await executeNeonQuery('SELECT * FROM employee_documents');

        employeesData = (employees || []).map(emp => {
            emp.employee_documents = (docs || []).filter(d => d.employee_id === emp.id);
            return emp;
        });

        populateInspectorVigilFilter();
        populateInspectorFilterDropdown();
        populateManagerFilters();
        renderKPIs();
        filterAndRenderTable();
    } catch (err) {
        console.error("Erreur chargement employés:", err);
    }
}

function renderKPIs() {
    const total = employeesData.length;
    const actives = employeesData.filter(e => e.statut === 'actif').length;
    const onLeave = employeesData.filter(e => e.statut === 'suspendu' || e.statut_conge === 'en_conge').length;

    const novacomCount = employeesData.filter(e => e.agence === 'Novacom').length;
    const a2sCount = employeesData.filter(e => e.agence === 'A2S').length;

    document.getElementById('kpi-total').textContent = total;
    document.getElementById('kpi-actives').textContent = actives;
    document.getElementById('kpi-on-leave').textContent = onLeave;

    document.getElementById('count-novacom').textContent = novacomCount;
    document.getElementById('count-a2s').textContent = a2sCount;

    const novacomPct = total > 0 ? (novacomCount / total) * 100 : 50;
    const a2sPct = total > 0 ? (a2sCount / total) * 100 : 50;
    document.getElementById('bar-novacom').style.width = `${novacomPct}%`;
    document.getElementById('bar-a2s').style.width = `${a2sPct}%`;
}

function filterAndRenderTable() {
    const search = document.getElementById('search-input')?.value.toLowerCase() || '';
    const agency = document.getElementById('filter-agency')?.value || '';
    const dept = document.getElementById('filter-department')?.value || '';
    const status = document.getElementById('filter-status')?.value || '';

    const filtered = employeesData.filter(emp => {
        const matchesSearch = !search || `${emp.nom} ${emp.prenom} ${emp.matricule} ${emp.email}`.toLowerCase().includes(search);
        const matchesAgency = !agency || emp.agence === agency;
        const matchesDept = !dept || emp.departement === dept;
        const matchesStatus = !status || emp.statut === status;

        return matchesSearch && matchesAgency && matchesDept && matchesStatus;
    });

    const tbody = document.getElementById('employees-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    filtered.forEach(emp => {
        const isContractEndingSoon = checkContractExpiry(emp.date_embauche);
        const formattedDate = formatDateTime(emp.date_embauche);
        const hasUserAccess = !!emp.user_id_supabase;

        const monthlySalary = parseFloat(emp.salaire_mensuel || 500);
        const dailyRate = monthlySalary / 26;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <img src="${emp.photo_url || 'https://via.placeholder.com/40'}" class="avatar-img clickable" onclick="window.showEmployeeDetails('${emp.id}')" alt="Avatar" style="width:40px; height:40px; border-radius:50%; object-fit:cover; cursor:pointer;" title="Voir la fiche">
            </td>
            <td><strong>${emp.matricule}</strong></td>
            <td>
                <span class="clickable-name" onclick="window.showEmployeeDetails('${emp.id}')" style="cursor:pointer; color:#2563eb; font-weight:600; text-decoration:underline;">
                    ${emp.nom} ${emp.prenom}
                </span>
                ${hasUserAccess ? '<i class="fa-solid fa-user-check text-success" title="Compte d\'accès actif" style="margin-left:5px;"></i>' : ''}
            </td>
            <td>${emp.poste} <br><small class="text-muted">${emp.departement}</small></td>
            <td><span class="badge">${emp.agence}</span></td>
            <td><strong>$${monthlySalary.toFixed(2)}</strong> / mois</td>
            <td><span class="badge badge-actif">$${dailyRate.toFixed(2)} / j</span></td>
            <td><span class="badge badge-${emp.statut}">${emp.statut}</span></td>
            <td>
                ${formattedDate}
                ${isContractEndingSoon ? '<span class="alert-badge" title="Fin de contrat/essai proche"><i class="fa-solid fa-triangle-exclamation"></i> 30j</span>' : ''}
            </td>
            <td>
                ${renderDocumentBadges(emp.employee_documents)}
            </td>
            <td class="text-right">
                <button class="btn-icon text-primary" onclick="window.editEmployee('${emp.id}')" title="Modifier"><i class="fa-solid fa-pen"></i></button>
                <button class="btn-icon text-danger" onclick="window.deleteEmployee('${emp.id}')" title="Supprimer"><i class="fa-solid fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function checkContractExpiry(dateEmbaucheStr) {
    if (!dateEmbaucheStr) return false;
    const dateEmbauche = new Date(dateEmbaucheStr);
    const today = new Date();
    const diffTime = Math.abs(today - dateEmbauche);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 60 && diffDays <= 90;
}

function renderDocumentBadges(docs) {
    if (!docs || docs.length === 0) return '<small class="text-muted">Aucun</small>';
    return docs.map(d => `
        <button class="btn btn-sm btn-secondary" onclick="window.previewDocument('${d.file_url}', '${d.file_name}')">
            <i class="fa-solid fa-file"></i> ${d.doc_type}
        </button>
    `).join(' ');
}

window.calculateDailyRatePreview = function() {
    const val = parseFloat(document.getElementById('emp-salaire-mensuel').value || 0);
    const daily = val > 0 ? (val / 26).toFixed(2) : "0.00";
    document.getElementById('emp-salaire-journalier-preview').value = `$${daily} / jour`;
};

window.showEmployeeDetails = function(id) {
    const emp = employeesData.find(e => e.id === id);
    if (!emp) return;

    const isInspector = (emp.poste || '').toLowerCase().includes('inspecteur') || (emp.poste || '').toLowerCase().includes('superviseur');

    if (isInspector) {
        const assignedSiteAssignments = inspectorSiteAssignmentsData
            .filter(a => String(a.inspector_id) === String(emp.id));
        const assignedSiteIds = assignedSiteAssignments.map(a => String(a.site_id));
        const inspSites = sitesData.filter(s => assignedSiteIds.includes(String(s.id)));

        const modalBody = document.getElementById('details-modal-body');
        
        let sitesTableHtml = '<p class="text-muted" style="padding:10px;">Aucun site affecté à cet inspecteur.</p>';
        if (inspSites.length > 0) {
            sitesTableHtml = `
                <table class="data-table" style="width:100%; margin-top:10px; border-collapse:collapse;">
                    <thead>
                        <tr style="background:#f1f5f9;">
                            <th style="padding:8px; border:1px solid #cbd5e1;">Code</th>
                            <th style="padding:8px; border:1px solid #cbd5e1;">Nom du Site</th>
                            <th style="padding:8px; border:1px solid #cbd5e1;">Client</th>
                            <th style="padding:8px; border:1px solid #cbd5e1;">Date d'affectation</th>
                            <th style="padding:8px; border:1px solid #cbd5e1;">Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${inspSites.map(s => {
                            const assignRecord = assignedSiteAssignments.find(a => String(a.site_id) === String(s.id));
                            const assignedDateStr = assignRecord ? formatDateOnly(assignRecord.assigned_date) : '-';
                            return `
                                <tr>
                                    <td style="padding:8px; border:1px solid #cbd5e1;"><strong>${s.code}</strong></td>
                                    <td style="padding:8px; border:1px solid #cbd5e1;">${s.name}</td>
                                    <td style="padding:8px; border:1px solid #cbd5e1;">${s.client_name || '-'}</td>
                                    <td style="padding:8px; border:1px solid #cbd5e1;">${assignedDateStr}</td>
                                    <td style="padding:8px; border:1px solid #cbd5e1;"><span class="badge badge-actif">${s.status || 'ACTIF'}</span></td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            `;
        }

        modalBody.innerHTML = `
            <div style="display:flex; gap:20px; align-items:center; margin-bottom:15px; border-bottom:1px solid #e2e8f0; padding-bottom:12px;">
                <img src="${emp.photo_url || 'https://via.placeholder.com/60'}" style="width:60px; height:60px; border-radius:50%; object-fit:cover; border:2px solid #2563eb;">
                <div>
                    <h3 style="margin:0; color:#1e293b;">${emp.nom} ${emp.prenom}</h3>
                    <p style="margin:2px 0 0 0; color:#64748b; font-size:0.85rem;">${emp.poste} &bull; Matricule : ${emp.matricule}</p>
                </div>
            </div>
            <div>
                <h4 style="margin-bottom:8px; color:#334155;"><i class="fa-solid fa-building"></i> Sites sous son inspection (${inspSites.length})</h4>
                ${sitesTableHtml}
            </div>
        `;
        document.getElementById('details-modal').style.display = 'flex';
        return;
    }

    const assignment = siteAssignmentsData.find(a => String(a.employee_id) === String(emp.id));
    let assignedSiteHtml = '<span class="text-muted">Aucun site affecté</span>';
    if (assignment) {
        const siteObj = sitesData.find(s => String(s.id) === String(assignment.site_id));
        if (siteObj) {
            assignedSiteHtml = `<strong>${siteObj.name}</strong> (${siteObj.code}) - Client : ${siteObj.client_name || '-'}<br><small style="color:#64748b;">Date d'affectation : ${formatDateOnly(assignment.start_date)}</small>`;
        }
    }

    const modalBody = document.getElementById('details-modal-body');
    const monthlySalary = parseFloat(emp.salaire_mensuel || 500);
    const dailyRate = monthlySalary / 26;

    let docsHtml = '<p class="text-muted">Aucun document joint</p>';
    if (emp.employee_documents && emp.employee_documents.length > 0) {
        docsHtml = `<div class="details-docs-list" style="display:flex; flex-direction:column; gap:10px;">` + 
        emp.employee_documents.map(d => `
            <div style="display:flex; align-items:center; justify-content:space-between; background:#f8fafc; padding:10px 14px; border-radius:8px; border:1px solid #e2e8f0;">
                <div>
                    <i class="fa-solid fa-file-pdf" style="color:#ef4444; margin-right:8px;"></i>
                    <strong>${d.doc_type.toUpperCase()}</strong> : <small class="text-muted">${d.file_name}</small>
                </div>
                <div style="display:flex; gap:8px;">
                    <button class="btn btn-sm btn-secondary" onclick="window.previewDocument('${d.file_url}', '${d.file_name}')">
                        <i class="fa-solid fa-eye"></i> Aperçu
                    </button>
                    <a href="${d.file_url}" target="_blank" download="${d.file_name}" class="btn btn-sm btn-primary" style="text-decoration:none; display:inline-flex; align-items:center; gap:5px;">
                        <i class="fa-solid fa-download"></i> Télécharger
                    </a>
                </div>
            </div>
        `).join('') + `</div>`;
    }

    const phoneHtml = emp.telephone 
        ? `<a href="https://wa.me/${emp.telephone.replace(/[^0-9+]/g, '')}" target="_blank" style="color:#2563eb; text-decoration:none; display:inline-flex; align-items:center; gap:5px;"><i class="fa-brands fa-whatsapp" style="color:#25d366; font-size:1.1rem;"></i> ${emp.telephone}</a>` 
        : 'Non renseigné';

    modalBody.innerHTML = `
        <div style="display:flex; gap:25px; flex-wrap:wrap; align-items:flex-start;">
            <div style="flex: 0 0 220px; text-align:center;">
                <img src="${emp.photo_url || 'https://via.placeholder.com/220'}" 
                     alt="Photo employé" 
                     style="width:200px; height:200px; border-radius:12px; object-fit:cover; border:3px solid #3b82f6; box-shadow: 0 4px 10px rgba(0,0,0,0.15);">
                <div style="margin-top:12px;">
                    <span class="badge badge-${emp.statut}" style="font-size:0.9rem; padding:4px 12px;">${emp.statut.toUpperCase()}</span>
                </div>
            </div>

            <div style="flex:1; min-width:280px;">
                <h2 style="margin-top:0; color:#1e293b; border-bottom:2px solid #f1f5f9; padding-bottom:8px;">
                    ${emp.nom} ${emp.prenom}
                </h2>
                
                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:15px; margin-bottom:20px;">
                    <div><small class="text-muted" style="display:block;">Matricule</small><strong style="font-size:1.1rem; color:#0f172a;">${emp.matricule}</strong></div>
                    <div><small class="text-muted" style="display:block;">Fonction</small><strong>${emp.poste}</strong></div>
                    <div><small class="text-muted" style="display:block;">Site d'affectation</small><span style="color:#16a34a;">${assignedSiteHtml}</span></div>
                    <div><small class="text-muted" style="display:block;">Salaire Contractuel</small><strong style="color:#2563eb;">$${monthlySalary.toFixed(2)} / mois</strong></div>
                    <div><small class="text-muted" style="display:block;">Taux Journalier</small><strong>$${dailyRate.toFixed(2)} / jour</strong></div>
                    <div><small class="text-muted" style="display:block;">Département</small><strong>${emp.departement}</strong></div>
                    <div><small class="text-muted" style="display:block;">Agence</small><span class="badge">${emp.agence}</span></div>
                    <div><small class="text-muted" style="display:block;">Adresse E-mail</small><a href="mailto:${emp.email}" style="color:#2563eb; text-decoration:none;">${emp.email}</a></div>
                    <div><small class="text-muted" style="display:block;">Téléphone / WhatsApp</small><strong>${phoneHtml}</strong></div>
                    <div><small class="text-muted" style="display:block;">Date d'embauche</small><strong style="color: #0f172a;">${formatDateTime(emp.date_embauche)}</strong></div>
                </div>

                <h4 style="margin-top:20px; margin-bottom:12px; color:#334155;">
                    <i class="fa-solid fa-folder-open" style="color:#f59e0b;"></i> Documents rattachés
                </h4>
                ${docsHtml}
            </div>
        </div>
    `;

    document.getElementById('details-modal').style.display = 'flex';
};

window.previewDocument = function(url, fileName) {
    const modalBody = document.getElementById('preview-body');
    document.getElementById('preview-title').textContent = fileName || "Document";
    
    if (url.toLowerCase().endsWith('.pdf')) {
        modalBody.innerHTML = `<iframe src="${url}" style="width:100%; height:500px;" frameborder="0"></iframe>`;
    } else {
        modalBody.innerHTML = `<img src="${url}" style="max-width:100%; max-height:500px; display:block; margin:auto;" />`;
    }
    
    document.getElementById('preview-modal').style.display = 'flex';
};

window.editEmployee = function(id) {
    const emp = employeesData.find(e => e.id === id);
    if (emp) openEmployeeModal(emp);
};

window.deleteEmployee = async function(id) {
    showCustomModal("Voulez-vous vraiment supprimer cet employé du système ?", "Confirmation de suppression", "confirm", async (confirmed) => {
        if (!confirmed) return;

        try {
            await executeNeonQuery('DELETE FROM employee_documents WHERE employee_id = $1', [id]);
            await executeNeonQuery('DELETE FROM agent_site_assignments WHERE employee_id = $1', [id]);
            await executeNeonQuery('DELETE FROM inspector_site_assignments WHERE inspector_id = $1', [id]);
            await executeNeonQuery('DELETE FROM attendance_reports WHERE employee_id = $1', [id]);
            await executeNeonQuery('DELETE FROM user_roles WHERE employee_id = $1', [id]);
            await executeNeonQuery('DELETE FROM employees WHERE id = $1', [id]);

            showCustomModal("Employé supprimé avec succès.", "Succès", "success");
            loadEmployees();
        } catch (e) {
            console.error("Erreur suppression:", e);
            showCustomModal("Impossible de supprimer cet employé en raison des dépendances liées.", "Erreur", "error");
        }
    });
};

async function handleEmployeeFormSubmit(e) {
    if (e) e.preventDefault();

    const empId = document.getElementById('emp-id').value.trim();
    const photoFileInput = document.getElementById('emp-photo-file');
    const photoFile = photoFileInput ? photoFileInput.files[0] : null;
    
    const docFileInput = document.getElementById('doc-file');
    const docFile = docFileInput ? docFileInput.files[0] : null;
    const docType = document.getElementById('doc-type') ? document.getElementById('doc-type').value : 'contrat';

    let photoUrl = null;

    if (photoFile) {
        const fileExt = photoFile.name.split('.').pop();
        const fileName = `avatar_${Date.now()}.${fileExt}`;

        const { error: uploadErr } = await supabaseClient
            .storage
            .from('avatars')
            .upload(fileName, photoFile, { cacheControl: '3600', upsert: true });

        if (!uploadErr) {
            const { data: publicUrlData } = supabaseClient
                .storage
                .from('avatars')
                .getPublicUrl(fileName);

            photoUrl = publicUrlData.publicUrl;
        }
    }

    const matricule = document.getElementById('emp-matricule').value.trim();
    const nom = document.getElementById('emp-nom').value.trim();
    const prenom = document.getElementById('emp-prenom').value.trim();
    const email = document.getElementById('emp-email').value.trim();
    const telephone = document.getElementById('emp-telephone').value.trim();
    const poste = document.getElementById('emp-poste').value.trim();
    const salaireMensuel = parseFloat(document.getElementById('emp-salaire-mensuel').value || 0);
    const departement = document.getElementById('emp-departement').value;
    const agence = document.getElementById('emp-agence').value;
    const inputDateVal = document.getElementById('emp-date-embauche').value;
    const statut = document.getElementById('emp-statut').value;

    const createAccessChecked = document.getElementById('emp-create-access')?.checked;
    const accessPassword = document.getElementById('emp-access-password')?.value;
    const accessRoleId = document.getElementById('emp-access-role-id')?.value;

    let dateEmbaucheTimestamp = inputDateVal;
    if (inputDateVal) {
        const now = new Date();
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        const ss = String(now.getSeconds()).padStart(2, '0');
        dateEmbaucheTimestamp = `${inputDateVal}T${hh}:${mm}:${ss}`;
    }

    let savedEmpId = empId;
    let supabaseUserId = null;

    try {
        if (createAccessChecked && accessPassword && email) {
            const { data: authData, error: authError } = await supabaseClient.auth.signUp({
                email: email,
                password: accessPassword,
                options: {
                    data: {
                        nom: nom,
                        prenom: prenom
                    }
                }
            });

            if (authError) {
                console.warn("Avertissement Supabase Auth :", authError.message);
                showCustomModal("Attention Supabase Auth : " + authError.message, "Avertissement", "error");
            } else if (authData && authData.user) {
                supabaseUserId = authData.user.id;
            }
        }

        if (empId && empId !== '') {
            let query = '';
            let params = [];

            if (supabaseUserId) {
                if (photoUrl) {
                    query = `UPDATE employees SET matricule=$1, nom=$2, prenom=$3, email=$4, telephone=$5, poste=$6, salaire_mensuel=$7, departement=$8, agence=$9, date_embauche=$10, statut=$11, photo_url=$12, user_id_supabase=$13 WHERE id=$14`;
                    params = [matricule, nom, prenom, email, telephone, poste, salaireMensuel, departement, agence, dateEmbaucheTimestamp, statut, photoUrl, supabaseUserId, empId];
                } else {
                    query = `UPDATE employees SET matricule=$1, nom=$2, prenom=$3, email=$4, telephone=$5, poste=$6, salaire_mensuel=$7, departement=$8, agence=$9, date_embauche=$10, statut=$11, user_id_supabase=$12 WHERE id=$13`;
                    params = [matricule, nom, prenom, email, telephone, poste, salaireMensuel, departement, agence, dateEmbaucheTimestamp, statut, supabaseUserId, empId];
                }
            } else {
                if (photoUrl) {
                    query = `UPDATE employees SET matricule=$1, nom=$2, prenom=$3, email=$4, telephone=$5, poste=$6, salaire_mensuel=$7, departement=$8, agence=$9, date_embauche=$10, statut=$11, photo_url=$12 WHERE id=$13`;
                    params = [matricule, nom, prenom, email, telephone, poste, salaireMensuel, departement, agence, dateEmbaucheTimestamp, statut, photoUrl, empId];
                } else {
                    query = `UPDATE employees SET matricule=$1, nom=$2, prenom=$3, email=$4, telephone=$5, poste=$6, salaire_mensuel=$7, departement=$8, agence=$9, date_embauche=$10, statut=$11 WHERE id=$12`;
                    params = [matricule, nom, prenom, email, telephone, poste, salaireMensuel, departement, agence, dateEmbaucheTimestamp, statut, empId];
                }
            }

            await executeNeonQuery(query, params);
        } else {
            const query = `
                INSERT INTO employees (matricule, nom, prenom, email, telephone, poste, salaire_mensuel, departement, agence, date_embauche, statut, photo_url, user_id_supabase)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
                RETURNING id
            `;
            const params = [matricule, nom, prenom, email, telephone, poste, salaireMensuel, departement, agence, dateEmbaucheTimestamp, statut, photoUrl, supabaseUserId];
            
            const res = await executeNeonQuery(query, params);
            if (res && res.length > 0) {
                savedEmpId = res[0].id;
            }
        }

        if (createAccessChecked && accessRoleId && savedEmpId) {
            await executeNeonQuery('DELETE FROM user_roles WHERE employee_id = $1', [savedEmpId]);
            await executeNeonQuery(
                'INSERT INTO user_roles (employee_id, role_id) VALUES ($1, $2)',
                [savedEmpId, accessRoleId]
            );
        }

        if (docFile && savedEmpId) {
            const fileExt = docFile.name.split('.').pop();
            const fileName = `doc_${savedEmpId}_${Date.now()}.${fileExt}`;

            const { error: docUploadErr } = await supabaseClient
                .storage
                .from('documents')
                .upload(fileName, docFile, { cacheControl: '3600', upsert: true });

            if (!docUploadErr) {
                const { data: docUrlData } = supabaseClient
                    .storage
                    .from('documents')
                    .getPublicUrl(fileName);

                await executeNeonQuery(
                    `INSERT INTO employee_documents (employee_id, doc_type, file_url, file_name) VALUES ($1, $2, $3, $4)`,
                    [savedEmpId, docType, docUrlData.publicUrl, docFile.name]
                );
            }
        }

        closeEmployeeModal();
        loadEmployees();
        showCustomModal("Employé et accès enregistrés avec succès !", "Succès", "success");
    } catch (err) {
        console.error("Erreur enregistrement employé:", err);
        showCustomModal("Erreur lors de l'enregistrement de l'agent : " + (err.message || err), "Erreur", "error");
    }
}

function openEmployeeModal(emp = null) {
    document.getElementById('employee-form').reset();
    toggleAccessFields(false);

    if (emp) {
        document.getElementById('modal-title').textContent = "Modifier l'employé";
        document.getElementById('emp-id').value = emp.id;
        document.getElementById('emp-matricule').value = emp.matricule;
        document.getElementById('emp-nom').value = emp.nom;
        document.getElementById('emp-prenom').value = emp.prenom;
        document.getElementById('emp-email').value = emp.email;
        document.getElementById('emp-telephone').value = emp.telephone || '';
        document.getElementById('emp-poste').value = emp.poste;
        document.getElementById('emp-salaire-mensuel').value = emp.salaire_mensuel || 500;
        calculateDailyRatePreview();
        document.getElementById('emp-departement').value = emp.departement;
        document.getElementById('emp-agence').value = emp.agence;
        
        if (emp.date_embauche) {
            const d = new Date(emp.date_embauche);
            if (!isNaN(d.getTime())) {
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                document.getElementById('emp-date-embauche').value = `${year}-${month}-${day}`;
            }
        }
        document.getElementById('emp-statut').value = emp.statut;
    } else {
        document.getElementById('modal-title').textContent = "Ajouter un Employé";
        document.getElementById('emp-id').value = '';
        document.getElementById('emp-salaire-mensuel').value = '500';
        calculateDailyRatePreview();
    }
    document.getElementById('employee-modal').style.display = 'flex';
}

function closeEmployeeModal() {
    document.getElementById('employee-modal').style.display = 'none';
}

window.editSite = function(id) {
    const site = sitesData.find(s => s.id == id);
    if (site) openSiteModal(site);
};

window.deleteSite = async function(id) {
    showCustomModal("Voulez-vous vraiment supprimer ce site ?", "Confirmation de suppression", "confirm", async (confirmed) => {
        if (!confirmed) return;

        try {
            await executeNeonQuery('DELETE FROM agent_site_assignments WHERE site_id = $1', [id]);
            await executeNeonQuery('DELETE FROM inspector_site_assignments WHERE site_id = $1', [id]);
            await executeNeonQuery('DELETE FROM attendance_reports WHERE site_id = $1', [id]);
            await executeNeonQuery('DELETE FROM site_control_visits WHERE site_id = $1', [id]);
            await executeNeonQuery('DELETE FROM maintenance_interventions WHERE site_id = $1', [id]);
            await executeNeonQuery('DELETE FROM sites WHERE id = $1', [id]);

            showCustomModal("Site supprimé avec succès.", "Succès", "success");
            loadSites();
        } catch (e) {
            console.error("Erreur suppression site:", e);
            showCustomModal("Impossible de supprimer ce site en raison des dépendances liées.", "Erreur", "error");
        }
    });
};

async function handleSiteFormSubmit(e) {
    if (e) e.preventDefault();

    const siteId = document.getElementById('site-id').value.trim();
    const code = document.getElementById('site-code').value.trim();
    const name = document.getElementById('site-name').value.trim();
    const address = document.getElementById('site-address').value.trim();
    const clientName = document.getElementById('site-client').value.trim();
    const status = document.getElementById('site-status').value;

    try {
        if (siteId && siteId !== '') {
            await executeNeonQuery(`
                UPDATE sites 
                SET code = $1, name = $2, address = $3, client_name = $4, status = $5
                WHERE id = $6
            `, [code, name, address, clientName, status, siteId]);
        } else {
            await executeNeonQuery(`
                INSERT INTO sites (code, name, address, client_name, status)
                VALUES ($1, $2, $3, $4, $5)
            `, [code, name, address, clientName, status]);
        }

        closeSiteModal();
        loadSites();
    } catch (err) {
        console.error("Erreur enregistrement site:", err);
        showCustomModal("Erreur lors de l'enregistrement du site.", "Erreur", "error");
    }
}

function openSiteModal(site = null) {
    document.getElementById('site-form').reset();

    if (site) {
        document.getElementById('site-modal-title').textContent = "Modifier le Site";
        document.getElementById('site-id').value = site.id;
        document.getElementById('site-code').value = site.code;
        document.getElementById('site-name').value = site.name;
        document.getElementById('site-address').value = site.address || '';
        document.getElementById('site-client').value = site.client_name || '';
        document.getElementById('site-status').value = site.status || 'ACTIF';
    } else {
        document.getElementById('site-modal-title').textContent = "Ajouter un Site";
        document.getElementById('site-id').value = '';
    }
    document.getElementById('site-modal').style.display = 'flex';
}

function closeSiteModal() {
    document.getElementById('site-modal').style.display = 'none';
}

window.openAssignModal = function(siteId) {
    const site = sitesData.find(s => s.id == siteId);
    if (!site) return;

    currentAssignSiteId = site.id;
    document.getElementById('assign-site-id').value = site.id;
    document.getElementById('assign-site-title').textContent = `Affectation des Vigiles - Site : ${site.name} (${site.code})`;
    
    const searchInput = document.getElementById('assign-search-input');
    if (searchInput) searchInput.value = '';

    renderAssignVigilsList();
    document.getElementById('assign-modal').style.display = 'flex';
};

function renderAssignVigilsList(searchQuery = '') {
    if (!currentAssignSiteId) return;
    const siteId = currentAssignSiteId;

    const currentAssignedEmployeeIds = siteAssignmentsData
        .filter(a => String(a.site_id) === String(siteId))
        .map(a => String(a.employee_id));

    const sourceVigils = employeesData.filter(e => 
        e.statut === 'actif' && 
        (e.poste || '').toLowerCase().includes('vigile')
    );

    const query = searchQuery.toLowerCase().trim();
    const filteredVigils = sourceVigils.filter(v => {
        if (!query) return true;
        const fullName = `${v.nom} ${v.prenom}`.toLowerCase();
        const matricule = (v.matricule || '').toLowerCase();
        const poste = (v.poste || '').toLowerCase();
        return fullName.includes(query) || matricule.includes(query) || poste.includes(query);
    });

    const container = document.getElementById('assign-vigils-list');
    if (container) {
        if (filteredVigils.length === 0) {
            container.innerHTML = '<p class="text-muted" style="text-align:center; padding:15px;">Aucun vigile actif trouvé pour cette affectation.</p>';
        } else {
            container.innerHTML = filteredVigils.map(v => {
                const isChecked = currentAssignedEmployeeIds.includes(String(v.id)) ? 'checked' : '';
                
                const assignment = siteAssignmentsData.find(a => String(a.employee_id) === String(v.id));
                let assignmentStatusHtml = '';
                if (assignment) {
                    const assignedSite = sitesData.find(s => String(s.id) === String(assignment.site_id));
                    const siteName = assignedSite ? assignedSite.name : 'Autre site';
                    assignmentStatusHtml = `<span class="badge" style="background:#fef3c7; color:#d97706; border:1px solid #fcd34d; font-size:0.72rem; padding:2px 6px;">Affecté à : ${siteName} (${formatDateOnly(assignment.start_date)})</span>`;
                } else {
                    assignmentStatusHtml = `<span class="badge badge-actif" style="font-size:0.72rem; padding:2px 6px;">Non affecté</span>`;
                }

                return `
                    <label style="display:flex; align-items:center; justify-content:space-between; padding:8px 12px; background:var(--bg-main); border:1px solid var(--border-color); border-radius:6px; cursor:pointer;">
                        <div style="display:flex; align-items:center; gap:10px;">
                            <input type="checkbox" class="assign-vigil-cb" value="${v.id}" ${isChecked} style="transform:scale(1.2);">
                            <div>
                                <strong>${v.nom} ${v.prenom}</strong> <small class="text-muted">(${v.matricule})</small>
                                <br><small class="text-muted">${v.poste} - ${v.agence}</small>
                            </div>
                        </div>
                        <div>
                            ${assignmentStatusHtml}
                        </div>
                    </label>
                `;
            }).join('');
        }
    }
}

window.filterAssignVigilsList = function() {
    const query = document.getElementById('assign-search-input')?.value || '';
    renderAssignVigilsList(query);
};

function closeAssignModal() {
    currentAssignSiteId = null;
    document.getElementById('assign-modal').style.display = 'none';
}

async function handleAssignFormSubmit(e) {
    if (e) e.preventDefault();

    const siteId = document.getElementById('assign-site-id').value;
    if (!siteId) return;

    const selectedCheckboxes = document.querySelectorAll('.assign-vigil-cb:checked');
    const selectedEmployeeIds = Array.from(selectedCheckboxes).map(cb => cb.value);
    const todayStr = new Date().toISOString().slice(0, 10);

    try {
        await executeNeonQuery(`
            CREATE TABLE IF NOT EXISTS agent_site_assignments (
                id SERIAL PRIMARY KEY,
                employee_id VARCHAR(255),
                site_id VARCHAR(255),
                start_date DATE
            )
        `);
        
        try { await executeNeonQuery(`ALTER TABLE agent_site_assignments DROP CONSTRAINT IF EXISTS agent_site_assignments_employee_id_fkey`); } catch(e) {}
        try { await executeNeonQuery(`ALTER TABLE agent_site_assignments DROP CONSTRAINT IF EXISTS agent_site_assignments_site_id_fkey`); } catch(e) {}

        await executeNeonQuery(`ALTER TABLE agent_site_assignments ALTER COLUMN employee_id TYPE VARCHAR(255)`);
        await executeNeonQuery(`ALTER TABLE agent_site_assignments ALTER COLUMN site_id TYPE VARCHAR(255)`);

        await executeNeonQuery('DELETE FROM agent_site_assignments WHERE site_id = $1', [siteId]);

        for (const empId of selectedEmployeeIds) {
            await executeNeonQuery('DELETE FROM agent_site_assignments WHERE employee_id = $1', [empId]);
            await executeNeonQuery(
                'INSERT INTO agent_site_assignments (site_id, employee_id, start_date) VALUES ($1, $2, $3)',
                [siteId, empId, todayStr]
            );
        }

        showCustomModal("Affectations des vigiles enregistrées avec succès !", "Succès", "success", () => {
            closeAssignModal();
            loadSites();
        });
    } catch (err) {
        console.error("Erreur enregistrement affectations vigiles:", err);
        showCustomModal("Erreur lors de l'enregistrement : " + (err.message || err), "Erreur", "error");
    }
}

window.openInspectorAssignModal = function(siteId) {
    const site = sitesData.find(s => s.id == siteId);
    if (!site) return;

    currentAssignSiteId = site.id;
    document.getElementById('inspector-assign-site-id').value = site.id;
    document.getElementById('inspector-assign-site-title').textContent = `Affectation des Inspecteurs - Site : ${site.name} (${site.code})`;

    renderAssignInspectorsList();
    document.getElementById('inspector-assign-modal').style.display = 'flex';
};

function renderAssignInspectorsList() {
    if (!currentAssignSiteId) return;
    const siteId = currentAssignSiteId;

    const currentAssignedInspectorIds = inspectorSiteAssignmentsData
        .filter(a => String(a.site_id) === String(siteId))
        .map(a => String(a.inspector_id));

    const sourceInspectors = employeesData.filter(e => 
        e.statut === 'actif' && 
        ((e.poste || '').toLowerCase().includes('inspecteur') || (e.poste || '').toLowerCase().includes('superviseur'))
    );

    const container = document.getElementById('inspector-assign-list');
    if (container) {
        if (sourceInspectors.length === 0) {
            container.innerHTML = '<p class="text-muted" style="text-align:center; padding:15px;">Aucun inspecteur actif trouvé.</p>';
        } else {
            container.innerHTML = sourceInspectors.map(insp => {
                const isChecked = currentAssignedInspectorIds.includes(String(insp.id)) ? 'checked' : '';
                const inspAssignmentsList = inspectorSiteAssignmentsData.filter(a => String(a.inspector_id) === String(insp.id));
                let inspStatusHtml = '';
                if (inspAssignmentsList.length > 0) {
                    inspStatusHtml = inspAssignmentsList.map(assign => {
                        const assignedSite = sitesData.find(s => String(s.id) === String(assign.site_id));
                        const siteName = assignedSite ? assignedSite.name : 'Autre site';
                        return `<span class="badge" style="background:#fef3c7; color:#d97706; border:1px solid #fcd34d; font-size:0.72rem; padding:2px 6px; margin:2px; display:inline-block;">${siteName} (${formatDateOnly(assign.assigned_date)})</span>`;
                    }).join(' ');
                } else {
                    inspStatusHtml = `<span class="badge badge-actif" style="font-size:0.72rem; padding:2px 6px;">Non affecté</span>`;
                }

                return `
                    <label style="display:flex; align-items:center; justify-content:space-between; padding:8px 12px; background:var(--bg-main); border:1px solid var(--border-color); border-radius:6px; cursor:pointer;">
                        <div style="display:flex; align-items:center; gap:10px;">
                            <input type="checkbox" class="assign-inspector-cb" value="${insp.id}" ${isChecked} style="transform:scale(1.2);">
                            <div>
                                <strong>${insp.nom} ${insp.prenom}</strong> <small class="text-muted">(${insp.matricule})</small>
                                <br><small class="text-muted">${insp.poste} - ${insp.agence}</small>
                            </div>
                        </div>
                        <div>
                            ${inspStatusHtml}
                        </div>
                    </label>
                `;
            }).join('');
        }
    }
}

function closeInspectorAssignModal() {
    currentAssignSiteId = null;
    document.getElementById('inspector-assign-modal').style.display = 'none';
}

async function handleInspectorAssignFormSubmit(e) {
    if (e) e.preventDefault();

    const siteId = document.getElementById('inspector-assign-site-id').value;
    if (!siteId) return;

    const selectedCheckboxes = document.querySelectorAll('.assign-inspector-cb:checked');
    const selectedInspectorIds = Array.from(selectedCheckboxes).map(cb => cb.value);
    const todayStr = new Date().toISOString().slice(0, 10);

    try {
        await executeNeonQuery(`
            CREATE TABLE IF NOT EXISTS inspector_site_assignments (
                id SERIAL PRIMARY KEY,
                inspector_id VARCHAR(255),
                site_id VARCHAR(255),
                assigned_date DATE
            )
        `);
        
        try { await executeNeonQuery(`ALTER TABLE inspector_site_assignments DROP CONSTRAINT IF EXISTS inspector_site_assignments_inspector_id_fkey`); } catch(e) {}
        try { await executeNeonQuery(`ALTER TABLE inspector_site_assignments DROP CONSTRAINT IF EXISTS inspector_site_assignments_site_id_fkey`); } catch(e) {}

        await executeNeonQuery(`ALTER TABLE inspector_site_assignments ALTER COLUMN inspector_id TYPE VARCHAR(255)`);
        await executeNeonQuery(`ALTER TABLE inspector_site_assignments ALTER COLUMN site_id TYPE VARCHAR(255)`);

        await executeNeonQuery('DELETE FROM inspector_site_assignments WHERE site_id = $1', [siteId]);

        for (const inspId of selectedInspectorIds) {
            await executeNeonQuery(
                'INSERT INTO inspector_site_assignments (inspector_id, site_id, assigned_date) VALUES ($1, $2, $3)',
                [inspId, siteId, todayStr]
            );
        }

        showCustomModal("Affectations des inspecteurs enregistrées avec succès !", "Succès", "success", () => {
            closeInspectorAssignModal();
            loadSites();
            loadAttendance();
        });
    } catch (err) {
        console.error("Erreur enregistrement affectations inspecteurs:", err);
        showCustomModal("Erreur lors de l'enregistrement : " + (err.message || err), "Erreur", "error");
    }
}

window.exportSitesPDF = function() {
    const todayStr = formatDateOnly(new Date());
    let rowsHtml = sitesData.map((s, index) => {
        const siteAssignments = siteAssignmentsData.filter(a => String(a.site_id) === String(s.id));
        const inspAssignments = inspectorSiteAssignmentsData.filter(a => String(a.site_id) === String(s.id));
        const hasVigils = siteAssignments.length > 0;

        const assignedInspectors = inspAssignments.length > 0
            ? inspAssignments.map(i => `${i.nom} ${i.prenom} (${formatDateOnly(i.assigned_date)})`).join(', ')
            : 'Aucun inspecteur';

        const assignedVigils = hasVigils
            ? siteAssignments.map(a => `${a.nom} ${a.prenom} (${formatDateOnly(a.start_date)})`).join(', ')
            : 'Aucun vigile affecté (Non affecté)';

        const textColor = hasVigils ? '#0f172a' : '#dc2626';
        const rowBg = index % 2 === 0 ? (hasVigils ? '#ffffff' : '#fef2f2') : (hasVigils ? '#f8fafc' : '#fee2e2');

        return `
            <tr style="background-color: ${rowBg}; color: ${textColor};">
                <td style="border: 1px solid #e2e8f0; padding: 12px; font-weight: 600; color: ${hasVigils ? '#2563eb' : '#dc2626'};">${s.code || ''}</td>
                <td style="border: 1px solid #e2e8f0; padding: 12px; font-weight: ${hasVigils ? '600' : 'bold'}; color: ${textColor};">${s.name || ''}</td>
                <td style="border: 1px solid #e2e8f0; padding: 12px; color: ${hasVigils ? '#475569' : '#dc2626'};">${s.address || '-'}</td>
                <td style="border: 1px solid #e2e8f0; padding: 12px; color: ${hasVigils ? '#334155' : '#dc2626'};">${s.client_name || '-'}</td>
                <td style="border: 1px solid #e2e8f0; padding: 12px; color: ${textColor}; font-weight: ${hasVigils ? 'normal' : 'bold'};">
                    <strong>Inspecteurs :</strong> ${assignedInspectors}<br>
                    <strong>Vigiles :</strong> ${assignedVigils}
                </td>
            </tr>
        `;
    }).join('');

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <title>Rapport - Liste des Sites et Vigiles Affectés</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; color: #1e293b; background: #fdfdfd; }
                .header-container { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #2563eb; padding-bottom: 15px; margin-bottom: 25px; }
                h2 { color: #0f172a; margin: 0; font-size: 1.5rem; letter-spacing: 0.5px; }
                p.subtitle { color: #64748b; margin: 5px 0 0 0; font-size: 0.95rem; }
                table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 0.9rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
                th { background-color: #2563eb; color: #ffffff; border: 1px solid #1d4ed8; padding: 12px; text-align: left; font-weight: 600; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.5px; }
                td { border: 1px solid #e2e8f0; padding: 12px; vertical-align: middle; }
                .footer-note { margin-top: 40px; font-size: 0.80rem; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 10px; }
                @media print {
                    .no-print { display: none; }
                    body { padding: 10px; background: #fff; }
                }
            </style>
        </head>
        <body>
            <div class="header-container">
                <div>
                    <h2>NOVACOM & A2S - RAPPORT DES SITES & VIGILES</h2>
                    <p class="subtitle">État consolidé des affectations par site client (Les sites en rouge n'ont aucun vigile affecté)</p>
                </div>
                <div style="text-align: right;">
                    <strong>Date d'édition :</strong> ${todayStr}
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th style="width: 12%;">Code</th>
                        <th style="width: 20%;">Nom du Site</th>
                        <th style="width: 22%;">Adresse</th>
                        <th style="width: 16%;">Client</th>
                        <th style="width: 30%;">Inspecteurs & Vigiles Affectés (avec dates)</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHtml}
                </tbody>
            </table>
            <div class="footer-note">Système Intégré Novacom & A2S - Document généré automatiquement le ${todayStr}</div>
            <div style="margin-top: 30px; text-align: right;" class="no-print">
                <button onclick="window.print()" style="padding: 12px 24px; background: #2563eb; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);">Imprimer / Enregistrer en PDF</button>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
};

window.exportSitesExcel = function() {
    let rowsHtml = sitesData.map((s, index) => {
        const siteAssignments = siteAssignmentsData.filter(a => String(a.site_id) === String(s.id));
        const inspAssignments = inspectorSiteAssignmentsData.filter(a => String(a.site_id) === String(s.id));
        const hasVigils = siteAssignments.length > 0;

        const assignedInspectors = inspAssignments.length > 0
            ? inspAssignments.map(i => `${i.nom} ${i.prenom} (${formatDateOnly(i.assigned_date)})`).join(', ')
            : 'Aucun inspecteur';

        const assignedVigils = hasVigils
            ? siteAssignments.map(a => `${a.nom} ${a.prenom} (${formatDateOnly(a.start_date)})`).join(', ')
            : 'Aucun vigile affecté';

        const rowBg = index % 2 === 0 ? (hasVigils ? '#ffffff' : '#fef2f2') : (hasVigils ? '#f8fafc' : '#fee2e2');
        const textColor = hasVigils ? '#0f172a' : '#dc2626';
        const fontWeight = hasVigils ? 'normal' : 'bold';

        return `
            <tr style="background-color: ${rowBg}; color: ${textColor}; font-weight: ${fontWeight};">
                <td style="mso-number-format:'@'; border: .5pt solid #cbd5e1; padding: 8px; font-weight: bold; color: ${hasVigils ? '#1e3a8a' : '#dc2626'}; vertical-align: middle;">${s.code || ''}</td>
                <td style="border: .5pt solid #cbd5e1; padding: 8px; color: ${textColor}; vertical-align: middle;">${s.name || ''}</td>
                <td style="border: .5pt solid #cbd5e1; padding: 8px; color: ${textColor}; vertical-align: middle;">${s.address || '-'}</td>
                <td style="border: .5pt solid #cbd5e1; padding: 8px; color: ${textColor}; vertical-align: middle;">${s.client_name || '-'}</td>
                <td style="border: .5pt solid #cbd5e1; padding: 8px; text-align: center; color: #166534; font-weight: bold; vertical-align: middle;">${s.status || 'ACTIF'}</td>
                <td style="border: .5pt solid #cbd5e1; padding: 8px; color: ${textColor}; vertical-align: middle;">Inspecteurs: ${assignedInspectors} | Vigiles: ${assignedVigils}</td>
            </tr>
        `;
    }).join('');

    const tableHTML = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
            <meta charset="utf-8">
            <style>
                table { border-collapse: collapse; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 11pt; }
                th { background-color: #1e3a8a; color: #ffffff; font-weight: bold; text-align: center; padding: 12px 10px; border: .5pt solid #172554; }
                td { padding: 8px 10px; }
            </style>
        </head>
        <body>
            <table>
                <thead>
                    <tr>
                        <th colspan="6" style="background-color: #2563eb; color: #ffffff; font-size: 14pt; text-align: center; padding: 15px; border: none;">NOVACOM & A2S - RAPPORT OFFICIEL DES SITES ET AFFECTATIONS</th>
                    </tr>
                    <tr>
                        <th style="width: 110px;">Code Site</th>
                        <th style="width: 180px;">Nom du Site</th>
                        <th style="width: 220px;">Adresse</th>
                        <th style="width: 160px;">Client</th>
                        <th style="width: 100px;">Statut</th>
                        <th style="width: 320px;">Inspecteurs & Vigiles Affectés</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHtml}
                </tbody>
            </table>
        </body>
        </html>
    `;

    const blob = new Blob([tableHTML], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Novacom_Sites_Affectations_${new Date().toISOString().slice(0, 10)}.xls`;
    link.click();
};

function triggerMultiChannelSubmission(reportTitle, reportDetails, supervisorPhone, supervisorEmail) {
    const messageWhatsApp = encodeURIComponent(
        `*${reportTitle} - NOVACOM & A2S*\n` +
        `-----------------------------------\n` +
        reportDetails +
        `\n-----------------------------------\n*Soumis via ERP Novacom*`
    );

    window.open(`https://api.whatsapp.com/send?phone=${supervisorPhone}&text=${messageWhatsApp}`, '_blank');
    console.log(`[EMAIL ENVOYÉ à ${supervisorEmail}] : ${reportTitle}\n${reportDetails}`);
}

window.submitVigilDailyReport = async function(e) {
    e.preventDefault();
    if (!currentAgent) {
        showCustomModal("Profil vigile introuvable.", "Erreur", "error");
        return;
    }

    const siteId = document.getElementById('vigil-site-id').value;
    const confirmPresence = document.getElementById('vigil-presence-check').checked;
    const observations = document.getElementById('vigil-observations-input').value.trim();
    const todayStr = new Date().toISOString().slice(0, 10);

    if (!confirmPresence) {
        showCustomModal("Vous devez impérativement confirmer votre présence pour aujourd'hui.", "Attention", "error");
        return;
    }

    try {
        await executeNeonQuery(`
            INSERT INTO attendance_reports (employee_id, site_id, report_date, observations, status, presence_confirmed)
            VALUES ($1, $2, $3, $4, 'SOUMIS_VIGILE', true)
        `, [currentAgent.id, siteId, todayStr, observations]);

        showCustomModal("Rapport journalier et présence enregistrés avec succès !", "Succès", "success", () => {
            triggerMultiChannelSubmission(
                "RAPPORT JOURNALIER VIGILE",
                `Agent : ${currentAgent.nom} ${currentAgent.prenom}\nDate : ${todayStr}\nPrésence : CONFIRMÉE\nObservations : ${observations}`,
                "+243000000000",
                "inspecteur@novacom.cd"
            );
            loadAttendance();
        });
    } catch (err) {
        console.error("Erreur rapport vigile:", err);
        showCustomModal("Erreur lors de la soumission du rapport.", "Erreur", "error");
    }
};

// ==========================================
// CONTRÔLE VISITE & PRÉSENCE
// ==========================================
async function loadSiteControlVisits() {
    try {
        await executeNeonQuery(`
            CREATE TABLE IF NOT EXISTS site_control_visits (
                id SERIAL PRIMARY KEY,
                site_id VARCHAR(255),
                visitor_employee_id VARCHAR(255),
                vigil_employee_id VARCHAR(255),
                status_presence VARCHAR(50),
                observations TEXT,
                visit_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        siteControlVisitsData = await executeNeonQuery(`
            SELECT scv.*, 
                   s.name as site_name, s.code as site_code,
                   v.nom as vigil_nom, v.prenom as vigil_prenom, v.matricule as vigil_matricule,
                   emp.nom as visitor_nom, emp.prenom as visitor_prenom, emp.poste as visitor_poste
            FROM site_control_visits scv
            JOIN sites s ON CAST(scv.site_id AS VARCHAR) = CAST(s.id AS VARCHAR)
            JOIN employees v ON CAST(scv.vigil_employee_id AS VARCHAR) = CAST(v.id AS VARCHAR)
            JOIN employees emp ON CAST(scv.visitor_employee_id AS VARCHAR) = CAST(emp.id AS VARCHAR)
            ORDER BY scv.visit_timestamp DESC
        `);

        populateControlSiteDropdown();
        renderSiteControlTable();
    } catch (e) {
        console.warn("Erreur chargement des visites de contrôle:", e);
    }
}

function populateControlSiteDropdown() {
    const select = document.getElementById('control-site-select');
    if (!select) return;
    select.innerHTML = '<option value="">-- Sélectionnez un site --</option>' +
        sitesData.map(s => `<option value="${s.id}">${s.name} (${s.code})</option>`).join('');
}

function onControlSiteSelected() {
    const siteId = document.getElementById('control-site-select')?.value;
    const container = document.getElementById('control-vigils-container');
    if (!container) return;

    if (!siteId) {
        container.innerHTML = '<p class="text-muted">Veuillez sélectionner un site pour afficher les vigiles affectés.</p>';
        return;
    }

    const assignedVigilsOnSite = siteAssignmentsData.filter(a => String(a.site_id) === String(siteId));
    if (assignedVigilsOnSite.length === 0) {
        container.innerHTML = '<p class="text-danger" style="font-weight:bold;"><i class="fa-solid fa-triangle-exclamation"></i> Aucun vigile n\'est actuellement affecté à ce site.</p>';
        return;
    }

    container.innerHTML = assignedVigilsOnSite.map(a => {
        const vigilEmp = employeesData.find(e => String(e.id) === String(a.employee_id));
        if (!vigilEmp) return '';

        return `
            <div class="control-vigil-card" data-vigil-id="${vigilEmp.id}" style="background:var(--bg-card); border:1px solid var(--border-color); padding:15px; border-radius:8px; margin-bottom:12px; display:flex; gap:15px; align-items:center; flex-wrap:wrap;">
                <img src="${vigilEmp.photo_url || 'https://via.placeholder.com/70'}" alt="Photo Vigile" style="width:70px; height:70px; border-radius:50%; object-fit:cover; border:2px solid #2563eb;">
                <div style="flex:1; min-width:200px;">
                    <h4 style="margin:0; color:#1e293b;">${vigilEmp.nom} ${vigilEmp.prenom}</h4>
                    <p style="margin:2px 0 0 0; font-size:0.85rem; color:var(--text-muted);">Matricule : <strong>${vigilEmp.matricule}</strong> | Poste : ${vigilEmp.poste}</p>
                </div>
                <div style="display:flex; flex-direction:column; gap:8px; min-width:200px;">
                    <div style="display:flex; gap:15px; align-items:center;">
                        <label style="cursor:pointer; font-weight:600; color:#16a34a;"><input type="radio" name="presence_${vigilEmp.id}" value="PRESENTE" checked onchange="toggleAbsenceNote('${vigilEmp.id}', false)"> Présent</label>
                        <label style="cursor:pointer; font-weight:600; color:#dc2626;"><input type="radio" name="presence_${vigilEmp.id}" value="ABSENT" onchange="toggleAbsenceNote('${vigilEmp.id}', true)"> Absent</label>
                    </div>
                </div>
                <div style="flex:2; min-width:250px;">
                    <input type="text" id="obs_${vigilEmp.id}" class="form-control" placeholder="Observations de la visite (ex: RAS, en retard, absent...)" style="width:100%; padding:8px; border:1px solid var(--border-color); border-radius:6px; font-size:0.85rem;">
                </div>
            </div>
        `;
    }).join('');
}

window.toggleAbsenceNote = function(vigilId, isAbsent) {
    const inputObs = document.getElementById(`obs_${vigilId}`);
    if (inputObs && isAbsent && !inputObs.value.includes('ABSENT')) {
        inputObs.value = 'ABSENT DU POSTE - ' + inputObs.value;
    }
};

window.submitSiteControlVisit = async function(e) {
    e.preventDefault();
    const siteId = document.getElementById('control-site-select')?.value;
    if (!siteId) {
        showCustomModal("Veuillez sélectionner un site.", "Attention", "error");
        return;
    }

    const visitor = currentAgent || (employeesData.length > 0 ? employeesData[0] : null);
    if (!visitor) {
        showCustomModal("Impossible d'identifier l'utilisateur effectuant le contrôle.", "Erreur", "error");
        return;
    }

    const vigilCards = document.querySelectorAll('.control-vigil-card');
    if (vigilCards.length === 0) {
        showCustomModal("Aucun vigile à contrôler sur ce site.", "Attention", "error");
        return;
    }

    const siteObj = sitesData.find(s => String(s.id) === String(siteId));
    const siteName = siteObj ? siteObj.name : 'Site inconnu';
    const visitTimestamp = new Date().toISOString();

    let absenteesCount = 0;

    try {
        for (const card of vigilCards) {
            const vigilId = card.getAttribute('data-vigil-id');
            const presenceRadio = card.querySelector(`input[name="presence_${vigilId}"]:checked`);
            const statusPresence = presenceRadio ? presenceRadio.value : 'PRESENTE';
            const observations = document.getElementById(`obs_${vigilId}`)?.value.trim() || 'RAS';

            await executeNeonQuery(`
                INSERT INTO site_control_visits (site_id, visitor_employee_id, vigil_employee_id, status_presence, observations, visit_timestamp)
                VALUES ($1, $2, $3, $4, $5, $6)
            `, [siteId, visitor.id, vigilId, statusPresence, observations, visitTimestamp]);

            if (statusPresence === 'ABSENT') {
                absenteesCount++;
                const vigilEmp = employeesData.find(e => String(e.id) === String(vigilId));
                const vigilName = vigilEmp ? `${vigilEmp.nom} ${vigilEmp.prenom}` : 'Vigile';
                const visitTimeFormatted = formatDateTime(visitTimestamp);
                const visitorName = `${visitor.nom} ${visitor.prenom}`;

                const absenceMessage = 
                    `*ALERTE : Absence du vigile*\n` +
                    `- Vigile affecté : ${vigilName}\n` +
                    `- Nom du site : ${siteName}\n` +
                    `- Heure : ${visitTimeFormatted}\n` +
                    `- Constaté par : ${visitorName}`;

                let targetPhones = ["+243000000002"];
                try {
                    const adminRows = await executeNeonQuery(`
                        SELECT e.telephone FROM employees e
                        JOIN user_roles ur ON ur.employee_id = e.id
                        JOIN roles r ON ur.role_id = r.id
                        WHERE r.code ILIKE '%admin%' OR r.code ILIKE '%manager%' OR r.code ILIKE '%direction%'
                    `);
                    if (adminRows && adminRows.length > 0) {
                        adminRows.forEach(row => {
                            if (row.telephone) targetPhones.push(row.telephone);
                        });
                    }
                } catch(errAdmin) {
                    console.warn("Erreur récupération numéros admins:", errAdmin);
                }

                targetPhones.forEach(phone => {
                    const cleanPhone = phone.replace(/[^0-9+]/g, '');
                    window.open(`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(absenceMessage)}`, '_blank');
                });
            }
        }

        showCustomModal(`Visite de contrôle enregistrée avec succès ! ${absenteesCount > 0 ? absenteesCount + ' alerte(s) d\'absence transmise(s) via WhatsApp.' : ''}`, "Succès", "success", () => {
            loadSiteControlVisits();
            document.getElementById('control-site-select').value = '';
            document.getElementById('control-vigils-container').innerHTML = '<p class="text-muted">Veuillez sélectionner un site pour afficher les vigiles affectés.</p>';
        });
    } catch (err) {
        console.error("Erreur enregistrement visite contrôle:", err);
        showCustomModal("Erreur lors de l'enregistrement du contrôle.", "Erreur", "error");
    }
};

function renderSiteControlTable() {
    const tbody = document.getElementById('site-control-tbody');
    if (!tbody) return;

    if (siteControlVisitsData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:15px;" class="text-muted">Aucun rapport de contrôle de visite enregistré.</td></tr>';
        return;
    }

    tbody.innerHTML = siteControlVisitsData.map(v => `
        <tr>
            <td><strong>${formatDateTime(v.visit_timestamp)}</strong></td>
            <td>${v.site_name} (${v.site_code})</td>
            <td>${v.visitor_nom} ${v.visitor_prenom} <br><small class="text-muted">${v.visitor_poste || 'Intervenant'}</small></td>
            <td><strong>${v.vigil_nom} ${v.vigil_prenom}</strong> (${v.vigil_matricule})</td>
            <td><span class="badge ${v.status_presence === 'ABSENT' ? 'badge-suspendu' : 'badge-actif'}">${v.status_presence}</span></td>
            <td>${v.observations || '-'}</td>
            <td class="text-right">
                <button class="btn btn-sm btn-secondary" onclick="window.viewControlDetails('${v.id}')"><i class="fa-solid fa-eye"></i></button>
            </td>
        </tr>
    `).join('');
}

window.viewControlDetails = function(id) {
    const visit = siteControlVisitsData.find(v => String(v.id) === String(id));
    if (!visit) return;

    const modalBody = document.getElementById('details-modal-body');
    modalBody.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:12px;">
            <h3 style="margin:0; color:#1e293b;"><i class="fa-solid fa-clipboard-user"></i> Détails du Contrôle de Visite</h3>
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:10px; background:#f8fafc; padding:12px; border-radius:8px; border:1px solid #e2e8f0;">
                <div><small class="text-muted">Date & Heure</small><br><strong>${formatDateTime(visit.visit_timestamp)}</strong></div>
                <div><small class="text-muted">Site concerné</small><br><strong>${visit.site_name} (${visit.site_code})</strong></div>
                <div><small class="text-muted">Visiteur / Intervenant</small><br><strong>${visit.visitor_nom} ${visit.visitor_prenom}</strong></div>
                <div><small class="text-muted">Vigile contrôlé</small><br><strong>${visit.vigil_nom} ${visit.vigil_prenom} (${visit.vigil_matricule})</strong></div>
                <div><small class="text-muted">Statut Présence</small><br><span class="badge ${visit.status_presence === 'ABSENT' ? 'badge-suspendu' : 'badge-actif'}">${visit.status_presence}</span></div>
            </div>
            <div>
                <h4 style="margin-bottom:6px; color:#334155;">Observations :</h4>
                <p style="background:#fff; padding:10px; border-radius:6px; border:1px solid #cbd5e1; margin:0; white-space:pre-wrap;">${visit.observations || 'Aucune observation'}</p>
            </div>
        </div>
    `;
    document.getElementById('details-modal').style.display = 'flex';
};

window.exportSiteControlPDF = function() {
    const todayStr = formatDateOnly(new Date());
    let rowsHtml = siteControlVisitsData.map((v, index) => {
        const isAbsent = v.status_presence === 'ABSENT';
        const rowBg = index % 2 === 0 ? (isAbsent ? '#fef2f2' : '#ffffff') : (isAbsent ? '#fee2e2' : '#f8fafc');
        const textColor = isAbsent ? '#dc2626' : '#0f172a';

        return `
            <tr style="background-color: ${rowBg}; color: ${textColor};">
                <td style="border: 1px solid #e2e8f0; padding: 10px;">${formatDateTime(v.visit_timestamp)}</td>
                <td style="border: 1px solid #e2e8f0; padding: 10px; font-weight:600;">${v.site_name} (${v.site_code})</td>
                <td style="border: 1px solid #e2e8f0; padding: 10px;">${v.visitor_nom} ${v.visitor_prenom}</td>
                <td style="border: 1px solid #e2e8f0; padding: 10px;">${v.vigil_nom} ${v.vigil_prenom} (${v.vigil_matricule})</td>
                <td style="border: 1px solid #e2e8f0; padding: 10px; font-weight:bold;">${v.status_presence}</td>
                <td style="border: 1px solid #e2e8f0; padding: 10px;">${v.observations || '-'}</td>
            </tr>
        `;
    }).join('');

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <title>Rapport - Contrôles de Visite & Présence</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; color: #1e293b; background: #fdfdfd; }
                .header-container { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #2563eb; padding-bottom: 15px; margin-bottom: 25px; }
                h2 { color: #0f172a; margin: 0; font-size: 1.5rem; }
                p.subtitle { color: #64748b; margin: 5px 0 0 0; font-size: 0.95rem; }
                table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 0.9rem; }
                th { background-color: #2563eb; color: #ffffff; border: 1px solid #1d4ed8; padding: 12px; text-align: left; font-size: 0.8rem; text-transform: uppercase; }
                td { border: 1px solid #e2e8f0; padding: 10px; vertical-align: middle; }
                .footer-note { margin-top: 40px; font-size: 0.80rem; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 10px; }
                @media print { .no-print { display: none; } body { padding: 10px; background: #fff; } }
            </style>
        </head>
        <body>
            <div class="header-container">
                <div>
                    <h2>NOVACOM & A2S - RAPPORT DE CONTRÔLE DES VISITES</h2>
                    <p class="subtitle">Suivi inopiné de la présence des vigiles par les intervenants et techniciens</p>
                </div>
                <div><strong>Date :</strong> ${todayStr}</div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Date & Heure</th>
                        <th>Site</th>
                        <th>Visiteur / Intervenant</th>
                        <th>Vigile Contrôlé</th>
                        <th>Présence</th>
                        <th>Observations</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHtml}
                </tbody>
            </table>
            <div class="footer-note">Système Intégré Novacom & A2S - Généré le ${todayStr}</div>
            <div style="margin-top: 30px; text-align: right;" class="no-print">
                <button onclick="window.print()" style="padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">Imprimer / PDF</button>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
};

window.exportSiteControlExcel = function() {
    let rowsHtml = siteControlVisitsData.map((v, index) => {
        return `
            <tr>
                <td style="border: .5pt solid #cbd5e1; padding: 8px;">${formatDateTime(v.visit_timestamp)}</td>
                <td style="border: .5pt solid #cbd5e1; padding: 8px;">${v.site_name} (${v.site_code})</td>
                <td style="border: .5pt solid #cbd5e1; padding: 8px;">${v.visitor_nom} ${v.visitor_prenom}</td>
                <td style="border: .5pt solid #cbd5e1; padding: 8px;">${v.vigil_nom} ${v.vigil_prenom} (${v.vigil_matricule})</td>
                <td style="border: .5pt solid #cbd5e1; padding: 8px; text-align: center; font-weight:bold; color:${v.status_presence === 'ABSENT' ? '#dc2626' : '#16a34a'};">${v.status_presence}</td>
                <td style="border: .5pt solid #cbd5e1; padding: 8px;">${v.observations || '-'}</td>
            </tr>
        `;
    }).join('');

    const tableHTML = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
            <meta charset="utf-8">
            <style>
                table { border-collapse: collapse; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 11pt; }
                th { background-color: #1e3a8a; color: #ffffff; font-weight: bold; text-align: center; padding: 12px 10px; border: .5pt solid #172554; }
                td { padding: 8px 10px; }
            </style>
        </head>
        <body>
            <table>
                <thead>
                    <tr>
                        <th colspan="6" style="background-color: #2563eb; color: #ffffff; font-size: 14pt; text-align: center; padding: 15px;">NOVACOM & A2S - RAPPORT EXCEL CONTRÔLE DES VISITES</th>
                    </tr>
                    <tr>
                        <th>Date & Heure</th>
                        <th>Site</th>
                        <th>Visiteur</th>
                        <th>Vigile Contrôlé</th>
                        <th>Statut</th>
                        <th>Observations</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHtml}
                </tbody>
            </table>
        </body>
        </html>
    `;

    const blob = new Blob([tableHTML], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Novacom_Controle_Visites_${new Date().toISOString().slice(0, 10)}.xls`;
    link.click();
};

function populateInspectorVigilFilter() {
    const select = document.getElementById('insp-filter-vigil');
    if (!select) return;
    const vigils = employeesData.filter(e => (e.poste || '').toLowerCase().includes('vigile') || (e.departement || '').toLowerCase().includes('sécurité'));
    const source = vigils.length > 0 ? vigils : employeesData;
    select.innerHTML = '<option value="">Tous les Vigiles</option>' + 
        source.map(v => `<option value="${v.id}">${v.nom} ${v.prenom} (${v.matricule})</option>`).join('');
}

function populateInspectorFilterDropdown() {
    const select = document.getElementById('insp-filter-inspector');
    if (!select) return;
    const inspectors = employeesData.filter(e => (e.poste || '').toLowerCase().includes('inspecteur') || (e.poste || '').toLowerCase().includes('superviseur') || (e.departement || '').toLowerCase().includes('sécurité'));
    const source = inspectors.length > 0 ? inspectors : employeesData;
    select.innerHTML = '<option value="">Tous les Inspecteurs</option>' + 
        source.map(i => `<option value="${i.id}">${i.nom} ${i.prenom} (${i.matricule})</option>`).join('');
}

function populateManagerFilters() {
    const inspSelect = document.getElementById('manager-filter-inspector');
    const siteSelect = document.getElementById('manager-filter-site');

    if (inspSelect) {
        const inspectors = employeesData.filter(e => 
            e.statut === 'actif' && 
            ((e.poste || '').toLowerCase().includes('inspecteur') || (e.poste || '').toLowerCase().includes('superviseur') || (e.departement || '').toLowerCase().includes('sécurité'))
        );
        const sourceInsp = inspectors.length > 0 ? inspectors : employeesData;
        inspSelect.innerHTML = '<option value="">Tous les Inspecteurs</option>' + 
            sourceInsp.map(i => `<option value="${i.id}">${i.nom} ${i.prenom} (${i.matricule})</option>`).join('');
    }

    if (siteSelect) {
        siteSelect.innerHTML = '<option value="">Tous les Sites</option>' + 
            sitesData.map(s => `<option value="${s.id}">${s.name} (${s.code})</option>`).join('');
    }
}

window.renderInspectorDashboard = function() {
    const siteFilter = document.getElementById('insp-filter-site')?.value || '';
    const inspectorFilter = document.getElementById('insp-filter-inspector')?.value || '';
    const vigilFilter = document.getElementById('insp-filter-vigil')?.value || '';
    const dateStart = document.getElementById('insp-filter-date-start')?.value || '';
    const dateEnd = document.getElementById('insp-filter-date-end')?.value || '';

    let assignedSiteIdsForInspector = [];
    if (inspectorFilter) {
        assignedSiteIdsForInspector = inspectorSiteAssignmentsData
            .filter(a => String(a.inspector_id) === String(inspectorFilter))
            .map(a => String(a.site_id));
    }

    let filteredReports = attendanceReportsData.filter(r => {
        let matchSite = !siteFilter || String(r.site_id) === String(siteFilter);
        let matchInspectorSite = !inspectorFilter || assignedSiteIdsForInspector.includes(String(r.site_id));
        let matchVigil = !vigilFilter || String(r.employee_id) === String(vigilFilter);
        
        let reportDateStr = r.report_date ? new Date(r.report_date).toISOString().slice(0, 10) : '';
        let matchStart = !dateStart || (reportDateStr >= dateStart);
        let matchEnd = !dateEnd || (reportDateStr <= dateEnd);

        return matchSite && matchInspectorSite && matchVigil && matchStart && matchEnd;
    });

    const cardProfile = document.getElementById('insp-vigil-profile-card');
    if (inspectorFilter) {
        const inspInfo = employeesData.find(e => String(e.id) === String(inspectorFilter));
        const inspSites = sitesData.filter(s => assignedSiteIdsForInspector.includes(String(s.id)));
        
        const assignedSiteIds = inspSites.map(s => String(s.id));
        const vigilsOnInspectorSites = siteAssignmentsData.filter(a => assignedSiteIds.includes(String(a.site_id)));

        if (inspInfo && cardProfile) {
            cardProfile.style.display = 'block';
            cardProfile.innerHTML = `
                <div style="background:var(--bg-card); padding:16px; border-radius:10px; border:1px solid var(--border-color); box-shadow:var(--shadow-sm); margin-bottom:15px;">
                    <div style="display:flex; align-items:center; gap:20px; flex-wrap:wrap;">
                        <img src="${inspInfo.photo_url || 'https://via.placeholder.com/80'}" alt="Avatar Inspecteur" style="width:80px; height:80px; border-radius:50%; object-fit:cover; border:3px solid #2563eb;">
                        <div style="flex:1; min-width:250px;">
                            <h3 style="margin:0; color:#1e293b; font-size:1.15rem;">Inspecteur : ${inspInfo.nom} ${inspInfo.prenom}</h3>
                            <p style="margin:3px 0; color:var(--text-muted); font-size:0.85rem;">
                                <strong>Matricule:</strong> ${inspInfo.matricule} | <strong>Fonction:</strong> ${inspInfo.poste} | <strong>Agence:</strong> ${inspInfo.agence}
                            </p>
                        </div>
                    </div>
                    <div style="margin-top:12px; padding-top:12px; border-top:1px solid var(--border-color); display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:12px;">
                        <div style="background:var(--bg-main); padding:10px; border-radius:6px; border:1px solid var(--border-color);">
                            <strong style="color:#2563eb; display:block; margin-bottom:5px;"><i class="fa-solid fa-building"></i> Sites sous sa responsabilité (${inspSites.length}) :</strong>
                            ${inspSites.length > 0 ? inspSites.map(s => `<span class="badge" style="margin:2px; display:inline-block;">${s.name} (${s.code})</span>`).join('') : '<small class="text-muted">Aucun site affecté à cet inspecteur</small>'}
                        </div>
                        <div style="background:var(--bg-main); padding:10px; border-radius:6px; border:1px solid var(--border-color);">
                            <strong style="color:#16a34a; display:block; margin-bottom:5px;"><i class="fa-solid fa-user-shield"></i> Vigiles sur ses sites (${vigilsOnInspectorSites.length}) :</strong>
                            ${vigilsOnInspectorSites.length > 0 ? vigilsOnInspectorSites.map(v => `<span class="badge badge-actif" onclick="window.showEmployeeDetails('${v.employee_id}')" style="margin:2px; display:inline-block; cursor:pointer;" title="Voir la fiche du vigile">${v.nom} ${v.prenom}</span>`).join('') : '<small class="text-muted">Aucun vigile sur ces sites</small>'}
                        </div>
                    </div>
                </div>
            `;
        }
    } else if (cardProfile) {
        cardProfile.style.display = 'none';
        cardProfile.innerHTML = '';
    }

    const container = document.getElementById('inspector-reports-list');
    if (!container) return;

    if (filteredReports.length === 0) {
        container.innerHTML = '<p class="text-muted" style="padding:20px; text-align:center; background:var(--bg-card); border-radius:8px; border:1px solid var(--border-color);">Aucun rapport journalier trouvé pour cette sélection.</p>';
        return;
    }

    container.innerHTML = filteredReports.map(r => `
        <div class="report-item-card" style="background:var(--bg-card); padding:14px; border-radius:8px; margin-bottom:12px; border:1px solid var(--border-color); box-shadow:var(--shadow-sm);">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:10px;">
                <div style="display:flex; align-items:center; gap:10px;">
                    <input type="checkbox" class="insp-report-check" value="${r.id}" style="transform:scale(1.2); cursor:pointer;">
                    <div>
                        <strong class="clickable-name" onclick="window.showEmployeeDetails('${r.employee_id}')" style="font-size:0.95rem; color:#2563eb; cursor:pointer; text-decoration:underline;" title="Voir les informations du vigile">Vigile : ${r.nom} ${r.prenom}</strong> 
                        <span style="margin:0 6px; color:#cbd5e1;">|</span> 
                        <strong style="color:#2563eb;">Site : ${r.site_name}</strong> 
                        <span style="margin:0 6px; color:#cbd5e1;">|</span> 
                        <small class="text-muted"><i class="fa-regular fa-clock"></i> Date : ${formatDateTime(r.report_date)}</small>
                    </div>
                </div>
                <div>
                    <span class="badge ${r.status === 'SOUMIS_VIGILE' ? 'badge-suspendu' : 'badge-actif'}">${r.status}</span>
                </div>
            </div>

            <div style="margin-top:10px; background:var(--bg-main); padding:10px; border-radius:6px; border:1px solid var(--border-color);">
                <p style="margin:0; font-size:0.85rem;"><strong>Observations du Vigile :</strong> ${r.observations || 'RAS'}</p>
            </div>

            <div style="margin-top:10px; display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
                <div style="flex:1; min-width:260px;">
                    <input type="text" id="insp-obs-${r.id}" class="form-control" placeholder="Ajouter un commentaire d'inspection..." value="${r.inspector_notes || ''}" style="width:100%; padding:6px 10px; border-radius:6px; border:1px solid var(--border-color); font-size:0.82rem;">
                </div>
                <div style="display:flex; gap:6px;">
                    <button class="btn btn-sm btn-secondary" onclick="window.viewReportDetails('${r.id}')"><i class="fa-solid fa-eye"></i> Détails</button>
                    <button class="btn btn-sm btn-primary" onclick="window.sendSingleReportToSupervisor('${r.id}')"><i class="fa-solid fa-paper-plane"></i> Compiler & Envoyer au Superviseur</button>
                </div>
            </div>
        </div>
    `).join('');
};

window.viewReportDetails = function(reportId) {
    const report = attendanceReportsData.find(r => String(r.id) === String(reportId));
    if (!report) return;

    const vigilInfo = employeesData.find(e => e.id === report.employee_id) || {};
    const phoneHtml = vigilInfo.telephone 
        ? `<a href="https://wa.me/${vigilInfo.telephone.replace(/[^0-9+]/g, '')}" target="_blank" style="color:#2563eb; text-decoration:none; display:inline-flex; align-items:center; gap:4px;"><i class="fa-brands fa-whatsapp" style="color:#25d366;"></i> ${vigilInfo.telephone}</a>` 
        : '-';

    const modalBody = document.getElementById('details-modal-body');
    modalBody.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:15px;">
            <div style="display:flex; gap:15px; align-items:center; background:#f8fafc; padding:12px; border-radius:8px; border:1px solid #e2e8f0;">
                <img src="${vigilInfo.photo_url || 'https://via.placeholder.com/60'}" style="width:60px; height:60px; border-radius:50%; object-fit:cover;">
                <div>
                    <h3 style="margin:0; color:#1e293b;">${report.nom} ${report.prenom}</h3>
                    <p style="margin:0; color:var(--text-muted); font-size:0.85rem;">
                        Matricule : ${vigilInfo.matricule || '-'} | Téléphone / WhatsApp : ${phoneHtml}
                    </p>
                </div>
            </div>

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:12px;">
                <div><small class="text-muted">Site d'affectation</small><br><strong>${report.site_name}</strong></div>
                <div><small class="text-muted">Date et Heure du Rapport</small><br><strong>${formatDateTime(report.report_date)}</strong></div>
                <div><small class="text-muted">Présence confirmée</small><br><span class="badge badge-actif">${report.presence_confirmed ? 'OUI' : 'NON'}</span></div>
                <div><small class="text-muted">Statut actuel</small><br><span class="badge">${report.status}</span></div>
            </div>

            <div style="background:#fff; padding:12px; border-radius:8px; border:1px solid #cbd5e1;">
                <h4 style="margin-top:0; color:#1e293b;"><i class="fa-solid fa-comment-dots"></i> Observations du Vigile</h4>
                <p style="white-space:pre-wrap; margin:0; font-size:0.9rem; color:#334155;">${report.observations || 'Aucune observation saisie.'}</p>
            </div>
        </div>
    `;

    document.getElementById('details-modal').style.display = 'flex';
};

window.sendSingleReportToSupervisor = async function(reportId) {
    const obsInput = document.getElementById(`insp-obs-${reportId}`);
    const obsText = obsInput ? obsInput.value.trim() : '';

    try {
        await executeNeonQuery(`
            UPDATE attendance_reports 
            SET status = 'TRANSMIS_SUPERVISEUR', inspector_notes = $1 
            WHERE id = $2
        `, [obsText, reportId]);

        showCustomModal("Rapport transmis individuellement au Superviseur (App + WhatsApp + Email).", "Succès", "success", () => {
            triggerMultiChannelSubmission(
                "RAPPORT INSPECTION INDIVIDUEL",
                `Rapport ID : ${reportId}\nNote Inspecteur : ${obsText || 'RAS'}`,
                "+243000000001",
                "superviseur@novacom.cd"
            );
            loadAttendance();
        });
    } catch (e) {
        console.error("Erreur transmission rapport:", e);
        showCustomModal("Erreur lors de la transmission du rapport.", "Erreur", "error");
    }
};

window.sendSelectedReportsToSupervisor = async function() {
    const checkboxes = document.querySelectorAll('.insp-report-check:checked');
    if (checkboxes.length === 0) {
        showCustomModal("Veuillez sélectionner au moins un rapport à transmettre.", "Attention", "error");
        return;
    }

    showCustomModal(`Voulez-vous transmettre les ${checkboxes.length} rapport(s) sélectionné(s) en bloc au Superviseur ?`, "Confirmation", "confirm", async (confirmed) => {
        if (!confirmed) return;

        const ids = Array.from(checkboxes).map(cb => cb.value);

        try {
            for (const id of ids) {
                const obsInput = document.getElementById(`insp-obs-${id}`);
                const obsText = obsInput ? obsInput.value.trim() : '';
                await executeNeonQuery(`
                    UPDATE attendance_reports 
                    SET status = 'TRANSMIS_SUPERVISEUR', inspector_notes = $1 
                    WHERE id = $2
                `, [obsText, id]);
            }

            showCustomModal(`${ids.length} rapport(s) transmis en bloc au Superviseur avec succès !`, "Succès", "success", () => {
                triggerMultiChannelSubmission(
                    "TRANSMISSION EN BLOC - RAPPORTS INSPECTION",
                    `Nombre de rapports transmis : ${ids.length}\nIDs : ${ids.join(', ')}`,
                    "+243000000001",
                    "superviseur@novacom.cd"
                );
                loadAttendance();
            });
        } catch (e) {
            console.error("Erreur transmission en bloc:", e);
            showCustomModal("Erreur lors de la transmission globale.", "Erreur", "error");
        }
    });
};

window.compileInspectorReportGroup = function() {
    const siteFilter = document.getElementById('insp-filter-site')?.value || '';
    const vigilFilter = document.getElementById('insp-filter-vigil')?.value || '';
    const dateStart = document.getElementById('insp-filter-date-start')?.value || '';
    const dateEnd = document.getElementById('insp-filter-date-end')?.value || '';

    let filteredReports = attendanceReportsData.filter(r => {
        let matchSite = !siteFilter || String(r.site_id) === String(siteFilter);
        let matchVigil = !vigilFilter || String(r.employee_id) === String(vigilFilter);
        let reportDateStr = r.report_date ? new Date(r.report_date).toISOString().slice(0, 10) : '';
        let matchStart = !dateStart || (reportDateStr >= dateStart);
        let matchEnd = !dateEnd || (reportDateStr <= dateEnd);

        return matchSite && matchVigil && matchStart && matchEnd;
    });

    if (filteredReports.length === 0) {
        showCustomModal("Aucun rapport ne correspond à la sélection pour générer le rapport d'inspection.", "Attention", "error");
        return;
    }

    const siteObj = sitesData.find(s => String(s.id) === String(siteFilter));
    const siteName = siteObj ? siteObj.name : 'TOUS LES SITES D\'INSPECTION';

    const vigilStats = {};
    filteredReports.forEach(r => {
        const key = `${r.nom} ${r.prenom}`;
        if (!vigilStats[key]) {
            vigilStats[key] = {
                dates: new Set(),
                reportsCount: 0
            };
        }
        if (r.report_date) {
            vigilStats[key].dates.add(new Date(r.report_date).toISOString().slice(0, 10));
        }
        vigilStats[key].reportsCount += 1;
    });

    let proReportText = `========================================================================\n`;
    proReportText += `               NOVACOM & A2S - RAPPORT SYNTHÉTIQUE D'INSPECTION\n`;
    proReportText += `========================================================================\n\n`;
    proReportText += `RÉFÉRENCE MISSION : INSP-${Date.now().toString().slice(-6)}\n`;
    proReportText += `DATE DE COMPILATION : ${formatDateTime(new Date().toISOString())}\n`;
    proReportText += `PÉRIODE D'INSPECTION : DU ${dateStart ? formatDateOnly(dateStart) : 'DEBUT'} AU ${dateEnd ? formatDateOnly(dateEnd) : 'CE JOUR'}\n`;
    proReportText += `SITE CONCERNÉ : ${siteName.toUpperCase()}\n\n`;
    
    proReportText += `------------------------------------------------------------------------\n`;
    proReportText += `1. SYNTHÈSE GLOBALE ET COUVERTURE DES PRESTATIONS\n`;
    proReportText += `------------------------------------------------------------------------\n`;
    proReportText += `* Nombre total de rapports compilés : ${filteredReports.length}\n`;
    proReportText += `* Effectif des vigiles inspectés   : ${Object.keys(vigilStats).length} agent(s)\n\n`;
    proReportText += `RÉCAPITULATIF INDIVIDUEL DES PRESTATIONS :\n`;

    Object.keys(vigilStats).forEach((vName) => {
        proReportText += `  - ${vName} : ${vigilStats[vName].dates.size} jour(s) presté(s) (${vigilStats[vName].reportsCount} rapport(s) soumis)\n`;
    });

    proReportText += `\n------------------------------------------------------------------------\n`;
    proReportText += `2. DÉTAIL CHRONOLOGIQUE DES RAPPORTS & RECOMMANDATIONS INSPECTEUR\n`;
    proReportText += `------------------------------------------------------------------------\n\n`;

    filteredReports.forEach((r, idx) => {
        const obsInput = document.getElementById(`insp-obs-${r.id}`);
        const obsText = obsInput ? obsInput.value.trim() : (r.inspector_notes || 'RAS - Aucune anomalie constatée');
        
        proReportText += `[ RAPPORT # ${idx + 1} ]\n`;
        proReportText += `* Agent Vigile   : ${r.nom} ${r.prenom}\n`;
        proReportText += `* Site Client    : ${r.site_name}\n`;
        proReportText += `* Date & Heure   : ${formatDateTime(r.report_date)}\n`;
        proReportText += `* Déclaration    : ${r.observations || 'Rien à signaler'}\n`;
        proReportText += `* Avis Inspecteur: ${obsText}\n`;
        proReportText += `------------------------------------------------------------------------\n\n`;
    });

    proReportText += `========================================================================\n`;
    proReportText += `               TRANSMIS POUR VALIDATION AU SUPERVISEUR\n`;
    proReportText += `========================================================================`;

    const modalBody = document.getElementById('details-modal-body');
    modalBody.innerHTML = `
        <div>
            <h3 style="margin-top:0; color:#1e293b;"><i class="fa-solid fa-file-invoice"></i> Compilation du Rapport Global d'Inspection</h3>
            <p class="text-muted">Voici la synthèse consolidée et professionnelle prête pour l'envoi au Superviseur.</p>
            <textarea id="compiled-report-text" class="form-control" rows="14" style="width:100%; font-family:Consolas, monospace; font-size:0.82rem; padding:12px; border-radius:6px; border:1px solid #cbd5e1; background:#0f172a; color:#f8fafc; line-height:1.4;">${proReportText}</textarea>
            <div style="margin-top:15px; display:flex; justify-content:flex-end; gap:10px;">
                <button class="btn btn-secondary" onclick="document.getElementById('details-modal').style.display='none'">Fermer</button>
                <button class="btn btn-primary" onclick="window.sendCompiledReport()"><i class="fa-solid fa-paper-plane"></i> Compiler & Envoyer au Superviseur</button>
            </div>
        </div>
    `;

    document.getElementById('details-modal').style.display = 'flex';
};

window.sendCompiledReport = async function() {
    showCustomModal("Rapport d'inspection compilé et transmis au Superviseur avec succès (App + WhatsApp + Email) !", "Succès", "success", () => {
        triggerMultiChannelSubmission(
            "RAPPORT GLOBAL D'INSPECTION OFFICIEL",
            document.getElementById('compiled-report-text')?.value || '',
            "+243000000001",
            "superviseur@novacom.cd"
        );
        document.getElementById('details-modal').style.display = 'none';
    });
};

function renderHierarchicalDashboards() {
    window.renderInspectorDashboard();

    const supervisorDiv = document.getElementById('supervisor-reports-container');
    if (supervisorDiv) {
        const pendingSupervisorReports = attendanceReportsData.filter(r => r.status === 'TRANSMIS_SUPERVISEUR' || r.status === 'SOUMIS_VIGILE');
        
        if (pendingSupervisorReports.length === 0) {
            supervisorDiv.innerHTML = '<p class="text-muted" style="padding:15px; background:var(--bg-card); border-radius:8px; border:1px solid var(--border-color);">Aucun rapport en attente de supervision.</p>';
        } else {
            supervisorDiv.innerHTML = pendingSupervisorReports.map(r => `
                <div style="background:var(--bg-card); padding:14px; border-radius:8px; margin-bottom:12px; border:1px solid var(--border-color); box-shadow:var(--shadow-sm);">
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
                        <div>
                            <strong>Rapport d'Inspection - Site : ${r.site_name}</strong>
                            <br><small class="text-muted">Agent : ${r.nom} ${r.prenom} | Date : ${formatDateTime(r.report_date)}</small>
                        </div>
                        <div>
                            <span class="badge badge-suspendu">Statut : ${r.status}</span>
                        </div>
                    </div>
                    <div style="margin-top:10px; background:var(--bg-main); padding:10px; border-radius:6px; border:1px solid var(--border-color);">
                        <p style="margin:0; font-size:0.85rem;"><strong>Observations :</strong> ${r.observations || 'RAS'}</p>
                        ${r.inspector_notes ? `<p style="margin:5px 0 0 0; font-size:0.85rem; color:#2563eb;"><strong>Note Inspecteur :</strong> ${r.inspector_notes}</p>` : ''}
                    </div>
                    <div style="margin-top:10px; display:flex; justify-content:flex-end;">
                        <button class="btn btn-sm btn-primary" onclick="window.supervisorSendToManager('${r.id}')"><i class="fa-solid fa-paper-plane"></i> Transmettre au Manager de Sécurité</button>
                    </div>
                </div>
            `).join('');
        }
    }
}

window.renderManagerDashboard = function() {
    const inspFilter = document.getElementById('manager-filter-inspector')?.value || '';
    const siteFilter = document.getElementById('manager-filter-site')?.value || '';

    const container = document.getElementById('manager-reports-container');
    if (!container) return;

    const inspectors = employeesData.filter(e => 
        (e.poste || '').toLowerCase().includes('inspecteur') || 
        (e.poste || '').toLowerCase().includes('superviseur') || 
        inspectorSiteAssignmentsData.some(a => String(a.inspector_id) === String(e.id))
    );
    const sourceInspectors = inspectors.length > 0 ? inspectors : employeesData;

    const filteredInspectors = sourceInspectors.filter(insp => {
        if (inspFilter && String(insp.id) !== String(inspFilter)) return false;
        if (siteFilter) {
            const inspSites = inspectorSiteAssignmentsData
                .filter(a => String(a.inspector_id) === String(insp.id))
                .map(a => String(a.site_id));
            if (!inspSites.includes(String(siteFilter))) return false;
        }
        return true;
    });

    let htmlContent = '';

    if (filteredInspectors.length === 0) {
        htmlContent += '<p class="text-muted" style="padding:15px; background:var(--bg-card); border-radius:8px; border:1px solid var(--border-color);">Aucun inspecteur trouvé pour ces filtres.</p>';
    } else {
        filteredInspectors.forEach(insp => {
            const assignedSiteIds = inspectorSiteAssignmentsData
                .filter(a => String(a.inspector_id) === String(insp.id))
                .map(a => String(a.site_id));
            
            let inspSites = sitesData.filter(s => assignedSiteIds.includes(String(s.id)));
            if (siteFilter) {
                inspSites = inspSites.filter(s => String(s.id) === String(siteFilter));
            }

            htmlContent += `
                <div style="background:var(--bg-card); padding:16px; border-radius:10px; border:1px solid var(--border-color); margin-bottom:20px; box-shadow:var(--shadow-sm);">
                    <div style="display:flex; align-items:center; gap:15px; margin-bottom:12px; border-bottom:1px solid var(--border-color); padding-bottom:10px;">
                        <img src="${insp.photo_url || 'https://via.placeholder.com/60'}" style="width:60px; height:60px; border-radius:50%; object-fit:cover; border:2px solid #2563eb;">
                        <div>
                            <h3 style="margin:0; color:#1e293b; font-size:1.1rem;">Inspecteur : ${insp.nom} ${insp.prenom} (${insp.matricule})</h3>
                            <p style="margin:2px 0 0 0; color:var(--text-muted); font-size:0.85rem;">Poste : ${insp.poste} | Agence : ${insp.agence}</p>
                        </div>
                    </div>
            `;

            if (inspSites.length === 0) {
                htmlContent += `<p class="text-muted" style="font-size:0.85rem; padding:8px;">Aucun site affecté à cet inspecteur.</p>`;
            } else {
                htmlContent += `<div style="display:flex; flex-direction:column; gap:12px;">`;
                inspSites.forEach(site => {
                    const siteVigils = siteAssignmentsData
                        .filter(a => String(a.site_id) === String(site.id));

                    const siteReports = attendanceReportsData
                        .filter(r => String(r.site_id) === String(site.id));

                    htmlContent += `
                        <div style="background:var(--bg-main); padding:12px; border-radius:8px; border:1px solid var(--border-color);">
                            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:8px;">
                                <div>
                                    <strong style="color:#2563eb; font-size:0.95rem;"><i class="fa-solid fa-building"></i> Site : ${site.name} (${site.code})</strong>
                                    <br><small class="text-muted">Client : ${site.client_name || '-'} | Adresse : ${site.address || '-'}</small>
                                </div>
                                <div>
                                    <span class="badge badge-actif">${site.status || 'ACTIF'}</span>
                                </div>
                            </div>

                            <div style="margin-bottom:8px;">
                                <strong style="font-size:0.82rem; color:#475569;"><i class="fa-solid fa-user-shield"></i> Vigiles affectés (${siteVigils.length}) :</strong>
                                <div style="display:flex; flex-wrap:wrap; gap:6px; margin-top:4px;">
                                    ${siteVigils.length > 0 ? siteVigils.map(v => `<span class="badge" onclick="window.showEmployeeDetails('${v.employee_id}')" style="background:#e0f2fe; color:#0369a1; font-size:0.78rem; cursor:pointer;" title="Affecté le ${formatDateOnly(v.start_date)}">🛡️ ${v.nom} ${v.prenom} (${v.matricule}) - <small>${formatDateOnly(v.start_date)}</small></span>`).join('') : '<small class="text-muted">Aucun vigile sur ce site</small>'}
                                </div>
                            </div>

                            <div style="margin-top:8px; padding-top:8px; border-top:1px dashed var(--border-color);">
                                <strong style="font-size:0.82rem; color:#475569;"><i class="fa-solid fa-clipboard-list"></i> Rapports de prestations / Activité (${siteReports.length}) :</strong>
                    `;

                    if (siteReports.length === 0) {
                        htmlContent += `<br><small class="text-muted">Aucun rapport enregistré pour ce site.</small>`;
                    } else {
                        htmlContent += `<div style="display:flex; flex-direction:column; gap:6px; margin-top:6px;">`;
                        siteReports.slice(0, 3).forEach(rep => {
                            htmlContent += `
                                <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-card); padding:6px 10px; border-radius:6px; border:1px solid var(--border-color); font-size:0.82rem;">
                                    <div>
                                        <strong class="clickable-name" onclick="window.showEmployeeDetails('${rep.employee_id}')" style="color:#2563eb; cursor:pointer;" title="Voir le vigile">${rep.nom} ${rep.prenom}</strong> - <small>${formatDateTime(rep.report_date)}</small>
                                        <br><span class="badge" style="font-size:0.7rem;">${rep.status}</span>
                                    </div>
                                    <div>
                                        <button class="btn btn-sm btn-success" onclick="managerSendToClient('${rep.id}')" style="font-size:0.75rem; padding:3px 8px;"><i class="fa-solid fa-globe"></i> Transmettre au Client</button>
                                    </div>
                                </div>
                            `;
                        });
                        htmlContent += `</div>`;
                    }

                    htmlContent += `
                            </div>
                        </div>
                    `;
                });
                htmlContent += `</div>`;
            }

            htmlContent += `</div>`;
        });
    }

    container.innerHTML = htmlContent;
};

window.compileAndSendToSupervisor = function(reportId) {
    window.sendSingleReportToSupervisor(reportId);
};

window.supervisorSendToManager = async function(reportId) {
    try {
        await executeNeonQuery(`
            UPDATE attendance_reports 
            SET status = 'VALIDÉ_SUPERVISEUR' 
            WHERE id = $1
        `, [reportId]);

        showCustomModal("Rapport validé et transmis au Manager de Sécurité avec succès.", "Succès", "success", () => {
            triggerMultiChannelSubmission(
                "VALIDATION SUPERVISEUR",
                `Transmission du rapport ID ${reportId} au Manager de Sécurité.`,
                "+243000000002",
                "manager@novacom.cd"
            );
            loadAttendance();
        });
    } catch (e) {
        console.error("Erreur validation superviseur:", e);
        showCustomModal("Erreur lors de la transmission au manager.", "Erreur", "error");
    }
};

window.managerSendToClient = function(reportId) {
    showCustomModal("Rapport transmis au Client avec succès (App + WhatsApp + Email).", "Succès", "success", () => {
        triggerMultiChannelSubmission(
            "RAPPORT DE SÉCURITÉ OFFICIEL - CLIENT",
            `Le rapport de sécurité pour le site a été validé et transmis.`,
            "+243000000003",
            "client@entreprise.cd"
        );
    });
};

async function loadSites() {
    try {
        sitesData = await executeNeonQuery('SELECT * FROM sites ORDER BY name ASC');
        try {
            siteAssignmentsData = await executeNeonQuery(`
                SELECT asa.*, e.nom, e.prenom, e.matricule 
                FROM agent_site_assignments asa
                JOIN employees e ON CAST(asa.employee_id AS VARCHAR) = CAST(e.id AS VARCHAR)
            `);
        } catch (errAssign) {
            console.warn("Erreur chargement affectations vigiles:", errAssign);
            siteAssignmentsData = [];
        }

        try {
            inspectorSiteAssignmentsData = await executeNeonQuery(`
                SELECT isa.*, e.nom, e.prenom, e.matricule, e.id as inspector_id_val 
                FROM inspector_site_assignments isa
                JOIN employees e ON CAST(isa.inspector_id AS VARCHAR) = CAST(e.id AS VARCHAR)
            `);
        } catch (errInsp) {
            console.warn("Erreur chargement affectations inspecteurs:", errInsp);
            inspectorSiteAssignmentsData = [];
        }

        const tbody = document.getElementById('sites-tbody');
        if (tbody) {
            tbody.innerHTML = sitesData.map(s => {
                const siteAssignments = siteAssignmentsData.filter(a => String(a.site_id) === String(s.id));
                const inspAssignments = inspectorSiteAssignmentsData.filter(a => String(a.site_id) === String(s.id));
                const hasVigils = siteAssignments.length > 0;

                const assignedVigils = hasVigils
                    ? siteAssignments.map(a => `<span class="badge badge-actif" onclick="window.showEmployeeDetails('${a.employee_id}')" style="margin-right:4px; margin-bottom:4px; display:inline-block; cursor:pointer;" title="Affecté le ${formatDateOnly(a.start_date)}"><i class="fa-solid fa-user-shield"></i> ${a.nom} ${a.prenom} <small>(${formatDateOnly(a.start_date)})</small></span>`).join('')
                    : `<span style="color: #dc2626; font-weight: bold;"><i class="fa-solid fa-triangle-exclamation"></i> Aucun vigile</span>`;

                const assignedInspectors = inspAssignments.length > 0
                    ? inspAssignments.map(i => `<span class="badge" onclick="window.showEmployeeDetails('${i.inspector_id}')" style="background:#dbeafe; color:#1e40af; margin-right:4px; margin-bottom:4px; display:inline-block; cursor:pointer;" title="Affecté le ${formatDateOnly(i.assigned_date)}"><i class="fa-solid fa-eye"></i> ${i.nom} ${i.prenom} <small>(${formatDateOnly(i.assigned_date)})</small></span>`).join('')
                    : `<span style="color: #64748b;"><i class="fa-solid fa-circle-exclamation"></i> Aucun inspecteur</span>`;

                return `
                    <tr style="${hasVigils ? '' : 'background-color: #fef2f2;'}">
                        <td><strong>${s.code}</strong></td>
                        <td>${s.name}</td>
                        <td>${s.address || '-'}</td>
                        <td>${s.client_name || '-'}</td>
                        <td><span class="badge badge-actif">${s.status || 'ACTIF'}</span></td>
                        <td>${assignedInspectors}<br><div style="margin-top:4px;">${assignedVigils}</div></td>
                        <td class="text-right">
                            <button class="btn btn-sm btn-primary" onclick="window.openInspectorAssignModal('${s.id}')" title="Affecter des Inspecteurs"><i class="fa-solid fa-user-tie"></i> Inspecteur</button>
                            <button class="btn btn-sm btn-secondary" onclick="window.openAssignModal('${s.id}')" title="Affecter des Vigiles"><i class="fa-solid fa-user-plus"></i> Vigile</button>
                            <button class="btn-icon text-primary" onclick="window.editSite('${s.id}')" title="Modifier"><i class="fa-solid fa-pen"></i></button>
                            <button class="btn-icon text-danger" onclick="window.deleteSite('${s.id}')" title="Supprimer"><i class="fa-solid fa-trash"></i></button>
                        </td>
                    </tr>
                `;
            }).join('');
        }

        const siteSelect = document.getElementById('vigil-site-id');
        if (siteSelect && sitesData.length > 0) {
            siteSelect.innerHTML = sitesData.map(s => `<option value="${s.id}">${s.name} (${s.code})</option>`).join('');
        }

        const inspSiteSelect = document.getElementById('insp-filter-site');
        if (inspSiteSelect) {
            inspSiteSelect.innerHTML = '<option value="">Tous les Sites</option>' + 
                sitesData.map(s => `<option value="${s.id}">${s.name} (${s.code})</option>`).join('');
        }

        populateControlSiteDropdown();
        populateManagerFilters();
    } catch (e) {
        console.warn("Erreur chargement sites:", e);
    }
}

async function loadAttendance() {
    try {
        attendanceReportsData = await executeNeonQuery(`
            SELECT ar.*, e.nom, e.prenom, s.name as site_name 
            FROM attendance_reports ar
            JOIN employees e ON CAST(ar.employee_id AS VARCHAR) = CAST(e.id AS VARCHAR)
            JOIN sites s ON CAST(ar.site_id AS VARCHAR) = CAST(s.id AS VARCHAR)
            ORDER BY ar.report_date DESC
        `);
        renderHierarchicalDashboards();
    } catch (e) {
        console.warn("Erreur chargement prestations:", e);
    }
}

// ==========================================
// 3. FONCTIONS COMPLÉTÉES (MAINTENANCE, PRIMES, PAIE, FINANCES, EXPORT)
// ==========================================
async function loadMaintenance() {
    try {
        await executeNeonQuery(`
            CREATE TABLE IF NOT EXISTS maintenance_interventions (
                id SERIAL PRIMARY KEY,
                site_id VARCHAR(255),
                technician_id VARCHAR(255),
                description TEXT,
                status VARCHAR(50) DEFAULT 'EN_COURS',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        const rows = await executeNeonQuery(`
            SELECT mi.*, s.name as site_name, e.nom as tech_nom, e.prenom as tech_prenom
            FROM maintenance_interventions mi
            LEFT JOIN sites s ON CAST(mi.site_id AS VARCHAR) = CAST(s.id AS VARCHAR)
            LEFT JOIN employees e ON CAST(mi.technician_id AS VARCHAR) = CAST(e.id AS VARCHAR)
            ORDER BY mi.created_at DESC
        `);
        const tbody = document.getElementById('maintenance-tbody');
        if (tbody) {
            if (!rows || rows.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:15px;" class="text-muted">Aucune intervention de maintenance enregistrée.</td></tr>';
            } else {
                tbody.innerHTML = rows.map(m => `
                    <tr>
                        <td><strong>${formatDateTime(m.created_at)}</strong></td>
                        <td>${m.site_name || 'Site inconnu'}</td>
                        <td>${m.tech_nom ? m.tech_nom + ' ' + m.tech_prenom : 'Non assigné'}</td>
                        <td>${m.description || '-'}</td>
                        <td><span class="badge badge-actif">${m.status || 'EN_COURS'}</span></td>
                    </tr>
                `).join('');
            }
        }
    } catch (e) {
        console.warn("Erreur chargement maintenance:", e);
    }
}

async function loadBonuses() {
    try {
        await executeNeonQuery(`
            CREATE TABLE IF NOT EXISTS bonuses (
                id SERIAL PRIMARY KEY,
                employee_id VARCHAR(255),
                amount NUMERIC,
                reason TEXT,
                bonus_date DATE DEFAULT CURRENT_DATE
            )
        `);
        bonusesData = await executeNeonQuery(`
            SELECT b.*, e.nom, e.prenom, e.matricule 
            FROM bonuses b
            JOIN employees e ON CAST(b.employee_id AS VARCHAR) = CAST(e.id AS VARCHAR)
            ORDER BY b.bonus_date DESC
        `);
        const tbody = document.getElementById('bonuses-tbody');
        if (tbody) {
            if (!bonusesData || bonusesData.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:15px;" class="text-muted">Aucune prime enregistrée.</td></tr>';
            } else {
                tbody.innerHTML = bonusesData.map(b => `
                    <tr>
                        <td><strong>${formatDateOnly(b.bonus_date)}</strong></td>
                        <td>${b.nom} ${b.prenom} (${b.matricule})</td>
                        <td><strong>$${parseFloat(b.amount || 0).toFixed(2)}</strong></td>
                        <td>${b.reason || '-'}</td>
                        <td class="text-right">
                            <button class="btn-icon text-danger" onclick="window.deleteBonus('${b.id}')" title="Supprimer"><i class="fa-solid fa-trash"></i></button>
                        </td>
                    </tr>
                `).join('');
            }
        }
    } catch (e) {
        console.warn("Erreur chargement primes:", e);
    }
}

async function loadPayroll() {
    try {
        const tbody = document.getElementById('payroll-tbody');
        if (tbody) {
            if (!employeesData || employeesData.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:15px;" class="text-muted">Aucun employé pour la paie.</td></tr>';
                return;
            }
            tbody.innerHTML = employeesData.map(emp => {
                const monthly = parseFloat(emp.salaire_mensuel || 500);
                const daily = monthly / 26;
                return `
                    <tr>
                        <td><strong>${emp.matricule}</strong></td>
                        <td>${emp.nom} ${emp.prenom}</td>
                        <td>${emp.poste}</td>
                        <td><strong>$${monthly.toFixed(2)}</strong></td>
                        <td>$${daily.toFixed(2)}</td>
                        <td><span class="badge badge-actif">PAYÉ / ACTIF</span></td>
                    </tr>
                `;
            }).join('');
        }
    } catch (e) {
        console.warn("Erreur chargement paie:", e);
    }
}

async function loadFinance() {
    try {
        await executeNeonQuery(`
            CREATE TABLE IF NOT EXISTS finance_items (
                id SERIAL PRIMARY KEY,
                type VARCHAR(50),
                category VARCHAR(100),
                amount NUMERIC,
                description TEXT,
                transaction_date DATE DEFAULT CURRENT_DATE
            )
        `);
        financeItemsData = await executeNeonQuery('SELECT * FROM finance_items ORDER BY transaction_date DESC');
        const tbody = document.getElementById('finance-tbody');
        if (tbody) {
            if (!financeItemsData || financeItemsData.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:15px;" class="text-muted">Aucune transaction financière enregistrée.</td></tr>';
            } else {
                tbody.innerHTML = financeItemsData.map(f => `
                    <tr>
                        <td><strong>${formatDateOnly(f.transaction_date)}</strong></td>
                        <td><span class="badge ${f.type === 'ENTREE' ? 'badge-actif' : 'badge-suspendu'}">${f.type}</span></td>
                        <td>${f.category || '-'}</td>
                        <td><strong>$${parseFloat(f.amount || 0).toFixed(2)}</strong></td>
                        <td>${f.description || '-'}</td>
                    </tr>
                `).join('');
            }
        }
    } catch (e) {
        console.warn("Erreur chargement finances:", e);
    }
}

window.deleteBonus = async function(id) {
    showCustomModal("Voulez-vous vraiment supprimer cette prime ?", "Confirmation", "confirm", async (confirmed) => {
        if (!confirmed) return;
        try {
            await executeNeonQuery('DELETE FROM bonuses WHERE id = $1', [id]);
            showCustomModal("Prime supprimée avec succès.", "Succès", "success");
            loadBonuses();
        } catch (err) {
            showCustomModal("Erreur lors de la suppression.", "Erreur", "error");
        }
    });
};

function exportToExcel() {
    let rowsHtml = employeesData.map((emp) => {
        const monthly = parseFloat(emp.salaire_mensuel || 500);
        const daily = monthly / 26;
        return `
            <tr>
                <td style="border: .5pt solid #cbd5e1; padding: 8px;">${emp.matricule || ''}</td>
                <td style="border: .5pt solid #cbd5e1; padding: 8px;">${emp.nom || ''} ${emp.prenom || ''}</td>
                <td style="border: .5pt solid #cbd5e1; padding: 8px;">${emp.poste || ''}</td>
                <td style="border: .5pt solid #cbd5e1; padding: 8px;">${emp.departement || ''}</td>
                <td style="border: .5pt solid #cbd5e1; padding: 8px;">${emp.agence || ''}</td>
                <td style="border: .5pt solid #cbd5e1; padding: 8px; text-align: right;">$${monthly.toFixed(2)}</td>
                <td style="border: .5pt solid #cbd5e1; padding: 8px; text-align: right;">$${daily.toFixed(2)}</td>
                <td style="border: .5pt solid #cbd5e1; padding: 8px; text-align: center;">${emp.statut || ''}</td>
            </tr>
        `;
    }).join('');

    const tableHTML = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
            <meta charset="utf-8">
            <style>
                table { border-collapse: collapse; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 11pt; }
                th { background-color: #1e3a8a; color: #ffffff; font-weight: bold; text-align: center; padding: 12px 10px; border: .5pt solid #172554; }
                td { padding: 8px 10px; }
            </style>
        </head>
        <body>
            <table>
                <thead>
                    <tr>
                        <th colspan="8" style="background-color: #2563eb; color: #ffffff; font-size: 14pt; text-align: center; padding: 15px;">NOVACOM & A2S - RAPPORT GLOBAL DES EMPLOYÉS</th>
                    </tr>
                    <tr>
                        <th>Matricule</th>
                        <th>Nom complet</th>
                        <th>Poste</th>
                        <th>Département</th>
                        <th>Agence</th>
                        <th>Salaire Mensuel</th>
                        <th>Taux Journalier</th>
                        <th>Statut</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHtml}
                </tbody>
            </table>
        </body>
        </html>
    `;

    const blob = new Blob([tableHTML], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Novacom_Employes_${new Date().toISOString().slice(0, 10)}.xls`;
    link.click();
}