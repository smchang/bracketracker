from flask import Flask, redirect, request, render_template, url_for, session, jsonify
from models import Member
from models import Tournament
from models import Notification
import os
import shelve
import uuid

tournamentDB = shelve.open('db/tournaments.dbm','w', writeback=True)

app = Flask(__name__)
app.secret_key = '\xe0e\xb1[\xae\xdb\xc6\xa6\xd5\xb0\xae\x87#\xeeM\xff\x17\xa7&9{-\xc7\x81'

@app.route('/home')
@app.route('/')
def home():
    print session
    if 'id' not in session.keys():
        print "is null session"
        seedSession()
    else:
        print "is not null session"
    print session
    print 'tournaments for home:', tournamentDB[session['id']]['your_tournaments']
    return render_template('home.html',your_tournaments=tournamentDB[session['id']]['your_tournaments'],
                          notifications = tournamentDB[session['id']]['notifications'],
                          all_tournaments=tournamentDB[session['id']]['all_tournaments'])

@app.route('/create', methods=['GET','POST'])
def create():
    print request.method
    if request.method == 'POST':
        name = request.form['name']
        pwd = request.form['password']
        desc = request.form['description']
        type = request.form['type']
        members = request.form['members']
        print "creating tournament"
        print "    ",name
        print "    ",pwd
        print "    ",desc
        print "    ",type
        print "    ",members
        newTournament = Tournament(name,name,type,desc)
        tournamentDB[session['id']]['your_tournaments'][name] = newTournament
        addMembersToTournament(name, members)
    return render_template('createTournament.html')

@app.route('/addMembers/<tournament>',methods=['POST'])
def addMember(tournament):
    print 'adding members'
    if tournament in tournamentDB[session['id']]['your_tournaments'].keys():
        print "adding members to tournament"
        members = request.form['members']
        addMembersToTournament(tournament, members)
        print members
    else:
        print 'tournament does not exist'

    return jsonify(msg='added members')

def addMembersToTournament(tournament, members):
    members = members.split(',')
    members = filter (lambda a: a!='', members)
    print members
    tournamentDB[session['id']]['your_tournaments'][tournament].players = members
def addAdminsToTournament(tournament, members):
    members = members.split(',')
    members = filter (lambda a: a!='', members)
    print members
    tournamentDB[session['id']]['your_tournaments'][tournament].admins = members

@app.route('/addTournament',methods=['POST'])
def addTournament():
    name = request.form['name']
    pwd = request.form['password']
    desc = request.form['description']
    type = request.form['type']
    admins = request.form['admins']
    players = request.form['players']
    print "adding tournament"
    print "    ",name
    print "    ",pwd
    print "    ",desc
    print "    ",type
    print "    ",admins
    print "    ",players
    newTournament = Tournament(name,name,type,desc, admins=admins, players=players)
    tournamentDB[session['id']]['your_tournaments'][name] = newTournament
    addMembersToTournament(name, players)
    addAdminsToTournament(name, admins)
    
    if name=="Office Ping Pong":
        print "joining office ping pong"
        tournamentDB[session['id']]['all_tournaments'].pop('pingPong')
    if name=="Foosball":
        tournamentDB[session['id']]['notifications'].pop('Tournament Invite')

    return jsonify(msg="added tournament")

@app.route('/join')
def join():
    return render_template('joinTournament.html')

@app.route('/join/foosball')
def join_foosball():
    return render_template('joinFoosball.html')

@app.route('/staticRobin/<name>', methods=['GET','POST'])
def funfun(name):
    return render_template('staticRobin.html',tournament = tournamentDB[session['id']]['your_tournaments'][name])

@app.route('/singleElim/<name>', methods=['GET','POST'])
def singleElim(name):
    return render_template('singleElim.html',tournament=tournamentDB[session['id']]['your_tournaments'][name])

@app.route('/doubleElim/<name>', methods=['GET','POST'])
def doubleElim(name):
    return render_template('doubleElim.html', tournament=tournamentDB[session['id']]['your_tournaments'][name])

@app.route('/roundrobin/<name>', methods=['GET','POST'])
def roundrobin(name):
    if request.method == 'POST':
        print "POSTING"
        
        if 'promote' in request.form:
            p = request.form['promote']
            print "making admin:", p
            if p in tournamentDB[session['id']]['your_tournaments'][name].players:
                tournamentDB[session['id']]['your_tournaments'][name].players.remove(p)
            if p in tournamentDB[session['id']]['your_tournaments'][name].booted:
                tournamentDB[session['id']]['your_tournaments'][name].booted.remove(p)
            tournamentDB[session['id']]['your_tournaments'][name].admins.append(p)
        elif 'demote' in request.form:
            d = request.form['demote']
            print "booting:",d
            if d in tournamentDB[session['id']]['your_tournaments'][name].players:
                tournamentDB[session['id']]['your_tournaments'][name].players.remove(d)
            if d in tournamentDB[session['id']]['your_tournaments'][name].admins:
                tournamentDB[session['id']]['your_tournaments'][name].admins.remove(d)
            tournamentDB[session['id']]['your_tournaments'][name].booted.append(d)
        elif 'win' in request.form:
            print 'adding win to tournament'
            win = request.form['win']
            s1 = request.form['s1']
            s2 = request.form['s2']
            if s1 == 'NaN':
                s1 = '--'
            else:
                s1 = int(s1)
            if s2 == 'NaN':
                s2 = '--'
            else:
                s2 = int(s2)
            print win,s1,s2
            tournamentDB[session['id']]['your_tournaments'][name].wins.append(int(win))
            tournamentDB[session['id']]['your_tournaments'][name].s1.append(s1)
            tournamentDB[session['id']]['your_tournaments'][name].s2.append(s2)
            print tournamentDB[session['id']]['your_tournaments'][name].wins,tournamentDB[session['id']]['your_tournaments'][name].s1,tournamentDB[session['id']]['your_tournaments'][name].s2

    return render_template('roundrobin.html', tournament=tournamentDB[session['id']]['your_tournaments'][name])

@app.route('/friends')
def friends():
    return render_template('comingSoon.html', page="Friends")
#using settings page as a site reset - clears session variable
@app.route('/settings')
def settings():
    if 'id' in session.keys():
        session.pop('id')
    return render_template('comingSoon.html', page="Settings")
@app.route('/profile')
def profile():
    return render_template('comingSoon.html', page="Profile")

@app.route('/removeNotification',methods=['POST'])
def removeNotification():
    name = request.form['title']
    type = request.form['type']
#    print "removing notification", name
    
    notification = tournamentDB[session['id']]['notifications'].pop(name)
    if notification.type=="score":
        print "notification is a score"
        if type=="Accept":
            tournamentDB[session['id']]['your_tournaments'][notification.tournament.id].wins.append(10)
            tournamentDB[session['id']]['your_tournaments'][notification.tournament.id].s1.append(4)
            tournamentDB[session['id']]['your_tournaments'][notification.tournament.id].s2.append(5)

    else:
        tournamentDB[session['id']]['your_tournaments'][notification.tournament.id] = notification.tournament
        print "notification is tournament"
    return jsonify(msg="removed notification")


def seedSession():
    id = str(uuid.uuid4())
    print id
    session['id'] = id
    tournamentDB[id] = {}

    print 'seeding'

    roundRobin = Tournament('roundRobin','Round Robin','roundrobin',"Description 1",
                            admins=['Larry'],
                            players = ['Moe','Curly','Adam','Billy','Carl','Dave'],
                            booted = ['Eric','Fred','George'],
                           icon="roundrobinIcon",
                           wins=[21,25,44,55],s1=[21,21,21,21],s2=[4,1,7,2],
                           state='active')
    soccer = Tournament('soccer','Soccer','doubleElim',"Soccer Description",
                        admins = ['Moe'],
                        players = ['Curly','Billy','Carl','Larry (You)'],
                        booted=['Fred'],
                       icon="soccerIcon",
                       state='active')
    chess = Tournament('chess','Chess','singleElim',"Chess Description",
                       admins = ['Moe'],
                       players = ['Dave', 'George','Larry (You)'],
                      icon="chessIcon",
                      state='active')
    funfun = Tournament('funfun','FunFun','staticRobin',"FunFun Description",
                        admins = ['Moe'],
                        players = ['Larry (You)','Curly','Adam','Billy'],
                       icon="funfunIcon",
                       state='active')

    pingPong = Tournament('pingPong','Office Ping Pong', 'staticRobin',"Come play in our little office ping pong\
                          tournament. It'll be lots of fun. Let's see who's the best.",
                          admins=['Moe'],
                          players=['Curly','Adam','Billy','Carl','Dave'],
                          invited=['Eric','Fred@bedrock.com','George@spacelysprockets.com','Harry@hogwarts.edu'],
                          state='join')
    pingPong2 = Tournament('pingPong2','MIT Ping Pong','staticRobin',description="No description",\
                           admins=['President Hockfield'],password="password123",state='join')
    basketball = Tournament('basketball','IM Basketball','singleElim',description="We pretend we can ball",\
                            admins=['The Committee'], password="password321",state='join')

    foosball = Tournament('foosball','Foosball','staticRobin',"Just a small foosball tournament between friends",
                          admins=['Jeff'],
                          players=['Joe','James','Larry (You)','Jake','Jared'],
                         state='active')
    scoreNotification = Notification('Game Completed','Round Robin Tournament: You vs. Moe','3:5',type="score", tournament=roundRobin)
    invite = Notification('Tournament Invite','You received an invitation to join the tournament:','Foosball\
                          Tournament',type="invite",tournament=foosball)

    tournamentDB[id]['your_tournaments'] = {}
    tournamentDB[id]['your_tournaments']['roundRobin'] = roundRobin
    tournamentDB[id]['your_tournaments']['soccer'] = soccer
    tournamentDB[id]['your_tournaments']['chess'] = chess
    tournamentDB[id]['your_tournaments']['funfun'] = funfun
    tournamentDB[id]['notifications'] = {}
    tournamentDB[id]['notifications'][scoreNotification.title] = scoreNotification
    tournamentDB[id]['notifications'][invite.title] = invite
    tournamentDB[id]['all_tournaments'] = {}
    tournamentDB[id]['all_tournaments']['pingPong'] = pingPong
    tournamentDB[id]['all_tournaments']['pingPong2'] = pingPong2
    tournamentDB[id]['all_tournaments']['basketball'] = basketball

    print "done seeding", tournamentDB[id]


if __name__ == '__main__':
    port = int(os.environ.get('PORT',5000))
    app.run(host='0.0.0.0', port=port,debug=True)
