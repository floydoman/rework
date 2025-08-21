export default () => {
    document.addEventListener('click', (event) => {
        if (event.target.closest('[data-offcanvas-target]')) {
            event.preventDefault();
            if (document.querySelectorAll('[data-offcanvas]').length > 0) {
                document.body.classList.add('offcanvas-open');
                const offcanvasTarget = event.target.closest('[data-offcanvas-target]').dataset.offcanvasTarget;

                document.querySelectorAll('[data-offcanvas]').forEach((el) => {
                    el.classList.remove('open');
                });
                document.querySelector(`[data-offcanvas="${offcanvasTarget}"]`).classList.add('open');
            }
        }
    });

    document.addEventListener('click', (event) => {
        if (event.target.closest('[data-offcanvas-target-click]')) {
            event.preventDefault();
            if (document.querySelectorAll('[data-offcanvas]').length > 0) {
                document.body.classList.add('offcanvas-open');
                const offcanvasTarget = event.target.closest('[data-offcanvas-target-click]').dataset.offcanvasTargetClick;
                console.log(offcanvasTarget);
                document.querySelectorAll('[data-offcanvas]').forEach((el) => {
                    el.classList.remove('open');
                });
                document.querySelector(`[data-offcanvas="${offcanvasTarget}"]`).classList.add('open');
            }
        }
    });

    document.addEventListener('click', (event) => {
        if (event.target.closest('[data-offcanvas-close]')) {
            event.preventDefault();
            document.body.classList.remove('offcanvas-open');
            document.querySelectorAll('[data-offcanvas]').forEach((el) => {
                el.classList.remove('open');
            });
        }
    })
};
