
JR.events.add( 'click','.openpopup', (event) => {
    event.preventDefault();
    JR.events.dispatch('onBeforeLoad', event.eventTarget);
    let url = event.eventTarget.getAttribute('href') || event.eventTarget.getAttribute('url') || event.eventTarget.dataset.url || null;
    if(url == null)
    {
        return;
    }
    JR.ajax(url,{
        'success' : (data,response) => {
            if(event.eventTarget.openpopup != null)
            {
                event.eventTarget.openpopup.close();
            }

            let popup = new JR.Popup();
            popup.getPopup().classList.add('ajax_form')
            popup.load(data);

            JR.events.add('onFormSubmitSuccess', event.eventTarget, (e) => {
                popup.close();
            });

            JR.events.add('onFormSubmitError', event.eventTarget, (e) => {//--@TODO:a tester
                if(response.text.errorForm == true)
                {
                    popup.popup.load(data);
                }
            });

            popup.getPopup().caller = event.eventTarget;
            event.eventTarget.openpopup = popup;
            JR.events.dispatch('onLoadPopup', popup.getPopup(),{"detail": {data : data, response : response}});
        },
        'error' : (data, response) => {
            JR.events.dispatch('onLoadError', event.eventTarget,{"detail": {data : data, response : response}});
        }
    });
}, true);


JR.events.add( 'click','.openin', (event) => {
    event.preventDefault();
    JR.events.dispatch('onBeforeLoad', event.eventTarget);

    let url = event.eventTarget.getAttribute('href') || event.eventTarget.getAttribute('url') || event.eventTarget.dataset.url || null;
    let destination = event.eventTarget.dataset.destination || null;

    if(url == null)
    {
        console.error('no url passed');
        return;
    }
    if(destination == null)
    {
        console.error('no destination passed');
        return;
    }
    let elementDestination = document.querySelector(destination);


    JR.ajax(url,{
        'success' : (data,response) => {
            /*
            JR.events.add('onFormSubmitSuccess', event.eventTarget, (e) => {
                popup.close();
            });
            JR.events.add('onFormSubmitError', event.eventTarget, (e) => {//--@TODO:a tester
                if(response.text.errorForm == true)
                {
                    popup.popup.load(data);
                }
            });

             */

            elementDestination.innerHTML = data;
            elementDestination.caller = event.eventTarget;
            JR.events.dispatch('onLoadData', event.eventTarget,{"detail": {data : data, response : response}});

        },
        'error' : (data, response) => {
     //       JR.events.dispatch('onLoadError', event.eventTarget,{"detail": {data : data, response : response}});
        }
    });
}, true);

JR.events.add( 'click','.linkajax', (event) => {
    if(event.defaultPrevented) {return ;}
    event.preventDefault();

    if(event.eventTarget.dataset.update != '')
    {
        JR.events.add('onSubmitSuccess', event.eventTarget, function(e) {
            document.querySelector(event.eventTarget.dataset.update).outerHTML = e.detail.data;
        });
    }

    let headers = {'x-redirect-type': (event.eventTarget.dataset.redirectType) ?? 'forward'}
    if(event.eventTarget.dataset.update != undefined)
    {
        headers['x-section'] = event.eventTarget.dataset.update;
    }
    if(event.eventTarget.dataset.redirectToMe != undefined && event.eventTarget.dataset.redirectToMe)
    {
        headers['x-redirect-to'] = window.location.href;
    }

    JR.ajax(event.eventTarget.getAttribute('href'),{
        'headers': headers,
        'success' : (data,response) => {
            JR.events.dispatch('onSubmitSuccess', event.eventTarget, {"detail": {data : data, response : response}} );
        },
        'error' : (data , response) => {
            JR.events.dispatch('onSubmitError', event.eventTarget, {"detail": {data : data, response : response}} );
        }
    });
}, true);

JR.events.add( 'submit', 'form.submitajax', (event) =>
{
    formSubmitInAjax(event);
});

JR.events.add( 'submit','.ajax_form form', (event) =>
{
    formSubmitInAjax(event, (form) => form.closest('.ajax_form'));
});

function formSubmitInAjax(event, containerGetter = null)
{
    if(event.defaultPrevented) {return ;}
    event.preventDefault();

    let form = event.eventTarget;

    let form_container = null;
    let caller = form;

    if(containerGetter != null)
    {
        form_container = containerGetter(form);
        caller = form_container.caller ?? null;
    }

    if(form.classList.contains('noAjaxSubmit') || (caller != null && caller.dataset.openpopupSubmit == "noAjax"))
    {
        form.submit();
        return;
    }

    if(caller != null)
    {
        JR.events.dispatch('beforeFormSubmit' , caller);
    }

    let formData = new FormData(form);
    let headers = {'x-redirect-type': (caller != null && caller.dataset.redirectType) ?? 'forward'}

    if(caller.dataset.update != undefined)
    {
        headers['x-section'] = caller.dataset.update;

        JR.events.add('onFormSubmitSuccess', caller, function(e) {
            document.querySelector(caller.dataset.update).outerHTML = e.detail.data;
            JR.events.dispatch('onAjaxReload', document.querySelector(caller.dataset.update),{ "detail": {}});
        });
    }

    if(caller.dataset.redirect_to_me != undefined && caller.dataset.redirect_to_me)
    {
        headers['x-redirect-to'] = window.location.href;
    }

    JR.ajax(form.getAttribute('action'),{
        'method':  form.getAttribute('method'),
        'data': formData,
        'headers': headers,
        'redirect': (caller != null && caller.dataset.redirectType) == 'manual' ? 'manual' : 'follow',
        'success': function (data,response) {
            JR.events.dispatch('onFormSubmitSuccess', caller, {"detail": {data : data, form: form, formData : formData, response : response, formContainer: form_container}});
        },
        'error': function (data,response) {
            JR.events.dispatch('onFormSubmitError', caller,{ "detail": {response : response}});
        }
    });
}