"use strict"

import * as usefulFunctions from "./components/functions.js"; // Полезные функции
import tabs from './components/tabs.js'; // Tabs
import Dropdown from "./components/dropdown.js";
import Select from './components/select.js' // Select
import Offcanvas from './components/offcanvas.js';
import Alert from "./components/alert.js";
import DateFields from "./forms/date-field.js";
import Spoilers from "./components/spoilers.js";
import treeView from "./components/treeview.js";
import treeTable from "./components/treeTable.js";
import Sortable from 'sortablejs';
import { Fancybox } from "@fancyapps/ui"; // Fancybox modal gallery
import Table from "./components/table.js";

import {TableDragSortResize} from "./components/table-drag-sort-resize.js"

// Проверка поддержки webp
usefulFunctions.isWebp();

// Добавление класса после загрузки страницы
usefulFunctions.addLoadedClass();

// Добавление класса touch для мобильных
usefulFunctions.addTouchClass()

// Mobile 100vh
usefulFunctions.fullVHfix();

// Плавный скролл
usefulFunctions.SmoothScroll('[data-anchor]')


// Вкладки (tabs)
tabs();

Dropdown();

Spoilers()

Select()

Offcanvas()

DateFields()

Alert()

Table()

treeView()

treeTable()


document.querySelectorAll('[data-list-sortable]').forEach(el => {
    const sortable = Sortable.create(el, {
        draggable: '.list-group-item',
        group: {
            name: 'shared',
        },
    });
});



document.addEventListener('click', (event) => {
    if (event.target.closest('.table-sorter')) {
        event.target.closest('.table-sorter').classList.toggle('reverse')
    }
});

// Маска для ввода номера телефона
import "./components/input-mask.js";
import * as agGrid from "ag-grid-community";


Fancybox.bind("[data-fancybox]", {
    autoFocus: false,
    closeButton: false
});

document.addEventListener('click', (event) => {
    if (event.target.closest('[data-aside-toggle]')) {
        document.body.classList.toggle('aside-open')
    }
});



window.addEventListener('load', function (e) {

    if (document.querySelectorAll('[data-option]').length > 0) {
        const options = document.querySelectorAll('[data-option]');
        options.forEach(el => {
            el.querySelector('[data-option-switcher]').addEventListener('change', (event) => {
                if (event.target.checked) {
                    el.classList.add('checked');
                }
                else {
                    el.classList.remove('checked');
                }
            })
        })
    }
})

document.addEventListener('click', (event) => {
    if (event.target.closest('[data-edit-task]')) {
        const checkbox = document.querySelectorAll('[data-edit-task]:checked');
        const createTask = document.querySelector("#create-task")
        const editTask = document.querySelector("#edit-task")
        if (checkbox.length > 0) {
            createTask.classList.add('hidden');
            editTask.classList.remove('hidden');
        } else {
            createTask.classList.remove('hidden');
            editTask.classList.add('hidden');
        }
    }
});

// Инициализация таблиц c drag&drop
window.addEventListener('load', function () {
    // usefulFunctions.initDragTable("employeeTable");
    // usefulFunctions.initDragTable("workshopsTable");
    // usefulFunctions.initDragTable("tableWasteAccumulation");
    // usefulFunctions.initDragTable("tableCourtyardTerritories");
    // usefulFunctions.initDragTable("tableRegistry");
    // usefulFunctions.initDragTable("tableAccess");
    // usefulFunctions.initDragTable("tableRoles");
    // usefulFunctions.initDragTable("tableUsers");
    // usefulFunctions.initDragTable("tableIntegrationLog");
    // usefulFunctions.initDragTable("tableLoggingLog");
    // usefulFunctions.initDragTable("tableDischarge");
    // usefulFunctions.initDragTable("tableWork")
    // TableDragSortResize(document.getElementById("employeeTable"))
    TableDragSortResize(document.getElementById("workshopsTable"))
    //workshopsTable
})

