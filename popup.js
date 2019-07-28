StorageManager.retrieveAllText(function(items) {
	for(var key of Object.keys(items)) {
    var listNode = document.createElement("UL")
    listNode.className += "project-item";
    // listNode.className = "listFormat"

    var urlHeader = constructNodeWithText("H3", key);
    var urlTitle = document.createElement('a');


    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (key.indexOf("//") > -1) {
        hostname = key.split('/')[2];
    }
    else {
        hostname = key.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?,.com,.co"
    hostname = hostname.split('?')[0];
    hostname = hostname.split('.com')[0];
    hostname = hostname.split('.co')[0];


    var linkText = document.createTextNode(hostname);
    urlTitle.appendChild(linkText);
    urlTitle.href = key;
    document.body.appendChild(urlTitle);

    listNode.appendChild(urlTitle);


    var webpage = items[key]
    for(var saved of webpage) {
      var listItem = constructNodeWithText("LI", saved);
      listItem.className += "project-item-title";

      listNode.appendChild(listItem);
    }

    document.getElementById("titleContainer").appendChild(listNode);
	}
});

function constructNodeWithText(type, text) {
  var fullText = text;

  if(typeof text === 'object') {
    fullText = '(Selection =) ' + text.selection + ': (Note =) ' + text.note;
  }

  var node = document.createElement(type);
  var textNode = document.createTextNode(fullText);
  node.appendChild(textNode);

  return node;
}