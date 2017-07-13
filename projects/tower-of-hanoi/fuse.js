const { FuseBox, WebIndexPlugin, CSSPlugin, Sparky } = require("fuse-box");

let fuse, app, dist = false;

Sparky.task('config', () => {
    fuse = FuseBox.init({
        homeDir: "src",
        output: "dist/$name.js",
        plugins: [
            CSSPlugin(),
            WebIndexPlugin({
                template: 'index.html',
                title: 'Towers of Hanoi Variations'
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