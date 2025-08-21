export default function() {
    window.addEventListener("load", function (e) {
        if (document.querySelectorAll('[data-file]').length > 0) {
            const fileInputs = document.querySelectorAll('[data-file]')
            fileInputs.forEach(el => {
                let fileInput = el.querySelector('[data-file-input]')
                let filePlaceholder = el.querySelector('[data-file-placeholder]')
                let fileName = ''

                fileInput.addEventListener('change', (event) => {
                    fileName = fileInput.value.replace(/^.*[\\\/]/, '')
                    if (fileName) {
                        filePlaceholder.innerHTML = fileName
                        el.classList.add('file-field--uploaded')
                    }
                    else {
                        filePlaceholder.innerHTML = filePlaceholder.dataset.filePlaceholder
                        el.classList.remove('file-field--uploaded')
                    }
                })
            })
        }
    });
}
