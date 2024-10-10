"use strict";

import powerbi from "powerbi-visuals-api";
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
//import { index } from "d3";

/*export*/
type SubDataTypeComparativeValues = {
    label: string,
    value: number,
    percentage: number,
    index: number
}
/*export*/
/*type DataTypeComparative = {
    previous: SubDataTypeComparativeValues,
    current: SubDataTypeComparativeValues,
    next: SubDataTypeComparativeValues,
    scope: SubDataTypeComparativeValues,
}
*/
export interface VData {
    previous: SubDataTypeComparativeValues,
    current: SubDataTypeComparativeValues,
    next: SubDataTypeComparativeValues,
    scope: SubDataTypeComparativeValues,
}


function CalculatePercentage(A: number, B: number): number {

    return (A > 0 && B > 0) ? parseFloat(((100 - ((A * 100) / B)) / 100).toFixed(2)) : 0;

}
export function TransformData(options: VisualUpdateOptions): VData | null {

    try {
        const CurrentDataView = options.dataViews[0];

        /* TODO: calcular el orden de los valoes en base al rolesIndex */
        const _values_ = {
            previous: {
                label: "",
                value: 0,
                percentage: 0,
                index: null
            },
            current: {
                label: "",
                value: 0,
                percentage: 0,
                index: null
            },
            next: {
                label: "",
                value: 0,
                percentage: 0,
                index: null
            },
            scope: {
                label: "",
                value: 0,
                percentage: 0,
                index: null
            }
        };

        let existScope = false;
        //let indexValue = 0;
        //let _value_ = 0;
        //let _label_ = "";

        (CurrentDataView.table.columns).forEach((COLUMN: any, index: number) => {

            const indexValue = (COLUMN.index) as number;
            const _value_ = CurrentDataView.table.rows[0][indexValue] as number;
            const _label_ = COLUMN.displayName as string;

            if (COLUMN.roles.scope !== undefined) {
                console.log("entró SI ESCOPE ", index);

                existScope = true;
                _values_.scope.value = _value_;
                _values_.scope.label = _label_;
                _values_.scope.percentage = 0;
                _values_.previous.index = indexValue
            } else {



                console.log("entró NO ESCOPE ", index);

                //indexValue = (COLUMN.rolesIndex.values_to_compare[0]) as number;

                switch (COLUMN.rolesIndex.values_to_compare[0] as number) {
                    case 0:
                        _values_.previous.value = _value_;
                        _values_.previous.label = _label_;
                        _values_.previous.percentage = 0;
                        _values_.previous.index = indexValue
                        break;
                    case 1:
                        _values_.current.value = _value_;
                        _values_.current.label = _label_;
                        _values_.current.percentage = 0;
                        _values_.current.index = indexValue
                        break;
                    case 2:
                        _values_.next.value = _value_;
                        _values_.next.label = _label_;
                        _values_.next.percentage = 0;
                        _values_.next.index = indexValue
                        break;

                    default:
                        _values_.previous.value = _value_;
                        _values_.previous.label = _label_;
                        _values_.previous.percentage = 0;
                        _values_.previous.index = indexValue
                        break;
                }
            }

        });

        _values_.previous.percentage = CalculatePercentage(_values_.previous.value, _values_.current.value);
        _values_.next.percentage = CalculatePercentage(_values_.next.value, _values_.current.value);
        if (existScope) {
            _values_.current.percentage = CalculatePercentage(_values_.current.value, _values_.scope.value);
        }


        return _values_;

    } catch (error) {
        console.error("Error=======:", error.message);
        return null;
    }


    /*try {
        const dataView = options.dataViews[0];
        const singleDataView = dataView.single;
        return {
            value: singleDataView.value as number
        };

    } catch (error) {
        return null;
    }*/
}