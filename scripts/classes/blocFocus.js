BlocFocus = function(){
    this.proto = "BlocFocus"
    this.container;
    this.content;
    this.width;
    this.height;

    this.headerHeight = 20;
}

BlocFocus.prototype.proto = "BlocFocus";
BlocFocus.prototype.initBloc = function(){
    var self = this;
    this.container = $("<div></div>")
	.css({"width":$(document).width() - 20, 
	      "height":$(document).height() - 20, 
	      "background-color":"#ffffff", 
	      "position":"absolute", 
	      "top":"10px", 
	      "left":"10px", 
	      "border-radius":"20px"})
	.appendTo($(document.body));
    
    var $quit = $("<div></div>")
	.css({
	    "background-image":"url(images/cross.png)",
	    "background-size":this.headerHeight + "px " + this.headerHeight + "px",
	    "width": this.headerHeight + "px",
	    "height": this.headerHeight + "px",
	    "position":"absolute",
	    "top": "5px",
	    "right":"5px"})
	.appendTo(this.container);
    
    $($quit).hover(
	function(){
	    $quit.css({"background-image":"url(images/cross_active.png)"})
	},
	function(){
	    $($quit).css({"background-image":"url(images/cross.png"});
	});
    
    $($quit).click(
	function(){
	    self.hide();
	});

    this.content = $("<div></div>")
	.css({
	    "width":"100%", 
	    "height":this.container.height() - this.headerHeight,
	    "position":"absolute",
	    "top":this.headerHeight+"px"})
	.appendTo(this.container);
    $().resize(function(){
	self.updateContainer();
    });
}

BlocFocus.prototype.createBloc = function(content){
    this.initBloc();
    if (content !== undefined){
	/*this.content = content;*/
	content.appendTo(this.content);
    }
}

BlocFocus.prototype.setContent = function(newContent){
    if (newContent !== undefined){
	this.content = newContent
	this.updateContainer();
    }else{
	console.error("Le bloc fournie n'est pas définie");
    }
}

BlocFocus.prototype.updateContainer = function(){
    this.container.empty();
    if (this.content !== undefined){
	this.container.appendChild(this.content);
	this.container.css("width", $(document).width() - 20);
	this.container.css("height",$(document).height() - 20);
    }else{
	console.error("Erreur, il n'y à pas de contenu à afficher.");
    }
}

BlocFocus.prototype.show = function(){
    this.container.fadeIn(150);
}

BlocFocus.prototype.hide = function(){
    this.container.fadeOut(150);
}


$(document).ready(function(){
});
