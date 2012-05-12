$(document).ready(function(){
    $('#joinBtn').click(function(){
        $('<tr><td>Larry (You)</td></tr>').insertBefore($($('#members').children()[0]).children()[6]);
        $('#joinBtn').attr('disabled','true');

        var n = $('#name').text().trim();
        var p = "";
        var d = $('#description').text();
        var type = "staticRobin";
        $.post('/addTournament',{name:String(n),password:String(p),description:String(d),type:type});
    });
});
