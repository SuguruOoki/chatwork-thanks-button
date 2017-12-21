'use strict';

function showTabContent() {
  //$("#_categoryDisplay").css("display", "none");
  $("#_roomListItems").css("display", "none");
  $("#_hidenArea").prepend($("#_chatListEmptyArea"));
  $("#_pinList").css("display", "block");
}

function hideTabContent() {
  //$("#_categoryDisplay").css("display", "block");
  $("#_roomListItems").css("display", "block");
  $("#_roomListArea").prepend($("#_chatListEmptyArea"));
  $("#_pinList").css("display", "none");
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
    var isPinTabButton = $(this).attr("data-cwui-bb-idx") == 3;
    if (!isPinTabButton) {
      hideTabContent();
      state = false;
    }

  });
}

// load data from local storage
// return list of html text of the items
function loadDatas() {
  var list = JSON.parse(localStorage.getItem("pin_list"));
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
  tabContent.attr('id', '_pinList');
  tabContent.attr('role', 'list');
  tabContent.attr('data-vivaldi-spatnav-clickable', '1');
  tabContent.css("display", "none");

  for (var i = 0; i < datas.length; i++) {
    var item = $.parseHTML(datas[i]);
    tabContent.append(createPinItem(item));
  }
  // append to the roomListArea
  $('#_roomListArea').append(tabContent);
}

function createPinButton() {
  var pinLi = $("<li class='_cwABAction linkStatus'></li>");
  pinLi.append($("<span class='icoSizeLarge icoFontEmoticon'></span>"));
  pinLi.append($("<span class='_showAreaText showAreatext'>Pin</span>"));

  return pinLi;
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

// create pin item based on content
function createPinItem(content) {
  var pinItem = $("<li class='_pinItem'></li>");
  var deleteIcon = $('<span class="icoSizeLarge icoFontActionDelete _deleteIcon"></span>');

  pinItem.append(content);
  pinItem.append(deleteIcon);

  deleteIcon.click(function() {
    // delete the pinned message
    $(this).parent().remove();
    console.log("delete clicked");

    // TODO:remove the data in data storage
    // get the content to remove
    //var sibData = $(this).siblings(".chatTimeLineMessageArea").prop("outerHTML");
    var sibData = $(this).siblings("._chatTimeLineMessageBox").prop("outerHTML");

    // get the stored list
    var list = JSON.parse(localStorage.getItem("pin_list"));
    removeElement(list, sibData)
    // store back
    localStorage.setItem("pin_list", JSON.stringify(list))

  });
  return pinItem;
}

// Add pin button for message obj
// message is the chatTimeLineMessage
function addPinButton(message) {
  // track change on timeLine
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      // get the nodelist, check to get only ul._messageActionNav cwTextUnselectable actionNav
      mutation.addedNodes.forEach(function(node) {
        if (node.getAttribute("role") == "toolbar") {
          var pinButton = createPinButton();

          // append the pin button after the 4th child
          var child = $(node).children(":eq(3)");
          child.after(pinButton);

          // register click event for each button
          pinButton.click(function() {
            // get the content of the message
            //var messageParent = $(this).parent().parent().parent();
            var messageParent = $(this).closest(".chatTimeLineMessage");
            //var content = messageParent.find(".chatTimeLineMessageArea");
            var content = messageParent.find("._chatTimeLineMessageBox");
            var cloneContent = content.clone();

            var rid = messageParent.attr("data-rid");
            var mid = messageParent.attr("data-mid");
            cloneContent.addClass("_roomLink");
            cloneContent.attr("data-rid", rid);
            cloneContent.attr("data-mid", mid);

            var contentInString = cloneContent.prop("outerHTML");

            // get local storage
            var list = JSON.parse(localStorage.getItem("pin_list"));
            if (!list) {
              list = [];
            }
            if (isExist(list, contentInString)) {
              alert("Already pin")
              return;
            }
            list.push(contentInString);
            localStorage.setItem("pin_list", JSON.stringify(list))

            // add new item to tab content
            var pinItem = createPinItem(cloneContent);
            $("#_pinList").append(pinItem);
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
addPinButton();;
