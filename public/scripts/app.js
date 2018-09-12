/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

function createTweetElement(db) {
  const elaspe = Date.now() - db.created_at;
  const days = Math.floor(elaspe / (8.64 * Math.pow(10, 7)));
  const weeks = Math.floor(days / 7);
  let ago = `${days} days ago`
  if (weeks >= 1) {
    ago = `${weeks} weeks ago`
  }
  const $tweet = $("<article>").addClass("single-tweet");
  const header = `
    <header class="t-header">
      <img class="avatar" src="${escape(db.user.avatars.small)}">
      <strong class="username">${escape(db.user.name)}</strong>
      <small class="user-tag">${escape(db.user.handle)}r</small>
    </header>`
  const body = `<p class="tweet-body">${escape(db.content.text)}</p>`
  const footer = `
    <footer class="created-on">
      ${escape(ago)}
      <div class="footer-icon">
        <img src="/images/flag.png">
        <img src="/images/retweet.png">
        <img src="/images/heart.png">
      </div>
    </footer>`

  $tweet.append(header);
  $tweet.append(body);
  $tweet.append(footer);

  return $tweet;
}

function renderTweet(arr) {
  arr.forEach((tweet) => {
    $('#tweet-container').prepend(createTweetElement(tweet));
  });
}

// Intercepts form submition and use AJAX instead.
function formSubmit() {
  const $error = $("#error-message");
  const $post = $('#create-tweet');
  $post.on('submit', function(e) {
    $error.hide({
      opacity: 'toggle',
    });
    e.preventDefault();
    const data = $(this).serialize()
    if (data.length === 5) {
      $error.text('Error: Tweet cannot be empty');
      $error.show({
        opacity: 'toggle',
      });
    } else if (data.length > 145) {
      $error.text('Error: Tweets cannot exceed 140 characters.');
      $error.show({
        opacity: 'toggle',
      });
    } else {
      $.ajax("/tweets", { method: 'POST', data })
      .then(() => {
        $(this).children('textarea').val('');
        $(this).children('.counter').text('140');
        loadTweets();
      });
    }
  });
}

// Returns an array of tweets through API
function loadTweets() {
  $.ajax("/tweets", { method: "GET" })
  .then((data) => {
    $('#tweet-container').empty();
    renderTweet(data);
  })
}

// Helper function to escape text to prevent XSS;
function escape(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

function toggleCompose() {
  const $button = $('#compose');
  $button.click(() => {
    $('.new-tweet').animate({
      height: "toggle",
      opacity: "toggle",
    })
    $('.new-tweet textarea').focus();
  });
}


$(document).ready(function () {
  loadTweets();
  formSubmit();
  toggleCompose();
});
