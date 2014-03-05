$(function() {

  $('#header').addClass('animated fadeInLeftBig');

  $('#smallcopy').click(function() {
    $('#copy').show();
    $('#smallcopy').hide();
  })

  $('#copy').click(function() {
    $('#smallcopy').show();
    $('#copy').hide();
  })

});