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
        var contentWrapper = document.getElementsByClassName('content-wrapper')[0];
        contentWrapper.innerHTML = jsonData['popup_content'];

        $('#tabs a').click(function (e) {
          e.preventDefault()
          $(this).tab('show')
        })

        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
          $(e.target).parent().addClass('is-active'); // newly activated tab
          $(e.relatedTarget).parent().removeClass('is-active'); // previous active tab
        })

        var links = document.querySelectorAll('a.pr');

        for (var i = 0; i < links.length; i++) {
          (function () {
            var ln = links[i];
            var location = ln.href;
            ln.onclick = function () {
              chrome.tabs.create({active: true, url: location});
            };
          })();
        }
      } else {
        alert('There was a problem with the request.');
      }
    }
  }
});
