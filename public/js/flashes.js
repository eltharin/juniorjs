class Flashes
{
	mutationObserverRegistered = false;
	selector = null;
	time = null;

	static init(selector, time = null)
	{
		this.selector = selector;
		this.time = time;
		if (time !== null)
		{
			this.#addEventTimerClose(time);
		}

		JR.events.add('click', this.selector + ' > div', function(element) {
			element.eventTarget.remove();
		});
	}

	static #addEventTimerClose(time)
	{
		document.querySelectorAll(this.selector + ' > div').forEach((element) => {
			sleep(time).then(() => { element.remove(); });
		});
	}

	/**
	 *
	 * @param message
	 * @param type
	 * @param time -1 : get this.time instead, null : no automatic close, int : close in x ms
	 * @returns {HTMLDivElement}
	 */
	static create( message, type = 'info' , time = -1, id = null)
	{
		let div = document.createElement("div");
		div.classList.add('messageflash');
		div.classList.add(type);
		div.innerHTML = message;

		if(id !== null)
		{
			document.querySelectorAll(this.selector + ' > div[data-id="'+id+'"]').forEach(e => e.remove());
			div.dataset.id = id;
		}

		document.querySelector(this.selector).append(div);

		if(time === -1)
		{
			time = this.time;
		}

		if(time !== null)
		{
			sleep(time).then(() => { div.remove(); });
		}

		return div;
	}
}
