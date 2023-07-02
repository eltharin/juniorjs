JR.Popup = class{
    popup = null;
    content = null;

    constructor() {
        this.popup = document.createElement("div");
        this.popup.classList.add('popup');
        this.popup.classList.add('draggable');
        this.popup.popup = this;
        document.querySelector('body').append(this.popup);

        let header = document.createElement("nav");
        this.popup.append(header);

        this.content = document.createElement("div");
        this.popup.append(this.content);

        let closeBtn = document.createElement("span");
        closeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>';
        closeBtn.onclick = () => this.close();
        header.append(closeBtn);


        dragElement(this.popup)
        this.popup.dispatchEvent(new Event("onCreatePopup", {"bubbles":true, "cancelable":false}));
    };

    getPopup()
    {
        return this.popup;
    }

    load(html)
    {
        this.content.innerHTML = html;
        this.popup.dispatchEvent(new Event("onLoadContent", {"bubbles":true, "cancelable":false}));
    }

    close(){
        this.popup.dispatchEvent(new Event("onClose", {"bubbles":true, "cancelable":false}));
        this.popup.remove();
    }
}