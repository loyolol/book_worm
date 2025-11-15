document.addEventListener('DOMContentLoaded', () => {

    const navLinks = document.querySelectorAll('.nav-link');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const header = document.querySelector('.site-header');
    const loginButton = document.getElementById('login-button'); // Получаем кнопку "Войти"
    const authButtonContainer = document.querySelector('.auth-button-container'); // Контейнер кнопки "Войти"

    // --- Функция для установки активной ссылки в меню ---
    const setActiveNavLink = () => {
        const currentPageFileName = window.location.pathname.split('/').pop() || 'index.html';
        let currentSectionId = '';
        const headerHeight = header ? header.offsetHeight : 0;

        if (currentPageFileName === 'index.html' || currentPageFileName === '') {
            let scrollPosition = window.scrollY || window.pageYOffset;
            const sections = document.querySelectorAll('main section[id]');

            sections.forEach(section => {
                const sectionTop = section.offsetTop - headerHeight - 50;
                const sectionHeight = section.offsetHeight;
                const sectionBottom = sectionTop + sectionHeight;

                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    currentSectionId = section.getAttribute('id');
                }
            });
        }

        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            let linkTargetPage = linkHref.split('#')[0].split('/').pop() || 'index.html';
            if (linkTargetPage === '' || linkTargetPage === '/') {
                linkTargetPage = 'index.html';
            }

            link.classList.remove('active');

            if (currentPageFileName === linkTargetPage) {
                if (linkTargetPage === 'index.html') {
                    const linkAnchor = linkHref.split('#')[1];
                    if (currentSectionId === linkAnchor || (!currentSectionId && linkHref === '#home')) {
                         link.classList.add('active');
                    }
                } else if (linkTargetPage === 'about.html') {
                    const linkAnchor = linkHref.split('#')[1];
                    if (linkAnchor === 'about' || linkHref === 'about.html') {
                        link.classList.add('active');
                    }
                } else if (linkTargetPage === 'contacts.html') {
                    const linkAnchor = linkHref.split('#')[1];
                    if (linkAnchor === 'contact' || linkHref === 'contacts.html') {
                        link.classList.add('active');
                    }
                } else if (linkTargetPage === 'catalog.html') {
                    if (linkHref === 'catalog.html' || linkHref === 'catalog.html#') {
                        link.classList.add('active');
                    }
                }
            }
        });
    };

    // --- Переключение мобильного меню ---
    mobileMenuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');

        // Перемещаем кнопку "Войти" в мобильное меню, когда оно открывается
        if (mainNav.classList.contains('active')) {
            // Проверяем, что кнопка "Войти" существует и находится в своем исходном контейнере
            if (loginButton && authButtonContainer && authButtonContainer.contains(loginButton)) {
                mainNav.appendChild(loginButton); // Перемещаем кнопку в мобильное меню
            }
        } else {
            // Возвращаем кнопку "Войти" на место, когда мобильное меню закрывается
            if (loginButton && authButtonContainer && !authButtonContainer.contains(loginButton)) {
                authButtonContainer.appendChild(loginButton); // Возвращаем кнопку в ее исходный контейнер
            }
        }
    });

    // Закрытие меню при клике вне его
    document.addEventListener('click', (e) => {
        // Если клик произошел вне мобильного меню и вне кнопки его открытия
        if (!mainNav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            // Если меню открыто, закрываем его
            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                // Важно: возвращаем кнопку "Войти" на место, если меню закрывается кликом вне его
                if (loginButton && authButtonContainer && !authButtonContainer.contains(loginButton)) {
                    authButtonContainer.appendChild(loginButton);
                }
            }
        }
    });

    // ----- Карусель на главной странице -----
    let currentIndex = 0;
    let totalItems = 0;
    let itemsPerPage = 0;

    const getCssVariable = (variableName) => {
        return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
    };

    const initializeCarousel = () => {
        if (!document.querySelector('.book-carousel-inner')) return;

        totalItems = document.querySelector('.book-carousel-inner').children.length;
        itemsPerPage = parseInt(getCssVariable('--carousel-items-visible'), 10) || 4;

        if (totalItems === 0) {
            if (document.querySelector('.carousel-control.prev')) document.querySelector('.carousel-control.prev').style.display = 'none';
            if (document.querySelector('.carousel-control.next')) document.querySelector('.carousel-control.next').style.display = 'none';
            return;
        }

        const maxIndex = totalItems - itemsPerPage;
        currentIndex = Math.min(currentIndex, maxIndex);
        if (currentIndex < 0) currentIndex = 0;

        updateCarouselPosition();
        updateCarouselButtons();
    };

    const updateCarouselPosition = () => {
        if (!document.querySelector('.book-carousel-inner')) return;

        const gap = parseInt(getCssVariable('--carousel-item-gap'), 10) || 20;
        const cardWidth = parseInt(getCssVariable('--book-card-width'), 10);

        const offset = currentIndex * (cardWidth + gap);
        document.querySelector('.book-carousel-inner').style.transform = `translateX(-${offset}px)`;
    };

    const updateCarouselButtons = () => {
        const prevButton = document.querySelector('.carousel-control.prev');
        const nextButton = document.querySelector('.carousel-control.next');
        if (!prevButton || !nextButton) return;

        prevButton.classList.toggle('hidden', currentIndex === 0);
        nextButton.classList.toggle('hidden', currentIndex >= totalItems - itemsPerPage);
    };

    if (document.querySelector('.carousel-control.prev')) {
        document.querySelector('.carousel-control.prev').addEventListener('click', () => {
            currentIndex = Math.max(0, currentIndex - itemsPerPage);
            updateCarouselPosition();
            updateCarouselButtons();
        });
    }
    if (document.querySelector('.carousel-control.next')) {
        document.querySelector('.carousel-control.next').addEventListener('click', () => {
            currentIndex = Math.min(totalItems - itemsPerPage, currentIndex + itemsPerPage);
            updateCarouselPosition();
            updateCarouselButtons();
        });
    }

    window.addEventListener('resize', () => {
        itemsPerPage = parseInt(getCssVariable('--carousel-items-visible'), 10) || 4;
        initializeCarousel();
    });

    initializeCarousel();

    // ----- Фильтрация жанров (базовая имитация) -----
    const genreSelect = document.getElementById('genre-select');
    const catalogBooksGrid = document.querySelector('.catalog-books-grid');
    const bookCards = document.querySelectorAll('.book-card');

    if (genreSelect && catalogBooksGrid && bookCards) {
        genreSelect.addEventListener('change', (e) => {
            const selectedGenre = e.target.value;
            bookCards.forEach(card => {
                const cardGenre = card.getAttribute('data-genre');
                if (selectedGenre === 'all' || !cardGenre || cardGenre === selectedGenre) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // ----- Пагинация (имитация работы стрелочек и цифр) -----
    const paginationContainer = document.querySelector('.pagination');
    if (paginationContainer) {
        const paginationLinks = paginationContainer.querySelectorAll('a:not(.prev-page):not(.next-page)'); // Цифры страницы
        const prevPageBtn = paginationContainer.querySelector('.prev-page');
        const nextPageBtn = paginationContainer.querySelector('.next-page');
        
        let currentPage = 1; // Начинаем с 1-й страницы
        const totalPages = 7; // Общее количество страниц (из примера)

        // Функция для обновления отображения пагинации
        const updatePaginationDisplay = () => {
            paginationLinks.forEach(link => {
                const pageNumber = parseInt(link.textContent);
                // Скрываем лишние цифры, оставляем 1, 2, 3, 4, ..., 7
                if (link.textContent === '...' || pageNumber === currentPage || pageNumber === 1 || pageNumber === 2 || pageNumber === 3 || pageNumber === 4 || pageNumber === totalPages) {
                    link.style.display = 'flex';
                } else {
                    link.style.display = 'none';
                }
                
                // Подсвечиваем текущую страницу
                if (pageNumber === currentPage) {
                    link.classList.add('current-page');
                } else {
                    link.classList.remove('current-page');
                }
            });
            // Блокируем стрелки, если достигли первого или последнего элемента
            if (prevPageBtn) prevPageBtn.classList.toggle('disabled', currentPage === 1);
            if (nextPageBtn) nextPageBtn.classList.toggle('disabled', currentPage === totalPages);
        };

        // Обработчик клика по кнопкам пагинации (цифрам)
        paginationLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const pageNumber = parseInt(link.textContent);
                if (!isNaN(pageNumber) && pageNumber !== currentPage) {
                    currentPage = pageNumber;
                    updatePaginationDisplay();
                    // loadPage(currentPage);
                }
            });
        });

        // Обработчик клика по стрелке "Назад"
        if (prevPageBtn) {
            prevPageBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (currentPage > 1) {
                    currentPage--;
                    updatePaginationDisplay();
                    // loadPage(currentPage);
                }
            });
        }
        // Обработчик клика по стрелке "Вперед"
        if (nextPageBtn) {
            nextPageBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (currentPage < totalPages) {
                    currentPage++;
                    updatePaginationDisplay();
                    // loadPage(currentPage);
                }
            });
        }

        updatePaginationDisplay(); // Инициализация состояния пагинации при загрузке
    }

    // ----- Остальные скрипты -----
    const searchInput = document.getElementById('site-search');
    const searchButton = document.getElementById('search-button');

    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            window.location.href = `#search?q=${encodeURIComponent(query)}`;
        }
    });
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchButton.click();
        }
    });

    const animatedSections = document.querySelectorAll('.animated-section');
    const observerOptions = {
        root: null,
        threshold: 0.2
    };
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);
    animatedSections.forEach(section => {
        observer.observe(section);
    });

    setActiveNavLink();
    window.addEventListener('scroll', setActiveNavLink);

});