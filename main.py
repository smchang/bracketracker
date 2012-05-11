from flask import Flask, redirect, request, render_template, url_for, session, jsonify
from models import Member
from models import Tournament
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
    return render_template('home.html',your_tournaments=tournamentDB[session['id']]['your_tournaments'])

@app.route('/create', methods=['GET','POST'])
def create():
    print request.method
    if request.method == 'POST':
        name = request.form['name']
        pwd = request.form['password']
        desc = request.form['description']
        type = request.form['type']
        print "creating tournament"
        print "    ",name
        print "    ",pwd
        print "    ",desc
        print "    ",type
        newTournament = Tournament(name,name,type,desc)
        tournamentDB[session['id']]['your_tournaments'][name] = newTournament
    return render_template('createTournament.html')

@app.route('/join')
def join():
    return render_template('joinTournament.html')

@app.route('/staticRobin/<name>', methods=['GET','POST'])
def funfun(name):
    return render_template('funfun.html')

@app.route('/singleElim/<name>', methods=['GET','POST'])
def singleElim(name):
    return render_template('chess.html')

@app.route('/doubleElim/<name>', methods=['GET','POST'])
def doubleElim(name):
    return render_template('soccer.html')

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

    return render_template('roundrobin.html', tournament=tournamentDB[session['id']]['your_tournaments'][name])

@app.route('/friends')
def friends():
    return render_template('comingSoon.html', page="Friends")
#using settings page as a site reset - clears session variable
@app.route('/settings')
def settings():
    session.pop('id')
    return render_template('comingSoon.html', page="Settings")
@app.route('/profile')
def profile():
    return render_template('comingSoon.html', page="Profile")

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
                           icon="roundrobinIcon")
    soccer = Tournament('soccer','Soccer','doubleElim',"Soccer Description",
                        admins = ['Larry'],
                        players = ['Curly','Billy','Carl'],
                        booted=['Fred'],
                       icon="soccerIcon")
    chess = Tournament('chess','Chess','singleElim',"Chess Description",
                       admins = ['Larry'],
                       players = ['Dave', 'George'],
                      icon="chessIcon")
    funfun = Tournament('funfun','FunFun','staticRobin',"FunFun Description",
                        players = ['Moe','Curly','Adam','Billy'],
                       icon="funfunIcon")

    tournamentDB[id]['your_tournaments'] = {}
    tournamentDB[id]['your_tournaments']['roundRobin'] = roundRobin
    tournamentDB[id]['your_tournaments']['soccer'] = soccer
    tournamentDB[id]['your_tournaments']['chess'] = chess
    tournamentDB[id]['your_tournaments']['funfun'] = funfun
    print "done seeding", tournamentDB[id]


if __name__ == '__main__':
    port = int(os.environ.get('PORT',5000))
    app.run(host='0.0.0.0', port=port,debug=True)
