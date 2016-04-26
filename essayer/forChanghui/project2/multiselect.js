/**
 * Created by yan on 16/4/26.
 */

/**
 * initialiser multi-select
 * @param board: JSXGraph.BOARD
 * @returns {{}}
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

    multiSelect.getMouseCoords = function(e) {
        var cPos = board.getCoordsTopLeftCorner(e),
            absPos = JXG.getPosition(e),
            dx = absPos[0] - cPos[0],
            dy = absPos[1] - cPos[1];

        return new JXG.Coords(JXG.COORDS_BY_SCREEN, [dx, dy], board);
    };

    var rectStart, rectEnd, rectCorner1, rectCorner2, rect;

    multiSelect.down = function(e) {
        if (!isSelectMode) return;
        var canCreate = true,
            coords = getMouseCoords(e),
            el;


        if (canCreate) {
            rectStart = board.create('point', [coords.usrCoords[1], coords.usrCoords[2]], rectPointStyle);

            rectEnd = board.create('point', [coords.usrCoords[1], coords.usrCoords[2]], rectPointStyle);

            rectCorner1 = board.create('point', [rectStart.X(), function() {
                return rectEnd.Y();}], rectPointStyle);
            rectCorner2 = board.create('point', [function() {
                return rectEnd.X();}, rectStart.Y()], rectPointStyle);

            rect = board.create('polygon', [rectStart, rectCorner1, rectEnd, rectCorner2], rectStyle);
            selecting = true;
        }
    };

    var selectedPts = [];

    var up = function(e) {
        var i = 0;
        if (selecting) {
            var minX, maxX, minY, maxY;
            if (rectStart.X() < rectEnd.X()) {
                minX = rectStart.X();
                maxX = rectEnd.X();
            }
            else {
                maxX = rectStart.X();
                minX = rectEnd.X();
            }
            if (rectStart.Y() < rectEnd.Y()) {
                minY = rectStart.Y();
                maxY = rectEnd.Y();
            }
            else {
                maxY = rectStart.Y();
                minY = rectEnd.Y();
            }
            for (i = 0; i < V.length; i++) {
                if (V[i].pt.X() >= minX && V[i].pt.X() <= maxX && V[i].pt.Y() >= minY && V[i].pt.Y() <= maxY) {
                    selectedPts.push(V[i]);
                }

            }


            for (i = 0; i < selectedPts.length; i++) {
                selectedPts[i].pt.setAttribute(selectedStyle);
                polyPoints.push(selectedPts[i].pt)

            }

            polygon = board.create('polygon', polyPoints);

            selecting = false;
            board.removeObject(rect);
            board.removeObject(rectCorner1);
            board.removeObject(rectCorner2);
            board.removeObject(rectStart);
            board.removeObject(rectEnd);
        }
    };

    var isSelectMode = true;
    var selecting = false;

    var V = board.objects;
    var E = [];
    var polyPoints = [], polygon;



    return multiSelect
};