var insertClass = document.getElementById('_chatSendToolbar');
var div = document.createElement('span');
div.classList.add("chatInput__submit");
div.classList.add("_cwBN button");
div.textContent = 'ありがとう';
document.body.insertBefore(div, insertClass.firstChild);
