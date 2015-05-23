
var stuff = {};
var settle = {};
var search = {};

var oneA = function () {
    var d = Q.defer();
    var timeUntilResolve = Math.floor((Math.random()*2000)+1);
    console.log('1A Starting');
    setTimeout(function () {
        console.log('1A Finished');
        d.resolve('1ATime: ' + timeUntilResolve);
    }, timeUntilResolve);
    return d.promise;
};

var oneB = function () {
    var d = Q.defer();
    var timeUntilResolve = Math.floor((Math.random()*2000)+1);
    console.log('1B Starting');
    setTimeout(function () {
        console.log('1B Finished');
        d.resolve('1BTime: ' + timeUntilResolve);
    }, timeUntilResolve);
    return d.promise;
};

// This fuction throws an error which later on we show will be handled
var twoA = function (oneATime, oneBTime) {
    var d = Q.defer();
    console.log('OneA: ' + oneATime + ', OneB: ' + oneBTime);
    console.log('2 Starting and Finishing, so 3A and 3B should start');
    d.resolve();
    //return d.promise;
};

var threeA = function () {
    var d = Q.defer();
    console.log('3A Starting');
    setTimeout(function () {
        console.log('3A Finished');
        d.resolve();
    }, Math.floor((Math.random()*2000)+1));
    return d.promise;
};

var threeB = function () {
    var d = Q.defer();
    console.log('3B Starting');
    setTimeout(function () {
        console.log('3B Finished');
        d.resolve();
    }, Math.floor((Math.random()*5000)+1));
    return d.promise;
};

var fourA = function () {
    console.log('Four is now done');
};



var one = function (uri) {
            
    var deferred = Q.defer(); // Don't worry yet what this is
                              // until after you understand the flow
            
    console.log("Starting one's ajax");
    $.ajax( {
        url: uri,
        success: function(response) {
                    
            // Here's where you want to call the next function in the
            // list if there is one. To do it, call deferred.resolve()
            console.log(response);

            console.log('Finished with one. Ready to call next.');
            deferred.resolve();
        },
        error: function(error){
            console.log('Fail to resolve promise reject error %s.', error);
            deferred.reject(new Error(error));
        }
    });
            
    // The deferred object has a "promise" member, 
    // which has a "then" function
    return deferred.promise;
};

var two = function () {
    var deferred = Q.defer();
    console.log("Starting two's ajax");
    $.ajax( {
        url: '/system/',
        success: function(response) {
                    
            // Again, this is where you want to call the next function
            // in the list if there is one.
            console.log(response);

            console.log('Finished with two. Ready to call next.');
            deferred.resolve();
                    
        },
        error: function(error){
            console.log('Fail to resolve promise reject error %s.', error);
            deferred.reject(new Error(error));
        }
                
    });
    // The deferred object has a "promise" member,
    // which has a "then" function
    return deferred.promise;
};

var three = function () {
    var deferred = Q.defer();
    console.log("Starting three's ajax");
    $.ajax( {
        url: '/system/',
        success: function(response) {
                    
            // Again, this is where you want to call the next function
            // in the list if there is one.
            console.log(response);

            console.log('Finished with three. Ready to call next if there is one.');
            deferred.resolve();
                    
        },
        error: function(error){
            console.log('Fail to resolve promise reject error %s.', error);
            deferred.reject(new Error(error));
        }
                
    });
    // The deferred object has a "promise" member, which has a "then" function
    return deferred.promise;
};


var resource = function(response){
    _.each(response.transactions, function(o) {

        //console.log(o);
        //alert(o.transaction);

        search['TransactionNum'] = o.transaction;

        transaction = new fun.models.searchTransactions();
        transaction.save(searchTransPayload, searchTransCallback);
    });
};

var find = function(response){
    _.each(response.transactions, function(o) {

            //console.log(o);
            //alert(o.transaction);

            search['TransactionNum'] = o.transaction;

            transaction = new fun.models.searchTransactions();
            transaction.save(searchTransPayload, searchTransCallback);
    });
};

var modelErrorHandler = function(model, error){
    console.log('resources error model %s error %s', model, error);
};

var getTransactions = function(response){
    'use strict';
    var deferred = Q.defer();
    console.log(JSON.stringify(response));
    var summary = response['CustomerSummary'] || undefined;
    if (summary === undefined) {
        deferred.reject(new Error("can't get new valid token"));
    } else {
        var token = summary['CustomerToken'] || undefined;
    }

    if (token === undefined){
        deferred.reject(new Error("can't get new valid token"));
    } else {
        stuff['CustomerToken'] = token;
        settle['CustomerToken'] = token;
    };
    
    var transactions = new fun.models.Transactions();
    transactions.fetch({
        success: function(response){
            console.log(response)
            resource(response);
            deferred.resolve();
        },
        error: function(error){
            console.log(error);
            deferred.reject(new Error(error));
        }
    });
    return deferred.promise;

    //return transactions;

};


fun.views.money = Backbone.View.extend({

    events : {
        'click #fun-btn-send' : 'sendTransfer',
    },
    
    initialize: function(options){
        fun.containers.reports = this.$el;
    },

    render: function(){
        'use strict';
        var template;
        if (!this.$el.html()){
            template = _.template(fun.utils.getTemplate(fun.conf.templates.sendMoney));

            this.confirmAmount = this.$('#s-amount');

            this.$el.html(template);
        }
        
        this.$el.show();
    },

    sendTransfer: function(event){
        'use strict';
        event.preventDefault();


        Q.all([ oneA(), oneB() ])
            .spread(twoA)
            .then(function () { return Q.all([ threeA(), threeB() ]); })
            .then(fourA)
            .done();

        var userId = localStorage.getItem("UserId");

        if (typeof(userId) != "undefined"){
            userId = fun.conf.clxUserId;
        }

        var countryCode = localStorage.getItem("UserCountryCode");

        var cellPhone = localStorage.getItem("UserPhoneNumber").substr(1);

        var customer = new fun.models.customerSearch();

        var customerPayload = {
            "Culture": fun.conf.clxCulture,
            "ApplicationId": fun.conf.clxAppId,
            "UserId": userId,
            "CountryCode": countryCode,
            "CellPhone": cellPhone
        };

        var searchTransPayload = {
            "Culture": fun.conf.clxCulture,
            "ApplicationId": fun.conf.clxAppId,
            "UserId": userId
            //"TransactionNum": "2341100093"
        };

        var resourceCallbacks = {
            success: function(response){
                console.log(response)
                resource(response);
            },
            error: function(error){
                console.log(error);
            },
        };

        var customerCallback = {
            success: function(response){
                getTransactions(response);
            },
            error: function(error){
                console.log(error);
            }
        };

        
        // Test it out. Call the first. Pass the functions 
        // (without calling them, so no parentheses) into the then calls.
        var errorHandler = function (error) {
            console.log('inside error stuff');
            console.log(JSON.stringify(error));
        };

        //one('/system/').then(two).then(three).fail(function (error) {console.log('inside fail %s', JSON.stringify(error))});

        this.model = customer;

        var promise = this.model.save(customerPayload, customerCallback);
        //, customerCallback

        console.log('guagua');

        $.when(promise)
            .then(two)
            .then(undefined, errorHandler)
            .done(function(response) {console.log("Success! %s", response);})
            .fail(function(response) {console.log("Error! %s", response);});

        console.log('da fuck bro...');

        //var deferred = $.Deferred();
        //deferred.then(function(value) {
        //  alert(value);
        //  return 66;
        //}).then(function(id){
        //  alert('The answer : ' + id);
        //});

        //console.log(deferred)

        //deferred.resolve("hello world");
        
        //var promise = this.model.save(); 
        //$.when(promise).then(null, function(obj) {
        //    console.log(obj);
        //});

        one('/system/').then(two).then(three).fail(function (error) {console.log('inside fail %s', JSON.stringify(error))});
        
        //then(two).then(three).done(function(response) {console.log("Success!");}).fail(function (error) {console.log('inside fail %s', JSON.stringify(error))});
    },

    sendMoney: function (event){
        /*
         find report
        */
        'use strict';
        var amount,
            view = this,
            stuffx,
            amount,
            userId,
            countryCode,
            cellPhone,
            customer,
            customerPayload,
            customerCallback,
            send_money,
            stuff,
            callbackStuff,
            settle,
            settlePayload,
            settleCallback,
            resources,
            count,
            status,
            callbacks,
            statusPayload,
            statusCallback,
            transaction,
            transactions,
            transactionsCallback,
            transactionsPayload,
            search_trans,
            searchTransPayload,
            searchTransCallback;


        userId = localStorage.getItem("UserId");

        if (typeof(userId) != "undefined"){
            userId = fun.conf.clxUserId;
        }

        countryCode = localStorage.getItem("UserCountryCode");

        cellPhone = localStorage.getItem("UserPhoneNumber").substr(1);

        stuff = {
            "Culture": fun.conf.clxCulture,
            "ApplicationId": fun.conf.clxAppId,
            "UserId": userId,
            "RecipientId": 1,
            "RecipientAccountId": 1,
            "Amount": amount
        };

        customerPayload = {
            "Culture": fun.conf.clxCulture,
            "ApplicationId": fun.conf.clxAppId,
            "UserId": userId,
            "CountryCode": countryCode,
            "CellPhone": cellPhone
        };

        settlePayload = {
            "Culture": fun.conf.clxCulture,
            "ApplicationId": fun.conf.clxAppId,
            "UserId": userId
        };

        statusPayload = {
            "Culture": "en-US",
            "ApplicationId": fun.conf.clxAppId,
            "UserId": userId
        };



        transactions = {};

        transactionsCallback = {};

        transactionsPayload = {};

        searchTransPayload = {
            "Culture": fun.conf.clxCulture,
            "ApplicationId": fun.conf.clxAppId,
            "UserId": userId
            //"TransactionNum": "2341100093"
        };

        searchTransCallback = {
            success: function(model, response){
                console.log(response);

                var total = response['Transaction']['Total'];
                var amount = response['Transaction']['Amount'];

                stuff['Amount'] = String(total);

                console.log(stuff);


                send_money = new fun.models.sendMoney();
                send_money.save(stuff, callbackStuff);
            },
            error: function(model, error){
                console.log(error);
            }
        };


        callbackStuff = {
            success: function(model, response){
                console.log(response);

                var transaction_num = response['Transaction']['TransactionNum'];

                settlePayload['TransactionNum'] = transaction_num;

                statusPayload['TransactionNum'] = transaction_num;

                var confirm = new fun.models.Transaction({'TransactionNum':transaction_num});
                confirm.save({'checked': true}, {patch: true});

                settle = new fun.models.Settle();
                settle.save(settlePayload, settleCallback);
            },
            error: function(model, error){
                console.log(error);
            }
        };


        var resourceCallbacks = {
            success: function(model, response){

                _.each(response.transactions, function(o) {

                    //console.log(o);
                    //alert(o.transaction);

                    searchTransPayload['TransactionNum'] = o.transaction;

                    transaction = new fun.models.searchTransactions();
                    transaction.save(searchTransPayload, searchTransCallback);
                });

            },
            error: function(model, error){
                console.log('resources error');
            }
        };


        callbacks = {
            success: function(model, response){
                console.log(response);
            },
            error: function(model, error){
                console.log(error);
            }
        };


        customerCallback = {
            success: function(model, response){
                stuff['CustomerToken'] = response['CustomerSummary']['CustomerToken'];

                settlePayload['CustomerToken'] = response['CustomerSummary']['CustomerToken'];
                statusPayload['CustomerToken'] = response['CustomerSummary']['CustomerToken'];
 
                transactions = new fun.models.Transactions();
                transactions.fetch(resourceCallbacks);
            },
            error: function(model, error){
                console.log(error);
            }
        };

        settleCallback = {
            success: function(model, response){
                console.log('settle callbacks success');
                console.log(response);

                status = new fun.models.transactionStatus();
                status.save(statusPayload, statusCallback);

                // after cuallix call store the transaction
                //payment = new fun.models.Payment();
                //payment.save(stuff, payCallbacks);

            },
            error: function(model, error){
                console.log('CLX Error!');
                console.log(error);
            }
        };

        statusCallback = {
            success: function(model, response){
                console.log(response);
                var message = 'Transaction ' + response['TransactionStatus'];
                alert(message);
                fun.utils.hideAll();
                fun.utils.redirect(fun.conf.hash.banner);
            },
            error: function(model, error){
                console.log(error);
            }
        };

        customer = new fun.models.customerSearch();
        customer.save(customerPayload, customerCallback);
    }

});