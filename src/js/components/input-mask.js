import IMask from 'imask';

document.querySelectorAll('[data-mask]').forEach(elem => {
    let maskPattern = elem.dataset.mask;
    IMask(elem, {
        mask: elem.dataset.mask
    });
});

document.querySelectorAll('[data-mask-num]').forEach(elem => {
    IMask(elem, {
        mask: Number,
    });
});
