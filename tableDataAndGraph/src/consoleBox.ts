

// Inicialmente habilitamos los logs


export class consoleBox {
    private static _THIS_HTML_: HTMLElement
    constructor() {
        consoleBox.InitBOX();
        consoleBox.AddEventoClick()
    }
    public static AddEventoClick() {
        console.log("EVENT CLICK CREATED");
        const BTN_Toggle = consoleBox._THIS_HTML_?.querySelector('#allcontent');

        if (BTN_Toggle) {
            BTN_Toggle.addEventListener("click", function (event) {
                console.log("EVENT CLICK");

                const BOXCONTENT = consoleBox._THIS_HTML_?.querySelector("logbox");

                if (BOXCONTENT.classList.contains("open")) {

                    BOXCONTENT.classList.remove("open")
                } else {

                    BOXCONTENT.classList.add("open")
                }

            });
        }
    }

    public static InitBOX() {
        consoleBox._THIS_HTML_ = document.createElement("div");
        consoleBox._THIS_HTML_.id = "logbox";
        consoleBox._THIS_HTML_.className = "log";

        const _show_hidden_ = document.createElement("div");
        _show_hidden_.id = "show_hidden"

        const _allcontent_ = document.createElement("div");
        _allcontent_.className = "container-message";
        _allcontent_.id = "allcontent";
        _allcontent_.appendChild(document.createTextNode(""));
        consoleBox._THIS_HTML_.appendChild(_show_hidden_);
        consoleBox._THIS_HTML_.appendChild(_allcontent_);
        consoleBox._THIS_HTML_.appendChild(consoleBox.style());
        consoleBox.AddEventoClick();
    }
    public static GetDOM(): HTMLElement {
        return consoleBox._THIS_HTML_
    }
    private static style() {
        const _STYLE_ = document.createElement("style");
        const cssRules = `
@charset "UTF-8";
#logbox {
  display: block;
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 999999;
  cursor: default;
  background-color: #f4f4f4;
  margin: 0;
  height: 1px;
  padding: 0px;
}
#logbox textarea {
  width: 100%;
  font-size: 20px;
  height: 100px;
  display: block;
  background-color: rgb(219, 232, 251);
  color: #616161;
  border: #aeaeae solid 1px;
  resize: none;
  padding: 15px;
}
#logbox #show_hidden {
  position: absolute;
  top: -25px;
  right: 30px;
  display: block;
  background-color: #f4f4f4;
  color: #000;
  width: 50px;
  text-align: center;
  font-size: 20px;
  border-radius: 7px 7px 0 0;
  font-weight: bold;
  cursor: pointer;
}
#logbox #show_hidden::before {
  content: "˄";
}
#logbox.open {
  padding: 15px;
  height: 60% !important;
}
#logbox.open #allcontent {
  display: block;
}
#logbox.open #show_hidden::before {
  content: "˅";
}
#logbox #allcontent {
  display: none;
  overflow: scroll;
  display: block;
  width: 100%;
  height: 100%;
  outline: #ddd solid 2px;
  padding: 7px;
}
#logbox .container-message {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 30px;
}
#logbox .container-message.error {
  color: red;
}
#logbox .container-message.information {
  color: green;
}
#logbox .container-message.warning {
  color: orange;
}
`;


        _STYLE_.appendChild(consoleBox.returnText(cssRules));
        return _STYLE_;
    }

    private static returnText(_TEXT_: string) {

        return document.createTextNode(_TEXT_);
    }
    public static Clear() {
        consoleBox._THIS_HTML_.remove();
    }
    /*public static html() {
            const _H1_ = document.createElement("h1")
            _H1_.innerHTML = '<h1 style="position:absolute;z-index:9999;left:0;top:0;color:red;font-size:38px">GUILLERMO MAURICIO ROCHA ORTIZ</h1>';//.appendChild(document.createTextNode("GUILLERMO MAURICIO ROCHA ORTIZ"))
            document?.querySelector("#TblContainerER").appendChild(_H1_)
        }*/
    public static Log(_VALUE_: any) {

        const _INNER_CONTENT_ = consoleBox._THIS_HTML_?.querySelector('#allcontent')//consoleBox._THIS_HTML_.getElementById("allcontent");
        _INNER_CONTENT_.appendChild(consoleBox.returnText(_VALUE_));
        return false;
    }

    /* static log() {
 
         console.log(...arguments);
 
     }*/

    /*static warn() {

        console.warn(...arguments);

    }

    static info() {

        console.info(...arguments);

    }

    static error() {

        console.error(...arguments);

    }*/
}