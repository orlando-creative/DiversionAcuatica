// JavaScript para la barra de navegación y menú móvil
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const navbar = document.getElementById('navbar');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('flex');
            mobileMenu.classList.toggle('mobile-menu-open'); // Agrega clase para animar apertura
        });

        // Cerrar menú si se hace clic fuera o en un enlace
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
                mobileMenu.classList.remove('mobile-menu-open');
            });
        });
    }

    // Cambiar estilo de la navbar al hacer scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('header-scrolled'); // Añade una clase para estilos de scroll
        } else {
            navbar.classList.remove('header-scrolled');
        }
    });

    // Inicializar Swiper para las promociones
    if (document.querySelector('.promociones-swiper')) {
        new Swiper('.promociones-swiper', {
            loop: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            breakpoints: {
                640: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                },
                768: {
                    slidesPerView: 1,
                    spaceBetween: 30,
                },
                1024: {
                    slidesPerView: 1,
                    spaceBetween: 40,
                },
            }
        });
    }

    // --- Lógica para el Menú Especial Dominical (Pedidos por WhatsApp) ---
    const order = {}; // Objeto para almacenar los platos y sus cantidades

    document.querySelectorAll('.menu-item').forEach(item => {
        const dishName = item.dataset.dishName;
        const dishPrice = parseFloat(item.dataset.dishPrice); // Asegura que sea un número
        const quantityInput = item.querySelector('.dish-quantity');
        const addButton = item.querySelector('.add-to-cart-btn');

        // Inicializar la cantidad en el objeto de orden si aún no existe
        order[dishName] = { quantity: 0, price: dishPrice };

        // Sincronizar el input con el objeto 'order'
        quantityInput.addEventListener('change', (event) => {
            const newQuantity = parseInt(event.target.value);
            if (newQuantity >= 0) {
                order[dishName].quantity = newQuantity;
            } else {
                event.target.value = 0; // Asegura que no haya valores negativos
                order[dishName].quantity = 0;
            }
        });

        // Botón "Agregar" para ajustar la cantidad del input y el objeto 'order'
        addButton.addEventListener('click', () => {
            let currentQuantity = parseInt(quantityInput.value);
            currentQuantity++;
            quantityInput.value = currentQuantity;
            order[dishName].quantity = currentQuantity;
        });
    });

    // Botón "Ver mi Pedido y Reservar"
    const viewOrderBtn = document.getElementById('view-order-btn');
    if (viewOrderBtn) {
        viewOrderBtn.addEventListener('click', () => {
            let message = "¡Hola! Me gustaría hacer una reserva de comida para el menú dominical:\n\n";
            let totalItems = 0;
            let totalPrice = 0;

            for (const dish in order) {
                if (order[dish].quantity > 0) {
                    message += `- ${order[dish].quantity}x ${dish} (${order[dish].price * order[dish].quantity} Bs.)\n`;
                    totalItems += order[dish].quantity;
                    totalPrice += order[dish].price * order[dish].quantity;
                }
            }

            if (totalItems === 0) {
                message = "¡Hola! Estoy interesado en el menú especial dominical. ¿Podrías darme más información?";
            } else {
                message += `\nTotal de platos: ${totalItems}\nTotal a pagar (estimado): ${totalPrice} Bs.\n\n`;
                message += "Por favor, confírmenme la disponibilidad y los detalles para mi pedido. ¡Gracias!";
            }

            const whatsappURL = `https://wa.me/59173632226?text=${encodeURIComponent(message)}`;
            window.open(whatsappURL, '_blank');
        });
    }

});