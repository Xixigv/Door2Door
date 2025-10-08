function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach((button) => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            tabButtons.forEach(btn => {
                btn.classList.remove('bg-primary', 'text-primary-foreground');
                btn.classList.add('hover:bg-gray-100');
            });

            // Add active class to clicked button
            button.classList.add('bg-primary', 'text-primary-foreground');
            button.classList.remove('hover:bg-gray-100');

            // Hide all tab contents
            tabContents.forEach(content => {
                content.classList.add('hidden');
            });

            // Show corresponding tab content
            const tabId = button.id.replace('tab-', 'content-');
            const targetContent = document.getElementById(tabId);
            if (targetContent) {
                targetContent.classList.remove('hidden');
            }
        });
    });
}

// Initialize tabs when page loads
initTabs();