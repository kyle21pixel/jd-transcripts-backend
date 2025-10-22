// Navigation script for TranscribeHub
document.addEventListener('DOMContentLoaded', function() {
    // Get current page path
    const currentPath = window.location.pathname;
    const pageName = currentPath.split('/').pop();
    
    // Set active navigation link based on current page
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === pageName || 
            (pageName === '' && href === 'new-home.html') ||
            (pageName === 'index.html' && href === 'new-home.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Add admin dashboard link if user is logged in (secure check)
    fetch('/api/auth/check-admin', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.isAdmin) {
            const navbarNav = document.querySelector('.navbar-nav');
            if (navbarNav) {
                // Check if admin link already exists
                const adminLinkExists = Array.from(navbarNav.querySelectorAll('.nav-link')).some(
                    link => link.getAttribute('href') === 'new-admin.html'
                );
                
                if (!adminLinkExists) {
                    const adminLi = document.createElement('li');
                    adminLi.className = 'nav-item';
                    
                    const adminLink = document.createElement('a');
                    adminLink.className = 'nav-link';
                    adminLink.href = 'new-admin.html';
                    adminLink.textContent = 'Admin Dashboard';
                    
                    if (pageName === 'new-admin.html') {
                        adminLink.classList.add('active');
                    }
                    
                    adminLi.appendChild(adminLink);
                    navbarNav.appendChild(adminLi);
                }
            }
        }
    })
    .catch(error => console.error('Error checking admin status:', error));
    
    // Add transcriber dashboard link if user is a transcriber (simulated)
    const isTranscriber = localStorage.getItem('isTranscriber') === 'true';
    if (isTranscriber) {
        const navbarNav = document.querySelector('.navbar-nav');
        if (navbarNav) {
            // Check if transcriber link already exists
            const transcriberLinkExists = Array.from(navbarNav.querySelectorAll('.nav-link')).some(
                link => link.getAttribute('href') === 'new-transcriber.html'
            );
            
            if (!transcriberLinkExists) {
                const transcriberLi = document.createElement('li');
                transcriberLi.className = 'nav-item';
                
                const transcriberLink = document.createElement('a');
                transcriberLink.className = 'nav-link';
                transcriberLink.href = 'new-transcriber.html';
                transcriberLink.textContent = 'Transcriber Dashboard';
                
                if (pageName === 'new-transcriber.html') {
                    transcriberLink.classList.add('active');
                }
                
                transcriberLi.appendChild(transcriberLink);
                navbarNav.appendChild(transcriberLi);
            }
        }
    }
    
    // Handle login/logout button
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const loginLinks = document.querySelectorAll('a[href="new-login.html"]');
    
    loginLinks.forEach(link => {
        if (isLoggedIn) {
            link.textContent = 'Logout';
            link.addEventListener('click', function(e) {
                if (link.textContent === 'Logout') {
                    e.preventDefault();
                    // Clear login status
                    localStorage.removeItem('isLoggedIn');
                    localStorage.removeItem('isAdmin');
                    localStorage.removeItem('isTranscriber');
                    // Redirect to home
                    window.location.href = 'new-home.html';
                }
            });
        } else {
            link.textContent = 'Login';
        }
    });
    
    // Add login simulation to login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            
            // Simulate login
            localStorage.setItem('isLoggedIn', 'true');
            
            // Simulate different user roles based on email
            if (email.includes('admin')) {
                localStorage.setItem('isAdmin', 'true');
                window.location.href = 'new-admin.html';
            } else if (email.includes('transcriber')) {
                localStorage.setItem('isTranscriber', 'true');
                window.location.href = 'new-transcriber.html';
            } else {
                window.location.href = 'new-home.html';
            }
        });
    }
});