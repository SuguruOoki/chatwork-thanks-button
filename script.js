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

'use strict';

function showTabContent() {
  //$("#_categoryDisplay").css("display", "none");
  $("#_roomListItems").css("display", "none");
  $("#_hidenArea").prepend($("#_chatListEmptyArea"));
  $("#_thankList").css("display", "block");
}

function hideTabContent() {
  //$("#_categoryDisplay").css("display", "block");
  $("#_roomListItems").css("display", "block");
  $("#_roomListArea").prepend($("#_chatListEmptyArea"));
  $("#_thankList").css("display", "none");
}

function addTabButton() {
  // add tab item
  var tabItem = $('<li class="_cwBBButton button"></li>');
  var tabItemContent = $('<span class="icoSizeLarge icoFontEmoticon"></span>');
  tabItem.attr('role', "menuitemradio");
  tabItem.attr('data-cwui-bb-idx', "3");
  tabItem.attr('aria-checked', "false");
  tabItem.append(tabItemContent);
  $("#_chatFilterList").append(tabItem);

  // the tab content is hiding
  var state = false;

  // handle click event for tab button
  tabItem.click(function() {
    // determine where is the tab content
    if (state == false) {
      // show it up
      state = true;
      showTabContent();
    } else {
      state = false;
      hideTabContent();
    }
  });

  // handle click on other tab menu
  $("._cwBBButton").click(function() {
    var isthankTabButton = $(this).attr("data-cwui-bb-idx") == 3;
    if (!isthankTabButton) {
      hideTabContent();
      state = false;
    }

  });
}

// load data from local storage
// return list of html text of the items
function loadDatas() {
  var list = JSON.parse(localStorage.getItem("thank_list"));
  if (!list) {
    list = [];
  }
  return list;
}

function addTabContent() {
  // load data
  var datas = loadDatas()

  // render the tab content
  var tabContent = $('<ul class="menuListTitle cwTextUnselectable"></ul>');
  tabContent.attr('id', '_thankList');
  tabContent.attr('role', 'list');
  tabContent.attr('data-vivaldi-spatnav-clickable', '1');
  tabContent.css("display", "none");

  for (var i = 0; i < datas.length; i++) {
    var item = $.parseHTML(datas[i]);
    tabContent.append(createthankItem(item));
  }
  // append to the roomListArea
  $('#_roomListArea').append(tabContent);
}

function createthankButton() {
  var thankLi = $("<li class='_cwABAction linkStatus actionNav__item'></li>");
  thankLi.append($("<span class='icoSizeLarge icoFontEmoticon'></span>"));
  thankLi.append($("<span class='_showAreaText showAreatext'>thank</span>"));

  return thankLi;
}

// remove element in array
function removeElement(array, elemnt) {
  var index = array.indexOf(elemnt);
  if (index > -1) {
    array.splice(index, 1);
  }
}

// check isExist
function isExist(array, elemnt) {
  var index = array.indexOf(elemnt);
  if (index > -1) {
    return true;
  }
  return false;
}

// create thank item based on content
function createthankItem(content) {
  var thankItem = $("<li class='_thankItem'></li>");
  var deleteIcon = $('<span class="icoSizeLarge icoFontActionDelete _deleteIcon"></span>');

  thankItem.append(content);
  thankItem.append(deleteIcon);

  deleteIcon.click(function() {
    // delete the thankned message
    $(this).parent().remove();
    console.log("delete clicked");

    // TODO:remove the data in data storage
    // get the content to remove
    //var sibData = $(this).siblings(".chatTimeLineMessageArea").prop("outerHTML");
    var sibData = $(this).siblings("._chatTimeLineMessageBox").prop("outerHTML");

    // get the stored list
    var list = JSON.parse(localStorage.getItem("thank_list"));
    removeElement(list, sibData)
    // store back
    localStorage.setItem("thank_list", JSON.stringify(list))

  });
  return thankItem;
}

// Add thank button for message obj
// message is the chatTimeLineMessage
function addthankButton(message) {
  // track change on timeLine
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      // get the nodelist, check to get only ul._messageActionNav cwTextUnselectable actionNav
      mutation.addedNodes.forEach(function(node) {
        if (node.getAttribute("role") == "toolbar") {
          var thankButton = createthankButton();

          // append the thank button after the 4th child
          var child = $(node).children(":nth-child(4)");
          child.after(thankButton);

          // register click event for each button
          thankButton.click(function() {
            // get the content of the message
            //var messageParent = $(this).parent().parent().parent();
            var messageParent = $(this).closest(".chatTimeLineMessage");
            // var sender = $(this).parents("div").children(1).find('img');
            var target = $(this).parents("._message");
            while(sender.find("._speaker").length === 0) {
                target = sender.prev();
            }

            console.log(target);
            target = sender.find("img").attr("data-aid");

            //var content = messageParent.find(".chatTimeLineMessageArea");
            var content = messageParent.find(".timelineMessage__userName");
            var cloneContent = content.clone();

            var rid = messageParent.attr("data-rid");
            var mid = messageParent.attr("data-mid");
            cloneContent.addClass("_roomLink");
            cloneContent.attr("data-rid", rid);
            cloneContent.attr("data-mid", mid);

            var contentInString = cloneContent.prop("outerHTML");

            // get local storage
            var list = JSON.parse(localStorage.getItem("thank_list"));
            if (!list) {
              list = [];
            }
            if (isExist(list, contentInString)) {
              alert("Already thank")
              return;
            }
            list.push(contentInString);
            localStorage.setItem("thank_list", JSON.stringify(list))

            // add new item to tab content
            var thankItem = createthankItem(cloneContent);
            $("#_thankList").append(thankItem);
            // var req = new XMLHttpRequest();
            // var senderId = document.getElementById('_myStatusIcon').childNodes[0].dataset.aid;
            // var sendText = "ありがとうございます！";
            // // var url = 'https://dev-free01.next-engine.com:12390/thanks/new';
            // var url = 'https://127.0.0.1:12390/thanks/new';
            // var method = 'POST';
            // var thanksPostData = 'from_chatwork_id='+senderId+'&to_chatwork_id='+target+'&message='+sendText;
            // var temporary = "";
            //
            // req.open(method, url, true);
            // req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            // req.addEventListener('loadend', function() {
            //     if (req.status === 200) {
            //         temporary = document.getElementById('_chatText').value;
            //         document.getElementById('_chatText').value = "";
            //         document.getElementById('_chatText').value = sendText;
            //         const sendBtn = document.getElementById('_sendButton');
            //         notificate('送信成功！','ありがとうを送りました！');
            //         sendBtn.click();
            //         document.getElementById('_chatText').value = "";
            //         document.getElementById('_chatText').value = temporary;
            //     } else {
            //         notificate('エラー！','正常に送信できませんでした！');
            //         return;
            //     }
            // });
            // req.send(thanksPostData);
          });
        }
      });
    });
  });

  observer.observe($('#_timeLine')[0], {
    childList: true,
    subtree: true,
  });
}

// HACK to hide the empty area
function creatHidenArea() {
  var hidenArea = $("<div id='_hidenArea'></div>");
  hidenArea.css("display", "none");
  $("#_roomListArea").prepend(hidenArea);
}

creatHidenArea();
addTabButton();
addTabContent();
addthankButton();;
