function renderCalendarPage(provider) {
    const container = createElement('div', 'min-h-screen bg-gray-50');
    const mainContainer = createElement('div', 'container mx-auto px-4 py-6');
    
    const bookingState = {
        selectedDate: null,
        selectedTime: null,
        selectedService: null,
        serviceCallFee: 35
    };
    
    // Back button
    const backButton = createElement('a', 'inline-flex items-center text-muted-foreground hover:text-foreground mb-6');

    backButton.href = `/serviceDetail`;
    localStorage.setItem('service', provider.serviceId);
    backButton.innerHTML = '<i data-lucide="arrow-left" class="w-4 h-4 mr-2"></i>Back to service details';
    
    const contentGrid = createElement('div', 'grid grid-cols-1 lg:grid-cols-3 gap-8');
    
    // Main content
    const leftColumn = createElement('div', 'lg:col-span-2 space-y-6');
    
    // Calendar card
    const calendarCard = createCard('', '');
    const calendarHeader = createElement('div', 'flex items-center space-x-2 mb-4');
    const calendarIcon = createIcon('calendar', 'w-5 h-5');
    const calendarTitle = createElement('span', 'font-medium', 'Schedule Your Service');
    calendarHeader.appendChild(calendarIcon);
    calendarHeader.appendChild(calendarTitle);
    
    const calendarContent = createElement('div', 'grid grid-cols-1 md:grid-cols-2 gap-8');
    
    // Date selection
    const dateSection = createElement('div');
    const dateTitle = createElement('h3', 'font-medium mb-4', 'Select Date');
    const calendar = createElement('div', 'calendar');
    
    // Simple calendar implementation
    const calendarGrid = createElement('div', 'calendar-grid');
    const today = new Date();
    
    for (let i = 1; i <= 30; i++) {
        const date = new Date(today.getFullYear(), today.getMonth(), i);
        const isDisabled = date < today || date.getDay() === 0; // Disable past dates and Sundays
        
        const dayElement = createCalendarDay(date, false, isDisabled, () => {
            if (!isDisabled) {
                // Remove previous selection
                calendar.querySelectorAll('.calendar-day.selected').forEach(el => el.classList.remove('selected'));
                // Add selection to clicked day
                dayElement.classList.add('selected');
                
                bookingState.selectedDate = date;
                updateBookingSummary();
            }
        });
        
        calendarGrid.appendChild(dayElement);
    }
    
    calendar.appendChild(calendarGrid);
    dateSection.appendChild(dateTitle);
    dateSection.appendChild(calendar);
    
    // Time slots
    const timeSection = createElement('div');
    const timeTitle = createElement('h3', 'font-medium mb-4', 'Available Times');
    const timeSlotsGrid = createElement('div', 'grid grid-cols-2 gap-2');
    
    const TIME_SLOTS = [
        "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", 
        "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", 
        "4:00 PM", "5:00 PM", "6:00 PM"
    ]

    TIME_SLOTS.forEach(time => {
        const timeSlot = createTimeSlot(time, false, () => {
            // Remove previous selection
            timeSlotsGrid.querySelectorAll('.btn-primary').forEach(btn => {
                btn.className = btn.className.replace('btn-primary', 'btn-outline');
            });
            // Add selection to clicked slot
            timeSlot.className = timeSlot.className.replace('btn-outline', 'btn-primary');
            
            bookingState.selectedTime = time;
            updateBookingSummary();
        });
        timeSlotsGrid.appendChild(timeSlot);
    });
    
    timeSection.appendChild(timeTitle);
    timeSection.appendChild(timeSlotsGrid);
    
    calendarContent.appendChild(dateSection);
    calendarContent.appendChild(timeSection);
    
    const calendarCardContent = calendarCard.querySelector('.card-content');
    calendarCardContent.appendChild(calendarHeader);
    calendarCardContent.appendChild(calendarContent);
    
    // Service type card
    const serviceCard = createCard('Service Type', '');
    const serviceOptions = createElement('div', 'space-y-4');
    
    const SERVICE_OPTIONS = [
        { id: "basic", name: "Basic Service", duration: "1-2 hours", price: provider.hourlyRate, hours: 1.5 },
        { id: "standard", name: "Standard Service", duration: "2-4 hours", price: provider.hourlyRate * 2, hours: 3 },
        { id: "comprehensive", name: "Comprehensive Service", duration: "4-6 hours", price: provider.hourlyRate * 4, hours: 5 },
        { id: "emergency", name: "Emergency Service", duration: "ASAP", price: provider.hourlyRate * 1.5, hours: 1 }
    ]

    SERVICE_OPTIONS.forEach(option => {
        const optionRow = createElement('div', 'flex items-center space-x-2');
        const radio = createElement('input');
        radio.type = 'radio';
        radio.name = 'serviceType';
        radio.value = option.id;
        radio.className = 'radio';
        
        radio.addEventListener('change', () => {
            if (radio.checked) {
                bookingState.selectedService = option;
                updateBookingSummary();
            }
        });
        
        const label = createElement('label', 'flex-1 cursor-pointer');
        const optionContent = createElement('div', 'flex items-center justify-between');
        
        const optionInfo = createElement('div');
        const optionName = createElement('div', 'font-medium', option.name);
        const optionDuration = createElement('div', 'text-sm text-muted-foreground', option.duration);
        optionInfo.appendChild(optionName);
        optionInfo.appendChild(optionDuration);
        
        const optionPrice = createElement('div', 'font-medium', `$${option.price}/hr`);
        
        optionContent.appendChild(optionInfo);
        optionContent.appendChild(optionPrice);
        label.appendChild(optionContent);
        
        label.addEventListener('click', () => {
            radio.checked = true;
            bookingState.selectedService = option;
            updateBookingSummary();
        });
        
        optionRow.appendChild(radio);
        optionRow.appendChild(label);
        serviceOptions.appendChild(optionRow);
    });
    
    serviceCard.querySelector('.card-content').appendChild(serviceOptions);
    
    // Notes card
    const notesCard = createCard('Additional Information', '');
    const notesTextarea = createElement('textarea', 'input textarea min-h-[100px]');
    notesTextarea.placeholder = 'Please describe the issue or provide any additional details about the service needed...';
    notesCard.querySelector('.card-content').appendChild(notesTextarea);
    
    leftColumn.appendChild(calendarCard);
    leftColumn.appendChild(serviceCard);
    leftColumn.appendChild(notesCard);
    
    // Right column - booking summary
    const rightColumn = createElement('div', 'space-y-6');
    
    // Provider info card
    const providerCard = createCard('Service Provider', '');
    const providerInfo = createElement('div', 'flex items-center space-x-3 mb-4');
    const providerAvatar = createAvatar(
        provider.image,
        provider.name,
        provider.avatar
    );
    
    const providerDetails = createElement('div');
    const providerName = createElement('h3', 'font-medium', provider.name);
    const providerService = createElement('p', 'text-sm text-muted-foreground', provider.service);
    const providerRating = createElement('div', 'flex items-center space-x-1 mt-1');
    const starIcon = createIcon('star', 'w-4 h-4 fill-yellow-400 text-yellow-400');
    const rating = createElement('span', 'text-sm', '4.9');
    
    providerRating.appendChild(starIcon);
    providerRating.appendChild(rating);
    
    providerDetails.appendChild(providerName);
    providerDetails.appendChild(providerService);
    providerDetails.appendChild(providerRating);
    
    providerInfo.appendChild(providerAvatar);
    providerInfo.appendChild(providerDetails);
    
    const availabilityBadge = createBadge('Available Today', 'badge badge-outline text-green-700 border-green-700 w-full justify-center');
    
    const providerCardContent = providerCard.querySelector('.card-content');
    providerCardContent.appendChild(providerInfo);
    providerCardContent.appendChild(availabilityBadge);
    
    // Booking summary card
    const summaryCard = createCard('Booking Summary', '');
    const summaryContent = createElement('div', 'space-y-4');
    
    const summaryItems = createElement('div', 'space-y-3');
    
    // **MODIFIED: Create reference variables for dynamic updates**
    const dateItem = createElement('div', 'flex justify-between text-sm');
    const dateLabel = createElement('span', '', 'Date:');
    const dateValue = createElement('span', 'font-medium', 'Not selected');
    dateItem.appendChild(dateLabel);
    dateItem.appendChild(dateValue);
    
    const timeItem = createElement('div', 'flex justify-between text-sm');
    const timeLabel = createElement('span', '', 'Time:');
    const timeValue = createElement('span', 'font-medium', 'Not selected');
    timeItem.appendChild(timeLabel);
    timeItem.appendChild(timeValue);
    
    const serviceItem = createElement('div', 'flex justify-between text-sm');
    const serviceLabel = createElement('span', '', 'Service:');
    const serviceValue = createElement('span', 'font-medium', 'Not selected');
    serviceItem.appendChild(serviceLabel);
    serviceItem.appendChild(serviceValue);
    
    summaryItems.appendChild(dateItem);
    summaryItems.appendChild(timeItem);
    summaryItems.appendChild(serviceItem);
    
    const pricing = createElement('div', 'pt-4 border-t');
    const serviceCallFee = createElement('div', 'flex justify-between mb-2');
    const feeLabel = createElement('span', '', 'Service Call Fee:');
    const feeValue = createElement('span', '', `$${bookingState.serviceCallFee}`);
    serviceCallFee.appendChild(feeLabel);
    serviceCallFee.appendChild(feeValue);
    
    const hourlyRate = createElement('div', 'flex justify-between mb-2');
    const rateLabel = createElement('span', '', 'Hourly Rate:');
    const rateValue = createElement('span', '', `$${provider.hourlyRate}`);
    hourlyRate.appendChild(rateLabel);
    hourlyRate.appendChild(rateValue);
    
    const serviceCost = createElement('div', 'flex justify-between mb-2');
    const costLabel = createElement('span', '', 'Service Cost:');
    const costValue = createElement('span', '', '$0');
    serviceCost.appendChild(costLabel);
    serviceCost.appendChild(costValue);
    
    const total = createElement('div', 'flex justify-between font-medium text-lg pt-2 border-t');
    const totalLabel = createElement('span', '', 'Estimated Total:');
    const totalValue = createElement('span', '', '$0');
    total.appendChild(totalLabel);
    total.appendChild(totalValue);
    
    const disclaimer = createElement('p', 'text-xs text-muted-foreground mt-2', 
        '*Final cost may vary based on actual time and materials used');
    
    pricing.appendChild(serviceCallFee);
    pricing.appendChild(hourlyRate);
    pricing.appendChild(serviceCost);
    pricing.appendChild(total);
    pricing.appendChild(disclaimer);
    
    function updateBookingSummary() {
        // Update date display
        if (bookingState.selectedDate) {
            const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
            dateValue.textContent = bookingState.selectedDate.toLocaleDateString('en-US', options);
            dateValue.classList.remove('text-muted-foreground');
        } else {
            dateValue.textContent = 'Not selected';
            dateValue.classList.add('text-muted-foreground');
        }
        
        // Update time display
        if (bookingState.selectedTime) {
            timeValue.textContent = bookingState.selectedTime;
            timeValue.classList.remove('text-muted-foreground');
        } else {
            timeValue.textContent = 'Not selected';
            timeValue.classList.add('text-muted-foreground');
        }
        
        // Update service display
        if (bookingState.selectedService) {
            serviceValue.textContent = bookingState.selectedService.name;
            serviceValue.classList.remove('text-muted-foreground');
        } else {
            serviceValue.textContent = 'Not selected';
            serviceValue.classList.add('text-muted-foreground');
        }
        
        let calculatedServiceCost = 0;
        let calculatedTotal = 0;
        
        if (bookingState.selectedService) {
            // Calculate service cost based on hours
            calculatedServiceCost = bookingState.selectedService.hours * provider.hourlyRate;
            calculatedTotal = bookingState.serviceCallFee + calculatedServiceCost;
            
            costValue.textContent = `$${calculatedServiceCost.toFixed(2)}`;
            totalValue.textContent = `$${calculatedTotal.toFixed(2)}`;
        } else {
            costValue.textContent = '$0';
            totalValue.textContent = `$${bookingState.serviceCallFee}`;
        }
        
        const allSelected = bookingState.selectedDate && 
                           bookingState.selectedTime && 
                           bookingState.selectedService;
        
        if (allSelected) {
            confirmBtn.disabled = false;
            confirmBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        } else {
            confirmBtn.disabled = true;
            confirmBtn.classList.add('opacity-50', 'cursor-not-allowed');
        }
    }
    
    const confirmBtn = createButton('Confirm Booking', () => {
        if (!bookingState.selectedDate || !bookingState.selectedTime || !bookingState.selectedService) {
            alert('Please select a date, time, and service type before confirming.');
            return;
        }
        
        const bookingData = {
            provider: provider.name,
            date: bookingState.selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
            }),
            time: bookingState.selectedTime,
            service: bookingState.selectedService.name,
            duration: bookingState.selectedService.duration,
            serviceCost: (bookingState.selectedService.hours * provider.hourlyRate).toFixed(2),
            serviceCallFee: bookingState.serviceCallFee,
            total: (bookingState.serviceCallFee + (bookingState.selectedService.hours * provider.hourlyRate)).toFixed(2),
            notes: notesTextarea.value
        };
        
        localStorage.setItem('amount', bookingData.total);
        
        // Show detailed confirmation
        // alert(`Booking Confirmed!\n\nProvider: ${bookingData.provider}\nDate: ${bookingData.date}\nTime: ${bookingData.time}\nService: ${bookingData.service}\nTotal: ${bookingData.total}\n\nYou will receive a confirmation email shortly.`);
        
        window.location.href = '/payment';

    }, 'btn btn-primary w-full btn-lg mb-3');
    
    confirmBtn.disabled = true;
    confirmBtn.classList.add('opacity-50', 'cursor-not-allowed');
    
    const guarantees = createElement('div', 'text-xs text-muted-foreground space-y-1');
    const guaranteeItems = [
        '✓ Licensed & Insured',
        '✓ 30-day warranty',
        '✓ Satisfaction guaranteed',
        '✓ Background checked'
    ];
    
    guaranteeItems.forEach(item => {
        const guarantee = createElement('p', '', item);
        guarantees.appendChild(guarantee);
    });
    
    summaryContent.appendChild(summaryItems);
    summaryContent.appendChild(pricing);
    summaryContent.appendChild(confirmBtn);
    summaryContent.appendChild(guarantees);
    
    summaryCard.querySelector('.card-content').appendChild(summaryContent);
    
    rightColumn.appendChild(providerCard);
    rightColumn.appendChild(summaryCard);
    
    contentGrid.appendChild(leftColumn);
    contentGrid.appendChild(rightColumn);
    
    mainContainer.appendChild(backButton);
    mainContainer.appendChild(contentGrid);
    container.appendChild(mainContainer);
    
    return container;
}

// Calendar Day Component
function createCalendarDay(date, isSelected = false, isDisabled = false, onClick = null) {
    const day = createElement('div', 
        `calendar-day ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`,
        date.getDate().toString()
    );
    
    if (onClick && !isDisabled) {
        day.addEventListener('click', onClick);
    }
    
    return day;
}

// Time Slot Component
function createTimeSlot(time, isSelected = false, onClick = null) {
    const slot = createButton(
        `<i data-lucide="clock" class="w-4 h-4 mr-2"></i>${time}`,
        onClick,
        `btn ${isSelected ? 'btn-primary' : 'btn-outline'} btn-sm justify-start`
    );
    
    return slot;
}

function getProvider(id)
{

    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/providers/${id}`, true);

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('value', id);

    xhr.onload = function() {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            const providerDetailPage = renderCalendarPage(response);
            let main_content = document.getElementById('main-content');
            main_content.innerHTML = '';
            main_content.appendChild(providerDetailPage);
            lucide.createIcons();

        } else {
            console.error('Request failed. Status:', xhr.status);
        }
    };

    xhr.onerror = function() {
        console.error('Request error');
    };

    xhr.send();
}

window.onload = function() {
    const providerId = localStorage.getItem('provider');
    getProvider(providerId);
}