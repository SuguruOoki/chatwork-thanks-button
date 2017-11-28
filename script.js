var insertClass = document.getElementById('_sendButton');
// divタグを作成して変数に代入する
var thanksbutton = document.createElement("span");
thanksbutton.className = "chatInput__submit _cwBN button" ;
thanksbutton.setAttribute("id", "_thanks-send");
thanksbutton.setAttribute("role","button");
thanksbutton.innerHTML = "ありがとう!";
insertClass.parentNode.insertBefore(thanksbutton, insertClass.parentNode.firstChild); //親クラス 入れる要素 基準となるタグ

thanksbutton.onclick = function() {
    var sendText = document.getElementById('_chatText').value;
    alert(sendText);
 };
