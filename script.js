var insertClass = document.getElementById('_groupCall');
var thanksbutton = document.createElement("div");

// 要素についての指定
thanksbutton.className = "chatInput__submit button" ;
thanksbutton.setAttribute("id", "_thanks-send");
thanksbutton.setAttribute("role","button");

// style
thanksbutton.style.marginLeft="3px";
thanksbutton.style.borderColor="#5cb85c";
thanksbutton.style.background="#5cb85c";
thanksbutton.innerHTML = 'ありがとう!';
insertClass.parentNode.insertBefore(thanksbutton, insertClass.parentNode.lastChild);


function confirmOnClick() {
    var r = confirm("ありがとうを送信してもよろしいですか？");
    if (r == true) {
        return true;
    } else {
        return false;
    }
}

function notificate(title,message_contents) {
    if(window.Notification != null) {
        // Notificationを許可するかどうかを問い合わせる
        Notification.requestPermission(function(permission){
            // 許可されなかったら何もしない
            if(permission !== "granted"){
                return;
            }
            // タイトルと本文、アイコンを表示
            var options = {};
            options.icon = '';
            options.body = message_contents;
            var notification = new Notification(title, options);
            setTimeout(notification.close.bind(notification), 2000);
        });
    }
}

// サーバーからエラーレスポンスが返ってきたら、管理者（柳）にご連絡くださいとアラートを表示する
thanksbutton.onclick = function() {
    var req = new XMLHttpRequest();
    var sendText = "";
    sendText = document.getElementById('_chatText').value;
    var allMessage = sendText;
    var senderId = document.getElementById('_myStatusIcon').childNodes[0].dataset.aid;
    var url = 'https://dev-free01.next-engine.com:12390/thanks/new';
    var method = 'POST';
    var targetMessage = '';
    var to_target = '';
    var response_target = '';
    var target = '';

    // 送信先(To:)のユーザIDを取得
    // 現在は一つ目のみを検出
    // TODO: 複数送信時の対応が必要
    if (sendText.match(/\To:([0-9]+)/s) !== null && sendText.match(/\To:([0-9]+)/s) !== '') {
        to_target = sendText.match(/\To:([0-9]+)/s);
        to_target = to_target[0];
        to_target =  to_target.slice(3);
    }
    // To と 返信 どちらもあるときはToを優先
    if (to_target !== '') {
        target = to_target;
    }
    else if (sendText.match(/\[返信 aid\=(.[0-9]+) /s) !== null && sendText.match(/\[返信 aid\=(.[0-9]+) /s) !== '') {
        // 送信先(返信)を取得
        response_target = sendText.match(/\[返信 aid\=(.[0-9]+) /s)[1];
        target = response_target;
    } else {
        notificate('入力不足！','誰にありがとうを伝えたいですか？');
        return;
    }

    if (sendText.match(/\さん(.+)?/s) !== null) {
        sendText = sendText.match(/\さん(.+)?/s)[1];
    }

    if (sendText === '↵'|| sendText === '\n') {
        sendText = '';
    }

    if (sendText === '') {
        notificate('入力不足！','何かしらメッセージの入力をお願いします！');
        return;
    }

    var sendConfirm = confirmOnClick();

    if (sendConfirm === false) {
        notificate('送信中止','送信を中止しました！');
        return;
    }

    thanksPostData = 'from_chatwork_id='+senderId+'&to_chatwork_id='+target+'&message='+sendText;

    req.open(method, url, true);
    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    req.addEventListener('loadend', function() {
        if (req.status === 200) {
            document.getElementById('_chatText').value = allMessage + '\n[ありがとう送信です！]';
            const sendBtn = document.getElementById('_sendButton');
            notificate('送信成功！','ありがとうを送りました！');
            sendBtn.click();
        } else {
            notificate('エラー！','正常に送信できませんでした！');
            return;
        }
    });
    req.send(thanksPostData);
};
