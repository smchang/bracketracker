class Tournament:
    #name: name of tournament
    #type: roundrobin, singleElim, doubleElim, staticRobin
    #members: a list of members in this tournament
    #description: text description of tournament
    #outcomes: a nxn length list (condensed matrix) of outcomes for tournament (assuming round robin)
    #password: tournament password (public if password is NULL, private otherwise)
    def __init__(self, id, name, type, description="", admins=[], players=[], booted=[], invited=[], outcomes=[], password="", icon=""):
        self.id = id
        self.name = name
        self.type = type
        self.description = description
        self.admins = admins
        self.players = players
        self.booted = booted
        self.outcomes = outcomes
        self.password = password
        self.icon = icon

    def __repr__(self):
        return "<Tournament name:%s>" % self.name
#        return "<Tournament name:%s, type:%s, description:%s, members:%s, outcomes:%s, password:%s>, icon:%s"\
#                % (self.name, self.type, self.description, self.members,self.outcomes,self.password, self.icon)


class Member:
    #name of member
    #status: 0=admin, 1=active, 2=booted, 3=invited
    def __init__(self, name, status):
        self.name = name
        self.status = status

    def __repr__(self):
        return "<Member name:%s, status:%s>" % (self.name, self.status)

