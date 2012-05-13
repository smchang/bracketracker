$(document).ready(function(){
/*    $('.player').each(function(ind, val){
        var name = $(val).text();
        console.log(name);
        $(val).prepend('<input type="checkbox" name="player" value='+name+' />');
    });
*/
    $('#makeAdminBtn').click(function(){
        var selected = $('input:checked');
        $(selected).each(function(ind, elt){
            var player = $(elt).parent();
            $(player).remove();
            $('#adminList').append(player);
            clickable(player);
            elt.checked=false;
            $.post($(location).attr('href'), {'promote':this.value});
        });
    });
    $('#bootBtn').click(function(){
        var selected = $('input:checked');
        $(selected).each(function(ind, elt){
            var player = $(elt).parent();
            $('#bootedList').prepend(player);
            elt.checked=false;
            $.post($(location).attr('href'), {'demote':this.value});
        });
    });

    var clickable = function(elt){
        $(elt).click(function(){
            console.log("div clicked");
            var box = $(elt).children()[0];
            var checked = box.checked;
            if(checked){
                box.checked=false;
            }else{
                box.checked=true;
            }
        });

    }
    
    $('input').click(function(evt){
        console.log('input click');
        evt.stopPropagation();
    });

    $('.player').each(function(ind, elt){
        clickable(elt);    
    });
});
