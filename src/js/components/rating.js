export default () => {
    const ratings = document.querySelectorAll('[data-rating]')

    if (ratings.length > 0) {
        initRatings();
    }

    // Base function
    function initRatings() {
        let ratingItem, ratingActive, ratingValue

        ratings.forEach(elem => {
            initRating(elem)
        });

        // Init single rating
        function initRating(rating) {
            InitRatingVars(rating)
            serRatingActiveWidth()

            if (!rating.dataset.ratingReadonly) {
                setRating(rating)
            }
        }

        function InitRatingVars(rating) {
            ratingItem = rating
            ratingActive = rating.querySelector('[data-rating-active]')
            ratingValue = rating.querySelector('[data-rating-value]')
        }

        function serRatingActiveWidth(index = ratingItem.dataset.rating) {
            const ratingActiveWidth = index / 0.05
            ratingActive.style.width = `${ratingActiveWidth}%`
        }

        function setRating(rating) {
            const ratingItems = rating.querySelectorAll('[data-rating-item]')
            ratingItems.forEach(elem => {

                elem.addEventListener('mouseenter', function (e) {
                    InitRatingVars(rating)
                    serRatingActiveWidth(elem.dataset.ratingItem)
                })

                elem.addEventListener('mouseleave', function (e) {
                    serRatingActiveWidth()
                })

                elem.addEventListener('click', function (e) {
                    InitRatingVars(rating)
                    if (ratingValue) {
                        ratingValue.innerHTML = elem.dataset.ratingItem
                    }
                    ratingItem.dataset.rating = elem.dataset.ratingItem
                    serRatingActiveWidth(elem.dataset.ratingItem)
                })

            });
        }
    }
};
