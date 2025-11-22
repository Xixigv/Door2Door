document.addEventListener('DOMContentLoaded', function() {
    //load current user role
    loadCurrentUser();

    // Handle form submission
    const providerForm = document.getElementById('providerApplicationForm');

    if (providerForm) {
        providerForm.addEventListener('submit', handleProviderApplication); 
    }
});


//load current user data
function loadCurrentUser() {
    const user = getCurrentUser();
    
    if (!user || !user.id) {
        alert('Please login first');
        setTimeout(() => window.location.href = '/login', 2000);
        return;
    }

    
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/users/detail/${user.id}`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function() {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            if (response.success) {
                populateFormFields(response.data, user.email);
            } else {
                populateFormFieldsBasic(user.email);
            }
        } else {
            populateFormFieldsBasic(user.email);
        }
    };

    xhr.onerror = function() {
        populateFormFieldsBasic(user.email);
    };

    xhr.send();
}

function populateFormFields(profile, fallbackEmail) {
    // Extract full name
    let fullName = profile.name || profile.fullName || '';
    if (!fullName && profile.firstName) {
        fullName = profile.lastName ? `${profile.firstName} ${profile.lastName}` : profile.firstName;
    }
    
    // Split name into parts
    const nameField = fullName ? fullName.split(' ') : ['', ''];
    
    document.getElementById('firstName').value = nameField[0] || '';
    document.getElementById('lastName').value = nameField.slice(1).join(' ') || '';
    document.getElementById('email').value = profile.email || fallbackEmail || '';
    document.getElementById('phone').value = profile.phone || '';
    document.getElementById('address').value = profile.location || '';
}



// Fallback: populate with basic data
function populateFormFieldsBasic(email) {
    document.getElementById('firstName').value = '';
    document.getElementById('lastName').value = '';
    document.getElementById('email').value = email || '';
    document.getElementById('phone').value = '';
    document.getElementById('address').value = '';
    
    alert('Could not load complete profile. Please fill in your information manually.');
}


async function handleProviderApplication(event) {
    event.preventDefault(); 
    const user = getCurrentUser();

    if (!user) {
        alert('Session expired');
        window.location.href = '/login';
        return;
    }

    const formData = {
        serviceCategory: document.getElementById('serviceCategory').value.trim(),
        yearsExperience: document.getElementById('yearsExperience').value.trim(),
        professionalTitle: document.getElementById('professionalTitle').value.trim(),
        hourlyRate: document.getElementById('hourlyRate').value.trim(), 
        serviceDescription: document.getElementById('serviceDescription').value.trim(),
        shortDescription: document.getElementById('shortDescription').value.trim(),
        specificServices: document.getElementById('specificServices').value.trim(),
        profileImage: document.getElementById('profileImage').value.trim(),
        coverImage: document.getElementById('coverImage').value.trim(),
        businessName: document.getElementById('businessName').value.trim(),
        licenseNumber: document.getElementById('licenseNumber').value.trim(),
        insurance: document.getElementById('insurance').checked
    };


    //Validation
    if (!formData.serviceCategory || !formData.yearsExperience || !formData.professionalTitle || 
        !formData.hourlyRate || !formData.serviceDescription || !formData.specificServices ||
        !formData.shortDescription || !formData.profileImage || !formData.coverImage) {
        alert('Please fill all required fields');
        return;
    }
    
    if (!formData.insurance) {
        alert('You must confirm insurance coverage');
        return;
    }


    // try {
    //     const submitButton = event.target.querySelector('button[type="submit"]');
    //     submitButton.disabled = true;
    //     submitButton.textContent = 'Submitting...';


    //     const providerID = user.id;
    //     const servicesArr = formData.specificServices.split(',').map(s => s.trim());
    //     const applicationData = {
    //         userId: user.id,
    //         serviceCategory: formData.serviceCategory,
    //         yearsExperience: parseInt(formData.yearsExperience),
    //         professionalTitle: formData.professionalTitle,
    //         hourlyRate: parseFloat(formData.hourlyRate),
    //         serviceDescription: formData.serviceDescription,
    //         services: servicesArray,
    //         businessName: formData.businessName,
    //         licenseNumber: formData.licenseNumber

    //     };

    //     const serviceData = {
    //         id: providerID,
    //         availability: 'Available Now',
    //         avatar: formData.profileImage,
    //         bio: formData.serviceDescription,
    //         completedJobs: 0,
    //         converImage: formData.coverImage,
    //         hourlyRate: parseFloat(formData.hourlyRate),
    //         joinDate: new Date().toISOString().split('T')[0],
    //         location: user.location,
    //         name:user.name,
    //         rating: 0,
    //         responseTime: 'Within an hour',
    //         reviewCount: 0,
    //         service: formData.serviceCategory,
    //         serviceID: providerID,
    //         services: servicesArr,
    //         yearsExperience: parseInt(formData.yearsExperience)
    //     };

    //     const response = await fetch('/users/become-provider', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(applicationData)
    //     });
    //     const data = await response.json();
    //     if (response.ok) {
    //         alert('Application submitted successfully!');
    //         event.target.reset();
    //         setTimeout(() => {
    //             window.location.href = '/userProfile';
    //         }, 1000);
    //     } else {
    //         alert(data.error || 'Application failed');
    //         submitButton.disabled = false;
    //         submitButton.textContent = 'Submit Application';
    //     }
    // } catch (error) {
    //     console.error('Error submitting application:', error);
    //     alert('An error occurred. Please try again.');
    //     const submitButton = event.target.querySelector('button[type="submit"]');
    //     submitButton.disabled = false;
    //     submitButton.textContent = 'Submit Application';
    // }
      
}



