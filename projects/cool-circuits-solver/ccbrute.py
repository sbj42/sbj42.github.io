import copy

def index_at(cx, cy, a):
    #print("    (%d, %d, %d)" % (cx, cy, a))
    if cy & 1 == 1:
        if a == 0:
            return index_at(cx, cy-1, 2)
        elif a == 1:
            return index_at(cx+1, cy-1, 3)
        elif a == 2:
            return index_at(cx+1, cy+1, 0)
        elif a == 3:
            return index_at(cx, cy+1, 1)
    if cx < 0 or cx > 3 or cy < 0 or cy > 7:
        return None
    return (cy*2 + cx) * 4 + a

def move(cx, cy, a, cw):
    assert cx >= -1 and cx < 5
    assert cy >= -1 and cy < 9
    assert a >= 0 and a < 4
    a = (a + (1 if cw else 3)) & 3
    return (cx, cy, a)
        
def cross(cx, cy, a, cw):
    cw = not cw
    if cy & 1 == 1:
        if a == 0:
            cy -= 1
        elif a == 1:
            cy -= 1
            cx += 1
        elif a == 2:
            cy += 1
            cx += 1
        elif a == 3:
            cy += 1
    else:
        if a == 0:
            cy -= 1
            cx -= 1
        elif a == 1:
            cy -= 1
        elif a == 2:
            cy += 1
        elif a == 3:
            cy += 1
            cx -= 1
    a = (a + 2) & 3
    return (cx, cy, a, cw)

class Grid:
    def __init__(self):
        self.occupied = [False for _ in range(64)]

    def add_piece(self, cx, cy, a, cw, orient, path):
        assert cx >= -1 and cx < 5
        assert cy >= -1 and cy < 9
        assert a >= 0 and a < 4
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
            if step:
                cx, cy, a, cw = cross(cx, cy, a, cw)
            i = index_at(cx, cy, a)
            #print("  (%d, %d, %d, %s) %s" % (cx, cy, a, cw, i))
            if i is None:
                #print("  runs off board")
                return None
            if self.occupied[i]:
                #print("  hits path")
                return None
        self.occupied[i] = True
        cx, cy, a = move(cx, cy, a, cw)
        i = index_at(cx, cy, a)
        #print("  (%d, %d, %d) %s" % (cx, cy, a, i))
        if i is None:
            #print("  runs off board")
            return None
        return (cx, cy, a, cw)

starts = [
    (0,0,0,True),
    (0,0,1,False),
    (0,0,1,True),
    (0,0,2,False),
    (0,1,0,True),
    (0,1,1,False),
    (0,1,1,True),
    (0,1,2,False),
    (1,2,0,True),
    (1,2,1,True),
    (1,2,1,False),
    (1,2,2,False),
    (1,3,0,True),
    (1,0,0,True),
    (1,0,0,False),
    (1,0,1,False),
    (1,0,1,True),
    (1,0,2,True),
    (1,0,2,False),
    (1,0,3,True),
    (1,0,3,False),
    (1,1,0,False),
    (1,1,0,True),
    (1,1,3,False),
    (1,1,3,True),
    (0,-1,3,False),
    (0,-1,2,True),
    (1,-1,3,False),
]

pieces = [
    ('J', [False,False, True, True]),
    ('U', [ True,False,False, True]),
    ('V', [ True,False, True, True]),
    ('E', [False, True, True,False]),
    ('N', [False, True,False, True]),
    ('I', [ True, True, True, True]),
    ('L', [False, True, True, True]),
    ('S', [False,False, True,False]),
]

def next_piece(grid, cur, pieces, prog):
    global paths, solutions, start
    if len(pieces) == 0:
        #print('uses all pieces: %s' % prog)
        paths += 1
        if cur == start or cur == xstart:
            solutions += 1
            print('makes a circuit: %s %s' % (start, prog))
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

paths = 0
solutions = 0
for start in starts:
    xstart = cross(start[0], start[1], start[2], start[3])
    #print('%s or %s' % (start,xstart))
    for pi in range(len(pieces)):
        pieces_left = pieces[:]
        piece = pieces_left.pop(pi)
        #print("piece %s at %s" % (piece[1], start))
        #print('  %s' % piece[0])
        grid = Grid()
        cur = grid.add_piece(start[0], start[1], start[2], start[3], False, piece[1])
        if cur is not None:
            #print('  %s' % (cur,))
            next_piece(grid, cur, pieces_left, piece[0])
        reverse = list(reversed(piece[1]))
        if reverse == piece[1]:
            continue
        #print('  %s\'' % piece[0])
        grid = Grid()
        cur = grid.add_piece(start[0], start[1], start[2], start[3], False, reverse)
        if cur is not None:
            #print('  %s' % (cur,))
            next_piece(grid, cur, pieces_left, piece[0] + '\'')
        

print("%d paths" % paths)
total = 0
print("%d circuits (/ 16 for unique ones)" % solutions)
                             
