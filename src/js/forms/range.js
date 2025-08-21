// Подключение из node_modules
import * as noUiSlider from 'nouislider';

export function rangeInit() {

    const dataSliders = document.querySelectorAll('.data-slider');
    if (dataSliders.length > 0) {
        dataSliders.forEach(el => {
            let sliderStart = el.getAttribute('data-start').split(",").map(parseFloat);
            let sliderMin = parseFloat(el.getAttribute('data-min'));
            let sliderMax = parseFloat(el.getAttribute('data-max'));
            noUiSlider.create(el, {
                start: sliderStart,
                range: {
                    'min': sliderMin,
                    'max': sliderMax,
                }
            });
        });
    }
}
rangeInit();
