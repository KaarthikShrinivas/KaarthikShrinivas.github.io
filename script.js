document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // 1. Mobile Menu Toggle
    // ==========================================================================
    const mobileBtn = document.getElementById('mobile-btn');
    const navLinksWrapper = document.querySelector('.nav-links-wrapper');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileBtn && navLinksWrapper) {
        mobileBtn.addEventListener('click', () => {
            navLinksWrapper.classList.toggle('active');
            const icon = mobileBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-xmark');
            }
        });

        // Close mobile menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinksWrapper.classList.remove('active');
                const icon = mobileBtn.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-xmark');
                }
            });
        });
    }

    // ==========================================================================
    // 2. Theme Toggle (Dark/Light)
    // ==========================================================================
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

    // Check for saved theme preference, otherwise use system preference (default dark)
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (!themeIcon) return;
        if (theme === 'light') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }

    // ==========================================================================
    // 3. Typing Effect in Hero
    // ==========================================================================
    const typingTextElement = document.querySelector('.typing-text');
    const roles = [
        'Senior Software Engineer',
        'Backend Developer',
        'Java & Spring Boot Expert',
        'Microservices Architect'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
        if (!typingTextElement) return;

        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typingTextElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // speed up when deleting
        } else {
            typingTextElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100; // normal typing speed
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at end of word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500; // Short pause before typing next word
        }

        setTimeout(typeEffect, typingSpeed);
    }
    
    // Start typing effect
    typeEffect();

    // ==========================================================================
    // 4. Scroll Fade-In & Skill Bar Animations (Intersection Observer)
    // ==========================================================================
    const scrollElements = document.querySelectorAll('.scroll-fade');
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    
    // Set width to 0% initially for animation triggers
    skillBars.forEach(bar => {
        bar.dataset.targetWidth = bar.style.width;
        bar.style.width = '0%';
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // If it is the skills section, animate skill bars
                if (entry.target.id === 'skills') {
                    animateSkillBars();
                }
                
                // If it is the stats/about section, animate stats counters
                if (entry.target.id === 'about') {
                    animateStats();
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    scrollElements.forEach(el => sectionObserver.observe(el));

    function animateSkillBars() {
        skillBars.forEach(bar => {
            if (bar.dataset.targetWidth) {
                bar.style.width = bar.dataset.targetWidth;
            }
        });
    }

    // ==========================================================================
    // 5. Stat Counter Animations
    // ==========================================================================
    let statsAnimated = false;
    function animateStats() {
        if (statsAnimated) return;
        statsAnimated = true;

        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            let count = 0;
            const duration = 1500; // 1.5 seconds
            const increment = target / (duration / 16); // ~60fps
            
            const counter = setInterval(() => {
                count += increment;
                if (count >= target) {
                    clearInterval(counter);
                    // Add back suffix if necessary (+ or %)
                    if (target === 3) {
                        stat.textContent = '3+';
                    } else if (target === 98 || target === 30 || target === 80) {
                        stat.textContent = target + '%';
                    } else {
                        stat.textContent = target;
                    }
                } else {
                    stat.textContent = Math.floor(count) + (target === 3 ? '+' : '%');
                }
            }, 16);
        });
    }

    // ==========================================================================
    // 6. Interactive Terminal Sandbox Simulation
    // ==========================================================================
    const terminalInput = document.getElementById('terminal-input');
    const terminalBody = document.getElementById('terminal-body');
    const terminalOutput = document.querySelector('.terminal-output');
    const terminalPills = document.querySelectorAll('.terminal-pill');
    
    // Command history setup
    let cmdHistory = [];
    let historyIdx = -1;

    // Command registry responses
    const commands = {
        help: () => `
Available Commands:
  <span class="cmd-highlight">help</span>       - Display list of available commands.
  <span class="cmd-highlight">skills</span>     - List my programming languages, frameworks, and databases.
  <span class="cmd-highlight">experience</span> - Show a summary of my backend work history and impact.
  <span class="cmd-highlight">education</span>  - Print details about my B.Tech degree at VIT.
  <span class="cmd-highlight">awards</span>     - List my awards, honors, and professional recognition.
  <span class="cmd-highlight">contact</span>    - Show my email, phone, LinkedIn, and GitHub links.
  <span class="cmd-highlight">clear</span>      - Clear the console output.
        `,
        skills: () => `
<span class="terminal-welcome">--- TECHNICAL SKILLS PROFILE ---</span>
• <b>Languages:</b> Java (95%), Python (80%)
• <b>Frameworks & Tools:</b> Spring Boot (95%), Microservices (90%), Maven, Git, Postman, Graylogs, AWS S3
• <b>Databases & Message Queues:</b> MySQL, MongoDB (90%), Apache Kafka (85%), RabbitMQ (80%), Aerospike (75%)
        `,
        experience: () => `
<span class="terminal-welcome">--- WORK EXPERIENCE ---</span>

<b>1. Jubilant Foodworks (Jan 2023 - Present)</b>
   <i>Senior Software Engineer - Backend | Gurugram, India</i>
   • Re-engineered complex refund workflows, achieving a <b>98% same-day refund processing rate</b>.
   • Refactored and optimized critical payment APIs (Saved Cards, Order History, AOD Flows), reducing API latency by <b>30%</b> and improving transaction success rates.
   • Designed and implemented a modular <b>multi-tenancy library</b> for MySQL, MongoDB, Bean creation, and Aerospike, standardizing data access across microservices and reducing boilerplate code by <b>80%</b>.
   • Optimized after-order workflows (tracking, notifications, and discounts), significantly reducing database load and latency during peak ordering hours.
   • Redesigned SMS delivery logic and automated invoice generation, eliminating redundant API calls and lowering operational costs.
   • Integrated real-time tracking and WhatsApp notification flows, significantly reducing customer support ticket volumes.

<b>2. Samsung R&D Institute India (Dec 2021 - July 2022)</b>
   <i>Research Intern (Prism Developer) | Bangalore, India</i>
   • Developed a high-precision hand gesture detection prototype using Ultra-Wideband (UWB) sensors and CNNs (MesoNet) for smart home/device control, achieving enhanced gesture recognition accuracy.
   • Awarded a <b>Certificate of Excellence</b> for delivering production-ready, highly optimized sensor data processing pipelines.

<b>3. IIITDM Kancheepuram (June 2021 - July 2021)</b>
   <i>Research Intern | Chennai, India</i>
   • Optimized word tokenization and word embedding algorithms using Natural Language Processing (NLP) and Transfer Learning techniques to boost text-processing pipeline efficiency.
        `,
        education: () => `
<span class="terminal-welcome">--- EDUCATION ---</span>
<b>Vellore Institute of Technology (VIT), Chennai</b>
• B.Tech. in Computer Science and Engineering (July 2019 – May 2023)
• Cumulative GPA: <span class="cmd-highlight">9.29 / 10</span>
        `,
        awards: () => `
<span class="terminal-welcome">--- HONORS & AWARDS ---</span>
• <b>Chairperson Award:</b> Highest business impact and technical excellence recognition at Jubilant.
• <b>4 Gold Awards & 1 Silver Award:</b> Awarded for consistent leadership and performance at Jubilant.
• <b>Certificate of Excellence:</b> Awarded for key contributions at Samsung Prism.
        `,
        contact: () => `
<span class="terminal-welcome">--- CONTACT INFORMATION ---</span>
• <b>Email:</b> <a href="mailto:kaarthikofficial02@gmail.com" class="cmd-highlight">kaarthikofficial02@gmail.com</a>
• <b>Phone:</b> <a href="tel:+916379809820" class="cmd-highlight">+91-6379809820</a>
• <b>Location:</b> Chennai, Tamil Nadu, India
• <b>LinkedIn:</b> <a href="https://linkedin.com/in/kaarthik-shrinivas-341a561b1" target="_blank">linkedin.com/in/kaarthik-shrinivas-341a561b1</a>
• <b>GitHub:</b> <a href="https://github.com/KaarthikShrinivas" target="_blank">github.com/KaarthikShrinivas</a>
        `
    };

    if (terminalInput) {
        // Focus input on terminal container click
        const terminalContainer = document.querySelector('.terminal-container');
        if (terminalContainer) {
            terminalContainer.addEventListener('click', () => {
                terminalInput.focus();
            });
        }

        // Handle Enter key on input
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const rawVal = terminalInput.value;
                const cmd = rawVal.trim().toLowerCase();
                terminalInput.value = '';
                
                if (cmd) {
                    cmdHistory.push(rawVal);
                    historyIdx = cmdHistory.length;
                    executeCommand(cmd, rawVal);
                }
            } else if (e.key === 'ArrowUp') {
                // Command history navigation (up)
                if (historyIdx > 0) {
                    historyIdx--;
                    terminalInput.value = cmdHistory[historyIdx];
                }
                e.preventDefault();
            } else if (e.key === 'ArrowDown') {
                // Command history navigation (down)
                if (historyIdx < cmdHistory.length - 1) {
                    historyIdx++;
                    terminalInput.value = cmdHistory[historyIdx];
                } else {
                    historyIdx = cmdHistory.length;
                    terminalInput.value = '';
                }
                e.preventDefault();
            }
        });

        // Pill clicks
        terminalPills.forEach(pill => {
            pill.addEventListener('click', () => {
                const cmd = pill.getAttribute('data-cmd');
                if (cmd) {
                    executeCommand(cmd, cmd);
                    terminalInput.focus();
                }
            });
        });
    }

    function executeCommand(cmd, displayCmd) {
        // Print command prompt line
        const cmdLine = document.createElement('p');
        cmdLine.className = 'terminal-line';
        cmdLine.innerHTML = `<span class="terminal-prompt">visitor@kaarthik-backend:~$</span> <span class="terminal-line-cmd">${escapeHTML(displayCmd)}</span>`;
        terminalOutput.appendChild(cmdLine);

        // Process response
        if (cmd === 'clear') {
            terminalOutput.innerHTML = `
                <p class="terminal-welcome">Welcome to V Kaarthik Shrinivas's CLI Portfolio.</p>
                <p class="terminal-tip">Type <span class="cmd-highlight">help</span> to view all available commands.</p>
                <p class="terminal-line-break"></p>
            `;
        } else if (commands[cmd]) {
            const resultHtml = commands[cmd]();
            const respLine = document.createElement('div');
            respLine.className = 'terminal-line';
            respLine.innerHTML = resultHtml.trim();
            terminalOutput.appendChild(respLine);
        } else {
            const errorLine = document.createElement('p');
            errorLine.className = 'terminal-line terminal-line-error';
            errorLine.innerHTML = `Command not found: "${escapeHTML(cmd)}". Type <span class="cmd-highlight">help</span> for a list of valid commands.`;
            terminalOutput.appendChild(errorLine);
        }

        // Spacer line
        const breakLine = document.createElement('p');
        breakLine.className = 'terminal-line-break';
        terminalOutput.appendChild(breakLine);

        // Scroll terminal to bottom
        setTimeout(() => {
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }, 10);
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }

    // ==========================================================================
    // 7. Navbar Active link highlighting on scroll
    // ==========================================================================
    const sections = document.querySelectorAll('section, header');
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 100; // offset for nav height

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
                currentSectionId = section.getAttribute('id') || '';
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });
});
