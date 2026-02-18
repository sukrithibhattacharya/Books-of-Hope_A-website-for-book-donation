document.querySelectorAll('.toggle-description').forEach(button => {
    button.addEventListener('click', function() {
        const fullDescription = this.previousElementSibling;
        
        if (fullDescription.style.display === 'none' || fullDescription.style.display === '') {
            fullDescription.style.display = 'block';
            this.textContent = 'See Less';
        } else {
            fullDescription.style.display = 'none';
            this.textContent = 'See More';
        }
    });
});
