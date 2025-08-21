export default (selector = '[data-policy]', button = '[data-policy-button]') => {

    let cookieNote = document.querySelector(selector);
    let cookieBtnAccept = cookieNote.querySelector(button);

    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            let date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    function getCookie(name) {
        let matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }


    // Если куки cookies_policy нет или она просрочена, то показываем уведомление
    if (!getCookie('cookies_policy')) {
        cookieNote.classList.add('show');
    }

    // При клике на кнопку устанавливаем куку cookies_policy на один год
    cookieBtnAccept.addEventListener('click', function () {
        setCookie('cookies_policy', 'true', 365);
        cookieNote.classList.remove('show');
    });
};
