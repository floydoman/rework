
"use strict";

// вспомогательные функции

function eventPageX(event) {
    var pageX = event.pageX;

    if (typeof pageX == 'undefined') {
        var body = document.body;
        var docElem = document.documentElement;
        pageX = event.clientX + (docElem && docElem.scrollLeft || body && body.scrollLeft || 0) - (docElem && docElem.clientLeft || body && body.clientLeft || 0);
    }

    return pageX;
}
function elementStyleProperty(element, prop) {
    if (window.getComputedStyle) {
        return window.getComputedStyle(element, "").getPropertyValue(prop);
    } else { // http://stackoverflow.com/questions/21797258/getcomputedstyle-like-javascript-function-for-ie8
        var re = /(\-([a-z]){1})/g;
        if (prop == 'float') prop = 'styleFloat';
        if (re.test(prop)) {
            prop = prop.replace(re, function () {
                return arguments[2].toUpperCase();
            });
        }
        return element.currentStyle[prop]
    }
}
function numericProperty(prop) {
    return (typeof prop == 'undefined' || prop == '' || prop == null) ? 0 : parseInt(prop);
}
function eventTarget(event) {
    return event.target || event.srcElement;
}

function naturalSort(a, b) {
    var re = /(^-?[0-9]+(\.?[0-9]*)[df]?e?[0-9]?$|^0x[0-9a-f]+$|[0-9]+)/gi,
        sre = /(^[ ]*|[ ]*$)/g,
        dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,
        hre = /^0x[0-9a-f]+$/i,
        ore = /^0/,
        i = function (s) { return naturalSort.insensitive && ('' + s).toLowerCase() || '' + s; },
        // преобразовать все в строки без пробелов
        x = i(a).replace(sre, '') || '',
        y = i(b).replace(sre, '') || '',
        // блокировать/токенизировать
        xN = x.replace(re, '\0$1\0').replace(/\0$/, '').replace(/^\0/, '').split('\0'),
        yN = y.replace(re, '\0$1\0').replace(/\0$/, '').replace(/^\0/, '').split('\0'),
        // определение чисел, шестнадцатеричных кодов или даты
        xD = parseInt(x.match(hre)) || (xN.length != 1 && x.match(dre) && Date.parse(x)),
        yD = parseInt(y.match(hre)) || xD && y.match(dre) && Date.parse(y) || null,
        oFxNcL, oFyNcL;
    // сначала сортировка шестнадцатеричных кодов или дат
    if (yD)
        if (xD < yD) return -1;
        else if (xD > yD) return 1;
    // сортировка по разделенным числовым строкам и строкам по умолчанию
    for (var cLoc = 0, numS = Math.max(xN.length, yN.length); cLoc < numS; cLoc++) {
        // значения с плавающей запятой, не начинающиеся с '0', строки или 0, если они не определены
        oFxNcL = !(xN[cLoc] || '').match(ore) && parseFloat(xN[cLoc]) || xN[cLoc] || 0;
        oFyNcL = !(yN[cLoc] || '').match(ore) && parseFloat(yN[cLoc]) || yN[cLoc] || 0;
        // сравнение чисел и строк - number < string
        if (isNaN(oFxNcL) !== isNaN(oFyNcL)) { return (isNaN(oFxNcL)) ? 1 : -1; }
        // сравнение строк, если разные типы - т.е. '02' < 2 != '02' < '2'
        else if (typeof oFxNcL !== typeof oFyNcL) {
            oFxNcL += '';
            oFyNcL += '';
        }
        if (oFxNcL < oFyNcL) return -1;
        if (oFxNcL > oFyNcL) return 1;
    }
    return 0;
}
function sort(cell, table) {
    if (!cell || !table || !table.tBodies || !table.tBodies[0]) return;

    var body = table.tBodies[0];
    var colIndex = cell.cellIndex;

    // собрать строки тела
    var sortRows = [];
    for (var i = 0; i < body.rows.length; i++) sortRows.push(body.rows[i]);

    // сортировка с защитой от отсутствующих ячеек
    sortRows.sort(function (a, b) {
        var ac = a.cells[colIndex];
        var bc = b.cells[colIndex];
        var x = ac ? (ac.textContent || ac.innerText || '') : '';
        var y = bc ? (bc.textContent || bc.innerText || '') : '';
        return naturalSort(x, y);
    });

    // переключение класса направления
    if (hasClass(cell, 'sort-down')) {
        cell.className = cell.className.replace(/ sort-down/, '');
        cell.className += ' sort-up';
    } else {
        cell.className = cell.className.replace(/ sort-up/, '');
        cell.className += ' sort-down';
    }

    if (hasClass(cell, 'sort-down')) sortRows.reverse();

    for (var k = 0; k < sortRows.length; k++) body.appendChild(sortRows[k]);
}


var hasClass = function (el, c) {
    return (' ' + el.className + ' ').indexOf(' ' + c + ' ') > -1;
}

// функции для local storage
// загружает состояние и возвращает массив
function loadState(key) {
    var state = localStorage.getItem(key);

    if (state != null) {
        try {
            state = JSON.parse(state);
        } catch (e) {
            state = new Array();
        }
    } else {
        state = new Array();
    }

    return state;
}
function findIndex(state, searchId) {
    //найти элемент
    for (var i = 0; i < state.length; i++) {
        var id = state[i].id;
        if (id == searchId) {
            return i;
        }
    }
    return -1;
}
function saveState(key, table /* name, prop*/) {

    if (!localStorage) {
        console.log('localStorage не поддерживается или не используется');
        return;
    }



    var state = loadState(key),
        id = table.getAttribute('id'),
        element = { id: id },
        index = findIndex(state, id);

    for (var i = 2; i < arguments.length; i += 2) {
        element[arguments[i]] = arguments[i + 1];
    }

    // console.log("element: ", element);

    // разместить элемент
    if (index < 0) {
        console.log("push")
        state.push(element);
    } else {
        console.log("splice")
        state.splice(index, 1, element);
    }

    console.log("saveState: ", { key: key, state: JSON.stringify(state) });
    localStorage.setItem(key, JSON.stringify(state));
}

function moveTableColumn1(table, start, end) {
    var row,
        i = table.rows.length;
    while (i--) {
        row = table.rows[i];
        console.log(row)
        var x = row.removeChild(row.cells[1]);
        row.insertBefore(x, row.cells[0]);
    }
}
function restoreState(key, table, name) {
    var nc = table.rows[0].cells.length;
    var pm = Array.from({ length: nc }, (_, i) => i); // Исходная перестановка

    if (!localStorage) {
        console.log('localStorage не поддерживается или не используется');
        return pm;
    }

    var state = loadState(key);
    var id = table.getAttribute('id');
    var index = findIndex(state, id);

    if (index >= 0) {
        var keys = Object.keys(state[index]);
        var keyName = keys[1];
        name = keyName;

        var element = state[index];
        var memory = element[keyName];

        if (keyName == 'drag' || keyName == 'resize') {
            if (nc != memory.length) {
                console.log('Несоответствие размеров');
                return pm;
            }

            if (keyName == 'drag') {
                // Восстановление порядка столбцов
                var targetPositions = memory.map((origIndex, newIndex) => ({ origIndex, newIndex }));
                // Сортируем чтобы двигать столбцы с наибольшего индекса
                targetPositions.sort((a, b) => b.newIndex - a.newIndex);

                for (var item of targetPositions) {
                    var currentIndex = pm.indexOf(Number(item.origIndex));
                    if (currentIndex !== item.newIndex) {
                        moveTableColumn(table, currentIndex, item.newIndex);
                        // Обновляем перестановку
                        pm.splice(item.newIndex, 0, pm.splice(currentIndex, 1)[0]);
                    }
                }
                // Обновляем pm to match memory после всех перемещений
                pm = memory.slice();
            } else if (keyName == 'resize') {
                // Восстановление размеров
                for (var i = 0; i < nc; i++) {
                    var cell = table.rows[0].cells[i];
                    cell.style.maxWidth = cell.style.width = memory[i];
                }
            }
        } else if (keyName == 'sort') {
            // Восстановление сортировки
            var cell = table.rows[0].cells[memory.index];
            cell.className += ' ' + memory.order;
            sort(cell, table);
        }
    }
    return pm;
}

// Перемещение (drag'n'drop) колонок в html таблице.
function MouseHandler() {
    //this._mouseDownEvent
    //this._mouseStarted
    //this._mouseMoveDelegate
    //this._mouseUpDelegate
}
MouseHandler.prototype = (function () {
    // вспомогательные функции

    // Кроссбраузерные данные о событиях
    function getEvent(event) {
        return event || window.event;
    }
    function eventWhich(event) {
        return event.which || event.button;
    }
    function eventPageY(event) {
        var pageY = event.pageY;

        if (typeof pageY == 'undefined') {
            var body = document.body;
            var docElem = document.documentElement;
            pageY = event.clientY + (docElem && docElem.scrollTop || body && body.scrollTop || 0) - (docElem && docElem.clientTop || body && body.clientTop || 0);
        }

        return pageY;
    }

    // prototype функции

    function _mouseDown(event) {
        // поддержка ie8
        event = getEvent(event);

        (this._mouseStarted && this._mouseUp(event));

        this._mouseDownEvent = event;

        if (!event.which) { // определим ie8
            var copy = {};
            for (var attr in event) {
                copy[attr] = event[attr];
            }
            this._mouseDownEvent = copy;
        }

        // только нажатие левой клавиши мыши
        // поддержка ie8
        if (eventWhich(event) !== 1) {
            return true;
        }


        if (this.options.distance == 0) {
            this._mouseStarted = this._mousePrepareDrag(event) !== false;
            if (!this._mouseStarted) {
                // поддержка ie8

                (event.preventDefault ? event.preventDefault() : (event.returnValue = false));
                (event.stopPropagation ? event.stopPropagation() : (event.cancelBubble = true));

                return true;
            }
        } else {
            this._mousePrepareClick(event);
        }

        // сохранение контекста
        var _this = this;
        this._mouseMoveDelegate = function (event) {
            return _this._mouseMove(event);
        };
        this._mouseUpDelegate = function (event) {
            return _this._mouseUp(event);
        };

        addEvent(document, 'mousemove', this._mouseMoveDelegate);
        addEvent(document, 'mouseup', this._mouseUpDelegate);

        // поддержка ie8
        (event.preventDefault ? event.preventDefault() : (event.returnValue = false));
        (event.stopPropagation ? event.stopPropagation() : (event.cancelBubble = true));

        return true;
    }
    function _mouseMove(event) {
        // поддержка ie8
        event = getEvent(event);

        // Iframe mouseup проверка
        if (!eventWhich(event)) {
            return this._mouseUp(event);
        }

        // функциональность перетаскивания
        if (this._mouseStarted) {

            this._mouseDrag(event);

            // поддержка ie8
            (event.preventDefault ? event.preventDefault() : (event.returnValue = false));
            (event.stopPropagation ? event.stopPropagation() : (event.cancelBubble = true));

            return false;
        }

        // check distance (no action circle)
        if (this._mouseDistanceMet(event, this._mouseDownEvent)) {
            // lets start
            this._mouseStarted = (this._mousePrepareDrag(this._mouseDownEvent, event) !== false);
            // and move or stop
            (this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
        }

        // поддержка ie8
        (event.preventDefault ? event.preventDefault() : (event.returnValue = false));
        (event.stopPropagation ? event.stopPropagation() : (event.cancelBubble = true));

        return !this.mouseStarted;
    }
    function _mouseUp(event) {
        console.log("mouseUp");
        setTimeout(() => {
            console.log("setTimeout")
            let arColumns = []
            let columns = document.querySelectorAll('.table th.sort-header')
            columns.forEach(function (column) {
                arColumns.push(column.dataset.cellId);
            })
            console.log(arColumns);
            if (this.options.restoreState)
                saveState('table-drag-sort-resize', this.table, 'drag', arColumns);
        }, 100)
        // поддержка ie8
        event = getEvent(event);

        removeEvent(document, 'mousemove', this._mouseMoveDelegate);
        removeEvent(document, 'mouseup', this._mouseUpDelegate);

        if (this._mouseStarted) {
            this._mouseStarted = false;

            this._mouseStopDrag(event);
        } else {
            this._mouseExecuteClick(event);
        }

        // поддержка ie8
        (event.preventDefault ? event.preventDefault() : (event.returnValue = false));
        (event.stopPropagation ? event.stopPropagation() : (event.cancelBubble = true));

        return false;
    }
    function _mouseDistanceMet(newEvent, lastEvent) {
        var x = Math.abs(eventPageX(lastEvent) - eventPageX(newEvent)),
            y = Math.abs(eventPageY(lastEvent) - eventPageY(newEvent));
        return (Math.sqrt(x * x + y * y)) >= this.options.distance;
    }

    // Это методы-placeholder, которые должны быть переопределены расширениями
    function _mousePrepareClick() { }
    function _mousePrepareDrag() { }
    function _mouseDrag(event) { }
    function _mouseExecuteClick() { }
    function _mouseStopDrag() { }

    return {
        constructor: MouseHandler,
        options: {
            distance: 0
        },
        _mouseDown: _mouseDown,
        _mouseMove: _mouseMove,
        _mouseUp: _mouseUp,
        _mouseDistanceMet: _mouseDistanceMet,
        _mousePrepareClick: _mousePrepareClick,
        _mousePrepareDrag: _mousePrepareDrag,
        _mouseDrag: _mouseDrag,
        _mouseExecuteClick: _mouseExecuteClick,
        _mouseStopDrag: _mouseStopDrag
    };
})();


function DragSortHandler(table, options) {

    //параметры по умолчанию
    this.options.distance = 10;
    this.options.restoreState = true;

    // установить параметры
    var newOptions = {};
    for (var opt in this.options)
        newOptions[opt] = (typeof options[opt] == 'undefined') ? this.options[opt] : options[opt];
    this.options = newOptions;

    // таблица
    this.table = table;
    // строка заголовка
    this.hr = table.rows[0];
    // количество колонок
    this.nc = this.hr.cells.length;
    // количество строк
    this.nr = table.rows.length;

    this._init();
}
(function () {
    DragSortHandler.prototype = new MouseHandler();
    DragSortHandler.prototype.constructor = DragSortHandler;

    // вспомогательные функции

    function tridentDetection() {
        return (navigator.userAgent.indexOf("Trident") != -1) ? true : false;
    };
    function borderCollapseDetection(table) {
        return elementStyleProperty(table, 'border-collapse') == 'collapse' ? true : false;
    }
    function getTableColumn(table, pageX, defaultColumn) {
        var cells = table.rows[0].cells;
        for (var i = 0; i < cells.length; i++) {
            var tx = getOffsetRect(cells[i]).left;
            if (tx <= pageX && pageX <= tx + cells[i].offsetWidth) {
                return i;
            }
        }

        return (typeof defaultColumn == 'undefined' ? -1 : defaultColumn);
    }
    function copyStyles(el) {
        var cs = window.getComputedStyle ? window.getComputedStyle(el, null) : el.currentStyle,
            css = '';
        for (var i = 0; i < cs.length; i++) {
            var style = cs[i];
            css += style + ': ' + cs.getPropertyValue(style) + ';';
        }
        return css;
    }

    // публичные функции

    DragSortHandler.prototype.refresh = function () {
        if (typeof this.cell != 'undefined')
            sort(this.cell, this.table);
    };

    // приватные функции

    DragSortHandler.prototype._init = function () {
        this.pm = new Array(this.nc);
        for (var i = 0; i < this.nc; i++) {
            this.pm[i] = i;
        }

        // if (this.options.restoreState)
        //this.pm = restoreState('table-drag', this.table, 'drag');
        // this.pm = restoreState('table-drag-sort-resize', this.table, 'drag');

    };

    // переопределенные методы placeholder

    DragSortHandler.prototype._mousePrepareDrag = function (event) {
        var trident = tridentDetection(),
            table = this.table,
            borderCollapse = borderCollapseDetection(table),
            tablePosition = getOffsetRect(table),
            row = table.rows[0],
            rowPosition = getOffsetRect(row),
            rowOffsetHeight = row.offsetHeight,
            tableClientLeft = trident ? (rowPosition.left - tablePosition.left) : table.clientLeft,
            tableClientTop = trident ? (rowPosition.top - tablePosition.top) : table.clientTop,
            backLeft = borderCollapse ? tablePosition.left : (tablePosition.left + tableClientLeft),
            backTop = borderCollapse ? tablePosition.top : (rowPosition.top),
            backWidth = borderCollapse ? table.offsetWidth : table.offsetWidth - 2 * tableClientLeft,
            backHeight = table.rows[0].offsetHeight,
            zIndex = numericProperty(table.style.zIndex),
            zIndex = zIndex ? zIndex + 1 : 1,
            initialColumn = eventTarget(event).parentNode.parentNode.cellIndex,
            backgroundColor = elementStyleProperty(table, 'background-color');

        // последний столбец, начальный столбец
        this.lc = this.ic = initialColumn;

        // наложение - задняя часть
        var back = document.createElement("div");
        back.style.position = 'absolute';
        back.style.left = '0px';
        back.style.top = '0px';
        back.style.width = backWidth + 'px';
        back.style.height = backHeight + 'px';
        back.style.backgroundColor = backgroundColor;
        back.style.zIndex = zIndex;

        // DEBUGGING
        //back.style.opacity =  0.4;
        //back.style.backgroundColor = 'green';

        // наложение - фронт
        for (var i = 0; i < this.nc; i++) {
            var cell = row.cells[i],
                cellPosition = getOffsetRect(cell),
                offsetWidth = cell.offsetWidth,
                offsetHeight = cell.offsetHeight,
                clientWidth = cell.clientWidth,
                clientHeight = cell.clientHeight,
                clientLeft = cell.clientLeft,
                clientTop = cell.clientTop,
                clientRight = offsetWidth - clientWidth - clientLeft,
                clientBottom = offsetHeight - clientHeight - clientTop,
                paddingTop = numericProperty(elementStyleProperty(cell, 'padding-top')),
                paddingBottom = numericProperty(elementStyleProperty(cell, 'padding-bottom')),
                temp = cell.getBoundingClientRect(),
                computedCellHeight = temp.bottom - temp.top - clientTop - clientBottom - paddingTop - paddingBottom,
                borderLeftWidth = borderCollapse ? (clientRight + clientLeft) : clientLeft,
                borderTopWidth = borderCollapse ? (clientTop + clientBottom) : clientTop,
                borderRightWidth = borderCollapse ? (clientRight + clientLeft) : clientRight,
                borderBottomWidth = borderCollapse ? (clientTop + clientBottom) : clientBottom,
                elementBaseLeft = borderCollapse ? (cellPosition.left - backLeft - tableClientLeft) : cellPosition.left - backLeft,
                elementBaseTop = borderCollapse ? (cellPosition.top - backTop - tableClientTop) : cellPosition.top - backTop,
                elementBaseWidth = clientWidth + borderLeftWidth + borderRightWidth,
                elementBaseHeight = rowOffsetHeight;

            var element = document.createElement("div");
            element.style.cssText = copyStyles(cell);
            element.style.position = 'absolute';
            element.style.left = 0;
            element.style.top = '-2px';
            // element.style.height = computedCellHeight + 'px';
            element.style.height = '59px';
            element.style.borderLeftWidth = borderLeftWidth + 'px';
            element.style.borderTopWidth = borderTopWidth + 'px';
            element.style.borderRightWidth = borderRightWidth + 'px';
            // element.style.borderBottomWidth = borderBottomWidth + 'px';
            element.style.borderBottomWidth = '1px';
            element.innerHTML = cell.innerHTML;
            element.style.zIndex = zIndex + 3;
            element.style.borderTop = '2px solid #BCC4CF';

            element.style.backgroundColor = "#ffffff";

            if (i == initialColumn) element.style.left = elementBaseLeft + 'px';
            if (i == initialColumn) element.style.top = elementBaseTop + 'px';

            var elementBase = document.createElement("div");
            elementBase.style.position = 'absolute';
            elementBase.style.left = elementBaseLeft + 'px';
            elementBase.style.top = elementBaseTop + 'px';
            elementBase.style.height = elementBaseHeight + 'px';
            elementBase.style.width = elementBaseWidth + 'px';
            elementBase.style.backgroundColor = '#f6f6f7';
            elementBase.style.zIndex = zIndex + 2;
            elementBase.style.borderTop = '2px solid #BCC4CF';
            elementBase.style.borderBottom = '1px solid #BCC4CF';

            if (i == initialColumn) elementBase.style.zIndex = zIndex + 1;

            // DEBUGGING
            //element.style.top = 50 + 'px';
            //if (i == initialColumn) element.style.top = elementBaseTop + 75 + i*10 + 'px';
            //elementBase.style.backgroundColor = 'green';
            //elementBase.style.top = elementBaseTop + 75 + i*10 + 'px';

            // перетаскивание элемента
            if (i == initialColumn) this.de = element;
            if (i != initialColumn) elementBase.appendChild(element);
            back.appendChild(elementBase);
        }
        back.appendChild(this.de);
        // document.body.appendChild(back);
        document.querySelector('.table').appendChild(back);
        this.overlay = back;

        // заменить курсор
        this.cur = document.body.style.cursor;
        document.body.style.cursor = 'move';

        return true;
    };
    DragSortHandler.prototype._mouseDrag = function (event) {
        var distance = eventPageX(event) - eventPageX(this._mouseDownEvent),
            table = this.table,
            lastColumn = this.lc,
            eventColumn = getTableColumn(table, eventPageX(event), lastColumn);

        this.de.style.left = numericProperty(this.de.style.left) + distance + 'px';
        this.de.classList.add('dragging');

        if (eventColumn != lastColumn) {

            var trident = tridentDetection(),
                borderCollapse = borderCollapseDetection(table),
                borderSpacing = borderCollapse ? 0 : numericProperty(elementStyleProperty(table, 'border-spacing')),
                direction = sign(eventColumn - lastColumn);

            for (var i = lastColumn; i != eventColumn; i += direction) {
                var start = i,
                    end = start + direction,
                    shift = 0,
                    shift = (direction < 0 && start > this.ic) ? 1 : ((direction > 0 && start < this.ic) ? -1 : 0),
                    layerOne = this.overlay.childNodes[direction < 0 ? this.ic : (end + shift)],
                    layerTwo = this.overlay.childNodes[direction > 0 ? this.ic : (end + shift)],
                    borderLeftWidth = numericProperty(elementStyleProperty(direction < 0 ? layerTwo.childNodes[0] : this.de, 'border-left-width')),
                    borderLeftWidth = borderCollapse ? borderLeftWidth : 0,
                    left = numericProperty(layerTwo.style.left),
                    width = numericProperty(layerOne.style.width);

                layerOne.style.left = left + 'px';
                layerTwo.style.left = left + width + borderSpacing - borderLeftWidth + 'px';

                // смещение
                this.pm.move(start, end);
                // установить новый столбец
                this.lc = end;
            }


            // console.log("this.pm: ", this.pm);
            // console.log("this.lc: ", this.lc)
            // если опция restoreState true
            // if (this.options.restoreState)
            //     saveState('table-drag-sort-resize', this.table, 'drag', this.pm);
        }

        this._mouseDownEvent = event;
        if (!event.which) { // определение ie8
            var copy = {};
            for (var attr in event) {
                copy[attr] = event[attr];
            }
            this._mouseDownEvent = copy;
        }
    }

    DragSortHandler.prototype._mouseExecuteClick = function (event) {
        var target = eventTarget(event);

        if (target && target.classList && target.classList.contains('resize-elem')) return;

        var node = target;
        while (node && node.nodeName !== 'TH' && node !== this.hr) node = node.parentNode;
        if (!node || node.nodeName !== 'TH') return;

        var cell = node;

        for (var j = 0; j < this.nc; j++) {
            var c = this.hr.cells[j];
            if (c !== cell) {
                if (hasClass(c, 'sort-up') || hasClass(c, 'sort-down')) {
                    c.className = c.className.replace(' sort-down', '').replace(' sort-up', '');
                }
            }
        }

        this.cell = cell;
        sort(cell, this.table);
    };

    DragSortHandler.prototype._mouseStopDrag = function (event) {
        console.log("_mouseStopDrag");

        // удалить наложение
        document.querySelector('.table').removeChild(this.overlay);

        // переместите столбец, если это необходимо
        var table = this.table,
            col = getTableColumn(table, eventPageX(event), this.lc);
        if (col != this.ic)
            moveTableColumn(table, this.ic, col);

        // восстановить курсор
        document.body.style.cursor = this.cur;
    };
})();

function ResizeHandler(table, options) {

    //параметры по умолчанию
    this.options.minWidth = 30;
    this.options.restoreState = true;
    this.options.fixed = false;

    // установить параметры
    var newOptions = {};
    for (var opt in this.options) {
        newOptions[opt] = (typeof options[opt] == 'undefined') ? this.options[opt] : options[opt];
    }
    this.options = newOptions;

    // таблица
    this.table = table;
    // строка заголовка
    this.hr = table.rows[0];
    // количество колонок
    this.nc = this.hr.cells.length;
    // количество строк
    this.nr = table.rows.length;

    this._init();

}
(function () {
    ResizeHandler.prototype = new MouseHandler();
    ResizeHandler.prototype.constructor = ResizeHandler;

    // приватные функции

    ResizeHandler.prototype._init = function () {
        for (var i = 0; i < this.nc; i++) {
            var cell = this.hr.cells[i],
                width = elementStyleProperty(cell, 'width'),
                width = width == 'auto' ? (cell.clientWidth - numericProperty(elementStyleProperty(cell, 'paddingLeft')) - numericProperty(elementStyleProperty(cell, 'paddingRight'))) + 'px' : width; // поддержка ie8
            cell.style.width = width;
            cell.setAttribute('data-cell-id', i);
        }

        if (this.options.restoreState)
            restoreState('table-drag-sort-resize', this.table, 'drag');
    };

    // переопределенные методы

    ResizeHandler.prototype._mousePrepareDrag = function (event) {
        // начальный столбец
        this.ic = eventTarget(event).parentNode.parentNode.cellIndex;
        var initialColumn = this.ic,
            fixed = this.options.fixed,
            cell = [],
            width = [];
        for (var i = 0; i < 2; i++) {
            cell[i] = this.hr.cells[initialColumn + (i ? fixed : i)];
            width[i] = numericProperty(cell[i].style.width);
        }

        for (var i = 0; i < this.nr; i++) {
            for (var j = 0; j <= fixed; j++) {
                cell = this.table.rows[i].cells[initialColumn + j];
                cell.style.maxWidth = cell.style.width = width[j] + 'px';
            }
        }

        // заменить курсор
        this.cur = document.body.style.cursor;
        document.body.style.cursor = 'col-resize';

        return true;
    };
    ResizeHandler.prototype._mouseDrag = function (event) {
        var dist = eventPageX(event) - eventPageX(this._mouseDownEvent),
            initialColumn = this.ic,
            fixed = (this.options.fixed === true || this.options.fixed === 1),
            minW = this.options.minWidth;

        // Если включён фиксированный режим, но соседней колонки нет (последняя),
        // переходим к одиночному режиму.
        if (fixed && !this.hr.cells[initialColumn + 1]) {
            fixed = false;
        }

        if (!fixed) {
            // --- ОДНА колонка ---
            var th = this.hr.cells[initialColumn];
            var w0 = numericProperty(th.style.width);
            var newW0 = Math.max(minW, w0 + dist);

            for (var r = 0; r < this.nr; r++) {
                var c = this.table.rows[r].cells[initialColumn];
                c.style.maxWidth = c.style.width = newW0 + 'px';
            }

            // двигаем "якорь" для следующего кадра
            this._mouseDownEvent = event;
            if (!event.which) { var copy = {}; for (var a in event) copy[a] = event[a]; this._mouseDownEvent = copy; }
            return;
        }

        // --- ДВЕ колонки (fixed=true) ---
        var th0 = this.hr.cells[initialColumn];
        var th1 = this.hr.cells[initialColumn + 1];
        var w0 = numericProperty(th0.style.width);
        var w1 = numericProperty(th1.style.width);

        var newW0 = w0 + dist;
        var newW1 = w1 - dist;

        // Держим минимум и сумму (w0+w1) постоянной
        if (newW0 < minW) { newW0 = minW; newW1 = w0 + w1 - newW0; }
        if (newW1 < minW) { newW1 = minW; newW0 = w0 + w1 - newW1; }

        for (var i = 0; i < this.nr; i++) {
            var c0 = this.table.rows[i].cells[initialColumn];
            var c1 = this.table.rows[i].cells[initialColumn + 1];
            c0.style.maxWidth = c0.style.width = newW0 + 'px';
            c1.style.maxWidth = c1.style.width = newW1 + 'px';
        }

        this._mouseDownEvent = event;
        if (!event.which) { var cp = {}; for (var k in event) cp[k] = event[k]; this._mouseDownEvent = cp; }
    };

})();

export function TableDragSortResize(table, options) {
    // проверьте вводимые данные
    if (table && table.tagName !== 'TABLE') {
        console.log('ERROR: DOM element/input не таблица!');
        return;
    }

    // проверить на пустую таблицу
    if (!(table && table.rows && table.rows.length > 0)) {
        console.log('WARNING: Пустая таблица.');
        return;
    }

    options = options || {};
    var dragSortHandler = new DragSortHandler(table, options);
    var resizeHandler = new ResizeHandler(table, options);

    // прикрепить обработчики к каждой ячейке строки заголовка.
    for (var i = 0; i < ((options.fixed) ? (dragSortHandler.nc - 1) : dragSortHandler.nc); i++) {
        var cell = dragSortHandler.hr.cells[i];

        var paddingTop = numericProperty(elementStyleProperty(cell, 'padding-top'));
        cell.style.paddingTop = (paddingTop > 6 ? paddingTop : 6) + 'px';
        cell.className += ' sort-header';

        // установить курсор по-умолчанию
        cell.style.cursor = 'pointer';

        addEvent(cell, 'mousedown', function (event) {
            dragSortHandler._mouseDown(event);
        });

        cell.innerHTML = '<div class=\"resize-base\"><div class=\"resize-elem\"></div><div class=\"resize-text\">' + cell.innerHTML + '</div></div>';

        addEvent(cell.childNodes[0].childNodes[0], 'mousedown', function (event) {
            resizeHandler._mouseDown(event);
        });
    }
}

// полифилы и сниппеты
function addEvent(obj, type, fn) {
    if (obj.attachEvent) {
        obj['e' + type + fn] = fn;
        obj[type + fn] = function () {
            obj['e' + type + fn](window.event);
        };
        obj.attachEvent('on' + type, obj[type + fn]);
    } else
        obj.addEventListener(type, fn, false);
}
function removeEvent(obj, type, fn) {
    if (obj.detachEvent) {
        obj.detachEvent('on' + type, obj[type + fn]);
        obj[type + fn] = null;
    } else
        obj.removeEventListener(type, fn, false);
}

function getOffsetRect(elem) {
    // (1)
    var box = elem.getBoundingClientRect();

    var body = document.body;
    var docElem = document.documentElement;

    // (2)
    var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;

    // (3)
    var clientTop = docElem.clientTop || body.clientTop || 0;
    var clientLeft = docElem.clientLeft || body.clientLeft || 0;

    // (4)
    var top = box.top + scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;

    return { top: Math.round(top), left: Math.round(left) };
}

function moveTableColumn(table, start, end) {
    var row,
        i = table.rows.length;
    while (i--) {
        row = table.rows[i];
        var x = row.removeChild(row.cells[start]);
        row.insertBefore(x, row.cells[end]);
    }
}

function sign(x) {
    return typeof x == 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
}

Array.prototype.move = function (from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
};


