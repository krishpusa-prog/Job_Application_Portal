
const JOBS_DATA = [
    {
        id: 1,
        title: "Frontend Developer",
        company: "Tech Solutions Inc.",
        location: "Remote",
        salary: "$60,000 - $80,000",
        type: "Full-time",
        description: "We're looking for a skilled Frontend Developer to join our team. You'll be working with modern JavaScript frameworks.",
        requirements: ["HTML/CSS/JavaScript", "React.js or Vue.js", "Git experience", "REST APIs"],
        benefits: ["Health insurance", "Remote work", "Flexible hours", "Learning budget"],
        posted: "2 days ago"
    },
    {
        id: 2,
        title: "Marketing Intern",
        company: "Digital Agency Co.",
        location: "New York, NY",
        salary: "$30,000 - $40,000",
        type: "Internship",
        description: "Join our marketing team for a 6-month internship. Learn digital marketing strategies.",
        requirements: ["Marketing interest", "Social media savvy", "Good communication", "Learning attitude"],
        benefits: ["Mentorship", "Stipend", "Networking", "Certificate"],
        posted: "1 week ago"
    },
    {
        id: 3,
        title: "Data Analyst",
        company: "Finance Corp",
        location: "Chicago, IL",
        salary: "$70,000 - $90,000",
        type: "Full-time",
        description: "Looking for a Data Analyst with SQL and Python experience to join our analytics team.",
        requirements: ["SQL", "Python/R", "Excel", "Data visualization"],
        benefits: ["401k matching", "Gym membership", "Bonus", "Conference budget"],
        posted: "3 days ago"
    },
    {
        id: 4,
        title: "Graphic Designer",
        company: "Creative Studio",
        location: "Los Angeles, CA",
        salary: "$50,000 - $65,000",
        type: "Part-time",
        description: "Part-time graphic designer for branding projects. Must have portfolio.",
        requirements: ["Adobe Creative Suite", "Branding experience", "Portfolio", "Team player"],
        benefits: ["Flexible schedule", "Creative freedom", "Remote options", "Project bonuses"],
        posted: "1 day ago"
    },
    {
        id: 5,
        title: "Backend Developer",
        company: "Cloud Systems",
        location: "Austin, TX",
        salary: "$80,000 - $100,000",
        type: "Full-time",
        description: "Senior backend developer needed for cloud infrastructure team.",
        requirements: ["Node.js/Python", "AWS/Azure", "Database design", "System architecture"],
        benefits: ["Stock options", "Unlimited PTO", "Home office setup", "Health & wellness"],
        posted: "5 days ago"
    },
    {
        id: 6,
        title: "Customer Support",
        company: "Service First",
        location: "Remote",
        salary: "$35,000 - $45,000",
        type: "Full-time",
        description: "Provide excellent customer support via chat, email, and phone.",
        requirements: ["Customer service", "Communication skills", "Problem solving", "Patience"],
        benefits: ["Work from home", "Training", "Growth opportunities", "Team bonuses"],
        posted: "4 days ago"
    }
];


const Storage = {
    get: (key) => {
        try {
            return JSON.parse(localStorage.getItem(key)) || null;
        } catch {
            return localStorage.getItem(key);
        }
    },
    
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch {
            return false;
        }
    },
    
    remove: (key) => localStorage.removeItem(key),
    
    clear: () => localStorage.clear()
};

const JobStorage = {
    getAppliedJobs: () => Storage.get('appliedJobs') || [],
    getSavedJobs: () => Storage.get('savedJobs') || [],
    
    saveAppliedJob: (jobId) => {
        const appliedJobs = JobStorage.getAppliedJobs();
        if (!appliedJobs.includes(jobId)) {
            appliedJobs.push(jobId);
            return Storage.set('appliedJobs', appliedJobs);
        }
        return false;
    },
    
    toggleSavedJob: (jobId) => {
        let savedJobs = JobStorage.getSavedJobs();
        const index = savedJobs.indexOf(jobId);
        
        if (index === -1) {
            savedJobs.push(jobId);
        } else {
            savedJobs.splice(index, 1);
        }
        
        return Storage.set('savedJobs', savedJobs);
    },
    
    isJobApplied: (jobId) => JobStorage.getAppliedJobs().includes(jobId),
    isJobSaved: (jobId) => JobStorage.getSavedJobs().includes(jobId)
};

const UI = {
    showError: (message) => {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<strong>Error:</strong> ${message}`;
        errorDiv.style.cssText = 'background: #fee; color: #c00; padding: 10px; margin: 10px; border: 1px solid #c00; border-radius: 5px;';
        document.body.prepend(errorDiv);
        setTimeout(() => errorDiv.remove(), 5000);
    },
    
    showAlert: (message, type = 'info') => {
        alert(message); 
    },
    
    toggleMobileMenu: () => {
        const nav = document.querySelector('.nav');
        if (nav) nav.classList.toggle('active');
    }
};


function createJobCard(job) {
    const isApplied = JobStorage.isJobApplied(job.id);
    const isSaved = JobStorage.isJobSaved(job.id);
    
    const jobCard = document.createElement('div');
    jobCard.className = 'job-card';
    jobCard.dataset.id = job.id;
    
    jobCard.innerHTML = `
        <h3 class="job-title">${job.title}</h3>
        <p class="job-company">${job.company}</p>
        <div class="job-details">
            <span><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
            <span><i class="fas fa-money-bill-wave"></i> ${job.salary}</span>
            <span><i class="fas fa-clock"></i> ${job.type}</span>
        </div>
        <p class="job-description">${job.description.substring(0, 100)}...</p>
        <div class="job-actions">
            <a href="./job-details.html?id=${job.id}" class="btn">View Details</a>
            <button class="btn ${isApplied ? 'btn-secondary' : 'btn-success'} apply-btn" 
                    data-id="${job.id}" 
                    ${isApplied ? 'disabled' : ''}>
                ${isApplied ? 'Applied' : 'Apply Now'}
            </button>
            <button class="btn ${isSaved ? 'btn-danger' : 'btn-secondary'} save-btn" 
                    data-id="${job.id}">
                ${isSaved ? 'Unsave' : 'Save Job'}
            </button>
        </div>
    `;
    

    const applyBtn = jobCard.querySelector('.apply-btn');
    const saveBtn = jobCard.querySelector('.save-btn');
    
    applyBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        applyToJob(job.id, applyBtn);
    });
    
    saveBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        toggleSaveJob(job.id, saveBtn);
    });
    
    return jobCard;
}

function loadFeaturedJobs() {
    const jobsGrid = document.querySelector('.jobs-grid');
    if (!jobsGrid) return;
    
    jobsGrid.innerHTML = '';
    JOBS_DATA.slice(0, 4).forEach(job => {
        jobsGrid.appendChild(createJobCard(job));
    });
}

function loadAllJobs(filteredJobs = JOBS_DATA) {
    const jobsGrid = document.querySelector('.jobs-grid');
    if (!jobsGrid) return;
    
    jobsGrid.innerHTML = '';
    
    if (filteredJobs.length === 0) {
        jobsGrid.innerHTML = '<p class="no-jobs">No jobs found matching your criteria.</p>';
        return;
    }
    
    filteredJobs.forEach(job => {
        jobsGrid.appendChild(createJobCard(job));
    });
}

function applyToJob(jobId, buttonElement = null) {
    if (JobStorage.saveAppliedJob(jobId)) {
        UI.showAlert('Application submitted successfully!', 'success');
        
        if (buttonElement) {
            buttonElement.textContent = 'Applied';
            buttonElement.classList.replace('btn-success', 'btn-secondary');
            buttonElement.disabled = true;
        }
        
  
        if (window.location.pathname.includes('dashboard.html')) {
            loadDashboard();
        }
        
        return true;
    }
    
    UI.showAlert('You have already applied for this job.', 'warning');
    return false;
}

function toggleSaveJob(jobId, buttonElement = null) {
    const wasSaved = JobStorage.isJobSaved(jobId);
    JobStorage.toggleSavedJob(jobId);
    const isNowSaved = JobStorage.isJobSaved(jobId);
    
    if (buttonElement) {
        buttonElement.textContent = isNowSaved ? 'Unsave' : 'Save Job';
        buttonElement.classList.toggle('btn-danger', isNowSaved);
        buttonElement.classList.toggle('btn-secondary', !isNowSaved);
    }
    
    UI.showAlert(isNowSaved ? 'Job saved to your list!' : 'Job removed from saved list.', 'info');
    

    if (window.location.pathname.includes('dashboard.html')) {
        loadDashboard();
    }
}


function setupFilters() {
    const filterBtn = document.getElementById('filterBtn');
    const clearBtn = document.getElementById('clearBtn');
    
    if (!filterBtn) return;
    
    filterBtn.addEventListener('click', () => {
        const jobType = document.getElementById('jobTypeFilter')?.value || 'all';
        const location = (document.getElementById('locationFilter')?.value || '').toLowerCase();
        const salary = document.getElementById('salaryFilter')?.value || 'all';
        
        const filtered = JOBS_DATA.filter(job => {
            if (jobType !== 'all' && job.type !== jobType) return false;
            if (location && !job.location.toLowerCase().includes(location)) return false;
            if (salary !== 'all') {
                const salaryNum = parseInt(job.salary.replace(/[^0-9]/g, ''));
                if (salary === 'low' && salaryNum >= 50000) return false;
                if (salary === 'medium' && (salaryNum < 50000 || salaryNum >= 80000)) return false;
                if (salary === 'high' && salaryNum < 80000) return false;
            }
            return true;
        });
        
        loadAllJobs(filtered);
    });
    
    clearBtn?.addEventListener('click', () => {
        document.getElementById('jobTypeFilter').value = 'all';
        document.getElementById('locationFilter').value = '';
        document.getElementById('salaryFilter').value = 'all';
        loadAllJobs(JOBS_DATA);
    });
}

function loadJobDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = parseInt(urlParams.get('id'));
    const job = JOBS_DATA.find(j => j.id === jobId);
    
    if (!job) {
        document.querySelector('.job-detail-container').innerHTML = 
            '<p>Job not found. <a href="./jobs.html">Browse Jobs</a></p>';
        return;
    }
    

    const elements = {
        '.job-header': `
            <h1>${job.title}</h1>
            <p class="job-company">${job.company}</p>
            <div class="job-meta">
                <span><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
                <span><i class="fas fa-money-bill-wave"></i> ${job.salary}</span>
                <span><i class="fas fa-clock"></i> ${job.type}</span>
                <span><i class="fas fa-calendar"></i> ${job.posted}</span>
            </div>
        `,
        '.job-description-content': job.description,
        '.job-requirements-content': job.requirements.map(req => `<li>${req}</li>`).join(''),
        '.job-benefits-content': job.benefits.map(benefit => `<li>${benefit}</li>`).join('')
    };
    
    Object.entries(elements).forEach(([selector, content]) => {
        const element = document.querySelector(selector);
        if (element) element.innerHTML = content;
    });
    
    // Setup buttons
    const applyBtn = document.querySelector('.apply-btn-detail');
    const saveBtn = document.querySelector('.save-btn-detail');
    
    if (applyBtn) {
        const isApplied = JobStorage.isJobApplied(jobId);
        if (isApplied) {
            applyBtn.textContent = 'Already Applied';
            applyBtn.classList.replace('btn-success', 'btn-secondary');
            applyBtn.disabled = true;
        } else {
            applyBtn.addEventListener('click', () => {
                window.location.href = `./apply.html?id=${jobId}`;
            });
        }
    }
    
    if (saveBtn) {
        const isSaved = JobStorage.isJobSaved(jobId);
        saveBtn.textContent = isSaved ? 'Unsave Job' : 'Save Job';
        saveBtn.classList.toggle('btn-danger', isSaved);
        saveBtn.classList.toggle('btn-secondary', !isSaved);
        
        saveBtn.addEventListener('click', () => {
            toggleSaveJob(jobId, saveBtn);
        });
    }
}

function setupApplicationForm() {
    const form = document.getElementById('applyForm');
    if (!form) return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = parseInt(urlParams.get('id'));
    const job = JOBS_DATA.find(j => j.id === jobId);
    
    if (job) {
        document.getElementById('jobTitle').textContent = job.title;
        document.getElementById('companyName').textContent = job.company;
    }
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const phone = document.getElementById('phone')?.value.trim();
        
        if (!name || !email || !phone) {
            UI.showAlert('Please fill in all required fields.', 'warning');
            return;
        }
        
        if (jobId && !JobStorage.isJobApplied(jobId)) {
            JobStorage.saveAppliedJob(jobId);
            Storage.set('userName', name);
            Storage.set('userEmail', email);
            
            UI.showAlert(`Application submitted successfully for ${job?.title || 'the job'}!\n\nWe'll contact you at ${email} if selected.`, 'success');
            setTimeout(() => window.location.href = './dashboard.html', 1500);
        } else if (JobStorage.isJobApplied(jobId)) {
            UI.showAlert('You have already applied for this job.', 'warning');
        }
    });
}

function loadDashboard() {
    updateDashboardProfile();
    updateDashboardStats();
    loadApplicationsList();
    loadSavedJobsList();
    loadActivityTimeline();
    setupDashboardListeners();
}

function updateDashboardProfile() {
    const userName = Storage.get('userName') || 'Job Seeker';
    const userEmail = Storage.get('userEmail') || 'Click Edit to add email';
    

    const profileData = {
        'profileName': userName,
        'profileEmail': userEmail,
        'userEmailDisplay': userEmail,
        'headerUserName': userName,
        'welcomeMessage': getTimeBasedGreeting(userName)
    };
    
    Object.entries(profileData).forEach(([id, text]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = text;
    });
    
    updateProfileCompletion();
}

function getTimeBasedGreeting(name) {
    const hour = new Date().getHours();
    let greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
    return `${greeting}, ${name}!`;
}

function updateProfileCompletion() {
    let completion = 40;
    if (Storage.get('userName') !== 'Demo User') completion += 20;
    if (Storage.get('userEmail') !== 'demo@example.com') completion += 20;
    if (JobStorage.getAppliedJobs().length > 0) completion += 10;
    if (JobStorage.getSavedJobs().length > 0) completion += 10;
    
    const element = document.getElementById('profileCompletion');
    if (element) {
        element.textContent = `${Math.min(completion, 100)}%`;
        

        const colors = { low: '#ef4444', medium: '#f59e0b', high: '#10b981' };
        element.style.color = completion < 50 ? colors.low : completion < 80 ? colors.medium : colors.high;
    }
}

function updateDashboardStats() {
    const appliedJobs = JobStorage.getAppliedJobs();
    const savedJobs = JobStorage.getSavedJobs();
    
    const stats = {
        'appliedCount': appliedJobs.length,
        'savedCount': savedJobs.length,
        'viewedCount': Math.floor(Math.random() * 30) + appliedJobs.length,
        'interviewsCount': Math.min(Math.floor(appliedJobs.length * 0.3), appliedJobs.length)
    };
    
    Object.entries(stats).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    });
    
    updateResponseRate();
}

function updateResponseRate() {
    const appliedJobs = JobStorage.getAppliedJobs();
    if (appliedJobs.length === 0) {
        document.getElementById('responseRate').textContent = '0%';
        return;
    }
    

    let responses = 0;
    appliedJobs.forEach((_, index) => {
        if (Math.random() < Math.max(0.3, 0.6 - (index * 0.1))) responses++;
    });
    
    const rate = Math.round((responses / appliedJobs.length) * 100);
    const element = document.getElementById('responseRate');
    if (element) {
        element.textContent = `${rate}%`;
        element.style.color = rate < 20 ? '#ef4444' : rate < 50 ? '#f59e0b' : '#10b981';
    }
}

function loadApplicationsList() {
    const container = document.getElementById('applicationsList');
    if (!container) return;
    
    const appliedJobs = JobStorage.getAppliedJobs();
    
    if (appliedJobs.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-file-alt"></i>
                <p>No applications yet</p>
                <a href="./jobs.html" class="btn">Browse Jobs</a>
            </div>
        `;
        return;
    }
    
    const statuses = [
        { type: 'pending', label: 'Under Review' },
        { type: 'viewed', label: 'Profile Viewed' },
        { type: 'interview', label: 'Interview Scheduled' },
        { type: 'accepted', label: 'Offer Received' },
        { type: 'rejected', label: 'Not Selected' }
    ];
    
    let html = '';
    appliedJobs.slice(-5).reverse().forEach((jobId, index) => {
        const job = JOBS_DATA.find(j => j.id === jobId);
        if (!job) return;
        
        const status = index === 0 ? statuses[2] : 
                      index < 3 ? statuses[1] : 
                      statuses[Math.floor(Math.random() * 2)];
        
        html += `
            <div class="application-item">
                <div class="application-info">
                    <h4>${job.title}</h4>
                    <p>${job.company} • Applied ${Math.floor(Math.random() * 7) + 1} days ago</p>
                </div>
                <div class="application-actions">
                    <span class="status status-${status.type}">${status.label}</span>
                    <a href="./job-details.html?id=${job.id}" class="btn btn-icon" title="View Job">
                        <i class="fas fa-eye"></i>
                    </a>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function loadSavedJobsList() {
    const container = document.getElementById('savedJobsList');
    if (!container) return;
    
    const savedJobs = JobStorage.getSavedJobs();
    
    if (savedJobs.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-bookmark"></i>
                <p>No saved jobs yet</p>
                <a href="./jobs.html" class="btn">Save Jobs</a>
            </div>
        `;
        return;
    }
    
    let html = '';
    savedJobs.slice(-5).reverse().forEach(jobId => {
        const job = JOBS_DATA.find(j => j.id === jobId);
        if (!job) return;
        
        html += `
            <div class="saved-job-item">
                <div class="saved-job-info">
                    <h4>${job.title}</h4>
                    <p>${job.company} • ${job.location} • Saved ${Math.floor(Math.random() * 5) + 1} days ago</p>
                </div>
                <div class="saved-job-actions">
                    <button class="btn btn-icon unsave-btn" data-id="${job.id}" title="Remove from Saved">
                        <i class="fas fa-trash"></i>
                    </button>
                    <a href="./job-details.html?id=${job.id}" class="btn btn-icon" title="View Job">
                        <i class="fas fa-external-link-alt"></i>
                    </a>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    

    container.querySelectorAll('.unsave-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const jobId = parseInt(btn.dataset.id);
            if (confirm('Remove this job from your saved list?')) {
                JobStorage.toggleSavedJob(jobId);
                loadSavedJobsList();
                updateDashboardStats();
            }
        });
    });
}

function loadActivityTimeline() {
    const container = document.getElementById('activityTimeline');
    if (!container) return;
    
    const activities = [
        { icon: 'fa-user-plus', title: 'Profile Updated', description: 'You updated your profile information', time: 'Just now' },
        { icon: 'fa-paper-plane', title: 'Application Sent', description: 'Applied for Frontend Developer position', time: '2 hours ago' },
        { icon: 'fa-bookmark', title: 'Job Saved', description: 'Saved Data Analyst role for later', time: 'Yesterday' },
        { icon: 'fa-search', title: 'Job Search', description: 'Searched for "remote developer" jobs', time: '2 days ago' }
    ];
    
    container.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="fas ${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <h5>${activity.title}</h5>
                <p>${activity.description}</p>
                <div class="activity-time">${activity.time}</div>
            </div>
        </div>
    `).join('');
}

function setupDashboardListeners() {

    document.getElementById('editProfileBtn')?.addEventListener('click', () => {
        const newName = prompt('Enter your full name:', Storage.get('userName') || '');
        if (!newName) return;
        
        const newEmail = prompt('Enter your email:', Storage.get('userEmail') || '');
        if (!newEmail) return;
        
        Storage.set('userName', newName);
        Storage.set('userEmail', newEmail);
        updateDashboardProfile();
        UI.showAlert('Profile updated successfully!', 'success');
    });
    

    document.getElementById('exportDataBtn')?.addEventListener('click', () => {
        const data = {
            userName: Storage.get('userName'),
            userEmail: Storage.get('userEmail'),
            appliedJobs: JobStorage.getAppliedJobs(),
            savedJobs: JobStorage.getSavedJobs(),
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `jobportal-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        UI.showAlert('Data exported successfully!', 'success');
    });
    

    document.getElementById('resetDemoBtn')?.addEventListener('click', () => {
        if (confirm('Reset all demo data? This will clear all your applications and saved jobs.')) {
            Storage.remove('appliedJobs');
            Storage.remove('savedJobs');
            Storage.set('userName', 'Demo User');
            Storage.set('userEmail', 'demo@example.com');
            
            const today = new Date().toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });
            Storage.set('memberSince', today);
            
            setTimeout(() => location.reload(), 1000);
            UI.showAlert('Demo data reset! Page will reload.', 'info');
        }
    });
}


function initializeApp() {

    if (!Storage.get('appliedJobs')) Storage.set('appliedJobs', [2, 4]);
    if (!Storage.get('savedJobs')) Storage.set('savedJobs', [1, 3]);
    if (!Storage.get('userName')) Storage.set('userName', 'Demo User');
    if (!Storage.get('userEmail')) Storage.set('userEmail', 'demo@example.com');
    

    document.querySelector('.mobile-menu')?.addEventListener('click', UI.toggleMobileMenu);
    

    document.querySelector('.search-box .btn')?.addEventListener('click', () => {
        const keyword = document.querySelector('.search-box input:first-child')?.value || '';
        const location = document.querySelector('.search-box input:last-child')?.value || '';
        
        if (keyword || location) {
            UI.showAlert(`Searching for "${keyword}" jobs in "${location}"...`);
            window.location.href = `./jobs.html?search=${encodeURIComponent(keyword)}&location=${encodeURIComponent(location)}`;
        }
    });
    

    document.getElementById('loginBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        const userName = prompt('Enter your name:', Storage.get('userName') || '');
        if (userName) {
            Storage.set('userName', userName);
            UI.showAlert(`Welcome back, ${userName}!`);
            window.location.href = './dashboard.html';
        }
    });
    
    document.getElementById('registerBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        const userName = prompt('Create a username:');
        if (!userName) return;
        
        const userEmail = prompt('Enter your email:');
        if (!userEmail) return;
        
        Storage.set('userName', userName);
        Storage.set('userEmail', userEmail);
        UI.showAlert(`Account created! Welcome ${userName}.`);
        window.location.href = './dashboard.html';
    });
    

    const currentPage = window.location.pathname;
    
    if (currentPage.includes('index.html') || currentPage === '/' || currentPage.endsWith('/')) {
        loadFeaturedJobs();
    } else if (currentPage.includes('jobs.html')) {
        loadAllJobs();
        setupFilters();
    } else if (currentPage.includes('job-details.html')) {
        loadJobDetails();
    } else if (currentPage.includes('dashboard.html')) {
        loadDashboard();
    } else if (currentPage.includes('apply.html')) {
        setupApplicationForm();
    }
    

    setTimeout(() => {
        const jobsGrid = document.querySelector('.jobs-grid');
        if (jobsGrid && jobsGrid.children.length === 0) {
            const manualBtn = document.createElement('button');
            manualBtn.textContent = 'Load Jobs';
            manualBtn.className = 'btn manual-load';
            manualBtn.onclick = () => {
                if (currentPage.includes('jobs.html')) loadAllJobs();
                else loadFeaturedJobs();
                manualBtn.remove();
            };
            jobsGrid.after(manualBtn);
        }
    }, 1000);
}

document.addEventListener('DOMContentLoaded', initializeApp);

window.addEventListener('load', () => {
    console.log('Page loaded:', window.location.href);
});