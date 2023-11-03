JR.events = class{
    static add (eventName, elementSelector, handler)
    {
        document.addEventListener(eventName, function(e) {
            for (var target = e.target; target && target != this; target = target.parentNode) {
                if (target.matches(elementSelector)) {
                    e.eventTarget = target;
                    handler.call(target, e);
                    break;
                }
            }
        }, false);
    }

    static dispatch(eventName, element, options = {})
    {
        if(typeof element != 'object')
        {
            element = document.querySelector(element);
        }

        if(element != null)
        {
            let defaultOptions = {"bubbles":true, "cancelable":false, 'detail':{}};
            options = {...defaultOptions,...options};

            let event = new CustomEvent(eventName, options);
            element.dispatchEvent(event);
        }
    }
}