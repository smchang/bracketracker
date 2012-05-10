from flask import Flask, redirect, request, render_template, url_for, session, jsonify
from models import Member
from models import Tournament
import os

app = Flask(__name__)
app.secret_key = '\xe0e\xb1[\xae\xdb\xc6\xa6\xd5\xb0\xae\x87#\xeeM\xff\x17\xa7&9{-\xc7\x81'

@app.route('/home')
@app.route('/')
def home():
    print session
    if len(session.keys())==0:
        print "is null session"
        seedSession()
    else:
        print "is not null session"
    print session
    return render_template('home.html',your_tournaments=session['your_tournaments'])

@app.route('/create', methods=['GET','POST'])
def create():
    if request.method == 'POST':
        print "creating tournament", request.form['name'], request.form['password']
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
            if p in session['your_tournaments'][name].players:
                session['your_tournaments'][name].players.remove(p)
                session.modified = True
            if p in session['your_tournaments'][name].booted:
                session['your_tournaments'][name].booted.remove(p)
                session.modified = True
            session['your_tournaments'][name].admins.append(p)
            session.modified = True
        elif 'demote' in request.form:
            d = request.form['demote']
            print "booting:",d
            if d in session['your_tournaments'][name].players:
                session['your_tournaments'][name].players.remove(d)
                session.modified = True
            if d in session['your_tournaments'][name].admins:
                session['your_tournaments'][name].admins.remove(d)
                session.modified = True
            session['your_tournaments'][name].booted.append(d)
            session.modified = True


    return render_template('roundrobin.html', tournament=session['your_tournaments'][name])

@app.route('/friends')
def friends():
    return render_template('comingSoon.html', page="Friends")
#using settings page as a site reset - clears session variable
@app.route('/settings')
def settings():
    for k in session.keys():
        session.pop(k)
    return render_template('comingSoon.html', page="Settings")
@app.route('/profile')
def profile():
    return render_template('comingSoon.html', page="Profile")

def seedSession():
    session['your_tournaments'] = {}
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
    session['your_tournaments']['roundRobin'] = roundRobin
    session['your_tournaments']['soccer'] = soccer
    session['your_tournaments']['chess'] = chess
    session['your_tournaments']['funfun'] = funfun
#    session['your_tournaments'].append(roundRobin)
#    session['your_tournaments'].append(soccer)
#    session['your_tournaments'].append(chess)
#    session['your_tournaments'].append(funfun)

if __name__ == '__main__':
    port = int(os.environ.get('PORT',5000))
    app.run(host='0.0.0.0', port=port,debug=True)
