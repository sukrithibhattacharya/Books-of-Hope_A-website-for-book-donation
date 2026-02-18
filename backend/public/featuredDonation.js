// featuredDonation.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('featuredDonationForm');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    const statusDiv = document.getElementById('status');
  
    form.addEventListener('submit', function(event) {
      event.preventDefault(); // Prevent the default form submission
  
      const formData = new FormData(form);
      const xhr = new XMLHttpRequest();
  
      // Show progress bar
      progressContainer.style.display = 'block';
  
      xhr.open('POST', form.action);
  
      // Update progress bar during file upload
      xhr.upload.addEventListener('progress', function(event) {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          progressBar.value = percentComplete;
        }
      });
  
      // Handle response from the server
      xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            statusDiv.innerText = 'Donation submitted successfully!';
            form.reset();
            progressBar.value = 0;
            progressContainer.style.display = 'none';
          } else {
            statusDiv.innerText = 'Error submitting donation: ' + xhr.responseText;
          }
        }
      };
  
      xhr.send(formData);
    });
  });
  