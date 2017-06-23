'use strict';

document.addEventListener("DOMContentLoaded", function(event) {
  var PRTS_URL = 'https://prts.herokuapp.com/';
  // var PRTS_URL = 'http://localhost:3000/';
  var FEED_URL = PRTS_URL + 'api/extensions/feeds.json';
  var ACCOUNT_URL = PRTS_URL + 'api/extensions/accounts.json';

  function loadFeedData() {
    var notification = $('.notification.mb-0');
    var loader = $('.spin-loader');

    $.ajax({
      url: FEED_URL,
      type: 'GET',
      dataType: 'json',
      beforeSend: function() {

      },
      complete: function() {

      },
      success: function(result) {
        var feedWraper = $('.feed-wrapper');
        feedWraper.html(result.content);
        feedWraper.removeClass('is-hidden');
        notification.addClass('is-hidden');
        loader.addClass('is-hidden');
      },
      error: function(error) {
        notification.removeClass('is-hidden');
        loader.addClass('is-hidden');
      }
    });
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
      success: function(result) {
        localStorage.setItem('oauthTokenVal', token);
        $('.not-sign-in').addClass('is-hidden');
        $('.signed-in').removeClass('is-hidden');
      },
      error: function(error) {
        $('.help.is-danger').html('Cannot log in with the provided API key. Please review your API key. Click "Show guides" below if you need help.');
        $('.help.is-danger').delay(2000, function(){
          $(this).html();
        });
      }
    });
  }

  loadFeedData();
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
