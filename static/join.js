$(document).ready(function(){
    $('#preview').css('background','url(graphics/grid.png)');
    $('#preview').css('background-size','400px 300px');
    $('#joinBtn').click(function(){
        $('<tr><td>You</td></tr>').insertBefore($($('#members').children()[0]).children()[6]);
        $('#joinBtn').attr('disabled','true');
    });
});
