const { FuseBox, WebIndexPlugin, Sparky } = require("fuse-box");

let fuse, app, dist = false;

Sparky.task('config', () => {
    fuse = FuseBox.init({
        homeDir: "src",
        output: "dist/$name.js",
        plugins: [
            WebIndexPlugin({
                template: 'index.html',
                title: 'Hilbert Chords'
            })
        ]
    });
    app = fuse.bundle("app")
        .instructions(`>index.ts`);
});

Sparky.task('default', ['config'], () => {
    app.hmr()
        .watch();
    fuse.dev();
    return fuse.run();
});
Sparky.task('dist', ['config'], () => {
    return fuse.run();
});