import  { toggle } from 'slidetoggle';

export default () => {

    document.addEventListener('click', (event) => {
        if (event.target.closest('[data-collapse-control]')) {
            const self = event.target.closest('[data-collapse]');
            const content = self.querySelector('[data-collapse-content]');

            toggle(
                content,
                {
                    miliseconds: 200,
                }
            )
            self.classList.toggle('open')
        }
    })
};
