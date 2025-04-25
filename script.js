document.addEventListener('DOMContentLoaded', function() {
    // Плавная прокрутка для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Анимация появления элементов при скролле
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.roadmap-item, .stat, .info-item').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Изменение цвета и размера шапки при скролле
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Генерация фейковой цены и изменение её в реальном времени
    function updatePrice() {
        const randomChange = (Math.random() - 0.5) * 0.01;
        let currentPrice = parseFloat(localStorage.getItem('memcoinPrice')) || 0.0000742;
        
        currentPrice += currentPrice * randomChange;
        localStorage.setItem('memcoinPrice', currentPrice);
        
        const priceElements = document.querySelectorAll('.token-price');
        priceElements.forEach(el => {
            el.textContent = currentPrice.toFixed(8);
            
            // Добавляем класс для анимации изменения цены
            if (randomChange > 0) {
                el.classList.remove('price-down');
                el.classList.add('price-up');
            } else {
                el.classList.remove('price-up');
                el.classList.add('price-down');
            }
            
            // Убираем классы через секунду
            setTimeout(() => {
                el.classList.remove('price-up', 'price-down');
            }, 1000);
        });
    }
    
    // Обновляем цену каждые 5 секунд
    setInterval(updatePrice, 5000);
    updatePrice(); // Инициализируем цену
    
    // Имитация счетчика для сообщества
    function updateCommunityStats() {
        const startHolders = 98762;
        const startFollowers = 48532;
        
        const timeElapsed = (new Date() - new Date('2023-02-10')) / (1000 * 60 * 60 * 24);
        const holderGrowth = Math.floor(timeElapsed * 25); // ~25 новых холдеров в день
        const followerGrowth = Math.floor(timeElapsed * 15); // ~15 новых подписчиков в день
        
        const currentHolders = startHolders + holderGrowth;
        const currentFollowers = startFollowers + followerGrowth;
        
        const holdersElements = document.querySelectorAll('.holders-count');
        const followersElements = document.querySelectorAll('.followers-count');
        
        holdersElements.forEach(el => {
            el.textContent = currentHolders.toLocaleString();
        });
        
        followersElements.forEach(el => {
            el.textContent = currentFollowers.toLocaleString();
        });
    }
    
    updateCommunityStats();
    
    // Создание счетчика обратного отсчета для "будущего" листинга
    function updateCountdown() {
        const launchDate = new Date();
        launchDate.setDate(launchDate.getDate() + 7); // Листинг через 7 дней от текущей даты
        
        const now = new Date();
        const distance = launchDate - now;
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        const countdownElements = document.querySelectorAll('.countdown');
        countdownElements.forEach(el => {
            el.innerHTML = `${days}д ${hours}ч ${minutes}м ${seconds}с`;
        });
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    // Анимация плавающего лого
    const heroImage = document.querySelector('.hero-image img');
    if (heroImage) {
        heroImage.addEventListener('mouseover', () => {
            heroImage.style.animation = 'spin 1s ease-in-out';
            setTimeout(() => {
                heroImage.style.animation = 'float 6s ease-in-out infinite';
            }, 1000);
        });
    }
});

// Добавляем стили для анимаций
document.head.insertAdjacentHTML('beforeend', `
<style>
    .fade-in {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .fade-in.animated {
        opacity: 1;
        transform: translateY(0);
    }
    
    .price-up {
        color: #14F195;
        transition: color 0.3s ease;
    }
    
    .price-down {
        color: #FF4545;
        transition: color 0.3s ease;
    }
    
    header.scrolled {
        padding: 10px 0;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
</style>
`); 