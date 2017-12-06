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

// TODO サーバーからエラーレスポンスが返ってきたら、管理者（柳）にご連絡くださいとアラートを表示する

thanksbutton.onclick = function() {
    var sendText = document.getElementById('_chatText').value;
    var senderId = document.getElementById('_myStatusIcon').childNodes[0].dataset.aid;
    var url = 'http://127.0.0.1:12390/thanks/new';
    var method = 'POST';

    // TODO: 複数送信時にはこの辺りの初期化を変更する
    var targetMessage = '';
    var to_target = '';
    var response_target = '';
    var target = '';

    if (sendText === '') {
        alert('誰にありがとうを伝えたいですか？');
        exit();
    }

    // 送信先(To:)のユーザIDを取得
    // 現在は一つ目のみを検出
    // TODO: 複数送信時の対応が必要
    if (sendText.match(/\To:([0-9]+)/s) !== null && sendText.match(/\To:([0-9]+)/s) !== '') {
        to_target = sendText.match(/\To:([0-9]+)/s);
        to_target = to_target[0];
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
        if (sendText.match(/\[返信 aid\=(.[0-9]+) /s) !== null && sendText.match(/\[返信 aid\=(.[0-9]+) /s) !== '') {
            response_target = sendText.match(/\[返信 aid\=(.[0-9]+) /s);
            response_target = response_target.slice(8);
            // for (var jj = 0; jj < response_target.length; jj++) {
            //     response_target[jj] = response_target[jj].slice(8);
            // }
        }
        target = response_target;
    }

    // TODO: 複数でのToや返信の送信時の対応が必要
    sendText = sendText.match(/\さん(.+)?/s)[1];
    if (sendText === '↵') {
        sendText = '';
    }

    thanksPostData = 'from_chatwork_id='+senderId+'&to_chatwork_id='+target+'&message='+sendText;
    req.open(method, url, true);
    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    // TODO: この辺りはサーバーのレスポンスによって対応を変える時の処理。2017/12/06 現在はまだ未完成。
    // req.addEventListener('loadend', function() {
    //   console.log(req.status);
    //   console.log(req.statusText);
    //   if (req.status === 200) {
    //     console.log(req.response);
    //   } else {
    //     // console.error(req.status+' '+req.statusText);
    //     alert("エラーが発生しました。管理者（柳）にご連絡ください。");
    //   }
    // });

    req.send(thanksPostData);
    req.abort();
    document.getElementById('_chatText').value="";
 };
