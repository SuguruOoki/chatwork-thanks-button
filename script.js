var insertClass = document.getElementsByClassName('chatInput__submitContainer');
var thanksbutton = '<div id="_thanks-send" class="chatInput__submit _cwBN button" role="button" tabindex="2" aria-disabled="false">Thanks!</div>';

// divタグを作成して変数に代入する
var thanksbutton = document.createElement("div");
thanksbutton.setAttribute("class", "chatInput__submit _cwBN button");
thanksbutton.setAttribute("id", "_thanks-send");
thanksbutton.setAttribute("role","button");
thanksbutton.innerHTML = "Thanks!";
document.body.insertBefore(thanksbutton, insertClass.firstChild);

//var thanks_object = document.getElementById('_thanks-send');
thanksbutton.onclick = function() { alert("I was clicked!"); };
thanksbutton.onclick();

