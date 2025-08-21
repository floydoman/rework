/* Проверка поддержки webp, добавление класса webp или no-webp для HTML */
export function isWebp() {
	// Проверка поддержки webp
	function testWebP(callback) {
		let webP = new Image();
		webP.onload = webP.onerror = function () {
			callback(webP.height == 2);
		};
		webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
	}
	// Добавление класса _webp или _no-webp для HTML
	testWebP(function (support) {
		let className = support === true ? 'webp' : 'no-webp';
		document.documentElement.classList.add(className);
	});
}

/* Проверка мобильного браузера */
export let isMobile = {
	Android: function () {
		return navigator.userAgent.match(/Android/i);
		},
	BlackBerry: function () {
		return navigator.userAgent.match(/BlackBerry/i);
		},
	iOS: function () {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
	Opera: function () {
		return navigator.userAgent.match(/Opera Mini/i);
		},
	Windows: function () {
		return navigator.userAgent.match(/IEMobile/i);
		},
	any: function () {
		return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
	}
};

/* Добавление класса touch для HTML если браузер мобильный */
export function addTouchClass() {
	// Добавление класса _touch для HTML если браузер мобильный
	if (isMobile.any()) document.documentElement.classList.add('touch');
}

// Добавление loaded для HTML после полной загрузки страницы
export function addLoadedClass() {
	window.addEventListener("load", function () {
		setTimeout(function () {
			document.documentElement.classList.add('loaded');
		}, 0);
	});
}

// Получение хеша в адресе сайта
export function getHash() {
	if (location.hash) { return location.hash.replace('#', ''); }
}

// Указание хеша в адресе сайта
export function setHash(hash) {
	history.pushState('', '', hash);
}

// Учет плавающей панели на мобильных устройствах при 100vh
export function fullVHfix() {
	const fullScreens = document.querySelectorAll('[data-fullscreen]');
	if (fullScreens.length && isMobile.any()) {
		window.addEventListener('resize', fixHeight);
		function fixHeight() {
			let vh = window.innerHeight * 0.01;
			document.documentElement.style.setProperty('--vh', `${vh}px`);
		}
		fixHeight();
	}
}

//  ======================================================
// Прочие полезные функции ===============================
//  ======================================================

// FLS (Full Logging System)
export function FLS(message) {
    setTimeout(() => {
        if (window.FLS) {
            console.log(message);
        }
    }, 0);
}

// Получить цифры из строки
export function getDigFromString(item) {
	return parseInt(item.replace(/[^\d]/g, ''))
}

// Форматирование цифр типа 100 000 000
export function getDigFormat(item) {
	return item.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, "$1 ");
}

// Убрать класс из всех элементов массива
export function removeClasses(array, className) {
    for (let i = 0; i < array.length; i++) {
        array[i].classList.remove(className);
    }
}

// Ввод только цифр в поле
export function setInputFilter(textbox, inputFilter, errMsg) {
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop", "focusout"].forEach(function(event) {
        textbox.addEventListener(event, function(e) {
            if (inputFilter(this.value)) {
                // Accepted value
                if (["keydown","mousedown","focusout"].indexOf(e.type) >= 0){
                    this.classList.remove("input-error");
                    this.setCustomValidity("");
                }
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                // Rejected value - restore the previous one
                this.classList.add("input-error");
                this.setCustomValidity(errMsg);
                this.reportValidity();
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            } else {
                // Rejected value - nothing to restore
                this.value = "";
            }
        });
    });
}

//  Smooth Scroll
export function SmoothScroll(element) {
    const smoothLinks = document.querySelectorAll(element);
    for (let smoothLink of smoothLinks) {
        smoothLink.addEventListener('click', function (e) {
            e.preventDefault();
            const id = smoothLink.getAttribute('href');

            document.querySelector(id).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    };
}

// Drag&drop для колонок таблицы
export function initDragTable (id) {
    if (document.getElementById(id)) {
        if (localStorage.getItem(`tableContent_${id}`) !== null) {
            var tableContent = localStorage.getItem(`tableContent_${id}`);
            document.getElementById(id).innerHTML = tableContent;
        }

        const table = document.getElementById(id);

        let draggingEle;
        let draggingColumnIndex;
        let placeholder;
        let list;
        let isDraggingStarted = false;

        let x = 0;
        let y = 0;

        const swap = function(nodeA, nodeB) {
            const parentA = nodeA.parentNode;
            const siblingA = nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling;

            nodeB.parentNode.insertBefore(nodeA, nodeB);

            parentA.insertBefore(nodeB, siblingA);
        };

        const isOnLeft = function(nodeA, nodeB) {
            const rectA = nodeA.getBoundingClientRect();
            const rectB = nodeB.getBoundingClientRect();

            return (rectA.left + rectA.width / 2 < rectB.left + rectB.width / 2);
        };

        const cloneTable = function() {

            list = document.createElement('div');
            list.classList.add('clone-list');
            list.style.position = 'absolute';
            table.parentNode.insertBefore(list, table);

            table.style.visibility = 'hidden';

            const originalCells = [].slice.call(table.querySelectorAll('tbody td'));

            const originalHeaderCells = [].slice.call(table.querySelectorAll('th'));
            const numColumns = originalHeaderCells.length;

            originalHeaderCells.forEach(function(headerCell, headerIndex) {
                const width = parseInt(window.getComputedStyle(headerCell).width);

                const item = document.createElement('div');
                item.classList.add('draggable');

                const newTable = document.createElement('table');
                newTable.setAttribute('class', 'clone-table');
                newTable.style.width = `${width}px`;

                // Шапка таблицы
                const th = headerCell.cloneNode(true);
                let newRow = document.createElement('tr');
                newRow.appendChild(th);
                newTable.appendChild(newRow);

                const cells = originalCells.filter(function(c, idx) {
                    return (idx - headerIndex) % numColumns === 0;
                });
                cells.forEach(function(cell) {
                    const newCell = cell.cloneNode(true);
                    newCell.style.width = `${width}px`;
                    newRow = document.createElement('tr');
                    newRow.appendChild(newCell);
                    newTable.appendChild(newRow);
                });

                item.appendChild(newTable);
                list.appendChild(item);
            });
        };

        const mouseDownHandler = function(e) {
            console.log(e.target.className);
            if (e.target.className !== "checkbox__item" || e.target.className !== "table-sorter") {
                draggingColumnIndex = [].slice.call(table.querySelectorAll('th')).indexOf(e.target);

                x = e.clientX - e.target.offsetLeft;
                y = e.clientY - e.target.offsetTop;

                document.addEventListener('mousemove', mouseMoveHandler);
                document.addEventListener('mouseup', mouseUpHandler);
            }

        };

        const mouseMoveHandler = function(e) {
            if (!isDraggingStarted) {
                isDraggingStarted = true;

                cloneTable();

                draggingEle = [].slice.call(list.children)[draggingColumnIndex];
                console.log(draggingEle)
                draggingEle.classList.add('dragging');

                placeholder = document.createElement('div');
                placeholder.classList.add('placeholder');
                draggingEle.parentNode.insertBefore(placeholder, draggingEle.nextSibling);
                placeholder.style.width = `1px`;
            }

            draggingEle.style.position = 'absolute';
            draggingEle.style.top = `${draggingEle.offsetTop + e.clientY - y}px`;
            draggingEle.style.left = `${draggingEle.offsetLeft + e.clientX - x}px`;

            x = e.clientX;
            y = e.clientY;

            const prevEle = draggingEle.previousElementSibling;
            const nextEle = placeholder.nextElementSibling;

            if (prevEle && isOnLeft(draggingEle, prevEle)) {
                swap(placeholder, draggingEle);
                swap(placeholder, prevEle);
                return;
            }

            if (nextEle && isOnLeft(nextEle, draggingEle)) {
                swap(nextEle, placeholder);
                swap(nextEle, draggingEle);
            }
        };

        const mouseUpHandler = function() {
            placeholder && placeholder.parentNode.removeChild(placeholder);

            draggingEle.classList.remove('dragging');
            draggingEle.style.removeProperty('top');
            draggingEle.style.removeProperty('left');
            draggingEle.style.removeProperty('position');

            const endColumnIndex = [].slice.call(list.children).indexOf(draggingEle);

            isDraggingStarted = false;

            list.parentNode.removeChild(list);

            table.querySelectorAll('tr').forEach(function(row) {
                const cells = [].slice.call(row.querySelectorAll('th, td'));
                draggingColumnIndex > endColumnIndex
                    ? cells[endColumnIndex].parentNode.insertBefore(cells[draggingColumnIndex], cells[endColumnIndex])
                    : cells[endColumnIndex].parentNode.insertBefore(cells[draggingColumnIndex], cells[endColumnIndex].nextSibling);

            });

            // Сохранение в localStorage
            var tableContent = document.getElementById(id).innerHTML;
            localStorage.setItem(`tableContent_${id}`, tableContent);


            table.style.removeProperty('visibility');

            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
        };

        table.querySelectorAll('th').forEach(function(headerCell) {
            headerCell.classList.add('draggable');
            headerCell.addEventListener('mousedown', mouseDownHandler);
        })
    }
}
