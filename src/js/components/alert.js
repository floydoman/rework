export default () => {
    document.addEventListener('click', (event) => {
        if (event.target.closest('[data-alert-target]')) {
            event.preventDefault();
            if (document.querySelectorAll('[data-alert]').length > 0) {
                const alertTarget = event.target.closest('[data-alert-target]').dataset.alertTarget;

                document.querySelectorAll('[data-alert]').forEach((el) => {
                    el.classList.remove('open');
                });
                document.querySelector(`[data-alert="${alertTarget}"]`).classList.add('open');
            }
        }
    })

    document.addEventListener('click', (event) => {
        if (event.target.closest('[data-alert-close]')) {
            event.preventDefault();
            document.querySelectorAll('[data-alert]').forEach((el) => {
                el.classList.remove('open');
            });
        }
    })
};
