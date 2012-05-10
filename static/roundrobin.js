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
    score1 = score1||'--';
    score2 = score2||'--';
    $(wins).each(function(ind, elt){
        var xy = getXYfromIndex(elt);
        var eltOpp = getIndexFromXY(xy[1],xy[0]);
        var box = $('#bracket').children()[elt];
        var boxOpp = $('#bracket').children()[eltOpp];
        $(box).removeClass('valid');
        $(box).addClass("win");
        $(boxOpp).removeClass('valid');
        $(boxOpp).addClass('loss');
        $(box).text(score1+':'+score2);
        $(boxOpp).text(score2+':'+score1);
    });
}
var addLoss = function(losses, score1, score2){//takes a list of indexes
    score1 = score1||'--';
    score2 = score2||'--';
    $(losses).each(function(ind, elt){
        var xy = getXYfromIndex(elt);
        var eltOpp = getIndexFromXY(xy[1],xy[0]);
        var box = $('#bracket').children()[elt];
        var boxOpp = $('#bracket').children()[eltOpp];
        $(box).removeClass('valid');
        $(box).addClass("loss");
        $(boxOpp).removeClass('valid');
        $(boxOpp).addClass('win');

        $(box).text(score1+':'+score2);
        $(boxOpp).text(score2+':'+score1);
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
                  if(checked.length>0){
                      if(checked.val()=="you"){
                          if(updatingXY[0]<updatingXY[1]){
                            addLoss(updatingIndex, yourScore, oppScore);
                          }else{
                            addWin(updatingIndex, yourScore, oppScore);
                          }
                      }
                      else{
                          if(updatingXY[0]<updatingXY[1]){
                            addWin(updatingIndex, yourScore, oppScore);
                          }else{
                              addLoss(updatingIndex, yourScore, oppScore);
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

    addWin([21,25], 21, 4);
    addLoss([62,37], 7, 21);


});
