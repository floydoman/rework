import  { hide, show, toggle } from 'slidetoggle';

export default function() {

    document.addEventListener('click', (event) => {
        if (event.target.closest('[data-spoiler-control]')) {
            const spoilerItem       = event.target.closest('[data-spoiler]');
            const spoilerContent    = spoilerItem.querySelector('[data-spoiler-content]');
            const spoilerIsOpen     = spoilerItem.classList.contains('open');


            if (event.target.closest('[data-spoilers="single"]')) {
                if (!spoilerIsOpen) {
                    event.target.closest('[data-spoilers]').querySelectorAll('[data-spoiler]').forEach(elem => {

                        if (elem.classList.contains('open')) {
                            hide(
                                elem.querySelector('[data-spoiler-content]'),
                                {
                                    miliseconds: 200,
                                }
                            )
                            elem.classList.remove('open')
                        }
                    });

                    show(
                        spoilerContent,
                        {
                            miliseconds: 200,
                        }
                    )
                    spoilerItem.classList.add('open')
                }
                else {

                }
            }
            else  {
                toggle(
                    spoilerContent,
                    {
                        miliseconds: 200,
                    }
                )
                spoilerItem.classList.toggle('open')
            }
        }

        if (event.target.closest('[data-spoilers-toggle]')) {

            event.target.closest('[data-spoilers-toggle]').classList.toggle('active');
            event.target.closest('[data-spoilers]').querySelectorAll('[data-spoiler]').forEach(elem => {
                elem.classList.toggle('open');
                toggle(
                    elem.querySelector('[data-spoiler-content]'),
                    {
                        miliseconds: 200,
                    }
                )
            })
        }

    })
}


