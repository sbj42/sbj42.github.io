const { FuseBox } = require("fuse-box");

const fuse = FuseBox.init({
  homeDir: "src",
  output: "dist/$name.js",
});

fuse.bundle("ern").instructions(`> ern.ts`).watch('src/**');

fuse.run();