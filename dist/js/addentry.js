$(function() {
    
	//nw.Window.get().showDevTools();

    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host: CONFIG.HOST,
        user: CONFIG.USER,
        password: CONFIG.PASSWORD,
        database: CONFIG.DATABASE
    });

    connection.connect();
    
    var CREDIT = "credit", CASHPAID = "cashpaid";
    var PAITENT_NAME = "input[name='paitent-name']",
    	PAITENT_ID = "input[name='paitent-id']",
    	MOBILE = "input[name='mobile']",
    	PREVIOUS_BALANCE = "input[name='previous-balance']",
    	PAID_AMOUNT = "input[name='paid-amount']",
    	ACT_DATE = "input[name='activity-date']",
    	P_TYPE = "input[name='payment-type']:checked";

    $(ACT_DATE).datepicker({
        todayBtn: "linked",
        autoclose: true,
        todayHighlight: true
    });

    $(ACT_DATE).datepicker("setDate", new Date());

    $("#save").click(function() {
        var name, mobile, paidAmount, isOldPaitent = false, pbalance, pType;
        name = $(PAITENT_NAME).val();
        pid = $(PAITENT_ID).val();
        mobile = $(MOBILE).val();
        pbalance = parseInt($(PREVIOUS_BALANCE).val());
        paidAmount = parseInt($(PAID_AMOUNT).val());
		activityDate = $(ACT_DATE).val();
		pType = $(P_TYPE).val();

        if(typeof(pid) !== 'undefined' && pid != null && pid != "") {
        	isOldPaitent = true;
        }
        try{
        	var saveCallback = function(err, result) {
		        if (!err) {
		        	if(result.insertId) {
			        	saveActivity(result.insertId, paidAmount, activityDate, pType, function(err, result) {
			        		if(!err) {
			        			alert("Record saved !!!");
			        			$('form').find("input[type=text]").val("");
			        			$(PAITENT_ID).val("");
			        			$(ACT_DATE).datepicker("setDate", new Date());
			        		} else {
			        			alert("Error In AddEntry");
					            alert(err);
					            console.error(err);
			        		}
			        	});
			        }
		        } else {
		        	alert("Error In AddEntry");
		            alert(err);
		            console.error(err);
		        }
		    };
        	if(!isOldPaitent) {
	        	savePaitent(name, mobile, paidAmount, pbalance, pType, saveCallback);
	        } else {
	        	updatePaitentBalance(pid, paidAmount, pbalance, pType, saveCallback);
	        }
        } catch (e) {
        	alert(e);
        }
    });

    function savePaitent(name, mobile, paidAmount, pbalance, pType, callback) {
    	var pBal = pbalance;
    	if(pType == CREDIT) {
    		pBal = paidAmount;
    	}
    	connection.connect();

	    connection.query('insert into hms.customer(full_name, mobile, pbalance) values("'+name+'","'+mobile+'",'+pBal+');', callback);
    }

    function updatePaitentBalance(pid, paidAmount, pbalance, pType, callback) {
    	var pBal = pbalance;
    	if(pType == CREDIT) {
    		pBal = pbalance + paidAmount;
    	} else if(pType == CASHPAID) {
    		if(pbalance < paidAmount ) {
	    		pBal = 0;
	    	} else {
	    		pBal = pbalance - paidAmount;
	    	}
    	}
    	connection.connect();
	    connection.query('UPDATE hms.customer SET pbalance = '+pBal+' WHERE id = '+pid+';', function(err, res){
	    	res.insertId = pid;
	    	callback(err, res);	
	    });
    }

    function saveActivity(pid, paidAmount, activityDate, pType, callback) {
    	if(pType == CREDIT) {
			paidAmount = 0 - paidAmount;
    	}
    	connection.connect();

	    connection.query('insert into hms.activity(paidamount, activitydate, pid) values('+paidAmount+',"'+activityDate+'",'+pid+');', callback);
    }
    var sources = [
        { id: 1, full_name: 'demo', mobile:'9325137778', pbalance: 100 },        
    ];


    document.getElementsByName('paitent-name')[0].addEventListener("keyup", function(e) {
        switch (e.keyCode) {
            case 40: // down arrow
            case 38: // up arrow
            case 16: // shift
            case 17: // ctrl
            case 18: // alt
                break;
            case 9: // tab
            case 13: // enter
                break;
            case 27: // escape                            
                break
            default:
                var params = document.getElementsByName('paitent-name')[0].value;
                var query = "SELECT id, full_name, mobile, pbalance from customer where full_name like '%"+params+"%'";
	            connection.query(query, function(err, rows, fields) {
	        		try {
	        			//if(!rows) {
	        				typeh.render(rows);
	        			//}
	        			if(err) {
			                alert("Error In searching names");
			                alert(err);
			                console.error(err);
			            }
                    } catch (e) {
                        alert("error "+e);
                    }
			    });
        }
    });

    function displayResult(item) {
    	if(item) {
    		$(PAITENT_ID).val(item.value);
    		$(MOBILE).val(item.mobile);
    		$(PREVIOUS_BALANCE).val(item.pbalance);
    	}
    	$(PAID_AMOUNT).focus();
    };
    var typeh = $(PAITENT_NAME).typeahead({
        source: sources,
        displayField: 'full_name',
        onSelect: displayResult
    });
 	
 	window.onunload = function() {
		connection.end();
	};

});
