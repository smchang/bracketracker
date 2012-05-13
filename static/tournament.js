$(document).ready(function(){

    var sidebar = $('#adminbar');
    $('#bar').click(function(){
        $('#adminbar').hide('slide',{direction:'left',distance:'90%'}, function(){$('#expandBar').css('display','block');});
    });

    $('#expandBar').click(function(){
        $('#adminbar').show('slide',{direction:'left'});
        $('#expandBar').css('display','none');
    });
});
