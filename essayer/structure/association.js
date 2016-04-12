/**
 * Created by yan on 16/4/12.
 */



var initStructure = function (board) {
    var structure = {};
    structure.association = function (node, children) {
        if(!children){
            for(var i = 0; i < structure.nodes.length; i++){
                if(structure.nodes[i].node == node){
                    return structure.nodes[i]
                }
            }
            return null
        }
        for(var j = 0; j < structure.nodes.length; j++){
            if(structure.nodes[j].node == node){
                structure.nodes[j].children = children;
                return true
            }
        }
        structure.nodes[j] = {
            node: node,
            children: children
        }
    };
    structure.objects = board.objects;
    structure.nodes = (function () {
        var nodes = [];
        for(var i = 0; i < structure.objects.length; i++){
            nodes.push({
                node: structure.objects[i],
                children: []
            })
        }
        return nodes
    });
    return structure
};
