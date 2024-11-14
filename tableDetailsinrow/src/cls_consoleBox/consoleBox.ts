import "./style/ans_console_box.less";
// Inicialmente habilitamos los logs
export class CLS_ANSconsoleBox {
    private static _THE_INNERHTML_: HTMLElement;
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

        CLS_ANSconsoleBox.count_group = 0;
        CLS_ANSconsoleBox.InitBOX();

    }
    private static debug(_VALUE_: any = "") {
        console.group('***********DEBUGER ANS [BEGIN]***********');
        console.log(_VALUE_);
        console.groupEnd();
        console.log('***********DEBUGER ANS [END]***********');
    }

    public returnDetectDataType(__VARIABLE__: any = null) {
        switch (CLS_ANSconsoleBox.DetectDataType(__VARIABLE__)) {

            case CLS_ANSconsoleBox.__VAR_DATETYPE_UNDEFINED__: return "UNDEFINED"; break;
            case CLS_ANSconsoleBox.__VAR_DATETYPE_JSON__: return "JSON"; break;
            case CLS_ANSconsoleBox.__VAR_DATETYPE_JSON_STRING__: return "JSON_STRING"; break;
            case CLS_ANSconsoleBox.__VAR_DATETYPE_ARRAY__: return "ARRAY"; break;
            case CLS_ANSconsoleBox.__VAR_DATETYPE_STRING__: return "STRING"; break;
            case CLS_ANSconsoleBox.__VAR_DATETYPE_NUMBER__: return "NUMBER"; break;
            case CLS_ANSconsoleBox.__VAR_DATETYPE_BOOLEAN__: return "BOOLEAN"; break;
            case CLS_ANSconsoleBox.__VAR_DATETYPE_STRING_BOOLEAN__: return "STRING_BOOLEAN"; break;


        }

    }
    private static DetectDataType(__VARIABLE__: any = null) {
        if (typeof __VARIABLE__ === 'object' && __VARIABLE__ !== null && !Array.isArray(__VARIABLE__)) {
            return CLS_ANSconsoleBox.__VAR_DATETYPE_JSON__;
        } else if (Array.isArray(__VARIABLE__)) {
            return CLS_ANSconsoleBox.__VAR_DATETYPE_ARRAY__;
        } else if (typeof __VARIABLE__ === 'string') {
            try {
                JSON.parse(__VARIABLE__);
                return CLS_ANSconsoleBox.__VAR_DATETYPE_JSON_STRING__;
            } catch (e) {

                if (__VARIABLE__.toLocaleLowerCase() === 'true' || __VARIABLE__.toLocaleLowerCase() === 'false' || __VARIABLE__.toLocaleLowerCase() === 'yes' || __VARIABLE__.toLocaleLowerCase() === 'no' || __VARIABLE__.toLocaleLowerCase() === 'si') {
                    return CLS_ANSconsoleBox.__VAR_DATETYPE_STRING_BOOLEAN__;
                } else {
                    return CLS_ANSconsoleBox.__VAR_DATETYPE_STRING__;
                }

            }
        } else if (typeof __VARIABLE__ === 'number') {
            return CLS_ANSconsoleBox.__VAR_DATETYPE_NUMBER__;
        } else if (typeof __VARIABLE__ === 'boolean') {
            return CLS_ANSconsoleBox.__VAR_DATETYPE_BOOLEAN__;
        } else {
            return CLS_ANSconsoleBox.__VAR_DATETYPE_UNDEFINED__;

        }
    }
    public static InitBOX() {
        CLS_ANSconsoleBox._THE_INNERHTML_ = document.createElement("div");
        CLS_ANSconsoleBox._THE_INNERHTML_.id = "ans_innerhtml_bug";
        if (!document?.querySelector("#ANSlogbox")) {


            const contentBOX = document.createElement("div");
            contentBOX.id = "ANSlogbox";
            contentBOX.className = "log";
            const _show_hidden_ = document.createElement("div");
            _show_hidden_.id = "show_hidden"

            const _maximize_ = document.createElement("div");
            _maximize_.id = "maximize_icon"

            _show_hidden_.addEventListener("click", function (event) {

                const padre = (event.currentTarget as HTMLElement).parentNode;

                // Verificar que padre no sea null y sea un HTMLElement
                if (padre && padre instanceof HTMLElement) {
                    // Alternar la clase 'open'
                    padre.classList.toggle('open');
                    if (!(Array.from(padre.classList)).includes("open")) {
                        padre.classList.remove('maximize');
                        padre.style.cssText = '';
                    }

                }

            });

            _maximize_.addEventListener("click", function (event) {

                const div_sandbox_host = document.getElementById("sandbox-host") as HTMLElement;
                const padre = (event.currentTarget as HTMLElement).parentNode as HTMLElement;
                if (padre && padre instanceof HTMLElement) {
                    // Alternar la clase 'open'
                    padre.classList.toggle('maximize');

                }
                if (div_sandbox_host) {
                    const ancho = div_sandbox_host.clientWidth;
                    const alto = div_sandbox_host.clientHeight;

                    //const popupAncho = ancho - 30;
                    // const popupAlto = alto - 30;
                    if ((Array.from(padre.classList)).includes("maximize")) {
                        padre.style.width = (ancho - 30) + "px";
                        padre.style.height = (alto - 30) + "px";
                        /* padre.style.top = ((alto / 2) - (popupAlto / 2)) + "px";
                         padre.style.left = ((ancho / 2) - (popupAncho / 2)) + "px";*/
                    } else {
                        padre.style.cssText = '';
                    }
                }


                // Verificar que padre no sea null y sea un HTMLElement


            });


            const _ANS_console_content_: HTMLElement = document.createElement("div");
            _ANS_console_content_.className = "container-message";
            _ANS_console_content_.id = "ANS_console_content";
            _ANS_console_content_.appendChild(document.createTextNode(""));

            contentBOX.appendChild(_maximize_);
            contentBOX.appendChild(_show_hidden_);

            const _ANS_console_content_padding: HTMLElement = document.createElement("div");
            _ANS_console_content_padding.className = "container-padding";
            _ANS_console_content_padding.appendChild(_ANS_console_content_);
            contentBOX.appendChild(_ANS_console_content_padding);


            if (document) {
                document.body.appendChild(contentBOX);
            }
        }







    }
    private static GetDOM() {
        return CLS_ANSconsoleBox._THE_INNERHTML_.children;

    }

    private static PrintDom(_HTML_ELEMENT_) {
        if (document && document?.querySelector("#ANSlogbox")) {

            const _HTML_BOX_ = document?.querySelector("#ANS_console_content");
            if (_HTML_BOX_) {
                _HTML_BOX_.appendChild(_HTML_ELEMENT_);
            }
            //while (_HTML_BOX_.firstChild) {
            // _HTML_BOX_.removeChild(_HTML_BOX_.firstChild);
            // }

            // document?.querySelector("#ANS_console_content").appendChild(CLS_ANSconsoleBox.GetDOM());



        }
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
        Label.appendChild(DIVLeft.appendChild(CLS_ANSconsoleBox.returnSpan(str_left, null, "div")));
        Label.appendChild(DIVLeft.appendChild(CLS_ANSconsoleBox.returnSpan(str_right, null, "div")));
        _div_content_toogle_.appendChild(Label);




        _div_content_toogle_.addEventListener("click", (event: MouseEvent) => {

            const padreSpan = (event.currentTarget as HTMLElement).parentNode as HTMLElement;

            const valueCheckbok = padreSpan.querySelector('.toggleCheckbox') as HTMLInputElement

            // const checkbox = document.getElementById('myCheckbox') as HTMLInputElement;

            if (valueCheckbok.checked) {
                padreSpan.className = "open";
            } else {
                padreSpan.className = "close";
            }


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

        _table_.className = "table";

        const _table_row_: HTMLElement = document.createElement("tr");


        Object.keys(jsonData).forEach(key => {
            const _table_data_: HTMLElement = document.createElement("td");
            const _span_value_: HTMLElement = document.createElement("span");
            _span_value_.className = "value";

            const _span_key_: HTMLElement = document.createElement("span");
            _span_key_.className = "key";

            _span_key_.appendChild(document.createTextNode(key))
            _table_data_.appendChild(_span_key_);
            if (typeof jsonData[key] === 'object' && jsonData[key] !== null && !Array.isArray(jsonData[key])) {
                _table_data_.appendChild(CLS_ANSconsoleBox.displayFormatTable(jsonData[key]));
            } else {
                _span_value_.appendChild(document.createTextNode(jsonData[key]));
                _table_data_.appendChild(_span_value_);


            }
            _table_row_.appendChild(_table_data_);
        });
        _table_.appendChild(_table_row_);
        return _table_;
    }

    private static returnText(_VALUE_: any, print_span: boolean = false, _class_: string = "") {

        if (print_span) {
            const _span_ = document.createElement("div");
            _span_.className = "span " + _class_ + " " + ((CLS_ANSconsoleBox.count_group == 0) ? "full-display" : "");

            for (let _index_ = 0; _index_ < CLS_ANSconsoleBox.count_group; _index_++) {
                _span_.appendChild(CLS_ANSconsoleBox.returnSpan(" "));
            }




            if (CLS_ANSconsoleBox.DetectDataType(_VALUE_) == CLS_ANSconsoleBox.__VAR_DATETYPE_JSON__ || CLS_ANSconsoleBox.DetectDataType(_VALUE_) == CLS_ANSconsoleBox.__VAR_DATETYPE_JSON_STRING__) {
                _span_.className = _span_.className + " formatjson";
                const container_formater_json: HTMLElement = document.createElement("span");
                container_formater_json.appendChild(CLS_ANSconsoleBox.returnSetectFormat("TABLE", "JSON"));

                container_formater_json.appendChild(CLS_ANSconsoleBox.returnSpan(CLS_ANSconsoleBox.displayFormattedJson(_VALUE_), "content_string_formater", "div"));

                const _content_table_formater_ = document.createElement("div");
                _content_table_formater_.className = "content_table_formater";
                if (CLS_ANSconsoleBox.DetectDataType(_VALUE_) == CLS_ANSconsoleBox.__VAR_DATETYPE_JSON_STRING__) {
                    _content_table_formater_.appendChild(CLS_ANSconsoleBox.displayFormatTable(JSON.parse(_VALUE_)));
                } else {
                    _content_table_formater_.appendChild(CLS_ANSconsoleBox.displayFormatTable(_VALUE_));
                }
                container_formater_json.appendChild(_content_table_formater_);

                // createTableFromJson(jsonData);
                _span_.appendChild(container_formater_json);
            } else {

                _span_.appendChild(CLS_ANSconsoleBox.returnSpan(_VALUE_));
            }



            return _span_;
        } else {
            return document.createTextNode(_VALUE_);
        }

    }
    public Clear() {
        // CLS_ANSconsoleBox._THE_INNERHTML_?.querySelector('#ANS_console_content').remove()

        if (document && document?.querySelector("#ANSlogbox")) {

            const _HTML_BOX_ = document?.querySelector("#ANS_console_content");
            if (_HTML_BOX_) {
                while (_HTML_BOX_.firstChild) {
                    _HTML_BOX_.removeChild(_HTML_BOX_.firstChild);
                }
            }

        }
    }

    public Group(_title_: string = "") {
        const new_h1: HTMLElement = document.createElement("H1");
        if (_title_ !== "" && CLS_ANSconsoleBox.DetectDataType(_title_) === CLS_ANSconsoleBox.__VAR_DATETYPE_STRING__) {
            new_h1.appendChild(document.createTextNode(_title_));
            //console.log(_title_)
        } else {
            new_h1.appendChild(document.createTextNode("EL TÍTULO DEBE SER UNA CADENA NO UN OBJETO"));
        }
        CLS_ANSconsoleBox.PrintDom(new_h1);
        CLS_ANSconsoleBox.count_group++;
    }
    public GroupEnd() {
        CLS_ANSconsoleBox.count_group--;
    }
    public Log(_VALUE_: any) {
        //  CLS_ANSconsoleBox._THE_INNERHTML_?.querySelector('#ANS_console_content').appendChild(CLS_ANSconsoleBox.returnText(_VALUE_, true, "log"));
        CLS_ANSconsoleBox.PrintDom(CLS_ANSconsoleBox.returnText(_VALUE_, true, "log"));

    }

    public Warn(_VALUE_: any) {
        //CLS_ANSconsoleBox._THE_INNERHTML_?.querySelector('#ANS_console_content').appendChild(CLS_ANSconsoleBox.returnText(_VALUE_, true, "warning"));
        CLS_ANSconsoleBox.PrintDom(CLS_ANSconsoleBox.returnText(_VALUE_, true, "warning"));
    }

    public Info(_VALUE_: any) {
        //  CLS_ANSconsoleBox._THE_INNERHTML_?.querySelector('#ANS_console_content').appendChild();
        CLS_ANSconsoleBox.PrintDom(CLS_ANSconsoleBox.returnText(_VALUE_, true, "information"));
    }

    public Error(_VALUE_: any) {
        //CLS_ANSconsoleBox._THE_INNERHTML_?.querySelector('#ANS_console_content').appendChild(CLS_ANSconsoleBox.returnText(_VALUE_, true, "error"));
        CLS_ANSconsoleBox.PrintDom(CLS_ANSconsoleBox.returnText(_VALUE_, true, "error"));
    }
}
export const ANSconsoleBox = new CLS_ANSconsoleBox();