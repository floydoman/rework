export default () => {
    if (document.querySelectorAll('[data-select]').length > 0) {

        document.addEventListener('click', (event) => {
            if (event.target.closest('[data-select-control]')) {
                let selectContainer = event.target.closest('[data-select]');
                if (selectContainer.classList.contains('open')) {
                    selectContainer.classList.remove('open');
                }
                else {
                    selectClose();
                    selectContainer.classList.add('open');
                }
            }
            else {
                if (!event.target.closest('[data-select-dropdown]')) {
                    selectClose();
                }
            }
        });

        document.addEventListener('click', (event) => {
            if (event.target.closest('[data-select-item]')) {
                const select        = event.target.closest('[data-select]')
                const selectActive = select.querySelector('[data-select-active]')
                const selectValue   = select.querySelector('[data-select-value]')
                let selectItem= event.target.closest('[data-select-item]').dataset.selectItem
                select.querySelectorAll('[data-select-item]').forEach(elem => {
                    elem.classList.remove('active');
                });
                event.target.closest('[data-select-item]').classList.add('active')
                select.classList.remove('open')
                selectActive.innerHTML = selectItem
                selectValue.value = selectItem
            }
        });

        document.addEventListener('click', (event) => {
            if (event.target.closest('[data-select-option]')) {
                const select = event.target.closest('[data-select]')
                let isSelectAll = event.target.closest('[data-select-option]').classList.contains('select-all');
                let optionsSelectedArray = []
                let count = 0

                let optionsArray = select.querySelectorAll('[data-select-option]').length - 1

                if (!isSelectAll) {
                    event.target.closest('[data-select-option]').classList.toggle('selected');
                }
                else {
                    if (event.target.closest('[data-select-option]').classList.contains('selected-all')) {
                        event.target.closest('[data-select-option]').classList.remove('selected-all');
                        event.target.closest('[data-select-dropdown]').querySelectorAll('[data-select-option]').forEach(elem => {
                            if (!elem.classList.contains('selected-all')) {
                                elem.classList.remove('selected');
                            }
                        });
                    }
                    else {
                        event.target.closest('[data-select-option]').classList.add('selected-all');
                        event.target.closest('[data-select-dropdown]').querySelectorAll('[data-select-option]').forEach(elem => {
                            if (!elem.classList.contains('selected-all')) {
                                elem.classList.add('selected');
                            }
                        });
                    }
                }

                event.target.closest('[data-select-dropdown]').querySelectorAll('.selected').forEach(elem => {
                    if (elem.dataset.selectOption) {
                        optionsSelectedArray.push(elem.dataset.selectOption)
                    }
                    else {
                        optionsSelectedArray.push(elem.innerHTML)
                    }
                    count++
                });

                if (count === optionsArray) {
                    select.querySelector('.select-all').classList.add('selected-all')
                }
                else {
                    select.querySelector('.select-all').classList.remove('selected-all')
                }

                select.querySelector('[data-select-value]').value = optionsSelectedArray.toString()
                if (count) {
                    select.querySelector('[data-select-active]').innerHTML = 'Выбрано: ' + count
                }
                else {
                    select.querySelector('[data-select-active]').innerHTML = select.querySelector('[data-select-active]').dataset.selectActive
                }

            }
        });

        function selectClose() {
            document.querySelectorAll('[data-select]').forEach(el => {
                el.classList.remove('open');
            });
        }
    }
};
