
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
});


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
});

JR.events.add( 'click','.linkajax', (event) => {
    event.preventDefault();

    JR.ajax(event.eventTarget.getAttribute('href'),{
        'success' : (data,response) => {
            JR.events.dispatch('onSubmitSuccess', event.eventTarget, {"detail": {data : data, response : response}} );
        },
        'error' : (data , response) => {
            JR.events.dispatch('onSubmitError', event.eventTarget, {"detail": {data : data, response : response}} );
        }
    });
});

JR.events.add( 'submit','.ajax_form form', (event) =>
{
    event.preventDefault();

    /*if(CKEDITOR != undefined)
    {
        for ( instance in CKEDITOR.instances )
        {
            CKEDITOR.instances[instance].updateElement();
        }
    }*/

    let form = event.eventTarget;
    let form_container = form.closest('.ajax_form');
    let popup = form.closest('.popup');
    let caller = form_container.caller ?? null;

    if(form.classList.contains('noAjaxSubmit') || (caller != null && caller.dataset.openpopupSubmit == "noAjax"))
    {
        form.submit();
        return;
    }

    JR.events.dispatch('beforeFormSubmit' , caller);

    let formData = new FormData(form);

    JR.ajax(form.getAttribute('action'),{
        'method':  form.getAttribute('method'),
        'data': formData,
        'headers': {'x-redirect-type': (caller != null && caller.dataset.redirectType) ?? 'forward'},
        'redirect': (caller != null && caller.dataset.redirectType) == 'manual' ? 'manual' : 'follow',
        'success': function (data,response) {
            //popup.popup.close();
            JR.events.dispatch('onFormSubmitSuccess', caller, {"detail": {data : data, form: form, formData : formData, response : response, formContainer: form_container}});
        },
        'error': function (data,response) {
            JR.events.dispatch('onFormSubmitError', caller,{ "detail": {response : response}});
        }
    });
});
