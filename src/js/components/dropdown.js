export default () => {

    document.addEventListener('click', (event) => {
        const dropdown = document.querySelectorAll('[data-dropdown]');
        if (dropdown.length > 0) {
            if (event.target.closest('[data-dropdown-toggle]')) {
                let dropdownContainer = event.target.closest('[data-dropdown]');
                if (dropdownContainer.classList.contains('open')) {
                    dropdownContainer.classList.remove('open');
                }
                else {
                    dropdownClose();
                    dropdownContainer.classList.add('open');
                }
            }
            else {
                if (!event.target.closest('[data-dropdown-content]')) {
                    dropdownClose();
                }
            }
            function dropdownClose() {
                dropdown.forEach(el => {
                    el.classList.remove('open');
                });
            }
        }
    });
};
