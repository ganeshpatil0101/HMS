$(function() {
    //$('#side-menu').metisMenu();
});

//Loads the correct sidebar on window load,
//collapses the sidebar on window resize.
// Sets the min-height of #page-wrapper to window size
$(function() {
    
    //nw.Window.get().showDevTools();

    var NOOFPAITENT = "#no-of-paitent", TODAYSACTIVITY = "#todays-activity", TOTALCREDITBAL = "#total-credit-bal";

    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host: CONFIG.HOST,
        user: CONFIG.USER,
        password: CONFIG.PASSWORD,
        database: CONFIG.DATABASE
    });

    connection.connect();

    var todayActQuery = "SELECT count(id) as TodaysActivity FROM hms.activity WHERE activitydate like '12/25/2016';";
    connection.query(todayActQuery, function(err, rows, fields) {
        try {
            if(rows) {
                $(TODAYSACTIVITY).html(rows[0].TodaysActivity);
            }
            if(err){
                alert("Error In DashBoard");
                alert(err);
                console.error(err);
            }
        } catch (e) {
            alert("error "+e);
        }
    });

    var noOfPaitentQuery = "SELECT count(id) as NoOfPaitent, sum(pbalance) as totalCredit FROM hms.customer;";
    connection.query(noOfPaitentQuery, function(err, rows, fields) {
        try {
            if(rows) {
                $(NOOFPAITENT).html(rows[0].NoOfPaitent);
                $(TOTALCREDITBAL).html(rows[0].totalCredit);
            }
            if(err){
                alert("Error In DashBoard");
                alert(err);
                console.error(err);
            }
        } catch (e) {
            alert("error "+e);
        }
    });


    window.onunload = function() {
        connection.end();
    };
    
    $(window).bind("load resize", function() {
        var topOffset = 50;
        var width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
        if (width < 768) {
            $('div.navbar-collapse').addClass('collapse');
            topOffset = 100; // 2-row-menu
        } else {
            $('div.navbar-collapse').removeClass('collapse');
        }

        var height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
        height = height - topOffset;
        if (height < 1) height = 1;
        if (height > topOffset) {
            $("#page-wrapper").css("min-height", (height) + "px");
        }
    });

    var url = window.location;
    // var element = $('ul.nav a').filter(function() {
    //     return this.href == url;
    // }).addClass('active').parent().parent().addClass('in').parent();
    var element = $('ul.nav a').filter(function() {
        return this.href == url;
    }).addClass('active').parent();

    while (true) {
        if (element.is('li')) {
            element = element.parent().addClass('in').parent();
        } else {
            break;
        }
    }
});
