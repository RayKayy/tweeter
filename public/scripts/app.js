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
      <img class="avatar" src="${db.user.avatars.small}">
      <strong class="username">${db.user.name}</strong>
      <small class="user-tag">${db.user.handle}r</small>
    </header>`
  const body = `<p class="tweet-body">${db.content.text}</p>`
  const footer = `<footer class="created-on">${ago}</footer>`

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
