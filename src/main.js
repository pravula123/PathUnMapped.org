import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'

document.querySelector('#app').innerHTML = `
  <nav class="navbar">
    <div class="logo">PathUnMapped<span class="dot">.</span>Org</div>
    <ul class="nav-links">
      <li><a href="#home">Home</a></li>
      <li class="dropdown"><a href="#mentor">Mentor</a>
        <ul class="dropdown-menu">
          <li><a href="#register-mentor">Register as Mentor</a></li>
          <li><a href="#list-mentors" id="list-mentors-link">List Mentors</a></li>
        </ul>
      </li>
      <li class="dropdown"><a href="#mentee">Mentee</a>
        <ul class="dropdown-menu">
          <li><a href="#register-mentee">Register as Mentee</a></li>
          <li><a href="#list-mentees" id="list-mentees-link">List Mentees</a></li>
        </ul>
      </li>
      <li><a href="#about">About</a></li>
      <li><a href="#contact">Contact</a></li>
      <li><a href="#ai-pathfinder" id="ai-pathfinder-link">AI Pathfinder</a></li>
    </ul>
  </nav>
  <section class="hero" id="home">
    <h1>Welcome to PathUnMapped.Org</h1>
    <p>Discover, explore, and share the world's unmapped places.<br>Join our community to put the unknown on the map.</p>
    <a class="cta" href="#about">Learn More</a>
  </section>
  <section class="about" id="about">
    <h2>About PathUnMapped.Org</h2>
    <p>PathUnMapped.Org is a platform for explorers, mappers, and storytellers to document and share places that are off the beaten path. Our mission is to make the invisible visible and connect people through discovery.</p>
  </section>
  <section class="register" id="register-mentor">
    <h2>Register as Mentor</h2>
    <form class="register-form" id="mentor-register-form" autocomplete="off">
      <div class="form-group">
        <label for="mentor-name">Full Name</label>
        <input type="text" id="mentor-name" name="mentor-name" required />
      </div>
      <div class="form-group">
        <label for="mentor-email">Email</label>
        <input type="email" id="mentor-email" name="mentor-email" required />
      </div>
      <div class="form-group">
        <label for="mentor-expertise">Expertise</label>
        <input type="text" id="mentor-expertise" name="mentor-expertise" required />
      </div>
      <div class="form-group">
        <label for="mentor-bio">Short Bio</label>
        <textarea id="mentor-bio" name="mentor-bio" rows="3" required></textarea>
      </div>
      <div class="form-group">
        <label for="mentor-username">Username</label>
        <input type="text" id="mentor-username" name="mentor-username" required />
      </div>
      <div class="form-group">
        <label for="mentor-password">Password</label>
        <input type="password" id="mentor-password" name="mentor-password" required />
      </div>
      <button type="submit" class="cta">Register</button>
    </form>
    <div id="mentor-register-success" style="display:none; margin-top:1.5rem; color:#2e7d32; font-weight:bold;"></div>
  </section>
  <section class="mentors-list" id="list-mentors" style="display:none;">
    <h2>Our Mentors</h2>
    <input type="text" id="mentor-search" class="mentor-search" placeholder="Search mentors by name or expertise..." />
    <div id="mentors-container" class="mentors-container"></div>
  </section>
  <section class="mentees-list" id="list-mentees" style="display:none;">
    <h2>Our Mentees</h2>
    <input type="text" id="mentee-search" class="mentor-search" placeholder="Search mentees by name or interest..." />
    <div id="mentees-container" class="mentors-container"></div>
  </section>
  <section class="contact" id="contact">
    <h2>Contact</h2>
    <p>Want to contribute or get in touch? Email us at <a href="mailto:info@PathUnMapped.Org">info@PathUnMapped.Org</a></p>
  </section>
  <section class="ai-pathfinder" id="ai-pathfinder" style="display:none;">
    <h2>AI Pathfinder</h2>
    <p>Answer a few questions to discover your interests and get recommendations for your path.</p>
    // Placeholder for the AI questionnaire
  </section>
`;

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('mentor-register-form');
  const successDiv = document.getElementById('mentor-register-success');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const data = {
        name: form['mentor-name'].value,
        email: form['mentor-email'].value,
        expertise: form['mentor-expertise'].value,
        bio: form['mentor-bio'].value,
        username: form['mentor-username'].value,
        password: form['mentor-password'].value
      };
      // Save to localStorage (simulate backend)
      let mentors = JSON.parse(localStorage.getItem('mentors') || '[]');
      mentors.push(data);
      localStorage.setItem('mentors', JSON.stringify(mentors));
      form.reset();
      successDiv.style.display = 'block';
      successDiv.textContent = `Registration successful! Your username is: ${data.username}`;
      // Simulate sending email
      setTimeout(function() {
        alert(`A confirmation email has been sent to ${data.email} with your username and password.\n\nUsername: ${data.username}\nPassword: ${data.password}`);
        // Hide registration section and show home section
        document.getElementById('register-mentor').style.display = 'none';
        document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
      }, 500);
    });
  }

  let allMentors = [];
  // Show mentors list on click
  document.getElementById('list-mentors-link').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('register-mentor').style.display = 'none';
    document.getElementById('home').style.display = 'none';
    document.getElementById('about').style.display = 'none';
    document.getElementById('contact').style.display = 'none';
    document.getElementById('ai-pathfinder').style.display = 'none';
    document.getElementById('list-mentors').style.display = 'block';
    // Load mentors from sample JSON in public/mentors/mentors.json
    fetch('/mentors/mentors.json')
      .then(res => res.json())
      .then(data => {
        allMentors = data.mentors || [];
        renderMentors(allMentors);
      });
  });

  function renderMentors(mentors) {
    const container = document.getElementById('mentors-container');
    container.innerHTML = '';
    if (!mentors.length) {
      container.innerHTML = '<p>No mentors registered yet.</p>';
    } else {
      mentors.forEach(mentor => {
        container.innerHTML += `
          <div class="mentor-card">
            <img src="/mentors/${mentor.pic || 'default.jpg'}" alt="${mentor.name}" class="mentor-pic" />
            <div class="mentor-info">
              <h3>${mentor.name}</h3>
              <p><strong>Expertise:</strong> ${mentor.expertise}</p>
              <p><strong>Email:</strong> ${mentor.email}</p>
              <p>${mentor.bio}</p>
            </div>
          </div>
        `;
      });
    }
  }

  // Search/filter mentors
  document.addEventListener('input', function(e) {
    if (e.target && e.target.id === 'mentor-search') {
      const query = e.target.value.trim().toLowerCase();
      const filtered = allMentors.filter(m =>
        m.name.toLowerCase().includes(query) ||
        m.expertise.toLowerCase().includes(query)
      );
      renderMentors(filtered);
    }
  });

  let allMentees = [];
  // Show mentees list on click
  document.getElementById('list-mentees-link').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('register-mentor').style.display = 'none';
    document.getElementById('register-mentee') && (document.getElementById('register-mentee').style.display = 'none');
    document.getElementById('home').style.display = 'none';
    document.getElementById('about').style.display = 'none';
    document.getElementById('contact').style.display = 'none';
    document.getElementById('ai-pathfinder').style.display = 'none';
    document.getElementById('list-mentors').style.display = 'none';
    document.getElementById('list-mentees').style.display = 'block';
    // Load mentees from JSON
    fetch('/mentees/mentees.json')
      .then(res => res.json())
      .then(data => {
        allMentees = data.mentees || [];
        renderMentees(allMentees);
      });
  });

  // AI Pathfinder link
  document.getElementById('ai-pathfinder-link').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('register-mentor').style.display = 'none';
    document.getElementById('register-mentee') && (document.getElementById('register-mentee').style.display = 'none');
    document.getElementById('home').style.display = 'none';
    document.getElementById('about').style.display = 'none';
    document.getElementById('contact').style.display = 'none';
    document.getElementById('list-mentors').style.display = 'none';
    document.getElementById('list-mentees').style.display = 'none';
    document.getElementById('ai-pathfinder').style.display = 'block';
  });

  function renderMentees(mentees) {
    const container = document.getElementById('mentees-container');
    container.innerHTML = '';
    if (!mentees.length) {
      container.innerHTML = '<p>No mentees registered yet.</p>';
    } else {
      mentees.forEach(mentee => {
        container.innerHTML += `
          <div class="mentor-card">
            <img src="/mentees/${mentee.pic || 'default.jpg'}" alt="${mentee.name}" class="mentor-pic" />
            <div class="mentor-info">
              <h3>${mentee.name}</h3>
              <p><strong>Interest:</strong> ${mentee.interest}</p>
              <p><strong>Email:</strong> ${mentee.email}</p>
              <p>${mentee.bio}</p>
            </div>
          </div>
        `;
      });
    }
  }

  // Search/filter mentees
  document.addEventListener('input', function(e) {
    if (e.target && e.target.id === 'mentee-search') {
      const query = e.target.value.trim().toLowerCase();
      const filtered = allMentees.filter(m =>
        m.name.toLowerCase().includes(query) ||
        m.interest.toLowerCase().includes(query)
      );
      renderMentees(filtered);
    }
  });
});

setupCounter(document.querySelector('#counter'))
