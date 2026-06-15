// script.js - Общая функциональность для всех страниц

// ============== УПРАВЛЕНИЕ ИЗБРАННЫМ ==============
function toggleFavorite(productId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const index = favorites.indexOf(productId);
    
    if (index === -1) {
        favorites.push(productId);
        showNotification('Товар добавлен в избранное ❤️', 'success');
    } else {
        favorites.splice(index, 1);
        showNotification('Товар удален из избранного', 'info');
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoriteButtons();
}

function updateFavoriteButtons() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    document.querySelectorAll('.btn-favorite').forEach(btn => {
        const productCard = btn.closest('.product-card');
        if (productCard) {
            const productId = productCard.dataset.id;
            if (favorites.includes(parseInt(productId))) {
                btn.classList.add('active');
                btn.innerHTML = '❤️';
            } else {
                btn.classList.remove('active');
                btn.innerHTML = '🤍';
            }
        }
    });
}

// ============== УВЕДОМЛЕНИЯ ==============
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
        color: white;
        padding: 15px 25px;
        border-radius: 4px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============== КОРЗИНА ==============
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(productId) {
    const product = getProductById(productId);
    if (product) {
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showNotification('Товар добавлен в корзину 🛒', 'success');
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification('Товар удален из корзины', 'info');
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length;
        cartCount.style.display = cart.length > 0 ? 'flex' : 'none';
    }
}

// ============== ПОИСК ТОВАРОВ ==============
function searchProducts(query) {
    const products = document.querySelectorAll('.product-card');
    let foundCount = 0;
    
    products.forEach(product => {
        const title = product.querySelector('h3').textContent.toLowerCase();
        const category = product.querySelector('.product-category')?.textContent.toLowerCase() || '';
        
        if (title.includes(query.toLowerCase()) || category.includes(query.toLowerCase())) {
            product.style.display = 'block';
            foundCount++;
        } else {
            product.style.display = 'none';
        }
    });
    
    showNotification(`Найдено ${foundCount} товаров`, 'info');
}

// ============== ФИЛЬТРАЦИЯ ==============
function filterProducts() {
    const category = document.getElementById('categoryFilter')?.value;
    const size = document.getElementById('sizeFilter')?.value;
    const color = document.getElementById('colorFilter')?.value;
    const minPrice = parseFloat(document.getElementById('minPrice')?.value) || 0;
    const maxPrice = parseFloat(document.getElementById('maxPrice')?.value) || Infinity;
    
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        let show = true;
        const priceText = product.querySelector('.current-price')?.textContent || '0';
        const price = parseFloat(priceText.replace(/[^\d]/g, ''));
        
        if (minPrice && price < minPrice) show = false;
        if (maxPrice && price > maxPrice) show = false;
        
        product.style.display = show ? 'block' : 'none';
    });
    
    showNotification('Фильтры применены', 'success');
}

// ============== БЫСТРЫЙ ПРОСМОТР ==============
function quickView(productId) {
    const product = getProductById(productId);
    if (!product) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="quick-view-content">
                <div class="quick-view-image">
                    ${product.image || '<div style="width:100%;height:300px;background:#f0f0f0;display:flex;align-items:center;justify-content:center">🖼️ Изображение товара</div>'}
                </div>
                <div class="quick-view-details">
                    <h2>${product.name}</h2>
                    <p class="product-category">${product.category || 'Категория'}</p>
                    <div class="product-price">${product.price} ₽</div>
                    <p class="product-description">${product.description || 'Описание товара...'}</p>
                    <div class="size-selector">
                        <h4>Выберите размер:</h4>
                        ${['44-46', '48-50', '52-54', '56-58'].map(s => 
                            `<label><input type="radio" name="size" value="${s}"> ${s}</label>`
                        ).join('')}
                    </div>
                    <div class="quick-view-actions">
                        <button class="btn-primary" onclick="addToCart(${productId})">В корзину</button>
                        <button class="btn-favorite" onclick="toggleFavorite(${productId})">❤️ В избранное</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.close-modal').onclick = () => modal.remove();
    window.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
}

// ============== ПОЛУЧЕНИЕ ДАННЫХ О ТОВАРЕ ==============
function getProductById(id) {
    // Здесь должна быть заглушка с данными о товарах
    const products = {
        1: { id: 1, name: 'Костюм классический', price: 34990, category: 'Костюмы', description: 'Элегантный классический костюм из шерстяной ткани' },
        2: { id: 2, name: 'Пиджак шерстяной', price: 22500, category: 'Пиджаки', description: 'Однобортный пиджак из чистой шерсти' },
        3: { id: 3, name: 'Брюки классические', price: 12900, category: 'Брюки', description: 'Классические брюки со стрелками' },
        4: { id: 4, name: 'Рубашка хлопковая', price: 7990, category: 'Рубашки', description: 'Рубашка из египетского хлопка' },
        // Добавьте остальные товары
    };
    return products[id];
}

// ============== ПОДПИСКА НА РАССЫЛКУ ==============
function subscribeNewsletter(event) {
    event.preventDefault();
    const email = document.getElementById('newsletterEmail')?.value;
    
    if (email && email.includes('@')) {
        showNotification('Спасибо за подписку! 🎉', 'success');
        event.target.reset();
    } else {
        showNotification('Пожалуйста, введите корректный email', 'info');
    }
}

// ============== ФОРМА ОБРАТНОЙ СВЯЗИ ==============
function submitContactForm(event) {
    event.preventDefault();
    
    const name = document.getElementById('contactName')?.value;
    const email = document.getElementById('contactEmail')?.value;
    const message = document.getElementById('contactMessage')?.value;
    
    if (name && email && message) {
        showNotification('Сообщение отправлено! Мы свяжемся с вами скоро', 'success');
        event.target.reset();
    } else {
        showNotification('Пожалуйста, заполните все поля', 'info');
    }
}

// ============== ЗАГРУЗКА ИЗБРАННОГО ==============
function loadFavorites() {
    const favoritesGrid = document.querySelector('.favorites-grid');
    if (!favoritesGrid) return;
    
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    if (favorites.length === 0) {
        favoritesGrid.innerHTML = '<div class="empty-favorites">У вас пока нет избранных товаров</div>';
        return;
    }
    
    // Здесь должна быть загрузка товаров по ID из избранного
    favoritesGrid.innerHTML = favorites.map(id => `
        <div class="product-card" data-id="${id}">
            <div class="product-image">
                <svg viewBox="0 0 300 400">
                    <rect width="300" height="400" fill="#2c3e50"/>
                </svg>
                <button class="quick-view" onclick="quickView(${id})">Быстрый просмотр</button>
            </div>
            <div class="product-info">
                <h3>Товар ${id}</h3>
                <div class="product-price">${getProductById(id)?.price || 19990} ₽</div>
                <div class="product-actions">
                    <button class="btn-add-to-cart" onclick="addToCart(${id})">В корзину</button>
                    <button class="btn-favorite active" onclick="toggleFavorite(${id})">❤️</button>
                </div>
            </div>
        </div>
    `).join('');
}

// ============== ИНИЦИАЛИЗАЦИЯ ==============
document.addEventListener('DOMContentLoaded', function() {
    // Обновление кнопок избранного
    updateFavoriteButtons();
    
    // Обновление счетчика корзины
    updateCartCount();
    
    // Обработчики для кнопок быстрого просмотра
    document.querySelectorAll('.quick-view').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            if (productCard) {
                quickView(productCard.dataset.id);
            }
        });
    });
    
    // Обработчик поиска
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchProducts(e.target.value);
        });
    }
    
    // Обработчик формы подписки
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', subscribeNewsletter);
    }
    
    // Обработчик контактной формы
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', submitContactForm);
    }
    
    // Загрузка избранного на странице favorites.html
    loadFavorites();
});

// Добавляем CSS анимации
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 4px;
        color: white;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    
    .btn-favorite.active {
        color: #ff6b6b;
        border-color: #ff6b6b;
    }
    
    .cart-count {
        position: absolute;
        top: -5px;
        right: -5px;
        background: #ff6b6b;
        color: white;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .favorites-link {
        position: relative;
    }
    
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }
    
    .modal-content {
        background: white;
        padding: 30px;
        border-radius: 8px;
        max-width: 800px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
    }
    
    .close-modal {
        position: absolute;
        top: 15px;
        right: 20px;
        font-size: 28px;
        cursor: pointer;
    }
    
    .quick-view-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 30px;
    }
    
    .quick-view-image {
        background: #f8f8f8;
        border-radius: 4px;
        overflow: hidden;
    }
    
    .size-selector {
        margin: 20px 0;
    }
    
    .size-selector label {
        display: inline-block;
        margin-right: 15px;
        padding: 5px 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        cursor: pointer;
    }
    
    .size-selector input {
        margin-right: 5px;
    }
    
    .quick-view-actions {
        display: flex;
        gap: 15px;
        margin-top: 20px;
    }
    
    .empty-favorites {
        text-align: center;
        padding: 60px;
        color: #999;
        font-size: 1.2rem;
    }
    
    @media (max-width: 768px) {
        .quick-view-content {
            grid-template-columns: 1fr;
        }
    }
`;

document.head.appendChild(style);
function openSocial(network) {
    const urls = {
        'vk': 'https://vk.com',
        'pinterest': 'https://pinterest.com',
        'max': 'https://max.ru'
    };
    window.open(urls[network], '_blank');
}