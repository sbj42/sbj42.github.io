rm -r lib/reveal.js/* lib/c3.js/* lib/d3.js/* lib/head.js/*
cp -r node_modules/reveal.js/js lib/reveal.js
cp -r node_modules/reveal.js/css lib/reveal.js
cp -r node_modules/reveal.js/plugin lib/reveal.js
cp node_modules/c3/c3.js lib/c3.js
cp node_modules/c3/c3.css lib/c3.js
cp node_modules/d3/d3.js lib/d3.js
cp node_modules/headjs/dist/1.0.0/head.js lib/head.js