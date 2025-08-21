/*
Документация по работе в шаблоне:
Документация слайдера: https://swiperjs.com/
Сниппет(HTML): swiper
*/
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Инициализация слайдеров
function initSliders() {
    // Перечень слайдеров
    if (document.querySelector('[data-swiper]')) {
        new Swiper('[data-swiper]', {
            // Подключаем модули слайдера
            // для конкретного случая
            //modules: [Navigation, Pagination],
            /*
            effect: 'fade',
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            */
            observer: true,
            observeParents: true,
            slidesPerView: 1,
            spaceBetween: 0,
            autoHeight: true,
            speed: 800,
            //touchRatio: 0,
            //simulateTouch: false,
            //loop: true,
            //preloadImages: false,
            //lazy: true,
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            // Arrows
            navigation: {
                nextEl: '.swiper__more .swiper__more--next',
                prevEl: '.swiper__more .swiper__more--prev',
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                    spaceBetween: 16,
                },
                768: {
                    slidesPerView: 4,
                    spaceBetween: 24,
                },
                1024: {
                    slidesPerView: 4,
                    spaceBetween: 32,
                },
            },
            on: {}
        });
    }
}

window.addEventListener("load", function (e) {
    // Запуск инициализации слайдеров
    initSliders();
});
