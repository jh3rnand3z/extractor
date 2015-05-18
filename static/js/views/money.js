fun.views.money = Backbone.View.extend({

    events : {
        'click #fun-btn-send' : 'sendMoney',
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