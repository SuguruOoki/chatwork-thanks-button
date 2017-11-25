var insertClass = document.getElementsByClassName('chatInput__submitContainer');
var thanksbutton = '<div id="_thanks-send" class="chatInput__submit _cwBN button" role="button" tabindex="2" aria-disabled="false">ありがとう</div>';
document.body.insertBefore(thanksbutton, insertClass.firstChild);

var thanks_object = document.getElementById('_thanks-send');
thanks_object.onclick = function() { alert("I was clicked!"); }; //こういうふうにイベントリスナーを設定してあると
thanks_object.onclick();

