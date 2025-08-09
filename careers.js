// Careers Page JavaScript
class CareersPage {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 5;
        this.selectedPosition = null;
        this.uploadedFiles = [];
        
        this.init();
    }

    init() {
        this.loadPositions();
        this.setupEventListeners();
        this.setupFileUpload();
    }

    async loadPositions() {
        try {
            // In production, this would fetch from API
            // const response = await fetch('/api/careers/positions');
            // const data = await response.json();
            
            // Sample positions data
            const positions = [
                {
                    id: 'legal-transcriber',
                    title: 'Legal Transcriber',
                    department: 'Transcription',
                    type: 'Full-time / Part-time',
                    location: 'Remote',
                    description: 'Transcribe legal proceedings, depositions, and court hearings with high accuracy and attention to detail.',
                    requirements: [
                        '2+ years of legal transcription experience',
                        'Knowledge of legal terminology and procedures',
                        'Typing speed of 75+ WPM with 98% accuracy',
                        'Familiarity with legal document formats',
                        'Understanding of confidentiality requirements'
                    ],
                    responsibilities: [
                        'Transcribe legal audio recordings accurately',
                        'Ensure proper formatting and legal terminology',
                        'Meet strict deadlines for court proceedings',
                        'Maintain confidentiality of sensitive information',
                        'Communicate with legal teams as needed'
                    ],
                    salary: '$22-28/hour',
                    benefits: [
                        'Flexible working hours',
                        'Work from home',
                        'Performance bonuses',
                        'Professional development opportunities',
                        'Health insurance (full-time)'
                    ]
                },
                {
                    id: 'medical-transcriber',
                    title: 'Medical Transcriber',
                    department: 'Transcription',
                    type: 'Full-time / Part-time',
                    location: 'Remote',
                    description: 'Transcribe medical reports, patient consultations, and clinical notes with precision and HIPAA compliance.',
                    requirements: [
                        '1+ years of medical transcription experience',
                        'Knowledge of medical terminology and anatomy',
                        'Typing speed of 70+ WPM with 98% accuracy',
                        'Understanding of HIPAA compliance',
                        'Familiarity with medical report formats'
                    ],
                    responsibilities: [
                        'Transcribe medical dictations and reports',
                        'Ensure accuracy of medical terminology',
                        'Maintain patient confidentiality (HIPAA)',
                        'Follow medical formatting standards',
                        'Quality check all transcribed documents'
                    ],
                    salary: '$24-30/hour',
                    benefits: [
                        'Flexible scheduling',
                        'Remote work opportunity',
                        'Health insurance (full-time)',
                        'Continuing education support',
                        'Career advancement opportunities'
                    ]
                },
                {
                    id: 'business-transcriber',
                    title: 'Business Transcriber',
                    department: 'Transcription',
                    type: 'Part-time / Contract',
                    location: 'Remote',
                    description: 'Transcribe business meetings, conferences, and corporate communications with professional accuracy.',
                    requirements: [
                        'Excellent listening and typing skills',
                        'Typing speed of 65+ WPM with 95% accuracy',
                        'Understanding of business terminology',
                        'Reliable internet connection',
                        'Professional communication skills'
                    ],
                    responsibilities: [
                        'Transcribe business meetings and conferences',
                        'Ensure accurate speaker identification',
                        'Meet project deadlines consistently',
                        'Communicate with project managers',
                        'Maintain professional standards'
                    ],
                    salary: '$18-24/hour',
                    benefits: [
                        'Flexible hours',
                        'Work from anywhere',
                        'Weekly payments',
                        'Growth opportunities',
                        'Training provided'
                    ]
                },
                {
                    id: 'general-transcriber',
                    title: 'General Transcriber',
                    department: 'Transcription',
                    type: 'Part-time / Freelance',
                    location: 'Remote',
                    description: 'Transcribe various types of audio content including interviews, podcasts, and general recordings.',
                    requirements: [
                        'Strong attention to detail',
                        'Typing speed of 60+ WPM with 95% accuracy',
                        'Good listening skills',
                        'Basic computer proficiency',
                        'Reliable work schedule'
                    ],
                    responsibilities: [
                        'Transcribe various audio content types',
                        'Ensure accurate transcription',
                        'Meet assigned deadlines',
                        'Follow style guidelines',
                        'Communicate progress updates'
                    ],
                    salary: '$15-20/hour',
                    benefits: [
                        'Entry-level friendly',
                        'Flexible schedule',
                        'Training provided',
                        'Growth potential',
                        'Supportive team environment'
                    ]
                },
                {
                    id: 'qa-specialist',
                    title: 'Quality Assurance Specialist',
                    department: 'Quality Control',
                    type: 'Full-time',
                    location: 'Remote',
                    description: 'Review and ensure quality of transcribed documents before delivery to clients.',
                    requirements: [
                        '3+ years of transcription experience',
                        'Excellent proofreading skills',
                        'Knowledge of multiple transcription specialties',
                        'Leadership and training abilities',
                        'Strong communication skills'
                    ],
                    responsibilities: [
                        'Review transcribed documents for accuracy',
                        'Provide feedback to transcribers',
                        'Maintain quality standards',
                        'Train new team members',
                        'Generate quality reports'
                    ],
                    salary: '$28-35/hour',
                    benefits: [
                        'Full benefits package',
                        'Paid time off',
                        'Professional development',
                        'Leadership opportunities',
                        'Performance bonuses'
                    ]
                }
            ];

            this.renderPositions(positions);
        } catch (error) {
            console.error('Error loading positions:', error);
            this.showError('Failed to load positions. Please refresh the page.');
        }
    }

    renderPositions(positions) {
        const grid = document.getElementById('positionsGrid');
        
        grid.innerHTML = positions.map(position => `
            <div class="position-card" data-position-id="${position.id}">
                <div class="position-header">
                    <div>
                        <h3 class="position-title">${position.title}</h3>
                        <div class="position-meta">
                            <span><i class="fas fa-building"></i> ${position.department}</span>
                            <span><i class="fas fa-clock"></i> ${position.type}</span>
                            <span><i class="fas fa-map-marker-alt"></i> ${position.location}</span>
                        </div>
                    </div>
                    <div class="position-salary">${position.salary}</div>
                </div>
                
                <p class="position-description">${position.description}</p>
                
                <div class="position-details">
                    <div class="detail-section">
                        <h4>Requirements</h4>
                        <ul>
                            ${position.requirements.map(req => `
                                <li><i class="fas fa-check"></i> ${req}</li>
                            `).join('')}
                        </ul>
                    </div>
                    
                    <div class="detail-section">
                        <h4>Responsibilities</h4>
                        <ul>
                            ${position.responsibilities.slice(0, 3).map(resp => `
                                <li><i class="fas fa-arrow-right"></i> ${resp}</li>
                            `).join('')}
                            ${position.responsibilities.length > 3 ? `<li><i class="fas fa-ellipsis-h"></i> And more...</li>` : ''}
                        </ul>
                    </div>
                    
                    <div class="detail-section">
                        <h4>Benefits</h4>
                        <ul>
                            ${position.benefits.slice(0, 3).map(benefit => `
                                <li><i class="fas fa-star"></i> ${benefit}</li>
                            `).join('')}
                            ${position.benefits.length > 3 ? `<li><i class="fas fa-plus"></i> More benefits...</li>` : ''}
                        </ul>
                    </div>
                </div>
                
                <div class="position-actions">
                    <button class="btn btn-outline btn-sm" onclick="careers.viewPosition('${position.id}')">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                    <button class="btn btn-primary btn-sm" onclick="careers.applyForPosition('${position.id}', '${position.title}')">
                        <i class="fas fa-paper-plane"></i> Apply Now
                    </button>
                </div>
            </div>
        `).join('');
    }

    setupEventListeners() {
        // Form navigation
        document.getElementById('nextBtn').addEventListener('click', () => this.nextStep());
        document.getElementById('prevBtn').addEventListener('click', () => this.prevStep());
        document.getElementById('applicationForm').addEventListener('submit', (e) => this.submitApplication(e));

        // Form validation
        document.querySelectorAll('input[required], select[required]').forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
        });

        // Specialization validation
        document.querySelectorAll('input[name="specializations"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.validateSpecializations());
        });

        // Equipment validation
        document.querySelectorAll('input[name="hasComputer"], input[name="hasHeadphones"], input[name="hasInternet"], input[name="hasWorkspace"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.validateEquipment());
        });
    }

    setupFileUpload() {
        const fileUpload = document.getElementById('fileUpload');
        const fileInput = document.getElementById('documents');
        const fileList = document.getElementById('fileList');

        // Click to upload
        fileUpload.addEventListener('click', () => fileInput.click());

        // Drag and drop
        fileUpload.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileUpload.classList.add('dragover');
        });

        fileUpload.addEventListener('dragleave', () => {
            fileUpload.classList.remove('dragover');
        });

        fileUpload.addEventListener('drop', (e) => {
            e.preventDefault();
            fileUpload.classList.remove('dragover');
            this.handleFiles(e.dataTransfer.files);
        });

        // File input change
        fileInput.addEventListener('change', (e) => {
            this.handleFiles(e.target.files);
        });
    }

    handleFiles(files) {
        const fileList = document.getElementById('fileList');
        
        Array.from(files).forEach(file => {
            if (this.validateFile(file)) {
                this.uploadedFiles.push(file);
                
                const fileItem = document.createElement('div');
                fileItem.style.cssText = `
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.5rem;
                    background: #f8fafc;
                    border-radius: 0.375rem;
                    margin-bottom: 0.5rem;
                `;
                
                fileItem.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <i class="fas fa-file" style="color: #64748b;"></i>
                        <span style="font-size: 0.875rem;">${file.name}</span>
                        <span style="font-size: 0.75rem; color: #64748b;">(${this.formatFileSize(file.size)})</span>
                    </div>
                    <button type="button" onclick="careers.removeFile('${file.name}')" style="background: none; border: none; color: #ef4444; cursor: pointer;">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                
                fileList.appendChild(fileItem);
            }
        });
    }

    validateFile(file) {
        const maxSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/jpg', 'image/png'];
        
        if (file.size > maxSize) {
            this.showError(`File ${file.name} is too large. Maximum size is 10MB.`);
            return false;
        }
        
        if (!allowedTypes.includes(file.type)) {
            this.showError(`File ${file.name} has an unsupported format. Please use PDF, DOC, DOCX, JPG, or PNG.`);
            return false;
        }
        
        return true;
    }

    removeFile(filename) {
        this.uploadedFiles = this.uploadedFiles.filter(file => file.name !== filename);
        this.updateFileList();
    }

    updateFileList() {
        const fileList = document.getElementById('fileList');
        fileList.innerHTML = '';
        this.uploadedFiles.forEach(file => {
            // Re-render file list
            this.handleFiles([file]);
        });
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    applyForPosition(positionId, positionTitle) {
        this.selectedPosition = { id: positionId, title: positionTitle };
        
        // Scroll to application form
        document.getElementById('applicationSection').style.display = 'block';
        document.getElementById('applicationSection').scrollIntoView({ behavior: 'smooth' });
        
        // Update form title
        document.querySelector('#applicationSection .section-title').textContent = `Apply for ${positionTitle}`;
    }

    viewPosition(positionId) {
        // In a real application, this would show a detailed modal or navigate to a detail page
        alert(`Viewing details for position: ${positionId}\n\nThis would show a detailed view with full job description, requirements, and company information.`);
    }

    nextStep() {
        if (this.validateCurrentStep()) {
            if (this.currentStep < this.totalSteps) {
                this.currentStep++;
                this.updateStepDisplay();
            }
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStepDisplay();
        }
    }

    updateStepDisplay() {
        // Update step indicators
        document.querySelectorAll('.step').forEach((step, index) => {
            const stepNumber = index + 1;
            step.classList.remove('active', 'completed', 'inactive');
            
            if (stepNumber < this.currentStep) {
                step.classList.add('completed');
            } else if (stepNumber === this.currentStep) {
                step.classList.add('active');
            } else {
                step.classList.add('inactive');
            }
        });

        // Update form steps
        document.querySelectorAll('.form-step').forEach((step, index) => {
            const stepNumber = index + 1;
            step.classList.toggle('active', stepNumber === this.currentStep);
        });

        // Update navigation buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const submitBtn = document.getElementById('submitBtn');

        prevBtn.style.display = this.currentStep > 1 ? 'block' : 'none';
        
        if (this.currentStep === this.totalSteps) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'block';
        } else {
            nextBtn.style.display = 'block';
            submitBtn.style.display = 'none';
        }
    }

    validateCurrentStep() {
        const currentStepElement = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
        const requiredFields = currentStepElement.querySelectorAll('input[required], select[required]');
        
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        // Special validations
        if (this.currentStep === 3) {
            if (!this.validateSpecializations()) {
                isValid = false;
            }
        }

        if (this.currentStep === 5) {
            if (!this.validateEquipment()) {
                isValid = false;
            }
        }

        return isValid;
    }

    validateField(field) {
        const value = field.type === 'checkbox' ? field.checked : field.value.trim();
        const isValid = field.type === 'checkbox' ? field.checked : value !== '';
        
        // Visual feedback
        field.style.borderColor = isValid ? '#d1d5db' : '#ef4444';
        
        if (!isValid) {
            this.showFieldError(field, 'This field is required');
        } else {
            this.clearFieldError(field);
        }
        
        return isValid;
    }

    validateSpecializations() {
        const checkboxes = document.querySelectorAll('input[name="specializations"]:checked');
        const isValid = checkboxes.length > 0;
        
        const container = document.querySelector('input[name="specializations"]').closest('.form-group');
        const errorElement = container.querySelector('.field-error');
        
        if (!isValid) {
            if (!errorElement) {
                const error = document.createElement('div');
                error.className = 'field-error';
                error.style.cssText = 'color: #ef4444; font-size: 0.875rem; margin-top: 0.25rem;';
                error.textContent = 'Please select at least one specialization';
                container.appendChild(error);
            }
        } else {
            if (errorElement) {
                errorElement.remove();
            }
        }
        
        return isValid;
    }

    validateEquipment() {
        const requiredEquipment = ['hasComputer', 'hasHeadphones', 'hasInternet', 'hasWorkspace'];
        const isValid = requiredEquipment.every(name => document.querySelector(`input[name="${name}"]`).checked);
        
        const container = document.querySelector('input[name="hasComputer"]').closest('.form-group');
        const errorElement = container.querySelector('.field-error');
        
        if (!isValid) {
            if (!errorElement) {
                const error = document.createElement('div');
                error.className = 'field-error';
                error.style.cssText = 'color: #ef4444; font-size: 0.875rem; margin-top: 0.25rem;';
                error.textContent = 'All equipment requirements must be checked';
                container.appendChild(error);
            }
        } else {
            if (errorElement) {
                errorElement.remove();
            }
        }
        
        return isValid;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        
        const error = document.createElement('div');
        error.className = 'field-error';
        error.style.cssText = 'color: #ef4444; font-size: 0.875rem; margin-top: 0.25rem;';
        error.textContent = message;
        
        field.parentNode.appendChild(error);
    }

    clearFieldError(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    async submitApplication(e) {
        e.preventDefault();
        
        if (!this.validateCurrentStep()) {
            return;
        }

        const submitBtn = document.getElementById('submitBtn');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitBtn.disabled = true;

        try {
            const formData = this.collectFormData();
            
            // In production, this would submit to the API
            // const response = await fetch('/api/careers/apply', {
            //     method: 'POST',
            //     body: formData
            // });
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success message
            document.getElementById('applicationForm').style.display = 'none';
            document.getElementById('successMessage').classList.add('show');
            
            // Generate application ID for demo
            const applicationId = 'APP-' + Date.now();
            document.getElementById('successMessage').innerHTML = `
                <i class="fas fa-check-circle"></i>
                <strong>Application Submitted Successfully!</strong>
                <p>Application ID: <strong>${applicationId}</strong></p>
                <p>Thank you for your interest in joining our team. We'll review your application and get back to you within 2-3 business days.</p>
                <p>You should receive a confirmation email shortly at ${document.getElementById('email').value}</p>
            `;
            
            // Scroll to success message
            document.getElementById('successMessage').scrollIntoView({ behavior: 'smooth' });
            
        } catch (error) {
            console.error('Error submitting application:', error);
            this.showError('Failed to submit application. Please try again.');
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    collectFormData() {
        const formData = new FormData();
        
        // Collect all form data
        const applicationData = {
            position: this.selectedPosition?.title || 'General Application',
            personalInfo: {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: {
                    city: document.getElementById('city').value,
                    state: document.getElementById('state').value,
                    country: document.getElementById('country').value
                }
            },
            experience: {
                yearsOfExperience: parseInt(document.getElementById('yearsExperience').value) || 0,
                transcriptionExperience: parseInt(document.getElementById('transcriptionExperience').value) || 0,
                relevantExperience: document.getElementById('relevantExperience').value,
                typingSpeed: {
                    wpm: parseInt(document.getElementById('typingSpeed').value) || 0,
                    accuracy: parseInt(document.getElementById('typingAccuracy').value) || 0
                }
            },
            skills: {
                specializations: Array.from(document.querySelectorAll('input[name="specializations"]:checked')).map(cb => cb.value),
                transcriptionTypes: Array.from(document.querySelectorAll('input[name="transcriptionTypes"]:checked')).map(cb => cb.value),
                languages: document.getElementById('languages').value,
                certifications: document.getElementById('certifications').value
            },
            availability: {
                workType: document.getElementById('workType').value,
                hoursPerWeek: parseInt(document.getElementById('hoursPerWeek').value) || 0,
                preferredSchedule: document.getElementById('preferredSchedule').value,
                startDate: document.getElementById('startDate').value,
                canWorkWeekends: document.getElementById('weekends').checked,
                canWorkHolidays: document.getElementById('holidays').checked
            },
            compensation: {
                expectedHourlyRate: parseInt(document.getElementById('expectedRate').value) || 0
            },
            equipment: {
                hasComputer: document.getElementById('hasComputer').checked,
                hasHeadphones: document.getElementById('hasHeadphones').checked,
                hasReliableInternet: document.getElementById('hasInternet').checked,
                hasQuietWorkspace: document.getElementById('hasWorkspace').checked,
                additionalEquipment: document.getElementById('equipmentDetails').value
            },
            questionnaire: {
                whyInterested: document.getElementById('whyInterested').value,
                strengths: document.getElementById('strengths').value
            },
            source: 'website'
        };

        formData.append('applicationData', JSON.stringify(applicationData));
        
        // Add files
        this.uploadedFiles.forEach((file, index) => {
            formData.append(`documents`, file);
        });

        return formData;
    }

    showError(message) {
        // Create error notification
        const error = document.createElement('div');
        error.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ef4444;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            z-index: 3000;
            animation: slideIn 0.3s ease-out;
        `;
        error.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;

        document.body.appendChild(error);

        // Remove after 5 seconds
        setTimeout(() => {
            error.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => error.remove(), 300);
        }, 5000);
    }
}

// Initialize careers page
let careers;
document.addEventListener('DOMContentLoaded', function() {
    careers = new CareersPage();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);