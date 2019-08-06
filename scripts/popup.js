var STORAGE_OFFSET = 1;

StorageManager.retrieveAllText(function(items) {
	for(var urlKey of Object.keys(items)) {
    var webpage = items[urlKey];
    var titleText = hasTitle(webpage[0]) ? webpage.shift().title : undefined;

    var listNode = document.createElement("DIV");
    listNode.className += "col-12";

    var colNode = document.createElement("DIV");
    colNode.className += "card";

    var titleContainer = constructHeaderNode(urlKey, titleText);

    colNode.appendChild(titleContainer);

    listNode.appendChild(colNode);

    for(var saved of webpage) {
      (function() {
        var listItem = constructNodeWithText("LI", constructTextFromDataObj(saved));
        listItem.className += "project-item-title";

        var trashIcon = constructTrashIconNode();
        addListenerToTrashNode(trashIcon, listItem, urlKey);
        listItem.appendChild(trashIcon);
        listItem.addEventListener("mouseover", function() { trashIcon.className = 'trash-icon-visible'; });
        listItem.addEventListener("mouseout", function() { trashIcon.className = 'trash-icon-hidden'; });

        colNode.appendChild(listItem);
      }());
    }

    document.getElementById("titleContainer").appendChild(listNode);
	}
});

function addListenerToTrashNode(trashIcon, listItem, url) {
  trashIcon.addEventListener("click", function() {
    var i = 0;
    var item = listItem;
    while( (item = item.previousSibling) != null) {
      if(item.nodeName.toLowerCase() === 'li') {
        i++;
      }
    }

    console.log("COUNT IS : " + i);

    StorageManager.deleteTextInKey(url, (STORAGE_OFFSET + i), function() { location.reload(); });
  });
}

function constructTrashIconNode() {
  var trashButton = document.createElement("input");
  trashButton.type = "image";
  trashButton.src = 'public/icons/trash32.png';
  trashButton.className = 'trash-icon-hidden';

  return trashButton;
}

function hasTitle(obj) {
  return obj.hasOwnProperty('title');
}

function constructHeaderNode(url, titleText) {
  var container = document.createElement('div');
  
  

  var hostnameNode = constructNodeWithText("DIV", extractUrlHostname(url));
  hostnameNode.className += "collapse pt-3 show";
  hostnameNode.setAttribute("id", "cardCollpase1");



  if( titleText !== undefined) {
    var titleNode = constructNodeWithText("h5", titleText);
    titleNode.className += "card-title mb-0";
    var cardWidget = document.createElement("DIV");
    cardWidget.className += "card-widgets";
    var collapse = document.createElement("A");
    collapse.className += "collapseElement";
    var collapseIcon = document.createElement("I");
    collapseIcon.className += "mdi mdi-minus";

    collapse.setAttribute("data-toggle", "collapse");
    collapse.setAttribute("href", "#cardCollpase1");
    collapse.setAttribute("role", "button");
    collapse.setAttribute("aria-expanded", "false");
    collapse.setAttribute("aria-controls", "cardCollpase1");


    collapse.appendChild(collapseIcon);
    cardWidget.appendChild(collapse);
    container.appendChild(cardWidget);
    container.appendChild(titleNode);
  }
  container.appendChild(hostnameNode);
  container.className += "card-body";

  // container.addEventListener("click", function() { window.open(url) });

  return container;
}

function constructNodeWithText(type, text) {
  var node = document.createElement(type);
  var textNode = document.createTextNode(text);
  node.appendChild(textNode);

  return node;
}

function constructTextFromDataObj(text) {
  var fullText = text.selection;

  if(text.note !== undefined) {
    fullText = '(Selection =) ' + text.selection + ': (Note =) ' + text.note;
  } 

  return fullText;
}

function extractUrlHostname(url) {
  var hostname;

  if (url.indexOf("//") > -1) {
      hostname = url.split('/')[2];
  }
  else {
      hostname = url.split('/')[0];
  }

  //find & remove port number
  hostname = hostname.split(':')[0];
  //find & remove "?,.com,.co"
  hostname = hostname.split('?')[0];
  hostname = hostname.split('.com')[0];
  hostname = hostname.split('.co')[0];

  // for local files, take the name of the file
  if(url.indexOf("file:") > -1 && hostname.length === 0) {
    var nameOfLocalFile = url.split('/').pop();
    var extensionIndex = nameOfLocalFile.lastIndexOf('.');

    hostname = nameOfLocalFile.slice(0, extensionIndex);
  }

  return decodeURI(hostname);
}