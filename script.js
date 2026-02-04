document.addEventListener('DOMContentLoaded', () => {

    // --- 1. MENÚ HAMBURGUESA (Lógica Reparada) ---
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinksMobile = document.querySelectorAll('.nav-link');
    const menuIcon = hamburgerBtn ? hamburgerBtn.querySelector('i') : null;

    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => {
            // Abrir / Cerrar
            navMenu.classList.toggle('active');

            // Cambiar icono (Hamburguesa <-> X)
            if (navMenu.classList.contains('active')) {
                menuIcon.classList.replace('bx-menu', 'bx-x');
            } else {
                menuIcon.classList.replace('bx-x', 'bx-menu');
            }
        });

        // Cerrar menú al tocar un link
        navLinksMobile.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                if (menuIcon) menuIcon.classList.replace('bx-x', 'bx-menu');
            });
        });
    }

    // --- 2. LINTERNA + 3D + GLARE ---
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);

            // 3D solo en PC para no trabar el celular
            if (window.innerWidth > 768) {
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -7; 
                const rotateY = ((x - centerX) / centerX) * 7;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    // --- 3. BOTÓN MAGNÉTICO ---
    const magnetBtn = document.querySelector('.magnetic-btn');
    if (magnetBtn) {
        magnetBtn.addEventListener('mousemove', (e) => {
            const rect = magnetBtn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            magnetBtn.style.transform = `translate(${x * 0.4}px, ${y * 0.4}px)`;
        });
        magnetBtn.addEventListener('mouseleave', () => {
            magnetBtn.style.transform = 'translate(0, 0)';
        });
    }

    // --- 4. EFECTO MATRIX (TEXTO LOCO) ---
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    const skillTags = document.querySelectorAll('.skill-tag');

    skillTags.forEach(tag => {
        tag.dataset.value = tag.innerText;
        tag.addEventListener('mouseover', event => {
            let iterations = 0;
            const originalText = event.target.dataset.value;
            clearInterval(event.target.interval);

            event.target.interval = setInterval(() => {
                event.target.innerText = originalText
                    .split("")
                    .map((letter, index) => {
                        if(index < iterations) return originalText[index];
                        return letters[Math.floor(Math.random() * letters.length)];
                    })
                    .join("");

                if(iterations >= originalText.length) clearInterval(event.target.interval);
                iterations += 1 / 3; 
            }, 30);
        });
    });

    // --- 5. MÁQUINA DE ESCRIBIR ---
    const textElement = document.querySelector('.typewriter');
    const words = ["Responsable", "Proactivo", "Puntual", "Dinámico"];
    let wordIndex = 0, charIndex = 0, isDeleting = false, typeSpeed = 100;

    function type() {
        if (!textElement) return;
        const currentWord = words[wordIndex];
        if (isDeleting) {
            textElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--; typeSpeed = 50;
        } else {
            textElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++; typeSpeed = 100;
        }
        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true; typeSpeed = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false; wordIndex = (wordIndex + 1) % words.length; typeSpeed = 500;
        }
        setTimeout(type, typeSpeed);
    }
    type();

    // --- 6. TEMA OSCURO/CLARO ---
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const icon = themeToggle.querySelector('i');
            if (document.body.classList.contains('light-mode')) icon.classList.replace('bxs-moon', 'bxs-sun');
            else icon.classList.replace('bxs-sun', 'bxs-moon');
        });
    }

    // --- 7. ANIMACIÓN ENTRADA ---
    Array.from(cards).forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px)'; 
        setTimeout(() => { 
            card.style.opacity = '1'; 
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)'; 
        }, 150 * (index + 1));
    });

    // --- 8. RAYITA MENÚ INTELIGENTE ---
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('article.card[id]'); 

    const activeMenu = () => {
        let current = '';
        const triggerPoint = window.scrollY + (window.innerHeight / 3);
        sections.forEach(section => {
            if (triggerPoint >= section.offsetTop - 50) {
                current = section.getAttribute('id');
            }
        });
        if (window.scrollY < 100) current = 'profile-card';

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-target') === current) link.classList.add('active');
        });
    };
    window.addEventListener('scroll', activeMenu);

    // --- 9. CLICK SUAVE ---
    const headerHeight = document.querySelector('.top-header').offsetHeight;
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.getElementById(link.getAttribute('href').substring(1));
            if (target) {
                const offsetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 40;
                window.scrollTo({ top: offsetPosition, behavior: "smooth" });
            }
        });
    });
// --- 11. EFECTO LUMOS / ESTELA DE VARITA ---
    
    // Configuración: Colores mágicos (Azul eléctrico, Cian, Blanco)
    const sparkColors = ['#ffffff', '#00d4ff', '#aaddff'];

    document.addEventListener('mousemove', function(e) {
        // Solo creamos chispas si NO es un celular (pantalla grande)
        if (window.innerWidth > 768) {
            
            // Para que no sea una línea sólida aburrida, 
            // solo creamos una chispa el 30% de las veces que el mouse se mueve.
            // Si quieres MÁS estela, cambia 0.3 por 0.8
            if (Math.random() < 0.3) {
                createMagicSpark(e.clientX, e.clientY);
            }
        }
    });

    function createMagicSpark(x, y) {
        const spark = document.createElement('div');
        spark.classList.add('magic-spark');
        document.body.appendChild(spark);

        // Posicionamos la chispa EXACTAMENTE en la punta del mouse
        spark.style.left = `${x}px`;
        spark.style.top = `${y}px`;

        // Variación aleatoria para que se vea natural
        const randomColor = sparkColors[Math.floor(Math.random() * sparkColors.length)];
        const randomSize = (Math.random() * 5) + 3; // Tamaño entre 3px y 8px
        
        spark.style.background = randomColor;
        spark.style.width = `${randomSize}px`;
        spark.style.height = `${randomSize}px`;
        spark.style.boxShadow = `0 0 10px ${randomColor}, 0 0 20px white`;

        // Limpieza: Borrar la chispa del código cuando termina la animación
        setTimeout(() => {
            spark.remove();
        }, 800);
    }

});