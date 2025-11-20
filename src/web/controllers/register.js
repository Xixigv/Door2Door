// register.js - Handles user registration form submission
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegistration);
    }
});

async function handleRegistration(event) {
    event.preventDefault();
    
    // Get form data
    const formData = {
        name: document.getElementById('firstName').value.trim() + ' ' + document.getElementById('lastName').value.trim(),
        phone: document.getElementById('phoneNumber').value.trim(),
        email: document.getElementById('email').value.trim(),
        location: document.getElementById('location').value.trim(),
        password: document.getElementById('password').value,
        memberSince: new Date().toISOString().split('T')[0],
        totalBookings: 0,
        totalSpent: 0,
        isProvider: false,
        confirmPassword: document.getElementById('confirmPassword').value
    };
    // Validate form data
    if (!validateForm(formData)) {
        return;
    }
    
    // // Remove confirmPassword before sending to API
    const { confirmPassword, ...userData } = formData;
    console.log(userData);
    
    try {
        // Show loading state
        const submitButton = event.target.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Creating account...';
        
        // Make API call
        const response = await fetch('/users/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Registration successful
            showMessage('Account created successfully! Redirecting...', 'success');
            
            // Clear form
            event.target.reset();
            
            // Redirect to login or home page after 2 seconds
            setTimeout(() => {
                window.location.href = '/login'; // Change to your login page URL
            }, 2000);
            
        } else {
            // Registration failed
            const errorMessage = data.message || data.error || 'Registration failed. Please try again.';
            showMessage(errorMessage, 'error');
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
        
    } catch (error) {
        console.error('Registration error:', error);
        showMessage('An error occurred. Please check your connection and try again.', 'error');
        
        // Re-enable submit button
        const submitButton = event.target.querySelector('button[type="submit"]');
        submitButton.disabled = false;
        submitButton.textContent = 'Create account';
    }
}

function validateForm(formData) {
    // Check if all fields are filled
    if (!formData.name || !formData.phone || 
        !formData.email || !formData.location || !formData.password || !formData.confirmPassword) {
        showMessage('Please fill in all fields', 'error');
        return false;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showMessage('Please enter a valid email address', 'error');
        return false;
    }
    
    // Validate phone number (basic validation - adjust as needed)
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(formData.phone)) {
        showMessage('Please enter a valid phone number', 'error');
        return false;
    }
    
    // Validate password length
    if (formData.password.length < 6) {
        showMessage('Password must be at least 6 characters long', 'error');
        return false;
    }
    
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
        showMessage('Passwords do not match', 'error');
        return false;
    }
    
    return true;
}

function showMessage(message, type) {
    // Remove any existing messages
    const existingMessage = document.querySelector('.alert-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `alert-message ${type} p-4 mb-4 rounded-md`;
    
    if (type === 'success') {
        messageDiv.style.backgroundColor = '#d1fae5';
        messageDiv.style.color = '#065f46';
        messageDiv.style.border = '1px solid #6ee7b7';
    } else {
        messageDiv.style.backgroundColor = '#fee2e2';
        messageDiv.style.color = '#991b1b';
        messageDiv.style.border = '1px solid #fca5a5';
    }
    
    messageDiv.textContent = message;
    
    // Insert message before the form
    const form = document.getElementById('registerForm');
    form.parentNode.insertBefore(messageDiv, form);
    
    // Auto-remove message after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}