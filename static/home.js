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

    $('.listing .button').click(function(){
        $(this).parent().remove();
        if($('#notes').children().length==0){
            $('#notes').text("No new notifications");
        }
    });

    $('#searchIcon').button();
    $('#search').keypress(function(evt){
        console.log(evt);
        if(evt.which==13){
            showSearchResults($('#search').val());
        }
    });
    $('#search').change(function(){
        console.log('changed');
        console.log($('#search').val());
    });
    $('#searchIcon').click(function(){
        showSearchResults($('#search').val());
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
              } 
    }); 
    var showSearchResults = function(query){
        if(query.trim()===""){
            $('#yourTournaments').text("Your Tournaments:");
            $('#yourTournaments').children().remove();
            $('#allTournaments').children().remove();
            $(yourTournaments).each(function(ind, elt){
                showTournament(elt,false, false);
            });
            return;
        }
        $('#yourTournaments').children().remove();
        $('#yourTournaments').text("Your Tournaments: ");
        $(yourTournaments).each(function(ind, elt){
            if(elt.toLowerCase()==query.toLowerCase() || elt.toLowerCase().indexOf(query.toLowerCase())!=-1){
                showTournament(elt,false);
            }
        });
        if($('#yourTournaments').children().length==0)    
            $('#yourTournaments').append('No matches for "'+query+'" in your tournaments');
        $('#allTournaments').text("All Tournaments:");
        if(query.split(' ')[0].toLowerCase()==="office"){
            $([1,2,3]).each(function(ind,elt){
                var link = $('<a>');
                link.attr('href','/join');
                link.addClass("listingLink");
                if(ind>0){
                    link.addClass("private");
                }
                var tempListing = $('<div>');
                tempListing.addClass('tournament');
                tempListing.addClass('listing');
                var tempInfo = $('<div>');
                tempInfo.attr('id','officeIcon'+elt);
                tempInfo.addClass("icon icon3");
                tempListing.append(tempInfo);
                tempListing.append('Office Ping Pong '+elt);
                link.append(tempListing);
               
                $('#allTournaments').append(link);
                if(ind>0){
                    $('.private').click(function(evt){
                        evt.preventDefault();
                        $('#passwordPrompt').dialog('open');
                    });
                }
            });
        }else{
            showTournament(query+' 1',true,true);
            showTournament(query+' 2',true,true);
            showTournament(query+' 3',true,true);
        }
    }    
});
