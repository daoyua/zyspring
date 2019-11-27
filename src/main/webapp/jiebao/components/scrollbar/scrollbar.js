class ScrollBar {
	/**
	 * The ScrollBar class constructor.
	 *
	 * @date   2018-12-03
	 * @author mattbontrager
	 *
	 * @param  {String}   parentId          The id of the parent element that will `appendChild(scrollbarContainer)`
	 * @param  {String}   overflowElementId The element containing overflow content (the reason you need a scrollbar).
	 */
	constructor(parentId, overflowElementId) {
		// create the DOM elements for the scrollbar
		const scrollbarContainer = document.createElement('div');
		const scrollbar = document.createElement('div');
		const topLine = document.createElement('div');
		const bottomLine = document.createElement('div');
		const thumb = document.createElement('div');

		// assign the appropriate id's to each element for styling and click/touch behavior
		scrollbarContainer.setAttribute('id', 'scrollbar-container');
		scrollbar.setAttribute('id', 'scrollbar');
		topLine.setAttribute('id', 'top-line');
		bottomLine.setAttribute('id', 'bottom-line');
		thumb.setAttribute('id', 'thumb');

		// store a reference to the parent element and the scrolling element
		this.parentEl = document.querySelector(`#${parentId}`);
		this.scrollingEl = document.querySelector(`#${overflowElementId}`);

		// set the height of the scrollbar container equal to the parent element
		//scrollbarContainer.style.height = `${this.parentEl.clientHeight}px`;

		scrollbar.appendChild(topLine);
		scrollbar.appendChild(thumb);
		scrollbar.appendChild(bottomLine);

		scrollbarContainer.appendChild(scrollbar);
		this.parentEl.appendChild(scrollbarContainer);

		// start the scrollbar thumb at the top of the container
		thumb.style.top = '0px';

		/**
		 * The percentage of the element that has been scrolled.
		 * This is used to calculate the position of the scrollbar and is only
		 * relevant when the scrolling is happening inside the element.
		 *
		 * @date   2018-12-03
		 * @author mattbontrager
		 *
		 * @return {Number}   The percentage of the element's content that has been scrolled.
		 */
		const percentageElementScrolled = () => {
			return this.scrollingEl.scrollTop / (this.scrollingEl.scrollHeight - scrollbarContainer.clientHeight);
		};

		/**
		 * This normalizes the distances between the scrolling element and the height of the scrollbar
		 * to ensure the same ratio of scrolling progress happens between the two.
		 *
		 * @type {Number}
		 */
		const thumbScrollPercentageHeight = scrollbarContainer.clientHeight - thumb.clientHeight;

		/**
		 * The percentage that the thumb has been scrolled along the track.
		 * This is used to calculate how much of the scrolling elements content
		 * should be scrolled and is only relevant when the scrolling is happening
		 * as a result of touching/moving the thumb along the scrollbar track.
		 *
		 * @date   2018-12-03
		 * @author mattbontrager
		 *
		 * @return {Number}   The percentage the thumb has been scrolled inside of the scrollbar track.
		 */
		const percentageScrollBarScrolled = () => {
			return thumb.offsetTop / thumbScrollPercentageHeight;
		};


		// keep a 20px margin above the thumb.
		const topLineHeight = () => thumb.offsetTop - 20;

		// keep a 22px margin below the thumb.
		const bottomLineHeight = () => scrollbarContainer.clientHeight - thumb.offsetTop - 22 - thumb.clientHeight;

		// set the initial height of both lines.
		topLine.style.height = `${topLineHeight()}px`;
		bottomLine.style.height = `${bottomLineHeight()}px`;

		// flags and timestamps for use during moveTouch;
		let isTouching = false,
			touchPointTracking = null;

		/**
		 * Update the position of thumb and the heights of the lines on scroll
		 *
		 * @date   2018-12-03
		 * @author mattbontrager
		 *
		 * @param  {Event}   e the onscroll Event object
		 */
		this.scrollingEl.onscroll = function(e) {
			if (!isTouching) {
				const theTop = thumbScrollPercentageHeight * percentageElementScrolled();
				thumb.style.top = `${theTop}px`;
				topLine.style.height = `${topLineHeight()}px`;
				if (thumb.offsetTop === 600) {
					bottomLine.style.height = '0px';
				} else {
					bottomLine.style.height = `${bottomLineHeight()}px`;
				}
			}
		}

		/**
		 * The touchstart event handler
		 *
		 * @date   2018-12-03
		 * @author mattbontrager
		 *
		 * @param  {Object}   e The starttouch event object
		 */
		const startTouch = e => {
			e.preventDefault();
			isTouching = true;
			const touch = e.changedTouches[0];
			touchPointTracking = Math.floor(Math.round(touch.screenY));
		};

		/**
		 * The touchend event handler
		 *
		 * @date   2018-12-03
		 * @author mattbontrager
		 *
		 * @param  {Object}   e The starttouch event object
		 */
		const endTouch = e => {
			isTouching = false;
            return;
		};

		/**
		 * The touchcancel event handler
		 *
		 * @date   2018-12-03
		 * @author mattbontrager
		 *
		 * @param  {Object}   e The starttouch event object
		 */
		const cancelTouch = e => {
			isTouching = false;
			return;
		};

		const debounce = (func, wait, immediate) => {
			let timeout;
			return function() {
				let context = this,
					args = arguments,
					later = function() {
						timeout = null;
						if (!immediate) {
							func.apply(context, args);
						}
					},
					callNow = immediate && !timeout;

				clearTimeout(timeout);
				timeout = setTimeout(later, wait);
				if (callNow) {
					func.apply(context, args);
				}
			}
		};

		/**
		 * The touchmove event handler
		 *
		 * @date   2018-12-03
		 * @author mattbontrager
		 *
		 * @param  {Object}   e The starttouch event object
		 */
		const moveTouch = e => {
			e.preventDefault();


			isTouching = true;
			const touch = e.changedTouches[0];
			const difference = Math.floor(Math.round(touch.screenY)) - touchPointTracking;
			const newTop = e.target.offsetTop + difference;
			let start = null;


			// prevent the thumb from moving too far up or down.
			if (e.target.offsetTop >= 0 && newTop <= 599) {

				// set the position of the thumb
				thumb.style.top = `${newTop}px`;

				// scroll the scrollable elements contents to the correct position
                scrolllist.scrollTo(0, scrolllist.scrollHeight * percentageScrollBarScrolled());

				// move the top line to track the thumb
				topLine.style.height = `${topLineHeight()}px`;

				// move the bottom line to track the thumb
				bottomLine.style.height = `${bottomLineHeight()}px`;

				// update the touchPointTracking position for the next move event
				touchPointTracking = Math.floor(Math.round(touch.screenY));
            }
			// prevent the thumb from being scrolled up too far
			if (e.target.offsetTop < 0) {
				thumb.style.top = '0px';
			}
		};

		// add the event listeners to the thumb element
		thumb.addEventListener('touchstart', startTouch, false);
		thumb.addEventListener('touchend', endTouch, false);
		thumb.addEventListener('touchcancel', cancelTouch, false);
		thumb.addEventListener('touchmove', moveTouch, false);

	}
}