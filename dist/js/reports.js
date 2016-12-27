$(document).ready(function() {

    //nw.Window.get().showDevTools();

    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host: CONFIG.HOST,
        user: CONFIG.USER,
        password: CONFIG.PASSWORD,
        database: CONFIG.DATABASE
    });

    connection.connect();
    var dataSet = [];
    var query = "SELECT id, full_name, mobile, pbalance from hms.customer";
    connection.query(query, function(err, rows, fields) {
        try {
            //if(!rows) {
            for (var i = 0; i < rows.length; i++) {
                var tmp = [];
                tmp.push(rows[i].id);
                tmp.push(rows[i].full_name);
                tmp.push(rows[i].mobile);
                tmp.push(rows[i].pbalance);
                dataSet.push(tmp);
            }
            loadReport(dataSet);
            //}
        } catch (e) {
            alert("error " + e);
        }
    });
    var loadReport = function(dataSet) {
        $('#dataTables-example').DataTable({
            responsive: true,
            data: dataSet,
            columns: [
                { title: "ID" },
                { title: "Full Name" },
                { title: "Mobile" },
                { title: "Previous Balance" }
            ]
        });
    };


    window.onunload = function() {
        connection.end();
    };
});
