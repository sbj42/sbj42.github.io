function prog(pct) {
    console.info((pct*100).toFixed(0));
}

var p = Numbrix();
p.generate(10, 1, prog);
p.start(Html('#main'));
