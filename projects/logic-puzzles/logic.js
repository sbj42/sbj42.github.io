function prog(pct) {
    console.info((pct*100).toFixed(0));
}

var p = Numbrix();
p.generate(10, 7, prog);
p.start(Html('#main'));
