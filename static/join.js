$(document).ready(function(){
    $('#joinBtn').click(function(){
        $('<tr><td>Larry (You)</td></tr>').insertBefore($($('#members').children()[0]).children()[6]);
        $('#joinBtn').attr('disabled','true');

        var n = $('#name').text().trim();
        var p = "";
        var d = $('#description').text();
        var type = "staticRobin";
        var members = getInvitedMembers();
        var admins = members[0];
        var players = members[1];
        console.log(members);
        console.log(admins);
        console.log(players);
        $.post('/addTournament',{name:String(n),password:String(p),description:String(d),type:type, admins:String(admins), players:String(players)});
    });
});

var getInvitedMembers = function(){
    var invitedMembers = "";
    var players = "";
    var admins = "";
    var invited = ""
    $('#members tr').each(function(ind, val){
        var name = $($(val).children()[0]).html();
        var stat = $($(val).children()[1]).html();
        if (stat==="(Manager)"){
            admins += name+',';
        }
        else if(stat==="(Invited)"){
            invited += name+',';
        }
        else{
            players+= name+',';
        }
    });
    return [admins, players, invited];
}


