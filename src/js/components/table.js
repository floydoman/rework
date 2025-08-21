export default () => {

    document.addEventListener('click', (event) => {
        if (event.target.closest('tbody [name=setting-item]')) {
            if (event.target.checked) {
                event.target.closest('tr').classList.add("selected");
            } else {
                event.target.closest('tr').classList.remove("selected");
            }
        }
    });

    document.addEventListener('click', (event) => {
        if (event.target.closest('thead [name=setting-item]')) {
            if (event.target.checked) {
                event.target.closest('table').querySelectorAll('tbody tr').forEach(el => {
                    el.classList.add("selected");
                    el.querySelector('[name=setting-item]').checked = true;
                });
            } else {
                event.target.closest('table').querySelectorAll('tbody tr').forEach(el => {
                    el.classList.remove("selected");
                    el.querySelector('[name=setting-item]').checked = false;
                });
            }
        }
    });

    document.addEventListener('click', (event) => {
        if (event.target.closest('thead .table-sorter')) {
            event.target.classList.toggle('active');
        }
    })
};
