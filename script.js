// Mint адрес токена
const MINT_ADDRESS = "6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN";

// Функция копирования адреса
function copyAddress() {
    const addressElement = document.getElementById('mintAddress');
    const address = addressElement.textContent;
    
    navigator.clipboard.writeText(address).then(() => {
        // Показываем уведомление об успешном копировании
        showNotification('Адрес скопирован в буфер обмена!', 'success');
        
        // Анимация кнопки
        const copyBtn = document.querySelector('.copy-btn');
        copyBtn.textContent = 'Скопировано!';
        copyBtn.style.background = '#28a745';
        
        setTimeout(() => {
            copyBtn.textContent = 'Копировать';
            copyBtn.style.background = '#667eea';
        }, 2000);
    }).catch(err => {
        console.error('Ошибка копирования: ', err);
        showNotification('Ошибка копирования адреса', 'error');
    });
}

// Функция покупки токена
function buyToken() {
    // Проверяем наличие кошелька Phantom
    if (typeof window.solana !== 'undefined') {
        connectWallet().then(() => {
            showNotification('Перенаправление на DEX для покупки...', 'info');
            // Открываем Jupiter или Raydium для обмена
            window.open(`https://jup.ag/swap/SOL-${MINT_ADDRESS}`, '_blank');
        });
    } else {
        // Если кошелёк не установлен, предлагаем установить
        showNotification('Для покупки установите кошелёк Phantom', 'warning');
        window.open('https://phantom.app/', '_blank');
    }
}

// Функция добавления токена в кошелёк
async function addToWallet() {
    if (typeof window.solana !== 'undefined') {
        try {
            await connectWallet();
            
            // Запрос на добавление токена
            const response = await window.solana.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'SPL',
                    options: {
                        address: MINT_ADDRESS,
                        symbol: 'COIN',
                        decimals: 9,
                        image: 'data:image/svg+xml;base64,' + btoa(`
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="45" fill="url(#grad)"/>
                                <text x="50" y="55" text-anchor="middle" font-size="20" font-weight="bold" fill="white">COIN</text>
                                <defs>
                                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" style="stop-color:#667eea"/>
                                        <stop offset="100%" style="stop-color:#764ba2"/>
                                    </linearGradient>
                                </defs>
                            </svg>
                        `)
                    }
                }
            });
            
            if (response) {
                showNotification('Токен COIN добавлен в кошелёк!', 'success');
            }
        } catch (error) {
            console.error('Ошибка добавления токена:', error);
            showNotification('Ошибка добавления токена в кошелёк', 'error');
        }
    } else {
        showNotification('Для добавления токена установите кошелёк Phantom', 'warning');
        window.open('https://phantom.app/', '_blank');
    }
}

// Функция подключения к кошельку
async function connectWallet() {
    if (typeof window.solana !== 'undefined') {
        try {
            const response = await window.solana.connect();
            showNotification('Кошелёк подключен!', 'success');
            return response;
        } catch (error) {
            console.error('Ошибка подключения кошелька:', error);
            showNotification('Ошибка подключения к кошельку', 'error');
            throw error;
        }
    } else {
        throw new Error('Кошелёк не найден');
    }
}

// Функция показа уведомлений
function showNotification(message, type = 'info') {
    // Создаём элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Стили для уведомления
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    `;
    
    // Цвета в зависимости от типа
    switch(type) {
        case 'success':
            notification.style.background = '#28a745';
            break;
        case 'error':
            notification.style.background = '#dc3545';
            break;
        case 'warning':
            notification.style.background = '#ffc107';
            notification.style.color = '#333';
            break;
        default:
            notification.style.background = '#667eea';
    }
    
    // Добавляем на страницу
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Удаляем через 4 секунды
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Плавная прокрутка для навигационных ссылок
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Анимация при прокрутке
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Наблюдаем за секциями
    const sections = document.querySelectorAll('.about, .tokenomics');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
});

// Проверка доступности кошелька при загрузке
window.addEventListener('load', function() {
    if (typeof window.solana !== 'undefined') {
        console.log('Кошелёк Phantom обнаружен');
    } else {
        console.log('Кошелёк Phantom не установлен');
    }
}); 