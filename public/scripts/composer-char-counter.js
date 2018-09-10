console.log('hi');

$(document).ready(function () {
  // --- our code goes here ---
  let count;
  $('.new-tweet textarea').keyup(function(e) {
    console.log('pressed', count);
    count = 140 - this.value.length;
    $(this).siblings('.counter').html(count);
    if (count < 0) {
      $(this).siblings('.counter').addClass('invalid');
    } else {
      $(this).siblings('.counter').removeClass('invalid');
    }
  })
});