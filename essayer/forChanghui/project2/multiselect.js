/**
 * Created by yan on 16/4/26.
 */

/**
 * initialiser multi-select
 * @param board: JSXGraph.BOARD
 * @returns multi-select
 */
var multiSelect = function (board) {
    var multiSelect = {};
    multiSelect.style = {};
    (function (style) {
        style.point = {
            fillColor: 'red',
            strokeColor: 'red'
        };
        style.selected = {
            fillColor: 'green',
            strokeColor: 'green'
        };
        style.highlighted = {
            fillColor: 'yellow',
            strokeColor: 'black'
        };
        style.rectPoint = {
            face: 'o',
            size: 2,
            strokeColor: 'green',
            fillColor: 'green',
            fillOpacity: 0.3,
            strokeOpacity: 0.3
        };
        style.rect = {
            strokeWidth: 1,
            borders: {strokeColor: 'green'},
            strokeOpacity: .3,
            fillOpacity: 0.05
        }
    })(multiSelect.style);


    return multiSelect
};