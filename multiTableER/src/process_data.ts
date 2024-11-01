//import { json } from "d3";
import { CLS_ANSconsoleBox } from "./cls_consoleBox/consoleBox";
import { _structure_rows_columns_ } from "./custom_typedata";
export class CLS_ANS_JsonDB {
    private __JSON__: any;
    private static _max_iteraction_: _structure_rows_columns_;
    constructor() {
        this.__JSON__ = null;
        CLS_ANS_JsonDB._max_iteraction_ = {
            headers: 0,
            values: 0
        };
    }
    private static GetDataStructure(__JSON__: any) {
        if (__JSON__) {
            let __ERROR__: string = "";
            __ERROR__ += "ENTRÓ["
            const _new_structure_: any = __JSON__.map((_rows_) => {
                const _role_: string = Object.keys(_rows_.source.roles)[0];
                __ERROR__ += _rows_.source.displayName + "[" + _role_ + "],"
                return {
                    Title: _rows_.source.displayName,
                    Positions: Object.values(_rows_.source.rolesIndex[_role_][0]),
                    RowsValues: _rows_.values
                }
            })


            _new_structure_.sort((a: any, b: any) => a.Positions - b.Positions);
            __ERROR__ += JSON.stringify(_new_structure_);
            return _new_structure_.map((_rows_: any) => {
                return {
                    Title: _rows_.Title,
                    RowsValues: _rows_.RowsValues
                }
            })

            // return __ERROR__;

        } else {
            return "null";
        }

    }

    private static ReturnCells(__VALUE__) {

    }
    private static ReturnRow(__DATAVALUE__) {

    }
    private static RecursiveData(__JSON__: any = null, nivel: number = 0) {
        if (__JSON__) {
            if (nivel < CLS_ANS_JsonDB._max_iteraction_.rows || nivel == null) {
                CLS_ANS_JsonDB.RecursiveData(__JSON__, __JSON__.length - 1);
            } else {
                return
            }
        }
    }
    /*private static JoinRegisters(__JSON__) {
        const length = __JSON__[0].length;
        if (__JSON__.every(arr => arr.length === length)) {
            const concatenatedArray = Array.from({ length }, (_, index) =>
                __JSON__.map(arr => arr[index]).join("|")
            );

            return concatenatedArray
            //console.log(concatenatedArray);
            // Resultado: ["Alice Engineer USA", "Bob Designer Canada", "Charlie Manager UK"]
        } else {
            return null
        }
    }*/
    public static ReturnJSON(__JSON__: any) {





        const _JSON_estructure: any = {
            Rows: CLS_ANS_JsonDB.GetDataStructure(__JSON__.categories),
            Columns: CLS_ANS_JsonDB.GetDataStructure(__JSON__.values)
        }



        CLS_ANS_JsonDB._max_iteraction_ = {
            headers: (_JSON_estructure.Rows).length,
            values: (_JSON_estructure.Columns).length
        };
        return CLS_ANS_JsonDB.RecursiveData(_JSON_estructure.Rows);
    }
}