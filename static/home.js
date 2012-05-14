var yourTournaments = ['soccer','chess','funfun', 'round robin'];
var queryString = "";

var showTournament = function(name, global, isPrivate){
    var displayName = name;
    name = name.toLowerCase();
    if(name=="soccer") displayName="Soccer";
    else if(name=="chess") displayName="Chess";
    else if(name=="funfun") displayName="FunFun";
    else if(name=='round robin'){
        name='roundrobin';
        displayName="Round Robin";
    }
 
    var link = $('<a>');
    link.attr('href',name+'.html');
    link.attr('name',name);
    link.addClass("listingLink");
    if(isPrivate) link.addClass("private");
    var tempListing = $('<div>');
    tempListing.addClass('tournament');
    tempListing.addClass('listing');
    var tempInfo = $('<div>');
    tempInfo.attr('id',name+"Icon");
    tempInfo.addClass("icon");
    tempListing.append(tempInfo);
    tempListing.append(displayName+" Tournament");
    link.append(tempListing);

    if(isPrivate){
        link.click(function(evt){
            evt.preventDefault();
           $('#passwordPrompt').dialog('open');
        });
    }

    if(global) $('#allTournaments').append(link);
    else $('#yourTournaments').append(link);

}

$(document).ready(function(){
    $('.private').click(function(evt){
        evt.preventDefault();
        $('#passwordPrompt').dialog('open');
    });

    if($('#notes').children().length==0){
        $('#notes').text("No new notifications");
    }

    var makeCloseable = function(listing){
        var closeButton = $('<button>');
        closeButton.addClass('closeButton');
        closeButton.html('&times;');
        $(listing).append(closeButton);
    }
    $('.listing').each(function(ind, elt){
//        makeCloseable(elt);
    });

    $('.closeButton').click(function(){
        $(this).parent().remove();
    });
    
    $('#createLink').button();

    $('.listing .button').click(function(evt){
        $(this).parent().remove();
        var type = $(this).text();
        if($('#notes').children().length==0){
            $('#notes').text("No new notifications");
        }
        var title = $(this).parent().children('.title').text();
        console.log($(this).parent().children('.title').text());
        $.post('/removeNotification',{title:title, type:$(this).text()}, function(data){location.reload();console.log(data.msg)});
//        location.reload();
        evt.stopPropagation(); 
        evt.stopImmediatePropagation();
        evt.preventDefault();
    });

    $('#searchIcon').button();
    $('#search').keypress(function(evt){
        console.log(evt);
        if(evt.which==13){
            showSearchResults($('#search').val());
//            $.get('/search/'+$('#search').val());
        }
    });
    $('#search').change(function(){
        console.log('changed');
        console.log($('#search').val());
    });
    $('#searchIcon').click(function(){
        showSearchResults($('#search').val());
//        $.post('/search/'+$('#search').val());
    });

    $('#passwordPrompt').dialog({
        autoOpen: false,
        height:300,
        width:450,
        modal: true,
        buttons:{
            "Join":function(){
                $('#promptError').css('visibility','visible');
            },
        Cancel: function(){
                    $(this).dialog('close');
                }
        },
        close:function(){
                  $('#promptError').css('visibility','hidden');
                  $('#password').val('');
              } 
    }); 
    var showSearchResults = function(query){
        $('#yourTournamentsText').text('Your Tournaments:');
        $('#allTournamentsText').text('All Tournaments:');
        if(query.trim()===""){
            $('#yourTournaments').children('.listingLink').each(function(ind, val){
                if(name.indexOf(query.toLowerCase())!=-1){
                    $(val).attr('style','');
                }
            });
            $('#allTournaments').attr('style','display:none');
        }
        else{
            var count = 0;
            $('#yourTournaments').children('.listingLink').each(function(ind, val){
                var name = $(val).attr('name').toLowerCase();
                if(name.indexOf(query.toLowerCase())==-1){
                    $(val).attr('style','display:none');
                }else{
                    $(val).attr('style','');
                    count++;
                }
            });
            if (count==0){
                $('#yourTournamentsText').text('Your Tournaments:');
               $('#yourTournamentsText').append(' \<br\/\>No match for "'+query+'" found in your tournaments');
            }

            $('#allTournaments').attr('style','');
            var allCount = 0;
            $('#allTournaments').children('.listingLink').each(function(ind, val){
                var name = $(val).attr('name').toLowerCase();
                if(name.indexOf(query.toLowerCase())==-1){
                    $(val).attr('style','display:none');
                }else{
                    $(val).attr('style','');
                    allCount++;
                }
             });
            if (allCount==0){
                $('#allTournamentsText').text('All Tournaments:');
               $('#allTournamentsText').append('\<br\/\>No match for "'+query+'" found');
            }


        }
    }    
});
