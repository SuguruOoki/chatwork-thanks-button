var insertClass = document.getElementById('_sendButton');
var thanksbutton = document.createElement("div");
var req = new XMLHttpRequest();

// 要素についての指定
thanksbutton.className = "chatInput__submit button" ;
thanksbutton.setAttribute("id", "_thanks-send");
thanksbutton.setAttribute("role","button");

// style
thanksbutton.style.marginLeft="3px";
thanksbutton.style.borderColor="#5cb85c";
thanksbutton.style.background="#5cb85c";
thanksbutton.innerHTML = "ありがとう!";
insertClass.parentNode.insertBefore(thanksbutton, insertClass.parentNode.lastChild);

/*
・TOの名前にニックネームが設定されていたら、正常に動作しない
・「ありがとう！」のUIを「送信」の隣に置いて背景色を緑色などに変更しておく
======================== ↑ 優先度 高
・サーバーからエラーレスポンスが返ってきたら、管理者（柳）にご連絡くださいとアラートを表示する
・返信もTOとして扱うようにする
・TOが複数あった場合に、本文に2つ目以降のTOの文字列が含まれる
 */

thanksbutton.onclick = function() {
    var sendText = document.getElementById('_chatText').value;
    var senderId = document.getElementById('_myStatusIcon').childNodes[0].dataset.aid;
    var url = 'http://127.0.0.1:3000/thanks/new';
    var method = 'POST';
    var targetMessage = '';
    var to_target = '';
    var response_target = '';
    var target = '';

    // 送信先(To:)のユーザIDを取得
    if (sendText.match(/\[To:(.[0-9]+)\]/) !== null) {
        to_target = sendText.match(/\To:([0-9]+)/sg)[1];
        to_target =  to_target.slice(3);
        // for (var ii = 0; ii < target.length; ii++) {
        //     to_target[ii] = to_target[ii].slice(3);
        // }

    }

    // var target = to_target.concat(response_target).unique();
    // To と 返信 どちらもあるときはToを優先
    if (to_target !== '') {
        target = to_target;
    } else {
        // 送信先(返信)を取得
        if (sendText.match(/\[返信 aid\=(.[0-9]+) /sg) !== null) {
            response_target = sendText.match(/\[返信 aid\=(.[0-9]+) /sg)[1];
            response_target = response_target.slice(8);
            // for (var jj = 0; jj < response_target.length; jj++) {
            //     response_target[jj] = response_target[jj].slice(8);
            // }
        }
        target = response_target;
    }

    sendText = sendText.match(/\[To:.+](.*)さん(.+)?/s);
    if (sendText === '↵') {
        sendText = '';
    }

    thanksPostData = 'from_chatwork_id='+senderId+'&to_chatwork_id='+target+'&message='+sendText;
    // req.open(method, url, true);
    // req.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
    // req.send(thanksPostData);
    // req.abort();
    // document.getElementById('_chatText').value="";
 };
