import { ANSconsoleBox } from "./cls_consoleBox/consoleBox";

export type CLS_GeneratorHTML_structure_columns = {
    role: string,
    indexPosition: number,
    colPosition: number,
    title: string,
    name_id: string,
    indexValue: number
}

/*

{
  "role": "headers_rows",
  "indexPosition": 0,
  "colPosition": 0,
  "title": "ALUMNO",
  "name_id": "nom_cli",
  "indexValue": 2
}
*/

class CLS_GeneratorHTML {

    public CreateTable(id: string = ""): HTMLElement {
        const _table_ = document.createElement("table");
        _table_.id = id;
        return _table_;
    }
    private return_cell(inner_content: string = "", _the_class_: string = null, _fixed_: boolean = false) {
        const cell_resizable = document.createElement("div");
        cell_resizable.className = "cell resizable " + _the_class_ + (_fixed_ ? " fixed-width " : "");
        const cell_value = document.createElement("div");
        cell_value.className = (_fixed_ ? "title" : "count");
        cell_value.appendChild(document.createTextNode(inner_content));

        return cell_resizable.appendChild(cell_value);
    }

    private returnRowTR(_CELL_HTML_: any): HTMLElement {
        const _tr_ = document.createElement("tr");
        const _th_ = document.createElement("th");
        const _div_table_first_column = document.createElement("div");
        _div_table_first_column.className = "table";
        const _header_row_ = document.createElement("div");
        _header_row_.className = "header_row row";

        _header_row_.appendChild(_CELL_HTML_);

        _div_table_first_column.appendChild(_header_row_);
        _th_.appendChild(_div_table_first_column)
        _tr_.appendChild(_th_);

        return _tr_;
    }
    public CreateTableBody(_datas_: any = null) {


        const _tbody_ = document.createElement("tbody");


        if (_datas_) {



            (_datas_.ValuesRows).forEach((_rows_: any, index: number) => {

                ANSconsoleBox.Log(JSON.stringify(_rows_));

                _tbody_.appendChild(this.returnRowTR(this.return_cell(_rows_[0].value, "", (index === 0 ? true : false))))
            })
            //return_cell

        }
        return _tbody_;
        /*
        <div class="table">
            <div class="header_row row">
                <div class="cell resizable fixed-width column-header">
                    <div class="title">Dtrinidad Maria alejandra</div>
                </div>
                <div class="cell resizable flex-width column-error">
                    <div class="count">3</div>
                </div>
            </div>
        </div>
                             */
    }

    public CreateTableHead(_datas_: any, show_allColumns_headers: boolean = false/*, WidthsJson: any = null*/) {

        const _thead_ = document.createElement("thead");
        const _tr_ = document.createElement("tr");
        const _th_ = document.createElement("th");
        const _div_table_ = document.createElement("div");
        _div_table_.className = "table border_bottom";
        const _div_row_ = document.createElement("div");
        _div_row_.className = "row";

        //ANSconsoleBox.Log(JSON.stringify(_datas_.HeadersColumns));

        (_datas_.HeadersColumns).forEach((_columns_: CLS_GeneratorHTML_structure_columns, index: number) => {
            if (!show_allColumns_headers) {
                if (index == 0) {
                    const _div_content_ = document.createElement("div");
                    _div_content_.className = "cell resizable top fixed-width " + _columns_.name_id;
                    _div_content_.setAttribute("data-columnid", _columns_.name_id);
                    _div_content_.style.width = "180px";
                    _div_content_.appendChild(document.createTextNode(_columns_.title));
                    _div_row_.appendChild(_div_content_);
                }
            } else {
                const _div_content_ = document.createElement("div");
                if (index == 0) {
                    _div_content_.className = "cell resizable top fixed-width " + _columns_.name_id;
                    _div_content_.setAttribute("data-columnid", _columns_.name_id);
                } else {
                    _div_content_.className = "cell resizable top  flex-width";
                    _div_content_.setAttribute("data-columnid", _columns_.name_id);
                }
                _div_content_.style.width = "180px";
                _div_content_.appendChild(document.createTextNode(_columns_.title));

                _div_row_.appendChild(_div_content_);

            }

        });
        (_datas_.ValuesColumn).forEach((_columns_: CLS_GeneratorHTML_structure_columns) => {

            const _div_content_ = document.createElement("div");

            _div_content_.className = "cell resizable top  flex-width " + _columns_.name_id;
            _div_content_.setAttribute("data-columnid", _columns_.name_id);
            _div_content_.style.width = "180px";
            _div_content_.appendChild(document.createTextNode(_columns_.title));
            _div_row_.appendChild(_div_content_);



        });

        _div_table_.appendChild(_div_row_);
        _th_.append(_div_table_);
        _tr_.append(_th_);
        _thead_.append(_tr_);
        return _thead_;

    }



}
export const Visual_GeneratorHTML = new CLS_GeneratorHTML();

//export const ANSconsoleBox = new CLS_ANSconsoleBox();