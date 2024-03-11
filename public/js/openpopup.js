
JR.events.add( 'click','.openpopup', (event) => {
    event.preventDefault();
    JR.ajax(event.eventTarget.getAttribute('href'),{
        'success' : (data,response) => {
            if(event.eventTarget.openpopup != null)
            {
                event.eventTarget.openpopup.close();
            }

            let popup = new JR.Popup();
            popup.load(data);

            popup.getPopup().caller = event.eventTarget;
            event.eventTarget.openpopup = popup;
            JR.events.dispatch('onLoadPopup', popup.getPopup(),{"detail": {data : data, response : response}});
        },
        'error' : (data, response) => {
            JR.events.dispatch('onLoadError', event.eventTarget,{"detail": {data : data, response : response}});
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

JR.events.add( 'submit','.popup form', (event) =>
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
    let popup = form.closest('.popup');
    let caller = popup.caller;

    if(form.classList.contains('noAjaxSubmit') || caller.dataset.openpopupSubmit == "noAjax")
    {
        form.submit();
        return;
    }

    JR.events.dispatch('beforeFormSubmit' , caller);

    let formData = new FormData(form);

    JR.ajax(form.getAttribute('action'),{
        'method':  form.getAttribute('method'),
        'data': formData,
        'headers': {'x-redirect-type': caller.dataset.redirectType ?? 'forward'},
        'redirect': caller.dataset.redirectType == 'manual' ? 'manual' : 'follow',
        'success': function (data,response) {
            popup.popup.close();

            JR.events.dispatch('onFormSubmitSuccess', caller, {"detail": {data : data, formData : formData, response : response}});
        },
        'error': function (data,response) {
            if(response.text.errorForm == true)
            {
                popup.popup.load(data);
            }
            JR.events.dispatch('onFormSubmitError', caller,{ "detail": {response : response}});
        }
    });

});
