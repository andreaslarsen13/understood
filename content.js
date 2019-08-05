var pageX;
var pageY;
var isShown = false;

icons = {
  "search": chrome.runtime.getURL("images/search.png")
}

//mousedown event start
document.addEventListener("mousedown", function(event){
  //right click
  if(event.button == 0) {
    pageX = event.pageX - 30;
    pageY = event.pageY - 55;

    if(isShown) {
      $("#myDiv").fadeOut(300, function(){
        $(this).remove();
      });

      isShown = false;
    }
  }
}, true);
// mousedown event ends

//mouseup event start
document.addEventListener("mouseup", function(event){
  //right click
  if(event.button == 0) {
    var selection =  getSelectedAsString();
    if(selection != '') {
      showPopup();
    }
  }
}, true);
//mouseup event ends

// this function gets selected text in clipboard
function getSelected() {
  var t = '';

  if (window.getSelection) {
    t = window.getSelection();
  } else if (document.getSelection) {
    t = document.getSelection();
  } else if (document.selection) {
    t = document.selection.createRange().text;
  }

  return t;
}

function getSelectedAsString() {
  return getSelected().toString();
}

function createHoverButton(icon) {
  var hoverButton = document.createElement("input");
  hoverButton.setAttribute("type", "image");
  hoverButton.setAttribute("src", icon);
  hoverButton.setAttribute("width", "24");
  hoverButton.setAttribute("height", "24");

  return hoverButton;
}

//make and show popup
function showPopup() {
  var div = document.createElement( 'div' );
  div.id = 'myDiv';
  div.style.backgroundColor = '#333333';
  div.style.position = "absolute";
  div.style.boxSizing = 'content-box';
  div.style.left = pageX+'px';
  div.style.top = pageY+'px';
  div.style.padding = "6px 6px 0px 6px";
  div.style.display = "none";
  div.style.borderRadius = "6px";
  div.style.zIndex = '100000001';


  var ul = document.createElement('ul');

  ul.style.listStyleType =  "none";
  ul.style.listStyle = "none";
  ul.style.padding  = "0px";
  ul.style.margin = "0px";


  // var li_search = document.createElement('li');
  var li_copy = document.createElement('li');
  var li_twitter = document.createElement('li');


  // li_search.style.padding  = "0px 5px 0px 0px";
  // li_search.style.margin = "0px";

  li_copy.style.padding  = "0px 5px 0px 0px";
  li_copy.style.margin = "0px";

  li_twitter.style.padding  = "0px";
  li_twitter.style.margin = "0px";


  // li_search.style.display = "inline";
  li_copy.style.display = "inline";
  li_twitter.style.display = "inline";


  // var searchIcon = chrome.runtime.getURL("images/search.png");
  var copyIcon = chrome.runtime.getURL("images/copy.png");
  var twitterIcon = chrome.runtime.getURL("images/twitter.png");

  // var searchBtn = createHoverButton(searchIcon)
  var copyBtn = createHoverButton(copyIcon)
  var twitterBtn  = createHoverButton(twitterIcon)

  // searchBtn.addEventListener("click", function() {
  //   var selection = getSelected();
  //   var pathStack = DomParser.generateDomPath(selection.focusNode.parentElement);
  //   var selectionString = selection.toString();

  //   if(selection != '') {
  //     var activeNode = selection.focusNode.parentElement;
  //     StorageManager.saveSelected(location.href, document.title, selectionString, pathStack, function() { 
  //       setHighlights(pathStack, selectionString);
  //     });

  //     clearSelection()
  //   }
  // });

  copyBtn.addEventListener("click", function() {
    var selection = getSelected();
    var pathStack = DomParser.generateDomPath(selection.focusNode.parentElement);
    var selectionString = selection.toString();

    if(selection != '') {
      document.execCommand('copy');
      StorageManager.saveSelected(location.href, document.title, selectionString, pathStack, function() { 
          setHighlights(pathStack, selectionString)
      });

      clearSelection()
    }
  });


  twitterBtn.addEventListener("click", function() {
    var selection = getSelected();
    var pathStack = DomParser.generateDomPath(selection.focusNode.parentElement);
    var selectionString = selection.toString();

    if(selection != '') {
      promptNote(function(note) {
        StorageManager.saveSelectedWithNote(location.href, document.title, selectionString , note, pathStack, function() {
          setHighlights(pathStack, selectionString)
        });
      });

      clearSelection();
    }
  });

  // li_search.appendChild(searchBtn);
  li_copy.appendChild(copyBtn);
  li_twitter.appendChild(twitterBtn);

  // ul.appendChild(li_search);
  ul.appendChild(li_copy);
  ul.appendChild(li_twitter);

  div.appendChild(ul);

  document.body.appendChild( div );

  $("#myDiv").fadeIn(300);

  isShown = true;
}

function setHighlights(pathStack, selection) {
  var node = DomParser.findNodeByPath(pathStack);
  var fullText = node.textContent;
  var startOfSelection = fullText.indexOf(selection);

  if(startOfSelection === -1) {
    return;
  }

  var m = document.createElement("mark");
  m.className += 'highlighted';

  var selectionLength = selection.length;
  var previousText = fullText.substring(0, startOfSelection);
  var markedText = document.createTextNode(fullText.substring(startOfSelection, startOfSelection + selectionLength));
  var afterText = document.createTextNode(fullText.substring(startOfSelection + selectionLength));

  m.appendChild(markedText);

  node.textContent = previousText;
  node.appendChild(m);
  node.appendChild(afterText);

  console.debug("highlighted node is: ");
  console.debug(node);
}

function promptNote(callback) {
  var inputDiv = document.createElement("div");
  var inputNode = document.createElement("input");
  var inputButton = document.createElement("input");
  var mybreak = document.createElement('br');

  
  inputNode.type = "text";
  inputNode.id = "noteInputBox";
  inputButton.type = "button";
  inputButton.id = "saveNoteButton";
  inputButton.value = "save";

  inputDiv.appendChild(inputNode);
  inputDiv.appendChild(mybreak);
  inputDiv.appendChild(inputButton);

  inputDiv.id = 'notePrompt';
  inputDiv.style.backgroundColor = '#333333';
  inputDiv.style.position = "absolute";
  inputDiv.style.boxSizing = 'content-box';
  inputDiv.style.left = pageX+'px';
  inputDiv.style.top = pageY+'px';
  inputDiv.style.padding = "0px 0px 20px 6px";
  inputDiv.style.display = "inherit";
  inputDiv.style.borderRadius = "6px";
  inputDiv.style.zIndex = '200000001';

  inputNode.style.backgroundColor = '#333333';
  inputNode.style.padding = "70px 85px 70px 6px";
  inputNode.style.color = 'white';

  inputButton.style.backgroundColor = '#333333';
  inputButton.style.color = 'white';
  inputButton.style.padding = "10px 90px 10px 6px";





 

  document.body.appendChild(inputDiv);

  inputButton.addEventListener("click", function() {
    var noteResult = inputNode.value;
    console.debug("inner text of input element is : " + noteResult);
    inputDiv.remove();
    
    callback(noteResult);
  });
}

function popupCenter(url, title, w, h) {
  var left = (screen.width/2)-(w/2);
  var top = (screen.height/2)-(h/2);
  return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
}

function clearSelection() {
  if ( document.selection ) {
    document.selection.empty();
  } else if ( window.getSelection ) {
    window.getSelection().removeAllRanges();
  }
}