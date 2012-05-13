var updatingIndex;
var updatingXY; 

var SIZE = 8;
var getIndexFromXY = function(x,y, size){
    return y*SIZE+x;
}
var getXYfromIndex = function(index, size){
    return [index%SIZE, Math.floor(index/SIZE)]; 
}

var makeRoundRobin = function(w,h, numPlayers){
    size = numPlayers+1
    var grid = $('<div>');
    grid.attr("id",'bracket');
    grid.width(w);
    grid.height(h);
    for(var i=0; i<SIZE*SIZE; i++){
        var box = $('<div>');
        box.addClass('box');
        box.width(w/SIZE - 3);
        box.height(h/SIZE - 3);
        box.css('border','1px solid black');
        var content = $('<div>');
        content.addClass("content");
        box.append(content);
        grid.append(box);
    }
    
    $(grid).children().each(function(ind, elt){
        var xy = getXYfromIndex(ind);
        if(xy[0]==xy[1]){
            $(elt).addClass("invalid");//css('background-color','#444444');
        }
        else if(ind==1) $($(elt).children()[0]).text("Larry");
        else if(ind==2) $($(elt).children()[0]).text("Moe");
        else if(ind==3) $($(elt).children()[0]).text("Curly");
        else if(ind==4) $($(elt).children()[0]).text("Adam");
        else if(ind==5) $($(elt).children()[0]).text("Billy");
        else if(ind==6) $($(elt).children()[0]).text("Carl");
        else if(ind==7) $($(elt).children()[0]).text("Dave");
        else if(ind==8) $($(elt).children()[0]).text("Larry");
        else if(ind==16) $($(elt).children()[0]).text("Moe");
        else if(ind==24) $($(elt).children()[0]).text("Curly");
        else if(ind==32) $($(elt).children()[0]).text("Adam");
        else if(ind==40) $($(elt).children()[0]).text("Billy");
        else if(ind==48) $($(elt).children()[0]).text("Carl");
        else if(ind==56) $($(elt).children()[0]).text("Dave");
        else{
            $(elt).addClass("valid");
            $($(elt).children()[0]).addClass("score");
        }

    });

    $("#tournament").append(grid);
}

var addWin = function(wins, score1, score2){//takes a list of indexes
//    score1 = score1||'--';
//    score2 = score2||'--';
    $(wins).each(function(ind, elt){
        var s1 = score1[ind];
        var s2 = score2[ind];
        if (isNaN(s1)){
            s1 = '--';
        }
        if (isNaN(s2)){
            s2 = '--';
        }
        var xy = getXYfromIndex(elt);
        var eltOpp = getIndexFromXY(xy[1],xy[0]);
        var box = $('#bracket').children()[elt];
        var boxOpp = $('#bracket').children()[eltOpp];
        $(box).removeClass('valid');
        $(box).addClass("win");
        $(boxOpp).removeClass('valid');
        $(boxOpp).addClass('loss');
        $(box).text(s1+':'+s2);
        $(boxOpp).text(s2+':'+s1);
        console.log('adding'+elt+" "+s1+" "+s2);
//        $.post($(location).attr('href'),{'win':elt,s1:s1,s2:s2});
    });
}
var addLoss = function(losses, score1, score2){//takes a list of indexes
//    score1 = score1||'--';
//    score2 = score2||'--';
    $(losses).each(function(ind, elt){
        var s1 = score1[ind];
        var s2 = score2[ind];
        var xy = getXYfromIndex(elt);
        var eltOpp = getIndexFromXY(xy[1],xy[0]);
//        var box = $('#bracket').children()[elt];
//        var boxOpp = $('#bracket').children()[eltOpp];
//        $(box).removeClass('valid');
//        $(box).addClass("loss");
//        $(boxOpp).removeClass('valid');
//        $(boxOpp).addClass('win');

//        $(box).text(s1+':'+s2);
//        $(boxOpp).text(s2+':'+s1);
        addWin(eltOpp,s2,s1);
    });
}

//returns the name of your oppnent given you are Larry
var getOppFromIndex = function(ind){
    var xy = getXYfromIndex(ind);
    if(xy[0]==1){
        switch(xy[1]){
            case 2:
                return "Moe";
            case 3: return "Curly";
            case 4: return "Adam";
            case 5: return "Billy";
            case 6: return "Carl";
            case 7: return "Dave";
            default: return "";
        }    
    }else if(xy[1]==1){
        switch(xy[0]){
            case 2:
                return "Moe";
            case 3: return "Curly";
            case 4: return "Adam";
            case 5: return "Billy";
            case 6: return "Carl";
            case 7: return "Dave";
            default: return "";
        }
    }
}

$(document).ready(function(){
    $('.box').button();
    makeRoundRobin(800,800,7);
    $('#scorePrompt').dialog({
        autoOpen: false,
        height: 300,
        width:450,
        modal:true,
        buttons:{
            "Submit":function(){
                  var checked = $('input:radio[name="winner"]:checked');
                  var yourScore = $('#yourScore').val()||'--';
                  var oppScore = $('#oppScore').val()||'--';
                  yourScore = parseInt(yourScore);
                  oppScore = parseInt(oppScore);
                  if(checked.length>0){
                      if(checked.val()=="you"){
                          if(updatingXY[0]<updatingXY[1]){
                            var xy = getXYfromIndex(updatingIndex);
                            var eltOpp = getIndexFromXY(xy[1],xy[0]);
                            addWin(eltOpp,[oppScore],[yourScore]);
                            $.post($(location).attr('href'),{win:eltOpp,s1:oppScore,s2:yourScore});

//                            addLoss(updatingIndex, yourScore, oppScore);
                          }else{
                            addWin(updatingIndex, [yourScore], [oppScore]);
                            $.post($(location).attr('href'),{win:updatingIndex,s1:yourScore,s2:oppScore});
                          }
                      }
                      else{
                          if(updatingXY[0]<updatingXY[1]){
                            addWin(updatingIndex, [yourScore], [oppScore]);
                            $.post($(location).attr('href'),{win:updatingIndex,s1:yourScore,s2:oppScore});
                          }else{
                            var xy = getXYfromIndex(updatingIndex);
                            var eltOpp = getIndexFromXY(xy[1],xy[0]);
                            addWin(eltOpp,[oppScore],[yourScore]);
                            $.post($(location).attr('href'),{win:eltOpp,s1:oppScore,s2:yourScore});

//                            addLoss(updatingIndex, yourScore, oppScore);
                          }
                      }
                  $(this).dialog('close');
                  }
                  else{
                     $('#scoreError').css('visibility','visible'); 
                  }
            },
        Cancel: function(){
                    $(this).dialog('close');
                }
        },
        close:function(){
                var check = $('input:radio[name="winner"]:checked');
                if(check.length>0){
                    check[0].checked=false;
                }
                $('#scoreError').css('visibility','hidden');
              }
        });
    $('.box').click(function(){
        if(!$(this).hasClass('valid')) return;
        updatingIndex = $('#bracket').children().index(this);
        updatingXY = getXYfromIndex(updatingIndex);
        console.log(updatingXY);
        if(updatingXY[0]==1 || updatingXY[1]==1){
            $('#opponent').text(getOppFromIndex(updatingIndex));
            $('#scorePrompt').dialog('open');
        }
    });

//    addWin([21,25,44,55], [21, 21, 21, 21], [4,1,7,2]);
    var wins = $('#wins').text();
    var s1 = $('#s1').text();
    var s2 = $('#s2').text();
    wins = stringToArray(wins);
    s1 = stringToArray(s1);
    s2 = stringToArray(s2);
    addWin(wins,s1,s2);

});

var stringToArray = function(str){
    str = str.substr(1,str.length-2).split(',');
    for (var i=0; i<str.length; i++){
            str[i] = parseInt(str[i]);
    }
    return str;
}
