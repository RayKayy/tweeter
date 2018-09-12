/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// Helper function to escape text to prevent XSS;
function escape(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

function createTweetElement(db) {
  const elaspe = Date.now() - db.created_at;
  const days = Math.floor(elaspe / (8.64 * (10 ** 7)));
  const weeks = Math.floor(days / 7);
  const hours = Math.floor(((elaspe / (8.64 * (10 ** 7))) * 24));
  let ago = `${hours} hour(s) ago`;
  if (days >= 1) {
    ago = `${days} day(s) ago`;
  } if (weeks >= 1) {
    ago = `${weeks} week(s) ago`;
  }
  const $tweet = $('<article>').addClass('single-tweet');
  const header = `
    <header class="t-header">
      <img class="avatar" src="${escape(db.user.avatars.small)}">
      <strong class="username">${escape(db.user.name)}</strong>
      <small class="user-tag">${escape(db.user.handle)}r</small>
    </header>`;
  const body = `<p class="tweet-body">${escape(db.content.text)}</p>`;
  const footer = `
    <footer class="created-on">
      ${escape(ago)}
      <div class="footer-icon">
        <img src="/images/flag.png">
        <img src="/images/retweet.png">
        <img class="like" src="/images/heart.png">
        <p class="like-count">0</p>
      </div>
    </footer>`;

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

// Returns an array of tweets through API
function loadTweets() {
  $.ajax('/tweets', { method: 'GET' })
    .then((data) => {
      $('#tweet-container').empty();
      renderTweet(data);
    });
}

function toggleCompose() {
  const $button = $('#compose');
  $button.click(() => {
    $('.new-tweet').animate({
      height: 'toggle',
      opacity: 'toggle',
    });
    $('.new-tweet textarea').focus();
  });
}

// Intercepts form submition and use AJAX instead.
function formSubmit() {
  const $error = $('#error-message');
  const $post = $('#create-tweet');
  $post.on('submit', function (e) {
    $error.hide({
      opacity: 'toggle',
      done: $error.text(''),
    });
    e.preventDefault();
    const data = $(this).serialize();
    if (data.length === 5) {
      $error.show({
        opacity: 'toggle',
        done: $error.text('Error: Tweet cannot be empty'),
      });
    } else if (data.length > 145) {
      $error.show({
        opacity: 'toggle',
        done: $error.text('Error: Tweets cannot exceed 140 characters.'),
      });
    } else {
      $.ajax('/tweets', { method: 'POST', data })
        .then(() => {
          $(this).children('textarea').val('');
          $(this).children('.counter').text('140');
          loadTweets();
        });
    }
  });
}

$(document).ready(() => {
  loadTweets();
  formSubmit();
  toggleCompose();
  function likeCount() {
    const $button = $('.like');
    console.log($button);

    $button.on('click', (e) => {
      console.log(e);
    });
  }
  likeCount();
});
