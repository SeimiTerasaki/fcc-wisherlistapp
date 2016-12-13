
// init Isotope
var $grid = $('.grid').isotope({
  itemSelector: '.grid-item',
  percentPosition: true,
  masonry: {
    columnWidth: '.grid-sizer'
  }
});
// layout Isotope after each image loads
$grid.imagesLoaded().progress( function() {
  $grid.isotope('layout');
}); 

$(function () {
  
var socket = io.connect();

  var totalimg = $("body").find("img").length;
  var brokenimg = 0;
  $('img').each(function() {
    if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
      brokenimg ++;
      this.src = 'https://i.imgsafe.org/f9a0159eac.png';
    }
  });

 $('.like-btn').on('click', function(){
    var x = $(this).children('span').text();
    var image = $(this).closest('.grid-item').find('img.img').attr('src');
    var user = $(this).closest('.grid-item').find('p.username').text();
    var array =[];
   array.push(image, user);
    
    var num = x.match(/\d+/);
    if(num !== null){
    var parse = parseInt(num)
      num = parse +1;
      $(this).children('span').text( num);
      socket.emit('like', array);
    } else {
      num = 1;
      $(this).children('span').text( num);
      socket.emit('like', array);
    }
  });
  
  $('.share-btn').on('click', function(){
      var x = $(this).children('span').text();
    var user = $(this).closest('.grid-item').find('p.username').text();
    var title = $(this).parent('div').find('p.caption-p').text();
   var image = $(this).closest('.grid-item').find('img.img').attr('src');
   
   var array =[];
   array.push(user, title, image);
   console.log(array);

    var num = x.match(/\d+/);
    if(num !== null){
    var parse = parseInt(num)
      num = parse +1;
      $(this).children('span').text( num);
      socket.emit('share', array);
      socket.emit('addboard', array, function(data){
          console.log(data);
      });
    } else {
      num = 1;
      $(this).children('span').text( num);
      socket.emit('share', array);
      socket.emit('addboard', array, function(data){
          console.log(data);
      });
    }
  });
  
  var holder;
  
  $('.profile-input').click(function(){
    holder = $(this).text();
    $(this).empty();
    $(this).replaceWith( "<input class='input pass profile' id='input-field' placeholder='"+holder+"'/>" );
    $(this).find('input').focus();
 });

 $('#image').on('input', function(){
   var source= $('#image').val();
   var title = $('#title').val();
   $('.image-preview').prepend('<img src="'+source+'" id="thumbnail-img" />')
  });
  
  $('#upload-btn').on('click', function(){
    var user = $('.profile-username').text();
   var source= $('#image').val();
   var title = $('#title').val();
   var array=[];
   array.push(user, title, source);
   console.log(array);
   socket.emit('addboard', array, function(data){
     $('#add-board').modal('hide');
     $('#image').val(" ");
     $('#title').val(" ");
     $('#thumbnail-img').remove();
     $('<div class="grid-item"><div class="img-wrapper"><button class="trash-btn"><i class="fa fa-times" aria-hidden="true" id="trash"></i></button><img src="'+source+'" class="img"/><div class="caption"><span class="badge"><i class="fa fa-retweet" aria-hidden="true"></i><span class="like"> 0</span></span><span class="badge"><i class="fa fa-thumbs-up" aria-hidden="true"></i><span class="like"> 0</span></span><p class="caption-p">'+ title +'</p><div class="row"><img src="'+data.avatar+'" class="grid-avatar"/><div class="username"><p class="user-name">'+user+'</p></div></div></div>').insertAfter($(".grid-sizer")); 
   });
  });
  
 $('#cancel').on('click', function(){
   $('#image').val(" ");
   $('#title').val(" ");
   $('#thumbnail-img').remove();
 });
 
 $('#updateProfile-btn').on('click', function(){
  $(".profile").each(function() {
    var array = [];
   if($(this).val() != ""){
    var update = $(this).val();
    var label = $(this).parent('li').text();
    label = label.slice(0,-2).toLowerCase();
     var user = $('.profile-username').text();
     array.push(user, update, label);
      console.log(array);
     if($('#current-avatar') != ""){
       $('#setting-avatar, #header-avatar, #nav-avatar').attr('src', update);
       socket.emit('update-profile', array);
     } else $(this).replaceWith("<span class='profile-input'>"+update+"<span>");
     socket.emit('update-profile', array);
     $('#setting').modal('hide');
   }  
  });
}); 
  
  $('#updateProfile-cancel').on('click', function(){
    $('.profile').empty();
    $('.profile').replaceWith("<span class='profile-input'>"+holder+"<span>");
  });
  
  $('#trash').on('click', function(){
   var image = $(this).closest('.grid-item').find('img.img').attr('src');
   var user = $('.profile-username').text();
   var array = [];
   array.push(image, user);
   socket.emit('remove-board', array);
    $(this).closest('.grid-item').remove();
  });
 
});