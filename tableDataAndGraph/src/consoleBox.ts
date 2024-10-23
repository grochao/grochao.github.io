

// Inicialmente habilitamos los logs


export class ANSconsoleBox {
  private static _THIS_HTML_: HTMLElement;
  private static count_group: number;
  private static __VAR_DATETYPE_UNDEFINED__: number = 0;
  private static __VAR_DATETYPE_JSON__: number = 1;
  private static __VAR_DATETYPE_JSON_STRING__: number = 2;
  private static __VAR_DATETYPE_ARRAY__: number = 3;
  private static __VAR_DATETYPE_STRING__: number = 4;
  private static __VAR_DATETYPE_NUMBER__: number = 5;
  private static __VAR_DATETYPE_BOOLEAN__: number = 6;
  private static __VAR_DATETYPE_STRING_BOOLEAN__: number = 7;

  constructor() {

    ANSconsoleBox.count_group = 0;
    ANSconsoleBox.InitBOX();
    ANSconsoleBox.Clear();

  }
  private static debug(_VALUE_: any = "") {
    console.group('***********DEBUGER ANS***********');
    console.log(_VALUE_);
    console.groupEnd();
  }

  private static DetectDataType(__VARIABLE__: any = null) {
    if (typeof __VARIABLE__ === 'object' && __VARIABLE__ !== null && !Array.isArray(__VARIABLE__)) {
      return ANSconsoleBox.__VAR_DATETYPE_JSON__;
    } else if (Array.isArray(__VARIABLE__)) {
      return ANSconsoleBox.__VAR_DATETYPE_ARRAY__;
    } else if (typeof __VARIABLE__ === 'string') {
      try {
        JSON.parse(__VARIABLE__);
        return ANSconsoleBox.__VAR_DATETYPE_JSON_STRING__;
      } catch (e) {

        if (__VARIABLE__.toLocaleLowerCase() === 'true' || __VARIABLE__.toLocaleLowerCase() === 'false' || __VARIABLE__.toLocaleLowerCase() === 'yes' || __VARIABLE__.toLocaleLowerCase() === 'no' || __VARIABLE__.toLocaleLowerCase() === 'si') {
          return ANSconsoleBox.__VAR_DATETYPE_STRING_BOOLEAN__;
        } else {
          return ANSconsoleBox.__VAR_DATETYPE_STRING__;
        }

      }
    } else if (typeof __VARIABLE__ === 'number') {
      return ANSconsoleBox.__VAR_DATETYPE_NUMBER__;
    } else if (typeof __VARIABLE__ === 'boolean') {
      return ANSconsoleBox.__VAR_DATETYPE_BOOLEAN__;
    } else {
      return ANSconsoleBox.__VAR_DATETYPE_UNDEFINED__;

    }
  }
  public static InitBOX() {
    ANSconsoleBox._THIS_HTML_ = document.createElement("div");
    ANSconsoleBox._THIS_HTML_.id = "logbox";
    ANSconsoleBox._THIS_HTML_.className = "log";

    const _show_hidden_ = document.createElement("div");
    _show_hidden_.id = "show_hidden"

    const _maximize_ = document.createElement("div");
    _maximize_.id = "maximize_icon"



    _show_hidden_.addEventListener("click", function (event) {
      // console.clear();


      const padre = (event.currentTarget as HTMLElement).parentNode;

      // Verificar que padre no sea null y sea un HTMLElement
      if (padre && padre instanceof HTMLElement) {
        // Alternar la clase 'open'
        padre.classList.toggle('open');

      }

    });


    const _allcontent_: HTMLElement = document.createElement("div");
    _allcontent_.className = "container-message";
    _allcontent_.id = "allcontent";
    _allcontent_.appendChild(document.createTextNode(""));

    ANSconsoleBox._THIS_HTML_.appendChild(_maximize_);
    ANSconsoleBox._THIS_HTML_.appendChild(_show_hidden_);


    ANSconsoleBox._THIS_HTML_.appendChild(_allcontent_);
    ANSconsoleBox._THIS_HTML_.appendChild(ANSconsoleBox.style());



    ANSconsoleBox.debug("InitBOX");


  }
  public GetDOM() {
    ANSconsoleBox.debug("PASÓ  1 GetDOM");
    ANSconsoleBox.debug("[" + ANSconsoleBox._THIS_HTML_.innerHTML + "]");
    ANSconsoleBox.debug("PASÓ  1 GetDOM");
    return ANSconsoleBox._THIS_HTML_;
  }

  private static style() {
    const _STYLE_ = document.createElement("style");
    const cssRules = `
    #logbox {
    display: block;
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 999999;
    cursor: default;
    background-color: #131c26;
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

#logbox #maximize_icon {

    right: 80px;
    display: none;
}

#logbox #show_hidden {
    right: 30px;
    display: block;
}

#logbox #maximize_icon,
#logbox #show_hidden {
    position: absolute;
    top: -26px;
    color: #fff;
    width: 110px;
    text-align: center;
    font-size: 17px;
    border-radius: 7px 7px 0 0;
    font-weight: 400;
    cursor: pointer;
}

#logbox #maximize_icon::before {
    content: "⛶";
}

#logbox #show_hidden::before {
    content: "🞁 Debugger";
}

#logbox.open {
    padding: 15px;
    height: 60% !important;
}

#logbox:not(.open) #show_hidden {
    background-color: #547ddf;

}

#logbox.open #maximize_icon{
 background-color:#131c26;
    font-size: 31px;
top:-41px;
    width: 50px !important;
}
#logbox.open #show_hidden {
    background-color:#131c26;
    font-size: 31px;
top:-41px;

    width: 50px !important;


}

#logbox.open #allcontent {
    display: block;
}


#logbox.open #maximize_icon {
    display: block;
}

#logbox.open #show_hidden::before {
    content: "✕";
}

#logbox.open #maximize_icon:hover {
    background-color: #217fee !important;
    color: #fff;
}
    

#logbox.open #show_hidden:hover {
    background-color: #FF0000!important;
    color: #fff;
}

#logbox #allcontent {
    font-family: Courier, "Lucida Console", monospace;
    font-size: 18px;
    letter-spacing: 0.1em;
    background-color: transparent;
    color: #fff;
    display: none;
    overflow: auto;
    display: block;
    width: 100%;
    height: 100%;

    padding: 7px;
    cursor: text;
    -webkit-user-select: text !important;
    /* Safari */
    -ms-user-select: text !important;
    /* IE 10 and IE 11 */
    user-select: text !important;
    /* Standard syntax */
}


/*STYLE SCROLL - BEGIN*/
/* GENERATOR ONLINE: https://www.cssportal.com/css-scrollbar-generator/*/
/* Firefox (uncomment to work in Firefox, although other properties will not work!)  */
/* #logbox #allcontent {
  scrollbar-width: thin;
  scrollbar-color: #54AE32 #575757;
}*/



/* Chrome, Edge and Safari */
#logbox .content_table_formater::-webkit-scrollbar,
#logbox #allcontent::-webkit-scrollbar {
    height: 11px;
    width: 11px;

}

#logbox .content_table_formater::-webkit-scrollbar-track,
#logbox #allcontent::-webkit-scrollbar-track {
    border-radius: 11px;
    background-color: #575757;
    cursor: pointer;
}

#logbox .content_table_formater::-webkit-scrollbar-track:hover,
#logbox #allcontent::-webkit-scrollbar-track:hover {
    background-color: #666666;
}

#logbox .content_table_formater::-webkit-scrollbar-track:active,
#logbox #allcontent::-webkit-scrollbar-track:active {
    background-color: #737373;
}

#logbox .content_table_formater::-webkit-scrollbar-thumb,
#logbox #allcontent::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background-color: #7D7D7D;
    cursor: pointer;
}

#logbox .content_table_formater::-webkit-scrollbar-thumb:hover,
#logbox #allcontent::-webkit-scrollbar-thumb:hover {
    background-color: #5DC137;
}

#logbox .content_table_formater::-webkit-scrollbar-thumb:active,
#logbox #allcontent::-webkit-scrollbar-thumb:active {
    background-color: #5DC137;
}

/*STYLE SCROLL - END*/

#logbox .container-message {
    display: block;
    width: 100%;
    padding: 10px;
    background-color: #fff;
    border-radius: 3px;
    margin-bottom: 30px;
}

#logbox #allcontent .span {
    display: flex;
    width: 90%;
    margin-bottom: 4px;
}

#logbox .container-message .span>span:last-child {
    border: none;
    border-left-width: 6px;
    border-left-style: solid;
    border-radius: 6px 0 0 6px;
    padding: 10px 10px;
    font-size: 15px;
    border-bottom: #8e969f 1px solid;
}

#logbox .container-message .span.log>span:last-child {

    border-left-color: rgb(221, 221, 221) !important;
    /* background-color: rgb(221, 221, 221, 0.25);*/
}

#logbox .container-message .span.error>span:last-child {

    border-left-color: rgb(238 33 33) !important;
    /* background-color: rgb(238, 33, 33, 0.25);*/
}

#logbox .container-message .span.information>span:last-child {
    border-left-color: rgb(33, 127, 238) !important;
    /*background-color: rgb(33, 127, 238, 0.25);*/
}

#logbox .container-message .span.warning>span:last-child {

    border-left-color: rgb(238, 177, 33) !important;
    /*background-color: rgb(238, 177, 33, 0.25);*/
}

#logbox .span:not(.full-display)>span {
    width: 100%;
    flex: 0 0 20px;

}

#logbox .span.full-display>span {
    width: 100%;
    flex: 0 0 100%;
}

#logbox .span:not(.full-display)>span:last-child {
    flex: 0 0 calc(100% - 20px);
}


.content_string_formater {
    background: #fff;
    color: #000;
    margin-top: 15px;
    padding: 15px;
    white-space: pre;
    height: 200px;
    overflow: auto;
}

/* STYLE TOGGLE*/
.div_content_toogle {
    display: flex;
    align-items: center;
    justify-content: end;

    width: 100%;
    position: relative;
    font-family: 'Segoe UI Semibold', wf_segoe-ui_semibold, helvetica, arial, sans-serif;
}

.toggleContainer {
    position: relative;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    width: fit-content;
    border: 3px solid #079d1d;
    border-radius: 20px;
    background: transparent;
    font-weight: bold;
    color: #343434;
    cursor: pointer;
}

.toggleContainer::before {
    content: '';
    position: absolute;
    width: 50%;
    height: 100%;
    left: 0%;
    border-radius: 20px;
    background: #079d1d;
    transition: all 0.3s;
}

.toggleCheckbox:checked+.toggleContainer::before {
    left: 50%;
}

.toggleContainer div {
    padding: 3px 12px;
    text-align: center;
    z-index: 1;
    height: 23px;
    font-size: 12px;
}

.toggleCheckbox {
    display: none;
}

.toggleCheckbox:checked+.toggleContainer div:first-child {
    color: white;
    transition: color 0.3s;
}

.toggleCheckbox:checked+.toggleContainer div:last-child {
    color: #ffffff;
    transition: color 0.3s;
}

.toggleCheckbox+.toggleContainer div:first-child {
    color: #ffffff;
    transition: color 0.3s;
}

.toggleCheckbox+.toggleContainer div:last-child {
    color: white;
    transition: color 0.3s;
}

/*STYLE TABLE*/
.content_table_formater,
.content_table_formater *,
.content_table_formater ::after,
.content_table_formater ::before {
    box-sizing: border-box;
}

.content_table_formater {
    display: none;
    width: 100%;
    overflow: auto;
    max-width: 100%;
    background-color: #fff;
    margin: 20px 0 0 0;
    -webkit-overflow-scrolling: touch;
    -ms-overflow-style: -ms-autohiding-scrollbar;
}

.formatjson span.open .content_string_formater {
    display: none !important;
}

.formatjson span.open .content_table_formater {
    display: block !important;
}

.content_table_formater .table {
    width: 100%;
    max-width: 100%;
    margin-bottom: 1rem;
    background-color: transparent;
}

.content_table_formater .table {
    border-collapse: collapse;
}

.content_table_formater .table td,
.content_table_formater .table th {
    padding: .75rem;
    vertical-align: top;
    border-top: 1px solid #dee2e6;
}

.content_table_formater .table th {
    text-align: inherit;
}

.content_table_formater .table thead th {
    vertical-align: bottom;
    border-bottom: 2px solid #dee2e6;
}

.content_table_formater .table td,
.content_table_formater .table th {
    padding: .75rem;
    vertical-align: top;
    border: 1px solid #dee2e6;
}

.content_table_formater .table td span.key,
.content_table_formater .table th span.key {
    display: block;
    width: 100%;
    /*padding: 0.75rem;*/
    white-space: nowrap;
    background-color: #0f5795;
    color: #fff;
}

.content_table_formater .table td span.value,
.content_table_formater .table th span.value {
    display: block;
    width: 100%;
    padding: 0.75rem;
    white-space: nowrap;
    border: 1px solid #dee2e6;
    color: #0f5795;
}

.content_table_formater .table {
    text-align: center;
}
`;


    _STYLE_.appendChild(ANSconsoleBox.returnText(cssRules));
    return _STYLE_;
  }
  private static returnSetectFormat(str_left: string = "", str_right: string = "") {

    const _div_content_toogle_ = document.createElement("div");
    _div_content_toogle_.className = "div_content_toogle";
    _div_content_toogle_.id = "div_content_toogle";
    const checkbox: HTMLElement = document.createElement("INPUT");
    checkbox.setAttribute("type", "checkbox");
    checkbox.id = "toggle";
    checkbox.className = "toggleCheckbox";
    _div_content_toogle_.appendChild(checkbox);
    const Label: HTMLElement = document.createElement("LABEL");
    Label.setAttribute("for", "toggle");
    Label.className = "toggleContainer";

    const DIVLeft: HTMLElement = document.createElement("div");
    Label.appendChild(DIVLeft.appendChild(ANSconsoleBox.returnSpan(str_left, null, "div")));
    Label.appendChild(DIVLeft.appendChild(ANSconsoleBox.returnSpan(str_right, null, "div")));
    _div_content_toogle_.appendChild(Label);

    /*document.addEventListener('DOMContentLoaded', () => {
      const button = document.getElementById('_div_content_toogle_');

      if (button) {
        button.addEventListener('click', (event: MouseEvent) => {
          console.log('Button clicked once');
          // Aquí tu lógica
        }, { once: true });
      }
    });*/



    _div_content_toogle_.addEventListener("click", (event: MouseEvent) => {

      const padreSpan = (event.currentTarget as HTMLElement).parentNode as HTMLElement;

      const valueCheckbok = padreSpan.querySelector('.toggleCheckbox') as HTMLInputElement

      // const checkbox = document.getElementById('myCheckbox') as HTMLInputElement;

      if (valueCheckbok.checked) {
        padreSpan.className = "open";
      } else {
        padreSpan.className = "close";
      }

      /** */

      //const hijoEspecifico = padre.querySelector('.content_table_formater');
      //hijoEspecifico.classList.toggle('open');
      console.info("Entró");
      //console.clear();
      //console.warn(hijoEspecifico.innerHTML);
      /*
            const padre = (event.currentTarget as HTMLElement).parentNode;
      
            // Verificar que padre no sea null y sea un HTMLElement
            if (padre && padre instanceof HTMLElement) {
              // Alternar la clase 'open'
              padre.classList.toggle('open');
              console.log('Clase "open" toggled en el padre.');
            } else {
              console.warn('El elemento padre no es un HTMLElement o es null');
            }
      */
    })

    return _div_content_toogle_;

  }
  private static displayFormattedJson(jsonString: string) {
    try {
      // Parsear el string JSON a un objeto
      const jsonObject = JSON.parse(jsonString);

      // Convertir el objeto a un string con formato (salto de líneas y tabulaciones)
      const formattedJson = JSON.stringify(jsonObject, null, 2);
      return formattedJson;
    } catch (error) {
      return jsonString;
    }
  }
  private static returnSpan(_VALUE_: any, __class__: string = null, _tag_: string = "span") {
    const _tag_elementg_ = document.createElement(_tag_);
    if (__class__ !== null) {
      _tag_elementg_.className = __class__;
    }
    _tag_elementg_.appendChild(document.createTextNode(_VALUE_));
    return _tag_elementg_;
  }
  private static displayFormatTable(jsonData): HTMLElement {

    const _table_: HTMLElement = document.createElement('table');
    //_table_.style.borderCollapse = 'collapse';
    //_table_.style.width = '100%';
    //_table_.style.border = '1px solid black';
    _table_.className = "table";

    const _table_row_: HTMLElement = document.createElement("tr");

    //console.log(`Clave: ${key}, Valor: ${jsonData[key]}`);
    Object.keys(jsonData).forEach(key => {
      const _table_data_: HTMLElement = document.createElement("td");
      const _span_value_: HTMLElement = document.createElement("span");
      _span_value_.className = "value";

      const _span_key_: HTMLElement = document.createElement("span");
      _span_key_.className = "key";

      _span_key_.appendChild(document.createTextNode(key))
      _table_data_.appendChild(_span_key_);
      if (typeof jsonData[key] === 'object' && jsonData[key] !== null) {
        _table_data_.appendChild(ANSconsoleBox.displayFormatTable(jsonData[key]));
      } else {
        _span_value_.appendChild(document.createTextNode(jsonData[key]));
        _table_data_.appendChild(_span_value_);

        //  console.log(`Clave: ${key}, Valor: ${jsonData[key]}`);
      }
      _table_row_.appendChild(_table_data_);
    });
    _table_.appendChild(_table_row_);
    return _table_;
  }

  private static returnText(_TEXT_: any, print_span: boolean = false, _class_: string = "") {

    //

    if (print_span) {

      const _span_ = document.createElement("div");
      _span_.className = "span " + _class_ + " " + ((ANSconsoleBox.count_group == 0) ? "full-display" : "");

      for (let _index_ = 0; _index_ < ANSconsoleBox.count_group; _index_++) {
        _span_.appendChild(ANSconsoleBox.returnSpan(" "));
      }

      if (ANSconsoleBox.DetectDataType(_TEXT_) == ANSconsoleBox.__VAR_DATETYPE_JSON__ || ANSconsoleBox.DetectDataType(_TEXT_) == ANSconsoleBox.__VAR_DATETYPE_JSON_STRING__) {
        _span_.className = _span_.className + " formatjson";
        const container_formater_json: HTMLElement = document.createElement("span");
        container_formater_json.appendChild(ANSconsoleBox.returnSetectFormat("TABLE", "JSON"));

        container_formater_json.appendChild(ANSconsoleBox.returnSpan(ANSconsoleBox.displayFormattedJson(_TEXT_), "content_string_formater", "div"));

        const _content_table_formater_ = document.createElement("div");
        _content_table_formater_.className = "content_table_formater";
        if (ANSconsoleBox.DetectDataType(_TEXT_) == ANSconsoleBox.__VAR_DATETYPE_JSON_STRING__) {
          console.log("JSON_STRING");

          _content_table_formater_.appendChild(ANSconsoleBox.displayFormatTable(JSON.parse(_TEXT_)));
        } else {
          console.log("JSON");
          _content_table_formater_.appendChild(ANSconsoleBox.displayFormatTable(_TEXT_));
        }
        container_formater_json.appendChild(_content_table_formater_);

        // createTableFromJson(jsonData);
        _span_.appendChild(container_formater_json);
      } else {

        _span_.appendChild(ANSconsoleBox.returnSpan(_TEXT_));
      }



      return _span_;
    } else {
      return document.createTextNode(_TEXT_);
    }

  }
  public static Clear() {
    ANSconsoleBox._THIS_HTML_.remove();
  }
  /*public static html() {
          const _H1_ = document.createElement("h1")
          _H1_.innerHTML = '<h1 style="position:absolute;z-index:9999;left:0;top:0;color:red;font-size:38px">GUILLERMO MAURICIO ROCHA ORTIZ</h1>';//.appendChild(document.createTextNode("GUILLERMO MAURICIO ROCHA ORTIZ"))
          document?.querySelector("#TblContainerER").appendChild(_H1_)
      }*/
  public Group(_title_: string = "") {
    ANSconsoleBox.count_group++;
  }
  public GroupEnd(_title_: string = "") {
    ANSconsoleBox.count_group--;
  }
  public Log(_VALUE_: any) {
    ANSconsoleBox._THIS_HTML_?.querySelector('#allcontent').appendChild(ANSconsoleBox.returnText(_VALUE_, true, "log"));
  }

  public Warn(_VALUE_: any) {
    ANSconsoleBox._THIS_HTML_?.querySelector('#allcontent').appendChild(ANSconsoleBox.returnText(_VALUE_, true, "warning"));
  }

  public Info(_VALUE_: any) {
    ANSconsoleBox._THIS_HTML_?.querySelector('#allcontent').appendChild(ANSconsoleBox.returnText(_VALUE_, true, "information"));
  }

  public Error(_VALUE_: any) {
    ANSconsoleBox._THIS_HTML_?.querySelector('#allcontent').appendChild(ANSconsoleBox.returnText(_VALUE_, true, "error"));
  }
}