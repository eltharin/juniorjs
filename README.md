Junior JS Library


```
JR.ajax(url, options = {})
```

call an Ajax query

Manage Events

```
JR.Events.add (eventName, elementSelector, handler)
```

allow add an event on an HTML element but placed on document root to allow dispatching event on newest elements

```
JR.Events.dispatch(eventName, element, options = {})
```

dispatch the event



Manage Popup

```
let popup = new JR.Popup();
popup.load(data);
```

create a popup


set class openpopup on a link allow you to call differently a link,

simple clic open a popup with the page emedded or with a middle clic that open you a new page

you have to set your template with condition on 

```
{%- if app.request.headers.get('X-Requested-With') != 'XMLHttpRequest' -%}
<!DOCTYPE html>
<html>
<head>
...
{%- endif -%}
```

take a look to my othr plugin Ajaxresponser allowing a route to be responded in ajaxmode (a json with message, errors, success, ...} or HTML page)



allow load a link in ajax and load in a html element :

<a href="<<mylink>>" class="openin" data-destination="#my_div">Text</a>



allow load a link in ajax and load in a new popup :

<a href="<<mylink>>" class="openpopup" >Text</a>