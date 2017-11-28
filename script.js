var insertClass = document.getElementById('_chatSendToolbar');
var div = document.createElement('span');
div.classList.add("chatInput__submit");
div.classList.add("_cwBN button");
div.textContent = 'ありがとう';
document.body.insertBefore(div, insertClass.firstChild);

// divタグを作成して変数に代入する
var thanksbutton = document.createElement("div");
thanksbutton.setAttribute("class", "chatInput__submit _cwBN button");
thanksbutton.setAttribute("id", "_thanks-send");
thanksbutton.setAttribute("role","button");
thanksbutton.innerHTML = "Thanks!";
document.body.insertBefore(thanksbutton, insertClass.firstChild);

thanksbutton.onclick = function() { alert("I was clicked!"); };
thanksbutton.onclick();
//var thanksbutton = '<div id="_thanks-send" class="chatInput__submit _cwBN button" role="button" tabindex="2" aria-disabled="false">ありがとう</div>';

