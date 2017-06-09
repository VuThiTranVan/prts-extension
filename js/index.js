'use strict';

document.addEventListener("DOMContentLoaded", function(event) {
  var PRTS_URL = 'http://localhost:3000/api/feeds.json';
  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = alertContents;
  httpRequest.open('GET', PRTS_URL);
  httpRequest.send();

  function alertContents() {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        var jsonData = JSON.parse(httpRequest.responseText);
        // chrome.extension.sendMessage({
        //   content: jsonData["popup_content"]
        // });
        var contentWrapper = document.getElementsByClassName('content-wrapper')[0];
        contentWrapper.innerHTML = jsonData['popup_content'];

        var tabs = document.getElementsByClassName('tab');

        for (var i = 0; i < tabs.length; i++) {
          tabs[i].addEventListener('click', handleTabFunction, false);
        }
        // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        //   chrome.tabs.sendMessage(tabs[0].id, {content: jsonData["popup_content"]}, function(response) {
        //     // $('#status').html('changed data in page');
        //     console.log('success' + tabs[0].id);
        //   });
        // });
      } else {
        alert('There was a problem with the request.');
      }
    }
  }

  var handleTabFunction = function() {
    var elemId = this.children[0].getAttribute('href');
    var tabContent = document.getElementById(elemId);

    if(tabContent.className.includes("is-hidden")) {
      var tabContents = document.getElementsByClassName('tab-content');

      for (var i = 0; i < tabContents.length; i++) {
        var tab = tabContents[i];

        if (tab != tabContents) {
          tab.className += 'is-hidden';
        }
      }

      tab.className = 'tab-content';
    }
  }
});
