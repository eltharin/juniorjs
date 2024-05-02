class JR {
    static ajax (url, paramoptions)
    {
        let options =  {...{
                'method': 'GET',
                'data': {},
                'headers': {},
                'success': null,
                'error': null,
                'async': true,
                'redirect': 'follow', // follow / error / manual
                'mode' : 'cors',
                'cache': 'default'
            },...paramoptions};

        let part = null;

        let index = url.indexOf(' ');
        if(index != -1)
        {
            part = url.substring(index + 1);
            url = url.substring(0,index);
        }

        var myHeaders = new Headers();
        myHeaders.append('X-Requested-With', 'XMLHttpRequest');

        Object.entries(options.headers).forEach(([key, val]) => {
            myHeaders.append(key, val);
        });

        var myInit = {
            method: options.method,
            headers: myHeaders,
            mode: options.mode,
            cache: options.cache,
            redirect : options.redirect
        };

        if(myInit.method != 'GET')
        {
            myInit.body = options.data;
        }

        fetch(url, myInit)
            .then(function(response)
            {
                response.text().then(function(data )
                {
                    if(response.headers.get('Content-Type') == 'application/json')
                    {
                        try
                        {
                            data = JSON.parse(data);
                        }
                        catch(err)
                        {
                            data = data;
                        }
                    }
                    response.text = data;

                    if(response.headers.get('X-Response-Type') == 'AjaxOrNotResponse')
                    {
                        if(typeof Flashes !== "undefined")
                        {
                            for (var msgType in data.msgs)
                            {
                                data.msgs[msgType].forEach((msg) => {
                                    Flashes.create(msg, msgType);
                                });
                            }
                        }
                        data = data.content;
                    }
                    if(response.ok)
                    {
                        if(options.success != null)
                        {
                            options.success(data, response);
                        }
                    }
                    else if(response.status == 0 && response.headers.get('X-Response-Type'))
                    {

                    }
                    else
                    {
                        if(options.error != null)
                        {
                            options.error(data, response);
                        }
                    }
                });
            })
            .catch(function(error) {
                console.log('Il y a eu un problème avec l\'opération fetch: ' + error.message);
            })
        ;
    }

    static loadData(element, data)
    {
        element.innerHTML = '';
        element.append(document.createRange().createContextualFragment(data));
    }
}
