// Sample job data
const positions = [
    {
        id: 1,
        title: 'Senior Legal Transcriber',
        type: 'Full-time',
        category: 'Legal',
        location: 'Remote',
        description: 'We are seeking an experienced legal transcriber with at least 3 years of experience in legal transcription. The ideal candidate will have excellent typing skills, attention to detail, and knowledge of legal terminology.',
        requirements: [
            'At least 3 years of experience in legal transcription',
            'Typing speed of at least 70 WPM',
            'Excellent grammar and punctuation skills',
            'Knowledge of legal terminology',
            'Ability to work independently and meet deadlines'
        ],
        responsibilities: [
            'Transcribe legal proceedings, depositions, and interviews',
            'Ensure accuracy and completeness of transcripts',
            'Format documents according to client specifications',
            'Meet deadlines consistently',
            'Maintain confidentiality of sensitive information'
        ],
        date: '2023-05-01',
        salary: '$20-30 per hour',
        applications: 12
    },
    {
        id: 2,
        title: 'Medical Transcriptionist',
        type: 'Part-time',
        category: 'Medical',
        location: 'Remote',
        description: 'We are looking for a detail-oriented medical transcriptionist to join our team. The successful candidate will transcribe medical dictations and ensure accuracy of medical terminology.',
        requirements: [
            'Experience in medical transcription',
            'Knowledge of medical terminology',
            'Typing speed of at least 60 WPM',
            'Excellent listening skills',
            'Ability to work flexible hours'
        ],
        responsibilities: [
            'Transcribe medical dictations and reports',
            'Ensure accuracy of medical terminology',
            'Format documents according to client specifications',
            'Meet deadlines consistently',
            'Maintain confidentiality of patient information'
        ],
        date: '2023-05-10',
        salary: '$18-25 per hour',
        applications: 8
    },
    {
        id: 3,
        title: 'Transcription Quality Assurance Specialist',
        type: 'Full-time',
        category: 'Quality',
        location: 'Remote',
        description: 'We are seeking a Quality Assurance Specialist to review transcripts for accuracy and quality. The ideal candidate will have excellent attention to detail and strong editing skills.',
        requirements: [
            'At least 2 years of experience in transcription or editing',
            'Excellent grammar and punctuation skills',
            'Strong attention to detail',
            'Ability to provide constructive feedback',
            'Knowledge of multiple transcription styles'
        ],
        responsibilities: [
            'Review transcripts for accuracy and quality',
            'Provide feedback to transcribers',
            'Ensure adherence to client specifications',
            'Maintain quality standards',
            'Train new transcribers on quality standards'
        ],
        date: '2023-05-15',
        salary: '$22-32 per hour',
        applications: 5
    },
    {
        id: 4,
        title: 'Transcription Project Manager',
        type: 'Full-time',
        category: 'Management',
        location: 'Remote',
        description: 'We are looking for a Transcription Project Manager to oversee transcription projects and ensure timely delivery. The ideal candidate will have excellent organizational and communication skills.',
        requirements: [
            'At least 2 years of experience in project management',
            'Experience in transcription or related field',
            'Excellent organizational skills',
            'Strong communication skills',
            'Ability to work under pressure and meet deadlines'
        ],
        responsibilities: [
            'Manage transcription projects from start to finish',
            'Assign projects to transcribers based on skills and availability',
            'Monitor project progress and ensure timely delivery',
            'Communicate with clients regarding project status',
            'Resolve issues and address client concerns'
        ],
        date: '2023-05-20',
        salary: '$25-35 per hour',
        applications: 3
    },
    {
        id: 5,
        title: 'Academic Transcriber',
        type: 'Part-time',
        category: 'Academic',
        location: 'Remote',
        description: 'We are looking for an Academic Transcriber to transcribe research interviews, focus groups, and lectures. The ideal candidate will have experience in academic transcription and knowledge of research methodologies.',
        requirements: [
            'Experience in academic transcription',
            'Knowledge of research methodologies',
            'Typing speed of at least 60 WPM',
            'Excellent listening skills',
            'Ability to work flexible hours'
        ],
        responsibilities: [
            'Transcribe research interviews, focus groups, and lectures',
            'Ensure accuracy and completeness of transcripts',
            'Format documents according to client specifications',
            'Meet deadlines consistently',
            'Maintain confidentiality of research data'
        ],
        date: '2023-06-01',
        salary: '$18-25 per hour',
        applications: 7
    },
    {
        id: 6,
        title: 'Business Meeting Transcriber',
        type: 'Contract',
        category: 'Business',
        location: 'Remote',
        description: 'We are seeking a Business Meeting Transcriber to transcribe corporate meetings, interviews, and conferences. The ideal candidate will have experience in business transcription and knowledge of corporate terminology.',
        requirements: [
            'Experience in business transcription',
            'Knowledge of corporate terminology',
            'Typing speed of at least 60 WPM',
            'Excellent listening skills',
            'Ability to work on tight deadlines'
        ],
        responsibilities: [
            'Transcribe business meetings, interviews, and conferences',
            'Ensure accuracy and completeness of transcripts',
            'Format documents according to client specifications',
            'Meet tight deadlines consistently',
            'Maintain confidentiality of business information'
        ],
        date: '2023-06-05',
        salary: '$20-28 per hour',
        applications: 4
    }
];

// DOM Elements
const positionsGrid = document.getElementById('positionsGrid');
const applicationSection = document.getElementById('applicationSection');
const applicationForm = document.getElementById('applicationForm');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');
const successMessage = document.getElementById('successMessage');

// Current step and selected position
let currentStep = 1;
let selectedPosition = null;

// Load positions
function loadPositions() {
    positionsGrid.innerHTML = '';
    
    positions.forEach(position => {
        const positionCard = document.createElement('div');
        positionCard.className = 'position-card';
        positionCard.innerHTML = `
            <div class="position-header">
                <h3>${position.title}</h3>
                <span class="position-type">${position.type}</span>
            </div>
            <div class="position-details">
                <div class="position-info">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${position.location}</span>
                </div>
                <div class="position-info">
                    <i class="fas fa-tag"></i>
                    <span>${position.category}</span>
                </div>
                <div class="position-info">
                    <i class="fas fa-dollar-sign"></i>
                    <span>${position.salary}</span>
                </div>
                <div class="position-info">
                    <i class="fas fa-calendar-alt"></i>
                    <span>Posted: ${position.date}</span>
                </div>
            </div>
            <p class="position-description">${position.description}</p>
            <div class="position-meta">
                <span class="position-applications">
                    <i class="fas fa-users"></i> ${position.applications} applications
                </span>
                <button class="btn btn-primary apply-btn" data-position-id="${position.id}">Apply Now</button>
            </div>
        `;
        positionsGrid.appendChild(positionCard);
    });
    
    // Add event listeners to apply buttons
    document.querySelectorAll('.apply-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const positionId = parseInt(this.getAttribute('data-position-id'));
            selectedPosition = positions.find(p => p.id === positionId);
            
            // Update form with position details
            document.getElementById('positionTitle').textContent = selectedPosition.title;
            document.getElementById('positionType').textContent = selectedPosition.type;
            document.getElementById('positionLocation').textContent = selectedPosition.location;
            
            // Show application section
            applicationSection.style.display = 'block';
            
            // Scroll to application section
            applicationSection.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// Handle form navigation
function navigateForm(direction) {
    // Validate current step
    if (direction === 'next' && !validateStep(currentStep)) {
        return;
    }
    
    // Hide current step
    document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.remove('active');
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.remove('active');
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.add('inactive');
    
    // Update current step
    currentStep = direction === 'next' ? currentStep + 1 : currentStep - 1;
    
    // Show new step
    document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.add('active');
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.remove('inactive');
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.add('active');
    
    // Update buttons
    prevBtn.style.display = currentStep > 1 ? 'block' : 'none';
    nextBtn.style.display = currentStep < 5 ? 'block' : 'none';
    submitBtn.style.display = currentStep === 5 ? 'block' : 'none';
}

// Validate step
function validateStep(step) {
    let isValid = true;
    
    // Get all required fields in current step
    const requiredFields = document.querySelectorAll(`.form-step[data-step="${step}"] [required]`);
    
    requiredFields.forEach(field => {
        if (!field.value) {
            field.classList.add('invalid');
            isValid = false;
        } else {
            field.classList.remove('invalid');
        }
    });
    
    if (!isValid) {
        alert('Please fill in all required fields.');
    }
    
    return isValid;
}

// Handle file upload
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const filePreview = document.getElementById(event.target.id + 'Preview');
    const filePreviewName = document.getElementById(event.target.id + 'PreviewName');
    const filePreviewSize = document.getElementById(event.target.id + 'PreviewSize');
    
    // Update preview
    filePreviewName.textContent = file.name;
    filePreviewSize.textContent = formatFileSize(file.size);
    filePreview.style.display = 'block';
}

// Format file size
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
}

// Remove file
function removeFile(inputId) {
    document.getElementById(inputId).value = '';
    document.getElementById(inputId + 'Preview').style.display = 'none';
}

// Handle form submission
function handleSubmit(event) {
    event.preventDefault();
    
    // Validate final step
    if (!validateStep(currentStep)) {
        return;
    }
    
    // Hide form
    applicationForm.style.display = 'none';
    
    // Show success message
    successMessage.style.display = 'block';
    
    // In a real application, you would send the form data to your server here
    console.log('Form submitted for position:', selectedPosition.title);
    
    // Reset form after 5 seconds
    setTimeout(() => {
        // Reset form
        applicationForm.reset();
        applicationForm.style.display = 'block';
        successMessage.style.display = 'none';
        
        // Reset steps
        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.remove('active');
        });
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active');
            step.classList.add('inactive');
        });
        
        // Set first step as active
        document.querySelector('.form-step[data-step="1"]').classList.add('active');
        document.querySelector('.step[data-step="1"]').classList.remove('inactive');
        document.querySelector('.step[data-step="1"]').classList.add('active');
        
        // Reset buttons
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'block';
        submitBtn.style.display = 'none';
        
        // Reset current step
        currentStep = 1;
        
        // Hide application section
        applicationSection.style.display = 'none';
        
        // Scroll to positions section
        document.querySelector('.positions').scrollIntoView({ behavior: 'smooth' });
    }, 5000);
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Load positions
    loadPositions();
    
    // Add event listeners
    prevBtn.addEventListener('click', () => navigateForm('prev'));
    nextBtn.addEventListener('click', () => navigateForm('next'));
    applicationForm.addEventListener('submit', handleSubmit);
    
    // File upload event listeners
    document.getElementById('resumeFile').addEventListener('change', handleFileUpload);
    document.getElementById('coverLetterFile').addEventListener('change', handleFileUpload);
    document.getElementById('sampleFile').addEventListener('change', handleFileUpload);
});