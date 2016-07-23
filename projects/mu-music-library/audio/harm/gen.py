import math
def sine(f):
    return 'sine=frequency=%.5f:sample_rate=24000:duration=1' % f;
def delay(d):
    return 'adelay=%.5f' % (1 + d*1000);
def vol(v):
    return 'volume=volume=%.5f' % v;
def genid(id):
    return 'abcdefghijklmnopqrstuvwxyz'[math.floor(id / 26)] + 'abcdefghijklmnopqrstuvwxyz'[id % 26]
def mix(fvs):
    id = 0
    inputs = []
    mix = []
    for fv in fvs:
        input = []
        input.append(sine(fv[0]))
        input.append('[s%s];[s%s]' % (genid(id), genid(id)))
        input.append(delay(fv[2]))
        input.append('[d%s];[d%s]' % (genid(id), genid(id)))
        input.append(vol(fv[1]))
        input.append('[i%s]' % genid(id))
        inputs.append(''.join(input))
        mix.append('[i%s]' % genid(id))
        id += 1
    mix.append('amix=inputs=%d' % len(inputs))
    return ';'.join(inputs) + ';' + ''.join(mix)

#harm = [1, 1, 1]
harm = [1, 0.399, 0.299, 0.152, 0.197, 0.094, 0.061]#, 0.139, 0.011, 0.071, 0.030]
#harm = [1, 0.287, 0.150, 0.043, 0.204, 0.229, 0.157]#, 0.115, 0.000, 0.097, 0.088]

with open('gen.bat', 'w') as f:
    f.write('@echo off\n')
    f.write('set FFMPEG="c:\\Program Files (x86)\\FFmpeg for Audacity\\ffmpeg.exe"\n')
    a4 = 4 * 12 + 9
    for o in range(1, 9):
        for i in range(12 if o < 8 else 1):
            n = o * 12 + i
            freq = 440 * pow(pow(2, 1.0/12), (n - a4))
            graph = mix([(freq*(h+1), harm[h] * len(harm), (h+1)*1.0/freq/len(harm)) for h in range(len(harm))])
            f.write('%%FFMPEG%% -y -f lavfi -i "%s" harm_%i_%i.ogg\n' % (graph, o, i))
            f.write('%%FFMPEG%% -y -f lavfi -i "%s" harm_%i_%i.m4a 2> nul\n' % (graph, o, i))
