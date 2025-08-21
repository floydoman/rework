import AirDatepicker from 'air-datepicker';

export default () => {

    if (document.querySelectorAll('[data-date]').length > 0) {
        document.querySelectorAll('[data-date]').forEach(el => {
            let position = el.dataset.date;
            new AirDatepicker(el, {
                autoClose: true,
                position: position,
            })
        });
    }

    if (document.querySelectorAll('[data-time]').length > 0) {
        document.querySelectorAll('[data-time]').forEach(el => {
            let position = el.dataset.time;
            new AirDatepicker(el, {
                autoClose: true,
                onlyTimepicker: true,
                timepicker: true,
                position: position,
            })
        });
    }
};
