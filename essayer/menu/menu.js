/**
 * Created by yan on 16/3/8.
 */

$(document).ready(function () {
    $("<div></div>").css({
        width: 200,
        height: 100,
        border: "1px solid black"
    })
        .attr("id", "changhui")
        .html("Right Click Me")
        .appendTo($("body"));

    $.contextMenu({
        selector: '#changhui',
        callback: function(key, options) {
            var m = "clicked: " + key;
            window.console && console.log(m) || alert(m);
        },
        items: {
            "edit": {name: "Edit", icon: "edit", accesskey: "e"},
            "cut": {name: "Cut", icon: "cut", accesskey: "c"},
            // first unused character is taken (here: o)
            "copy": {name: "Copy", icon: "copy", accesskey: "c o p y"},
            // words are truncated to their first letter (here: p)
            "paste": {name: "Paste", icon: "paste", accesskey: "cool paste"},
            "delete": {name: "Delete", icon: "delete"},
            "sep1": "---------",
            "quit": {name: "Quit", icon: function($element, key, item){ return 'context-menu-icon context-menu-icon-quit'; }}
        }
    });

});