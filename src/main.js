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
          <li><a href="#list-mentors">List Mentors</a></li>
        </ul>
      </li>
      <li class="dropdown"><a href="#mentee">Mentee</a>
        <ul class="dropdown-menu">
          <li><a href="#register-mentee">Register as Mentee</a></li>
          <li><a href="#list-mentees">List Mentees</a></li>
        </ul>
      </li>
      <li><a href="#about">About</a></li>
      <li><a href="#contact">Contact</a></li>
      <li><a href="#ai-pathfinder">AI Pathfinder</a></li>
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
  <section class="mentors-list" id="list-mentors">
    <h2>Our Mentors</h2>
    <input type="text" id="mentor-search" class="mentor-search" placeholder="Search mentors by name or expertise..." />
    <div id="mentors-container" class="mentors-container"></div>
  </section>
  <section class="mentees-list" id="list-mentees">
    <h2>Our Mentees</h2>
    <input type="text" id="mentee-search" class="mentor-search" placeholder="Search mentees by name or interest..." />
    <div id="mentees-container" class="mentors-container"></div>
  </section>
  <section class="contact" id="contact">
    <h2>Contact</h2>
    <p>Want to contribute or get in touch? Email us at <a href="mailto:info@PathUnMapped.Org">info@PathUnMapped.Org</a></p>
  </section>
  <section class="ai-pathfinder" id="ai-pathfinder">
    <h2>AI Pathfinder</h2>
    <p>Answer a few questions to discover your interests and get recommendations for your path.</p>
    <button id="start-questionnaire" class="cta">Start Questionnaire</button>
    <div id="questionnaire-container" style="display:none; margin-top:1.5rem;">
      <h3 id="question-text"></h3>
      <div id="options-container"></div>
    </div>
    <div id="recommendation-container" style="display:none; margin-top:1.5rem;"></div>
  </section>
`;

document.addEventListener('DOMContentLoaded', function() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-links a');

  function showSection(sectionId) {
    sections.forEach(section => {
      section.style.display = section.id === sectionId ? 'block' : 'none';
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const sectionId = this.getAttribute('href').substring(1);
      showSection(sectionId);
    });
  });

  // Show home section by default
  showSection('home');


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
        showSection('home');
      }, 500);
    });
  }

  let allMentors = [];
  document.querySelector('a[href="#list-mentors"]').addEventListener('click', function() {
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
  document.querySelector('a[href="#list-mentees"]').addEventListener('click', function() {
    fetch('/mentees/mentees.json')
      .then(res => res.json())
      .then(data => {
        allMentees = data.mentees || [];
        renderMentees(allMentees);
      });
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

  // AI Pathfinder Questionnaire
  const questionnaireContainer = document.getElementById('questionnaire-container');
  const questionText = document.getElementById('question-text');
  const optionsContainer = document.getElementById('options-container');
  const recommendationContainer = document.getElementById('recommendation-container');
  const startButton = document.getElementById('start-questionnaire');

  const questions = [
    {
      question: "What is your primary goal?",
      options: {
        "Career growth": "career",
        "Skill development": "skill",
        "Personal exploration": "personal"
      }
    },
    {
      question: "Which of these areas are you most interested in?",
      options: {
        "Technology": "tech",
        "Creative Arts": "creative",
        "Business": "business"
      }
    },
    {
      question: "How do you prefer to learn?",
      options: {
        "Structured courses": "structured",
        "Project-based learning": "project",
        "Mentorship": "mentorship"
      }
    }
  ];

  let currentQuestionIndex = 0;
  let userAnswers = {};

  startButton.addEventListener('click', () => {
    startButton.style.display = 'none';
    questionnaireContainer.style.display = 'block';
    recommendationContainer.style.display = 'none';
    currentQuestionIndex = 0;
    userAnswers = {};
    displayQuestion();
  });

  function displayQuestion() {
    const question = questions[currentQuestionIndex];
    questionText.textContent = question.question;
    optionsContainer.innerHTML = '';

    for (const [optionText, optionValue] of Object.entries(question.options)) {
      const button = document.createElement('button');
      button.textContent = optionText;
      button.classList.add('cta');
      button.addEventListener('click', () => {
        userAnswers[currentQuestionIndex] = optionValue;
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
          displayQuestion();
        } else {
          showRecommendation();
        }
      });
      optionsContainer.appendChild(button);
    }
  }

  function showRecommendation() {
    questionnaireContainer.style.display = 'none';
    recommendationContainer.style.display = 'block';

    // This is a simple recommendation logic. You can expand this with more complex rules.
    let recommendation = "Based on your answers, we recommend exploring our general mentorship program.";
    if (userAnswers[1] === 'tech' && userAnswers[2] === 'project') {
      recommendation = "You seem interested in technology and project-based learning. We recommend finding a mentor with a strong technical background to guide you through a real-world project.";
    } else if (userAnswers[0] === 'career' && userAnswers[1] === 'business') {
      recommendation = "For your career growth in business, we suggest connecting with an experienced entrepreneur or a business leader in our mentorship program.";
    }

    recommendationContainer.innerHTML = `
      <h3>Your Recommended Path</h3>
      <p>${recommendation}</p>
      <button id="restart-questionnaire" class="cta">Start Over</button>
    `;

    document.getElementById('restart-questionnaire').addEventListener('click', () => {
      startButton.style.display = 'block';
      recommendationContainer.style.display = 'none';
    });
  }

});

setupCounter(document.querySelector('#counter'))
