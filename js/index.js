'use strict';

document.addEventListener("DOMContentLoaded", function(event) {
  var PRTS_URL = 'https://prts.herokuapp.com/';
  var FEED_URL = PRTS_URL + 'api/extensions/feeds.json';
  var ACCOUNT_URL = PRTS_URL + 'api/extensions/accounts.json';

  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = attachContents;
  httpRequest.open('GET', FEED_URL);
  httpRequest.send();

  function attachContents() {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      var feedWraper =  $('.feed-wrapper')

      if (httpRequest.status === 200) {
        var jsonData = JSON.parse(httpRequest.responseText);
        feedWraper.html(jsonData['content']);
        feedWraper.removeClass('is-hidden');
        $('.notification.mb-0').addClass('is-hidden');
      }
    }
  }

  function handleSetting() {
    var oauthTokenVal = localStorage.getItem('oauthTokenVal');

    if (!oauthTokenVal) return;

    loadUserWithOauthToken(oauthTokenVal);
  }

  function loadUserWithOauthToken(token) {
    $.ajax({
      url: ACCOUNT_URL,
      type: 'GET',
      dataType: 'json',
      headers: {'OAUTH_TOKEN': token},
      success: function (result) {
        localStorage.setItem('oauthTokenVal', token);
        $('.not-sign-in').addClass('is-hidden');
        $('.signed-in').removeClass('is-hidden');
      },
      error: function (error) {
        $('.help.is-danger').html('Cannot log in with the provided API key. Please review your API key. Click "Show guides" below if you need help.');
        $('.help.is-danger').delay(2000, function(){
          $(this).html();
        });
      }
    });
  }

  handleSetting();

  $(document).on('click', 'button.save-oauth-token', function(e) {
    e.preventDefault();
    var oauthTokenVal = $('#oauth-token').val();

    if (!oauthTokenVal) {
      $('.help.is-danger').html('Cannot log in with the provided API key. Please review your API key. Click "Show guides" below if you need help');
      $('.help.is-danger').delay(2000, function(){
        $(this).html();
      });
      return;
    }

    loadUserWithOauthToken(oauthTokenVal);
  });

  $(document).on('click', '#tabs a', function (e) {
    e.preventDefault()
    $(this).tab('show')
  });

  $(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
    $(e.target).parent().addClass('is-active');
    $(e.relatedTarget).parent().removeClass('is-active');
  });

  $(document).on('click', 'a.pr', function(){
    location = $(this).data('href');
    chrome.tabs.create({active: true, url: location});
  });
});
