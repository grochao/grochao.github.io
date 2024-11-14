import * as CryptoJS from "crypto-js";
type CLS_resetData_structure_columns = {
    role: string,
    indexPosition: number,
    title: string,
    name_id: string
}
type CLS_resetData_return = {
    HeadersColumns: CLS_resetData_structure_columns,
    ValuesColumn: CLS_resetData_structure_columns,
    ValuesRows: any
}
class CLS_resetData {

    public ReturnDataJson(_data_: any): CLS_resetData_return {

        const __HeadersColumns__ = (_data_.columns).filter((_filter_colum_: any) => Object.keys(_filter_colum_.roles)[0] === "headers_rows").map((_column_: any) => {
            return {
                role: Object.keys(_column_.roles)[0],
                indexPosition: _column_.rolesIndex[Object.keys(_column_.roles)[0]][0],
                colPosition: _column_.rolesIndex[Object.keys(_column_.roles)[0]][0],
                title: _column_.displayName,
                name_id: (_column_.expr.ref).toLowerCase(),
                indexValue: _column_.index
                /*rows: (_data_.rows).map((col: any) => {
                    return {
                        value: col[_column_.index]
                    }
                })*/
            }
        });
        const __ValuesColumn__ = (_data_.columns).filter((_filter_colum_: any) => Object.keys(_filter_colum_.roles)[0] === "columns_value").map((_column_: any) => {
            return {
                role: Object.keys(_column_.roles)[0],
                indexPosition: _column_.rolesIndex[Object.keys(_column_.roles)[0]][0],
                colPosition: __HeadersColumns__.length + Number(_column_.rolesIndex[Object.keys(_column_.roles)[0]][0]),
                title: _column_.displayName,
                name_id: ("ref" in _column_.expr) ? (_column_.expr.ref).toLowerCase() : ("arg" in _column_.expr) ? (_column_.expr.arg.ref).toLowerCase() : "",
                indexValue: _column_.index
            }
        });
        const __HeadersColumns_order__ = __HeadersColumns__.sort((a: CLS_resetData_structure_columns, b: CLS_resetData_structure_columns) => a.indexPosition - b.indexPosition)
        const __ValuesColumn_order__ = __ValuesColumn__.sort((a: CLS_resetData_structure_columns, b: CLS_resetData_structure_columns) => a.indexPosition - b.indexPosition)
        /*let _data_sort_ = this.sort_data(
        (__HeadersColumns_order__).concat(__ValuesColumn_order__),
        _data_.rows);*/

        const _data_sort_ =
            this.sort_data((__HeadersColumns_order__).concat(__ValuesColumn_order__).sort((a: any, b: any) => a.indexValue - b.indexValue), _data_.rows);
        return {

            HeadersColumns: __HeadersColumns_order__,
            ValuesColumn: __ValuesColumn_order__,
            ValuesRows: _data_sort_

        }
    }
    private sort_data(_columns_: any, _rows_: any) {
        const _the_columns_ = _columns_;
        //.sort((a: any, b: any) => a.indexValue - b.indexValue)


        const _the_rows_ = _rows_.map((_cell_: any) => {
            return (((_cell_.map((_current_cell_: any, _pos_: number) => {
                return {
                    id: (_the_columns_[_pos_].colPosition) === 0 ? CryptoJS.MD5(_current_cell_).toString() : null,
                    pos: _the_columns_[_pos_].colPosition,
                    value: _current_cell_,
                    role: _the_columns_[_pos_].role,
                    title: _the_columns_[_pos_].title
                }
            })).sort((a: any, b: any) => a.pos - b.pos)).map((_cell_: any) => {
                return {
                    id: _cell_.id,
                    value: _cell_.value,
                    role: _cell_.role,
                    title: _cell_.title
                }
            }))

        });
        /*const column = _columns_.map((_col_: any, i: number) => {
            return {
                rowpos: i,
                value: _col_.index
            }
        });
        column.*/
        return _the_rows_;
    }
}
export const Visual_CLS_resetData = new CLS_resetData();