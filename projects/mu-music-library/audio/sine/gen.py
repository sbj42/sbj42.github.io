with open('gen.bat', 'w') as f:
    f.write('@echo off\nset FFMPEG="c:\\Program Files (x86)\\FFmpeg for Audacity\\ffmpeg.exe"\n')
    a4 = 4 * 12 + 9
    for o in range(1, 9):
        for i in range(12 if o < 8 else 1):
            n = o * 12 + i
            freq = 440 * pow(pow(2, 1.0/12), (n - a4))
            f.write('%%FFMPEG%% -y -f lavfi -i "sine=frequency=%.5f:sample_rate=16000:duration=1" sine_%i_%i.ogg 2> nul\n' % (freq, o, i))
            f.write('%%FFMPEG%% -y -f lavfi -i "sine=frequency=%.5f:sample_rate=16000:duration=1" sine_%i_%i.m4a 2> nul\n' % (freq, o, i))
