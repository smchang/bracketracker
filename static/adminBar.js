$(document).ready(function(){
    $('#makeAdminBtn').attr('disabled','disabled');
    $('#bootBtn').attr('disabled','disabled');
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
            $('#makeAdminBtn').attr('disabled','disabled');
            $('#bootBtn').attr('disabled','disabled');
        });
    });
    $('#bootBtn').click(function(){
        var selected = $('input:checked');
        $(selected).each(function(ind, elt){
            var player = $(elt).parent();
            $('#bootedList').prepend(player);
            elt.checked=false;
            $.post($(location).attr('href'), {'demote':this.value});
            $('#makeAdminBtn').attr('disabled','disabled');
            $('#bootBtn').attr('disabled','disabled');
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
            toggle(elt);
        });

    }
    
    $('input').click(function(evt){
        console.log('input click');
        toggle($(this).parent()[0]);
        evt.stopPropagation();
    });

    $('.player').each(function(ind, elt){
        clickable(elt);    
    });

    var toggle = function(elt){
        console.log(elt)
        var adminSelected = false;
        var bootedSelected = false;
        $(':checked').each(function(ind, elt){
            var type = $(elt).parent().parent().attr('id');
           if(type==='adminList'){
               adminSelected = true;
           } 
           if(type==='bootedList'){
                bootedSelected= true;
           }
        });

        if (adminSelected || bootedSelected || $(':checked').length==0){
            $('#makeAdminBtn').attr('disabled','disabled');
            $('#bootBtn').attr('disabled','disabled');
        } else{
            $('#makeAdminBtn').removeAttr('disabled');
            $('#bootBtn').removeAttr('disabled');
        }
        console.log('adminSelected '+adminSelected);
        console.log('bootedSelected'+bootedSelected);
    }
});
