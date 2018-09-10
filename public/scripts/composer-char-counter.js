$(document).ready(function () {
  // --- our code goes here ---
  let count;
  $('.new-tweet textarea').on('input', function() {
    count = 140 - this.value.length;
    $(this).siblings('.counter').html(count);
    $(this).siblings('.counter').toggleClass('invalid', count < 0);
  })
});