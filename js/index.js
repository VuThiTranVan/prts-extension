'use strict';

document.addEventListener("DOMContentLoaded", function(event) {
  var PRTS_URL = 'https://prts.herokuapp.com/';
  // var PRTS_URL = 'http://localhost:3000/';
  var FEED_URL = PRTS_URL + 'api/extensions/feeds/';
  var ACCOUNT_URL = PRTS_URL + 'api/extensions/accounts.json';
  var PULL_URL = PRTS_URL + 'api/extensions/pull_requests/';

  function loadFeedData(status) {
    var notification = $('.notification.mb-0');
    var loader = $('.spin-loader');
    loader.removeClass('is-hidden');

    $.ajax({
      url: FEED_URL + status + '.json',
      type: 'GET',
      dataType: 'json',
      success: function(result) {
        if(result.content.length > 1) {
          var feedWraper = $('.feed-wrapper.pr-' + status);
          feedWraper.html(result.content);
          feedWraper.removeClass('is-hidden');
          notification.addClass('is-hidden');
          loader.addClass('is-hidden');
        } else {
          notification.removeClass('is-hidden');
          loader.addClass('is-hidden');
        }
      },
      error: function(error) {
        notification.removeClass('is-hidden');
        loader.addClass('is-hidden');
      }
    });
  }

  function handleSetting(apiKey) {
    loadUserWithOauthToken(apiKey);
  }

  function loadUserWithOauthToken(apiKey) {
    $.ajax({
      url: ACCOUNT_URL,
      type: 'GET',
      dataType: 'json',
      headers: {'OAUTH_TOKEN': apiKey},
      success: function(result) {
        // chrome.storage.sync.set({'oauth_token': apiKey});
        localStorage.setItem('oauth_token', apiKey);
        $('.settings').addClass('is-hidden');
        $('.navigation.feeds').removeClass('is-hidden');
        loadFeedData('ready');
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        if (XMLHttpRequest.readyState == 4) {
          // HTTP error (can be checked by XMLHttpRequest.status and XMLHttpRequest.statusText)
          // chrome.storage.sync.remove('oauth_token');
          localStorage.remoteItem('oauth_token');
          $('.help.is-danger').show().delay(3000).slideUp(500);
        } else if (XMLHttpRequest.readyState == 0) {
          // Network error (i.e. connection refused, access denied due to CORS, etc.)
        } else {
          // something weird is happening
        }
      }
    });
  }

  var oauthToken = localStorage.getItem('oauth_token');

  if (oauthToken) {
    $('.settings').addClass('is-hidden');
    $('.navigation.feeds').removeClass('is-hidden');

    handleSetting(oauthToken);
  }
  // chrome.storage.sync.get('oauth_token', function(result){
  //   if (result.hasOwnProperty('oauth_token')) {
  //     window.apiKey = result.oauth_token;
  //     window.handleSetting(window.apiKey);
  //   }
  // });

  $(document).on('click', 'button.save-oauth-token', function(e) {
    e.preventDefault();
    var apiKey = $('#oauth-token').val();

    if (!apiKey) {
      $('.help.is-danger').show().delay(3000).slideUp(500);
      return;
    }

    loadUserWithOauthToken(apiKey);
  });

  $(document).on('click', '#tabs a', function (e) {
    e.preventDefault()
    $(this).tab('show')
  });

  $(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
    $(e.target).parent().addClass('is-active');
    $(e.relatedTarget).parent().removeClass('is-active');

    var status = $(e.target).data('status');
    if (!status) return;

    loadFeedData(status);
  });

  $(document).on('click', 'a.pr', function(){
    location = $(this).data('href');
    chrome.tabs.create({active: true, url: location});
  });

  $(document).on('click', '.pr.ready', function (e) {
    e.preventDefault();

    var pull_id = $(this).data('id');
    var location = $(this).data('href');

    $.ajax({
      url: PULL_URL + pull_id + '.json',
      type: 'POST',
      dataType: 'json',
      headers: {'OAUTH_TOKEN': apiKey},
      success: function(result) {
        chrome.tabs.create({active: true, url: location});
      },
      error: function(error) {
      }
    });
  });
});
