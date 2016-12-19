$(function() {
	//require('nw.gui').Window.get().showDevTools();

    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'hms'
    });

    /*connection.connect();
    connection.query('SELECT * from customer', function(err, rows, fields) {
        if (!err)
            alert(rows[0].name);
        else
            console.log('Error while performing Query.');
    });
    connection.end();
*/
    $("#save").click(function() {
        var name = $("input[name='paitent-name']").val();
        console.log("name ", name);
        connection.connect();
	    connection.query('insert into hms.customer(name) values("'+name+'");', function(err, rows, fields) {
	        if (!err)
	            alert(rows);
	        else
	            alert('Error while performing Query.');
	    });
    });
});
