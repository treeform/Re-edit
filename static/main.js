var editPad = null;

var editors = {}

function resize() {
    var wh = $(window).height()-20;
    
    var totalw = 0;
    var totalw = $(".board").each(function(index) {
        totalw += 800 + 10;  
    });
    $("#workspace").width(totalw);
    $("#workspace").height(wh);
    
    $(".board").height(wh);
}


$(document).ready(function() {
    resize();
    
    $(".header").click(function() {
    
        var id = $(this).attr("id").slice(7);
        
        var cm = editors["text-"+id];
        
        var data = {
                "text": cm.getCode(),
                "id": id};
           jQuery.post("update.ajax", data, function(data){
               //editPad.html(data);
               //$(editPad).attr("contentEditable",true);
           });
    });
    
    //$(window).resize(resize());
    $(document).keypress(function(event) {
        if (event.keyCode == '13') {
           
        }
    });
    
    $(".text").each(function(index) {
    
        var lang = $(this).attr("lang");
        var parserfiles, stylesheets;

        if(lang == "python"){
            parserfiles = ["parse"+lang+".js"];
            stylesheets = "/static/codemirror/css/"+lang+"colors.css";
        } else  if(lang == "css"){
            parserfiles = ["parse"+lang+".js"];
            stylesheets = "/static/codemirror/css/"+lang+"colors.css";
        } else if(lang == "javascript"){
            parserfiles = ["tokenizejavascript.js", "parsejavascript.js"];
            stylesheets = "/static/codemirror/css/"+lang+"colors.css";
        } else if(lang == "htmlmixed"){
            parserfiles = ["parsexml.js", "parsecss.js", "tokenizejavascript.js", "parsejavascript.js", "parsehtmlmixed.js"];
            stylesheets = ["/static/codemirror/css/xmlcolors.css", "/static/codemirror/css/jscolors.css", "/static/codemirror/css/csscolors.css"];
        } else {
            parserfiles = ["parsedummy.js"];
            stylesheets = [];
        }
    
        var editor = CodeMirror.fromTextArea($(this).attr("id"), {
            parserfile: parserfiles,
            stylesheet: stylesheets,
            path: "/static/codemirror/js/",
            lineNumbers: true,
            textWrapping: false,
            indentUnit: 4,           
        });
        editors[$(this).attr("id")] = editor;
    });
    
    $.event.special.keystrokes.global.captureInputFields = true;
    $(document).bind('keystrokes', {
	// The key pattern you set your element to listen for
	    keys: ['i']				
    }, function(event){
	    // Throw a notification to the user what keys they successfully typed
	    alert('You typed : <em>' + event.keystrokes.stack_item.keys.join(', ') + '</em>');
     
    });

    $(document).bind('keystrokes', {keys: ['arrow right'], proceedToMainCallback: false}, 
    function(event){
	    alert(">")
    });
});
