///
/// Directives
/// -------------------------------------------------------------------------------------------------------------------
/// <reference path="../../scripts/_references.ts" />
angular.module('pwfApp.directives', []).directive('appVersion', [
    'version', function (version) {
        return function (scope, elm, attrs) {
            elm.text(version);
        };
    }]).directive("drawing", function ($window) {
    return {
        restrict: "E",
        replace: 'true',
        template: '<canvas></canvas>',
        link: function (scope, element) {
            // resize the canvas element to fill the parent container
            resize(element);

            // get reference to the canvas element and drawing context
            var canvas = element[0];
            var ctx = canvas.getContext('2d');
            var strokeStyle = "#4bf";

            // variable that decides if something should be drawn on mousemove
            var drawing = false;

            // the last coordinates before the current move
            var lastX;
            var lastY;

            scope.segments = [];
            scope.segmentHistory = [];

            // this function will draw each segment that comes from that argument
            scope.drawSegments = function (segments) {
                for (var i = 0; i < segments.length; i++) {
                    var segment = segments[i];

                    if (segment) {
                        ctx.lineWidth = "1.0";
                        ctx.beginPath();
                        ctx.moveTo((segment.xFrom / 1000) * canvas.width, (segment.yFrom / 1000) * canvas.height);
                        ctx.lineTo((segment.xTo / 1000) * canvas.width, (segment.yTo / 1000) * canvas.height);
                        ctx.strokeStyle = strokeStyle;
                        ctx.stroke();
                    }
                }
            };

            element.bind('mousedown', function (event) {
                var position = getCoords(event, canvas);
                lastX = position.x;
                lastY = position.y;

                // begins new line
                ctx.beginPath();

                drawing = true;
            });

            element.bind('mousemove', function (event) {
                var currentX;
                var currentY;

                if (drawing) {
                    // get current mouse position
                    var position = getCoords(event, canvas);
                    currentX = position.x;
                    currentY = position.y;

                    draw(lastX, lastY, currentX, currentY);

                    // set current coordinates to last one
                    lastX = currentX;
                    lastY = currentY;
                }
            });

            element.bind('mouseup', function (event) {
                // stop drawing
                drawing = false;
            });

            // window resize causes canvas to resize if necessary
            angular.element($window).bind('resize', function () {
                resize(element);
                scope.drawSegments(scope.segmentHistory);
            });

            // canvas reset
            function reset() {
                element[0].width = element[0].width;
            }

            function addSegment(xFrom, yFrom, xTo, yTo) {
                var segment = {
                    xFrom: ((xFrom / canvas.width) * 1000 | 0),
                    yFrom: ((yFrom / canvas.height) * 1000 | 0),
                    xTo: ((xTo / canvas.width) * 1000 | 0),
                    yTo: ((yTo / canvas.height) * 1000 | 0)
                };

                scope.segments.push(segment);
                scope.segmentHistory.push(segment);
            }

            function draw(lX, lY, cX, cY) {
                // line from
                ctx.moveTo(lX, lY);

                // to
                ctx.lineTo(cX, cY);

                // color
                ctx.strokeStyle = strokeStyle;

                // draw it
                ctx.stroke();

                // add the segment to the array
                addSegment(lX, lY, cX, cY);
            }

            // Get the coordinates crossbrowser for a mouse or touch event
            function getCoords(e, canvas) {
                if (e.offsetX) {
                    // Works in Chrome / Safari (except on iPad/iPhone)
                    return { x: e.offsetX, y: e.offsetY };
                } else if (e.layerX) {
                    // Works in Firefox
                    return { x: e.layerX, y: e.layerY };
                } else {
                    // Works in Safari on iPad/iPhone
                    var pos = findPos(canvas);
                    return { x: e.pageX - pos.left, y: e.pageY - pos.top };
                }
            }

            function findPos(elem) {
                var curleft = 0;
                var curtop = 0;

                if (elem.offsetParent) {
                    do {
                        curleft += elem.offsetLeft;
                        curtop += elem.offsetTop;
                    } while(elem = elem.offsetParent);

                    return { left: curleft, top: curtop };
                }
            }

            function resize(elem) {
                var canvas = elem[0];
                var parentDiv = elem.parent()[0];
                canvas.width = parentDiv.clientWidth;
                canvas.height = parentDiv.clientHeight;
            }
        }
    };
});
//# sourceMappingURL=directives.js.map