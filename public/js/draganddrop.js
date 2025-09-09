document.addEventListener("dragstart", function (ev) {
    JR.events.dispatch('onDragStart', ev.target, {detail: {event: ev}});
}, false);

document.addEventListener("dragend", function (ev) {
    JR.events.dispatch('onDragEnd', ev.target);
}, false);

document.addEventListener("dragenter", function (ev) {
    ev.preventDefault();
    let target = getDroppableParent(ev.target);

    if(target !== null)
    {
        ev.eventTarget = target;
        JR.events.dispatch('onDragEnter', ev.eventTarget);
    }
}, false);

document.addEventListener("dragleave", function (ev) {
    ev.preventDefault();
    let target = getDroppableParent(ev.target);

    if(target !== null)
    {
        ev.eventTarget = target;
        JR.events.dispatch('onDragLeave', ev.eventTarget);
    }
}, false);

document.addEventListener("dragover", function (ev) {
    ev.preventDefault();
    let target = getDroppableParent(ev.target);

    if(target !== null)
    {
        ev.eventTarget = target;
        JR.events.dispatch('onDragOver', ev.eventTarget);
    }
}, false);

document.addEventListener("drop", function (ev) {
    ev.preventDefault();
    let target = getDroppableParent(ev.target);
    if(target !== null)
    {
        ev.eventTarget = target;
        JR.events.dispatch('onDrop', ev.eventTarget, {'detail': {target: ev.dataTransfer.getData("target"), dataTransfer: ev.dataTransfer}});
    }
}, false);

function getDroppableParent(target)
{
    return target.closest('[data-droppable=true]');
}