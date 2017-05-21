del -recurse lib\reveal.js\*
del -recurse lib\c3.js\*
del -recurse lib\d3.js\*
copy -recurse node_modules\reveal.js\js lib\reveal.js
copy -recurse node_modules\reveal.js\css lib\reveal.js
copy -recurse node_modules\reveal.js\plugin lib\reveal.js
copy node_modules\c3\c3.js lib\c3.js
copy node_modules\c3\c3.css lib\c3.js
copy node_modules\d3\d3.js lib\d3.js