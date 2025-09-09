JR.events = class{
    static add (eventName, elementSelector, handler, withParents = false)
    {
        document.addEventListener(eventName, function(e) {

            let target = e.target;

            if(withParents)
            {
                target = e.target.closest(elementSelector);
            }
            if(target !== null && JR.events.targetmatch(target, elementSelector))
            {
                e.eventTarget = target;
                handler.call(target, e);
            }
        }, false);
    }

    static targetmatch(target, elementSelector)
    {
        if(typeof elementSelector === 'string')
        {
            if (target.matches(elementSelector))
            {
                return true;
            }
        }
        else if(typeof elementSelector === 'object' && elementSelector instanceof HTMLElement)
        {
            if (target == elementSelector)
            {
                return true;
            }
        }
        else
        {
            if (Array.prototype.slice.call(elementSelector).includes(target))
            {
                return true;
            }
        }

        return false;
    }

    static dispatch(event, element, options = {})
    {
        if(typeof element != 'object')
        {
            element = document.querySelector(element);
        }

        if(element != null)
        {
            if(typeof event == "string")
            {
                let defaultOptions = {"bubbles":true, "cancelable":false, 'detail':{}};
                options = {...defaultOptions,...options};

                event = new CustomEvent(event, options);
            }

            element.dispatchEvent(event);
        }
    }
}