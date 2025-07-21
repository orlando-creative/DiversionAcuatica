// Asegura que el script se ejecute una vez que todo el DOM (estructura HTML) esté cargado.
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Manejo del menú móvil y la barra de navegación ---

    // Obtiene referencias a los elementos HTML por su ID
    const mobileMenuButton = document.getElementById('mobile-menu-button'); // El botón de las 3 rayitas
    const mobileMenu = document.getElementById('mobile-menu');             // El div del menú desplegable
    const navbar = document.getElementById('navbar');                     // La barra de navegación principal

    // Verifica que ambos elementos existan antes de añadir los event listeners
    if (mobileMenuButton && mobileMenu) {
        // Event listener para el botón del menú móvil
        mobileMenuButton.addEventListener('click', () => {
            // Alterna la clase 'hidden' para mostrar/ocultar el menú
            // Alterna la clase 'flex' para aplicar estilos de flexbox cuando está visible
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('flex');
            // La clase 'mobile-menu-open' se podría usar para animaciones CSS más complejas
            // mobileMenu.classList.toggle('mobile-menu-open');
        });

        // Cierra el menú móvil si se hace clic en un enlace dentro de él
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                // Oculta el menú y remueve la clase 'flex'
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
                // mobileMenu.classList.remove('mobile-menu-open');
            });
        });
    }

    // Event listener para cambiar el estilo de la navbar al hacer scroll
    window.addEventListener('scroll', () => {
        if (navbar) { // Asegura que la navbar exista
            if (window.scrollY > 50) { // Si el usuario ha hecho scroll más de 50px
                navbar.classList.add('header-scrolled'); // Añade la clase para el estilo encogido
            } else {
                navbar.classList.remove('header-scrolled'); // Remueve la clase para restaurar el estilo original
            }
        }
    });

    // --- 2. Inicialización del carrusel Swiper en la sección de atracciones ---

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
                // Configuración para diferentes tamaños de pantalla
                640: {
                    slidesPerView: 1, // Muestra 1 slide por vista en pantallas de 640px o más
                    spaceBetween: 20,
                },
                768: {
                    slidesPerView: 1, // Muestra 1 slide por vista en pantallas de 768px o más
                    spaceBetween: 30,
                },
                1024: {
                    slidesPerView: 1, // Muestra 1 slide por vista en pantallas de 1024px o más
                    spaceBetween: 40,
                },
            }
        });
    } else {
        // Mensaje de advertencia si Swiper no se puede inicializar (útil para depuración)
        console.warn("Swiper no se pudo inicializar. Asegúrate de que el CDN de Swiper esté cargado y el contenedor '.promociones-swiper' exista.");
    }

    // --- 3. Lógica para el Menú Especial Dominical (Pedidos por WhatsApp) ---

    // Objeto para almacenar los platos seleccionados y sus cantidades
    const order = {};

    // Itera sobre cada elemento de menú para añadir funcionalidad
    document.querySelectorAll('.menu-item').forEach(item => {
        const dishName = item.dataset.dishName; // Obtiene el nombre del plato del atributo data-dish-name
        const dishPrice = parseFloat(item.dataset.dishPrice); // Obtiene el precio del plato y lo convierte a número
        const quantityInput = item.querySelector('.dish-quantity'); // El input numérico para la cantidad
        const addButton = item.querySelector('.add-to-cart-btn');   // El botón "Agregar"

        // Inicializa la cantidad del plato en el objeto 'order' a 0 si no existe
        order[dishName] = { quantity: 0, price: dishPrice };

        // Sincroniza el valor del input con el objeto 'order' cuando el usuario lo cambia manualmente
        quantityInput.addEventListener('change', (event) => {
            const newQuantity = parseInt(event.target.value);
            if (newQuantity >= 0) { // Asegura que la cantidad no sea negativa
                order[dishName].quantity = newQuantity;
            } else {
                event.target.value = 0; // Si es negativo, lo resetea a 0 en el input
                order[dishName].quantity = 0; // Y en el objeto de orden
            }
        });

        // Incrementa la cantidad del plato cuando se hace clic en el botón "Agregar"
        addButton.addEventListener('click', () => {
            let currentQuantity = parseInt(quantityInput.value);
            currentQuantity++; // Incrementa la cantidad
            quantityInput.value = currentQuantity; // Actualiza el input visualmente
            order[dishName].quantity = currentQuantity; // Actualiza la cantidad en el objeto de orden
        });
    });

    // Event listener para el botón "Ver mi Pedido y Reservar"
    const viewOrderBtn = document.getElementById('view-order-btn');
    if (viewOrderBtn) {
        viewOrderBtn.addEventListener('click', () => {
            let message = "¡Hola! Me gustaría hacer una reserva de comida para el menú dominical:\n\n";
            let totalItems = 0;
            let totalPrice = 0;

            // Construye el mensaje con los platos y cantidades seleccionadas
            for (const dish in order) {
                if (order[dish].quantity > 0) { // Solo incluye platos con cantidad mayor a 0
                    message += `- ${order[dish].quantity}x ${dish} (${(order[dish].price * order[dish].quantity).toFixed(2)} Bs.)\n`;
                    totalItems += order[dish].quantity;
                    totalPrice += order[dish].price * order[dish].quantity;
                }
            }

            // Si no se seleccionó ningún plato, envía un mensaje general de consulta
            if (totalItems === 0) {
                message = "¡Hola! Estoy interesado en el menú especial dominical. ¿Podrías darme más información?";
            } else {
                // Añade el resumen del pedido si hay platos seleccionados
                message += `\nTotal de platos: ${totalItems}\nTotal a pagar (estimado): ${totalPrice.toFixed(2)} Bs.\n\n`;
                message += "Por favor, confírmenme la disponibilidad y los detalles para mi pedido. ¡Gracias!";
            }

            // Codifica el mensaje para que sea seguro en una URL de WhatsApp
            const whatsappURL = `https://wa.me/59173632226?text=${encodeURIComponent(message)}`;
            // Abre la URL de WhatsApp en una nueva pestaña
            window.open(whatsappURL, '_blank');
        });
    }

    // --- 4. Manejo del envío del formulario de contacto (ejemplo básico) ---
    const contactFormButton = document.querySelector('#contacto form button[type="submit"]');
    if (contactFormButton) {
        contactFormButton.addEventListener('click', function(e) {
            e.preventDefault(); // Evita el envío del formulario por defecto (para manejarlo con JS)

            // Recopila los datos de los campos del formulario
            const nombre = document.getElementById('nombre')?.value;
            const email = document.getElementById('email')?.value;
            const mensaje = document.getElementById('mensaje')?.value;

            if (nombre && email && mensaje) {
                console.log('Formulario enviado:', { nombre, email, mensaje });
                // En un entorno real, aquí harías una llamada a una API para enviar los datos:
                /*
                fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nombre, email, mensaje })
                })
                .then(response => response.json())
                .then(data => console.log('Éxito:', data))
                .catch(error => console.error('Error:', error));
                */

                // Muestra un mensaje de éxito. NOTA: En producción, usa un modal personalizado en lugar de alert().
                console.log('Mensaje enviado. ¡Gracias por contactarnos!');
                // Limpiar el formulario
                document.getElementById('nombre').value = '';
                document.getElementById('email').value = '';
                document.getElementById('mensaje').value = '';
            } else {
                // Muestra un mensaje de error si faltan campos. NOTA: En producción, usa un modal personalizado.
                console.error('Por favor, completa todos los campos del formulario.');
            }
        });
    }

    // --- 5. Smooth scrolling para todos los enlaces de navegación interna ---
    // Selecciona todos los enlaces que comienzan con '#' (enlaces ancla)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Evita el comportamiento predeterminado del enlace (salto instantáneo)

            // Cierra el menú móvil si está abierto al hacer clic en un enlace de navegación
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu && mobileMenu.classList.contains('flex')) { // Verifica si el menú está visible
                mobileMenu.classList.remove('flex'); // Oculta el menú
                mobileMenu.classList.add('hidden'); // Añade la clase 'hidden'
            }

            // Obtiene el ID del destino (ej. "#precios")
            const targetId = this.getAttribute('href');
            // Encuentra el elemento de destino en la página
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Desplazamiento suave a la sección de destino
                targetElement.scrollIntoView({
                    behavior: 'smooth' // Habilita el desplazamiento suave
                });
            }
        });
    });

}); // Fin de DOMContentLoaded
