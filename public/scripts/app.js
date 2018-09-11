/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

function createTweetElement(db) {
  const date = new Date(db.created_at).toLocaleTimeString();
  const $tweet = $("<article>").addClass("single-tweet");
  const header = `
    <header class="t-header">
      <img class="avatar" src="${db.user.avatars.small}">
      <strong class="username">${db.user.name}</strong>
      <small class="user-tag">${db.user.handle}r</small>
    </header>`
  const body = `<p class="tweet-body">${db.content.text}</p>`
  const footer = `<footer class="created-on">${date}</footer>`

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
  const $post = $('#create-tweet');
  $post.on('submit', function(e) {
    e.preventDefault();
    const data = $(this).serialize()
    if (data.length === 5) {
      window.alert('Tweets cannot be empty');
    } else if (data.length > 145) {
      window.alert('Tweets cannot be longer than 140 characters.');
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


$(document).ready(function () {
  loadTweets();
  formSubmit();
});
