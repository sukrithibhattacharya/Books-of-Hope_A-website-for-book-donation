function updateHeader() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userType = localStorage.getItem('userType');
  
    const navElement = document.getElementById('navbar-list');
    if (!navElement) return;
  
    let navHTML = `
      <li><a href="index.html">Home</a></li>
      <li><a href="about.html">About</a></li>
      <li><a href="donate.html">Donate</a></li>
      <li><a href="browse.html">Browse</a></li>
      <li><a href="contact.html">Contact</a></li>
    `;
  
    if (isLoggedIn) {
      navHTML += `
        <li><a href="dashboard-${userType}.html">Dashboard</a></li>
        <li><a href="#" id="logout-btn">Logout</a></li>
      `;
    } else {
      navHTML += `
        <li><a href="register.html">Register</a></li>
        <li><a href="login.html">Login</a></li>
      `;
    }
  
    navElement.innerHTML = navHTML;
  
    if (isLoggedIn) {
      document.getElementById('logout-btn').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userType');
        window.location.href = 'index.html';
      });
    }
  }
  