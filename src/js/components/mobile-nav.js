export default () => {
    document.addEventListener('click',  (event) => {
        if(event.target.closest('[data-nav-toggle]')) {
            document.querySelector('body').classList.toggle('nav-open')
            return false
        }
    })
};

