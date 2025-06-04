// Función para alternar la visibilidad del menú móvil
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) { // Asegura que el elemento existe antes de manipularlo
        mobileMenu.classList.toggle('active'); // Alterna la clase 'active'
    }
}

// Función para manejar el encogimiento del encabezado al hacer scroll
function handleScroll() {
    const navbar = document.getElementById('navbar');
    if (navbar) { // Asegura que el elemento existe
        if (window.scrollY > 50) { // Si el usuario ha hecho scroll más de 50px
            navbar.classList.add('py-2', 'md:py-2'); // Reduce el padding
            navbar.classList.remove('py-3', 'md:py-3'); // Elimina el padding original
        } else {
            navbar.classList.remove('py-2', 'md:py-2'); // Restaura el padding original
            navbar.classList.add('py-3', 'md:py-3'); // Añade el padding original
        }
    }
}

// Función para inicializar el carrusel Swiper en la sección de promociones
function initializeSwiper() {
    // Verifica si Swiper está disponible y si el contenedor existe
    if (typeof Swiper !== 'undefined' && document.querySelector('.promociones-swiper')) {
        new Swiper('.promociones-swiper', {
            loop: true, // Habilita el modo de bucle continuo
            pagination: {
                el: '.swiper-pagination', // Contenedor de los puntos de paginación
                clickable: true, // Hace que los puntos de paginación sean clickeables
            },
            autoplay: {
                delay: 5000, // Retraso de autoplay en milisegundos (5 segundos)
                disableOnInteraction: false, // Continúa el autoplay después de la interacción del usuario
            },
            breakpoints: {
                // Configuración para pantallas de 768px o más (desktop)
                768: {
                    slidesPerView: 1, // Muestra 1 slide por vista
                    spaceBetween: 30, // Espacio entre slides
                },
                // Configuración para pantallas menores de 768px (móvil)
                0: {
                    slidesPerView: 1, // Muestra 1 slide por vista
                    spaceBetween: 10, // Espacio entre slides
                }
            }
        });
    } else {
        console.warn("Swiper no se pudo inicializar. Asegúrate de que el CDN de Swiper esté cargado y el contenedor '.promociones-swiper' exista.");
    }
}

// Event Listeners: Se ejecutan una vez que el DOM está completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // 1. Manejo del botón del menú móvil
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', toggleMobileMenu);
    }

    // 2. Manejo del scroll para el efecto del encabezado
    window.addEventListener('scroll', handleScroll);

    // 3. Inicialización del carrusel Swiper
    initializeSwiper();

    // 4. Smooth scrolling para todos los enlaces de navegación interna
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Evita el comportamiento predeterminado del enlace

            // Cierra el menú móvil si está abierto al hacer clic en un enlace
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
            }

            // Desplazamiento suave a la sección de destino
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 5. Manejo del envío del formulario de contacto (ejemplo básico)
    const contactFormButton = document.querySelector('#contacto form button[type="submit"]');
    if (contactFormButton) {
        contactFormButton.addEventListener('click', function(e) {
            e.preventDefault(); // Evita el envío del formulario por defecto
            // Aquí puedes añadir la lógica para enviar el formulario, por ejemplo:
            // - Recopilar los datos de los campos (nombre, email, mensaje)
            // - Validar los datos
            // - Enviar los datos a un servidor (usando fetch API o XMLHttpRequest)
            // - Mostrar un mensaje de éxito o error al usuario

            // Ejemplo simple de recopilación de datos y un mensaje de consola
            const nombre = document.getElementById('nombre')?.value;
            const email = document.getElementById('email')?.value;
            const mensaje = document.getElementById('mensaje')?.value;

            if (nombre && email && mensaje) {
                console.log('Formulario enviado:', { nombre, email, mensaje });
                // En un entorno real, aquí harías una llamada a una API:
                // fetch('/api/contact', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify({ nombre, email, mensaje })
                // })
                // .then(response => response.json())
                // .then(data => console.log('Éxito:', data))
                // .catch(error => console.error('Error:', error));

                alert('Mensaje enviado. ¡Gracias por contactarnos!'); // Usa un modal personalizado en producción
                // Limpiar el formulario
                document.getElementById('nombre').value = '';
                document.getElementById('email').value = '';
                document.getElementById('mensaje').value = '';
            } else {
                alert('Por favor, completa todos los campos del formulario.'); // Usa un modal personalizado en producción
            }
        });
    }
});
