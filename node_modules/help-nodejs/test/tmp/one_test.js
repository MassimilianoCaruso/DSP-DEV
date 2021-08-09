var test = require('tape');
 
test('timing test', function (t) {
    //2 asserzioni devono essere chiamate
    t.plan(2);
    
    t.equal(typeof Date.now, 'function');
    var start = Date.now();
    
    setTimeout(function () {
        t.equal(Date.now() - start, 100);
    }, 100);
});
