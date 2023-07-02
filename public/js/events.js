JR.events = class{
    static add (elementSelector, eventName, handler)
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

    static dispatch(element, eventName, options = {})
    {
        if(typeof element != 'object')
        {
            element = document.querySelector(element);
        }

        let defaultOptions = {"bubbles":true, "cancelable":false, 'detail':{}};
        options = {...defaultOptions,...options};

        let event = new CustomEvent(eventName, options);
        element.dispatchEvent(event);
    }
}