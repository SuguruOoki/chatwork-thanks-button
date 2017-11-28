var insertClass = document.getElementById('_sendButton');
var thanksbutton = document.createElement("span");
thanksbutton.className = "chatInput__submit _cwBN button" ;
thanksbutton.setAttribute("id", "_thanks-send");
thanksbutton.setAttribute("role","button");
thanksbutton.innerHTML = "ありがとう!";
insertClass.parentNode.insertBefore(thanksbutton, insertClass.parentNode.firstChild);

/**
 * データをPOSTする
 * @param String アクション
 * @param Object POSTデータ連想配列
 */
function execPost(action, data) {
 var form = document.createElement("form");
 form.setAttribute("action", action);
 form.setAttribute("method", "post");
 form.style.display = "none";
 document.body.appendChild(form);
 // パラメタの設定
 if (data !== undefined) {
  for (var paramName in data) {
   var input = document.createElement('input');
   input.setAttribute('type', 'hidden');
   input.setAttribute('name', paramName);
   input.setAttribute('value', data[paramName]);
   form.appendChild(input);
  }
 }
 form.submit();
}

thanksbutton.onclick = function() {
    var sendText = document.getElementById('_chatText').value;
    var senderId = document.getElementById('_myStatusIcon').childNodes[0].dataset.aid;
    var url = '';
    var targetMessage=sendText.match(/\[To:(.[0-9]+)\]/)[1];
    thanksPostData = {'senderId':senderId, 'senderText':sendText, 'To':targetMessage};
    execPost(url,thanksPostData);
 };
