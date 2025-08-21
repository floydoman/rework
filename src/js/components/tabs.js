export default () => {
    document.addEventListener('click', (event) => {
        const tabsArray = document.querySelectorAll('[data-tabs]');
        if (tabsArray.length > 0) {
            if (event.target.closest('[data-tabs-nav]')) {
                const tabs = event.target.closest('[data-tabs]');
                const tabsNavs = tabs.querySelectorAll('[data-tabs-nav]');
                const tabsContent = tabs.querySelectorAll('[data-tabs-target]');
                const tabsPath = event.target.closest('[data-tabs-nav]').dataset.tabsNav;

                tabsNavs.forEach(elem => {
                    elem.classList.remove('active');
                });
                tabsContent.forEach(elem => {
                    elem.classList.remove('active');
                });
                tabs.querySelector(`[data-tabs-nav="${tabsPath}"]`).classList.add('active');
                tabs.querySelector(`[data-tabs-target="${tabsPath}"]`).classList.add('active');
            }
        }
    });
};
