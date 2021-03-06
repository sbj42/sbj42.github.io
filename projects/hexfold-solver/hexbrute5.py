import copy

def index_at(cx, cy, a):
    #print("    (%d, %d, %d)" % (cx, cy, a))
    if a == 3:
        return index_at(cx + 1, cy, 0)
    elif a == 4:
        return index_at(cx, cy + 1, 1)
    elif a == 5:
        return index_at(cx - 1, cy + 1, 2)
    if cx < -1 or cx > 5 or cy < 0 or cy > 5:
        return None
    elif cx < 2 - cy or cx > 7 - cy:
        return None
    elif cx == -1 and a != 2:
        return None
    elif cx == 5 and a != 0:
        return None
    elif cy == 5 and a == 0:
        return None
    elif cx == 7 - cy and a == 2:
        return None
    return cy * 7 * 3 + cx * 3 + a

def move(cx, cy, a, cw):
    assert cx >= -1 and cx <= 5
    assert cy >= -1 and cy <= 5
    assert a >= 0 and a < 6
    a = (a + (1 if cw else 5)) % 6
    return (cx, cy, a)
        
def cross(cx, cy, a, cw):
    cw = not cw
    if a == 0:
        cx -= 1
    elif a == 1:
        cy -= 1
    elif a == 2:
        cx += 1
        cy -= 1
    elif a == 3:
        cx += 1
    elif a == 4:
        cy += 1
    elif a == 5:
        cx -= 1
        cy += 1
    a = (a + 3) % 6
    return (cx, cy, a, cw)

class Grid:
    def __init__(self):
        self.occupied = [False for _ in range(7*3*6)]

    def add_piece(self, cx, cy, a, cw, orient, path):
        assert cx >= -1 and cx <= 5
        assert cy >= -1 and cy <= 5
        assert a >= 0 and a < 6
        if orient:
            cx, cy, a, cw = cross(cx, cy, a, cw)
        i = index_at(cx, cy, a)
        assert i is not None
        #print("  (%d, %d, %d, %s) %s" % (cx, cy, a, cw, i))
        if self.occupied[i]:
            #print("  hits path")
            return None
        for step in path:
            self.occupied[i] = True
            cx, cy, a = move(cx, cy, a, cw)
            i = index_at(cx, cy, a)
            #print("    (%d, %d, %d) %s" % (cx, cy, a, i))
            if i is None:
                #print("  runs off board")
                return None
            if self.occupied[i]:
                #print("  hits path")
                return None
            if step:
                #print("  (%d, %d, %d, %s)" % (cx, cy, a, cw))
                cx, cy, a, cw = cross(cx, cy, a, cw)
        self.occupied[i] = True
        cx, cy, a = move(cx, cy, a, cw)
        i = index_at(cx, cy, a)
        #print("  (%d, %d, %d, %s) %s" % (cx, cy, a, cw, i))
        if i is None:
            #print("  runs off board")
            return None
        return (cx, cy, a, cw)

starts = [
    (0,2,0,True),
    (0,2,1,False),
    (0,2,1,True),
    (0,2,2,False),
    (0,2,2,True),
    (0,2,3,False),

    (1,2,0,True),
    (1,2,1,False),
    (1,2,1,True),
    (1,2,2,False),
    (1,2,2,True),
    (1,2,3,False),

    (2,2,0,True),

    (0,1,4,False),
    (0,1,3,True),

    (1,1,0,False),
    (1,1,0,True),
    (1,1,4,False),
    (1,1,4,True),
    (1,1,5,False),
    (1,1,5,True),
]

pieces = [
    #('J', [False,False, True, True]), #3
    ('U', [ True,False,False, True]), #1
    ('V', [ True,False, True, True]), #1
    #('E', [False, True, True,False]), #3
    ('N', [False, True,False, True]), #1
    ('I', [ True, True, True, True]), #1
    ('L', [False, True, True, True]), #1
    ('S', [False,False, True,False]), #1
    #('Q', [ True,False,False,False]), #3
]

canonpiece = 'S'
def canonicalize(path):
    global pieces, canonpiece
    p = []
    c = []
    i = 0
    j = 0
    while i < len(path):
        letter = path[i]
        i += 1
        reverse = False
        connect = path[i]
        i += 1
        if connect == '\'':
            reverse = True
            connect = path[i]
            i += 1
        if letter == canonpiece:
            j = len(p)
        p.append((letter, reverse))
        c.append(connect == '-')
    p = p[j:] + p[0:j]
    c = c[j:] + c[0:j]
    if p[0][1]:
        p = [(x[0], x[1] if x[0] in 'UEI' else not x[1]) for x in reversed(p[1:] + p[0:1])]
        c = list(reversed(c))
    ret = ''
    for i in range(len(p)):
        ret = ret + p[i][0] + ('\'' if p[i][1] else '') + ('-' if c[i] else '+')
    return ret

def next_piece(grid, cur, pieces, prog):
    global paths, solutions, start, allpaths
    if len(pieces) == 0:
        #print('uses all pieces: %s' % prog)
        paths += 1
        if cur == start or cur == xstart:
            solutions += 1
            if cur == xstart:
                nprog = prog + '-'
            else:
                nprog = prog + '+'
            path = canonicalize(nprog)
            print('makes a circuit: %s %s %s' % (start, ''.join(prog), path))
            if path not in allpaths:
                allpaths[path] = 0
            allpaths[path] += 1
    for pi in range(len(pieces)):
        pieces_left = pieces[:]
        piece = pieces_left.pop(pi)
        nprog = prog + '+' + piece[0]
        #print('  %s' % nprog)
        ngrid = copy.deepcopy(grid)
        next = ngrid.add_piece(cur[0], cur[1], cur[2], cur[3], False, piece[1])
        if next is not None:
            #print('  %s' % (next,))
            next_piece(ngrid, next, pieces_left, nprog)
        nprog = prog + '-' + piece[0]
        #print('  %s' % nprog)
        ngrid = copy.deepcopy(grid)
        next = ngrid.add_piece(cur[0], cur[1], cur[2], cur[3], True, piece[1])
        if next is not None:
            #print('  %s' % (next,))
            next_piece(ngrid, next, pieces_left, nprog)
        reverse = list(reversed(piece[1]))
        if reverse == piece[1]:
            continue
        nprog = prog +'+' + piece[0] + '\''
        #print('  %s' % nprog)
        ngrid = copy.deepcopy(grid)
        next = ngrid.add_piece(cur[0], cur[1], cur[2], cur[3], False, reverse)
        if next is not None:
            #print('  %s' % (next,))
            next_piece(ngrid, next, pieces_left, nprog)
        nprog = prog + '-' + piece[0] + '\''
        #print('  %s' % nprog)
        ngrid = copy.deepcopy(grid)
        next = ngrid.add_piece(cur[0], cur[1], cur[2], cur[3], True, reverse)
        if next is not None:
            #print('  %s' % (next,))
            next_piece(ngrid, next, pieces_left, nprog)

allpaths = dict()
paths = 0
solutions = 0
for start in starts:
    xstart = cross(start[0], start[1], start[2], start[3])
    print('%s or %s' % (start,xstart))
    for pi in range(len(pieces)):
        pieces_left = pieces[:]
        piece = pieces_left.pop(pi)
        #print("piece %s at %s" % (piece[1], start))
        print('  %s' % piece[0])
        grid = Grid()
        cur = grid.add_piece(start[0], start[1], start[2], start[3], False, piece[1])
        if cur is not None:
            #print('  %s' % (cur,))
            next_piece(grid, cur, pieces_left, piece[0])
        reverse = list(reversed(piece[1]))
        if reverse == piece[1]:
            continue
        print('  %s\'' % piece[0])
        grid = Grid()
        cur = grid.add_piece(start[0], start[1], start[2], start[3], False, reverse)
        if cur is not None:
            #print('  %s' % (cur,))
            next_piece(grid, cur, pieces_left, piece[0] + '\'')

print("%d paths" % paths)
print("%d circuits" % solutions)
print("%d unique" % len(allpaths))
for p, c in allpaths.items():
    print("  %s %d" % (p, c))
                             
