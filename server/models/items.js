// CREATE A SINGLE USER
//curl --data 'email=juju@test.com2&phoneNumber=415-111-111&password=jujupw&userName=AdminJuJu' http://127.0.0.1:3000/api/v1/items
router.post('/api/v1/items', function(req, res) {

    var results = [];

    // Grab data from http request
    var data = {name: req.body.name, itemUrl: req.body.itemUrl, itemImageUrl:req.body.itemImageUrl, currentPrice:req.body.currentPrice};

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Insert Data
        client.query('INSERT INTO items(name, itemUrl, itemImageUrl, currentPrice) values($1, $2, $3, $4)', [data.name, data.itemUrl, data.itemImageUrl, data.currentPrice]);

        // SQL Query > Select Data
        var query = client.query('SELECT * FROM items ORDER BY id ASC');

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);
        });


    });
});

//READ GET ALL USERS
router.get('/api/v1/items', function(req, res) {

    var results = [];

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Select Data
        var query = client.query('SELECT * FROM items ORDER BY id ASC;');

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);
        });

    });

});

//UPDATE A SINGLE USER
//curl -X PUT --data 'email=test@test.com&phoneNumber=510-111-1111&password=jujupw&userName=JuJu' http://127.0.0.1:3000/api/v1/users/1
router.put('/api/v1/items/:item_id', function(req, res) {

    var results = [];

    // Grab data from the URL parameters
    var id = req.params.item_id;

    // Grab data from http request
    var data = {name: req.body.name, itemUrl: req.body.itemUrl, itemImageUrl:req.body.itemImageUrl, currentPrice:req.body.currentPrice};

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).send(json({ success: false, data: err}));
        }

        // SQL Query > Update Data
        client.query('UPDATE items SET email=($1), phoneNumber=($2), password=($3), userName=($4) WHERE id=($5)', [data.name, data.itemUrl, data.itemImageUrl, data.currentPrice, id]);

        // SQL Query > Select Data
        var query = client.query('SELECT * FROM items ORDER BY id ASC');

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);
        });
    });

});