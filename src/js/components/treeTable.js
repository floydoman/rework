export default function() {

    window.addEventListener('load', function (e) {
        if(document.querySelectorAll('[data-table-collapse]').length > 0) {

            document.querySelectorAll('[data-table-collapse]').forEach(function (table) {

                table.querySelectorAll('[data-tr-toggle]').forEach(toggle => {
                    toggle.addEventListener('click', function () {
                        const tr = this.closest('tr');
                        const id = tr.dataset.trId;
                        const rows = table.querySelectorAll(`[data-tr-parent='${id}']`);
                        const isExpanded = this.classList.contains('close');

                        if (isExpanded) {
                            this.classList.remove('close');
                            rows.forEach(row => row.classList.remove('hidden'));
                        } else {
                            this.classList.add('close');
                            hideChildren(id);
                        }
                    });
                });

                function hideChildren(parentId) {
                    const children = table.querySelectorAll(`[data-tr-parent='${parentId}']`);
                    children.forEach(child => {
                        child.classList.add('hidden');
                        const childId = child.dataset.trId;
                        hideChildren(childId); // рекурсивно скрываем потомков
                        const toggle = child.querySelector('[data-tr-toggle]');
                        if (toggle) toggle.classList.add('close');
                    });
                }


                // Чекбоксы: и прямое, и обратное наследование
                table.querySelectorAll('[data-tr-checkbox]').forEach(checkbox => {
                    checkbox.addEventListener('change', function () {

                        const tr = this.closest('tr');
                        const id = tr.dataset.trId;
                        const isChecked = this.checked;

                        // Вперёд — отметить всех потомков
                        // setChildrenChecked(id, isChecked);

                        // Назад — обновить родителей
                        updateParents(tr);
                    });
                });

// Отмечает/снимает всех потомков
                function setChildrenChecked(parentId, checked) {
                    const children = table.querySelectorAll(`tr[data-tr-parent='${parentId}']`);
                    children.forEach(child => {
                        const cb = child.querySelector('[data-tr-checkbox]');
                        if (cb) {
                            cb.checked = checked;
                            cb.indeterminate = false;
                        }
                        const childId = child.dataset.id;
                        setChildrenChecked(childId, checked);
                    });
                }

// Обновляет родителей рекурсивно
                function updateParents(childRow) {
                    const parentId = childRow.dataset.trParent;
                    if (!parentId) return;

                    const parentRow = table.querySelector(`tr[data-tr-id='${parentId}']`);
                    const parentCheckbox = parentRow.querySelector('[data-tr-checkbox]');
                    const siblingRows = table.querySelectorAll(`tr[data-tr-parent='${parentId}']`);

                    let allChecked = true;
                    let noneChecked = true;

                    siblingRows.forEach(row => {
                        const cb = row.querySelector('[data-tr-checkbox]');
                        if (cb.checked) {
                            noneChecked = false;
                        } else {
                            allChecked = false;
                        }
                    });

                    if (allChecked) {
                        parentCheckbox.checked = true;
                        parentCheckbox.indeterminate = false;
                    } else if (noneChecked) {
                        parentCheckbox.checked = false;
                        parentCheckbox.indeterminate = false;
                    } else {
                        parentCheckbox.checked = true;
                        parentCheckbox.indeterminate = true;
                    }
                    // console.log(parentRow);
                    // Рекурсивно обновляем вышестоящих родителей
                    updateParents(parentRow);
                }
            })
        }
    })
}
