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
            status,
            statusPayload,
            statusCallback;

        this.amount = this.$('#s-amount');

        amount = this.amount.val();

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


        callbackStuff = {
            success: function(model, response){
                console.log(response);

                settlePayload['TransactionNum'] = response['Transaction']['TransactionNum'];
                statusPayload['TransactionNum'] = response['Transaction']['TransactionNum'];

                settle = new fun.models.Settle();

                settle.save(settlePayload, settleCallback);
            },
            error: function(model, error){
                console.log(error);
            }
        },

        customerCallback = {
            success: function(model, response){
                stuff['CustomerToken'] = response['CustomerSummary']['CustomerToken'];

                settlePayload['CustomerToken'] = response['CustomerSummary']['CustomerToken'];
                statusPayload['CustomerToken'] = response['CustomerSummary']['CustomerToken'];
                

                send_money = new fun.models.sendMoney();
                send_money.save(stuff, callbackStuff)
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

            },
            error: function(model, error){
                console.log(error);
            }
        };

        customer = new fun.models.customerSearch();
        customer.save(customerPayload, customerCallback);
    }

});