 export default () => {

    document.addEventListener('click',  (event) => {
        if(event.target.closest('[data-quantity-button]')) {
            const quantity = event.target.closest('[data-quantity]')
            const quantityInput = quantity.querySelector('[data-quantity-input]')
            const quantityMin = quantityInput.min
            const quantityMax = quantityInput.max
            const quantityDirection = event.target.closest('[data-quantity-button]').dataset.quantityButton
            let quantityValue = 0;

            if (!quantityInput.disabled) {
                if(quantityDirection === 'minus') {
                    quantityValue = parseInt(quantityInput.value) - 1
                    if (quantityValue < quantityMin) {
                        quantityValue = quantityMin
                    }
                }
                else {
                    quantityValue = parseInt(quantityInput.value) + 1
                    if (quantityValue > quantityMax) {
                        quantityValue = quantityMax
                    }
                }
                quantityInput.value = quantityValue
            }
        }
    })

    if( document.querySelector('[data-quantity-input]')) {

        document.querySelector('[data-quantity-input]').addEventListener('change', function (){
            let val = parseInt(this.value)
            const quantity = this.closest('[data-quantity]').querySelector('[data-quantity-input]')

            if(!val) {
                val = quantity.min
            }

            if (val < quantity.min) {
                val = quantity.min
            }
            else if (val > quantity.max) {
                val = quantity.max
            }

            quantity.value = val
        })
    }
};
