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
            settleCallback;

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

        callbackStuff = {
            success: function(model, response){
                console.log(response);
            },
            error: function(model, error){
                console.log(error);
            }
        },

        customerPayload = {
            "Culture": fun.conf.clxCulture,
            "ApplicationId": fun.conf.clxAppId,
            "UserId": userId,
            "CountryCode": countryCode,
            "CellPhone": cellPhone
        };

        customerCallback = {
            success: function(model, response){
                stuff['CustomerToken'] = response['CustomerSummary']['CustomerToken'];
                
                send_money = new fun.models.sendMoney();
                send_money.save(stuff, callbackStuff)
            },
            error: function(model, error){
                console.log(error);
            }
        };

        settlePayload = {
            "Culture": fun.conf.clxCulture,
            "ApplicationId": fun.conf.clxAppId,
            "UserId": userId,
            "CustomerToken": customerToken,
            "TransactionNum": transactionNum
        }

        settleCallback = {
            success: function(model, response){
                console.log('settle callbacks success');
                console.log(response);

                stuff['AuthorizationNum'] = response['AuthorizationNum'];
                stuff['Status'] = response['Status'];

                // after cuallix call store the transaction
                payment = new fun.models.Payment();
                payment.save(stuff, payCallbacks);

                console.log(stuff)

            },
            error: function(model, error){
                console.log('CLX Error!');
            }
        };

        customer = new fun.models.customerSearch();
        customer.save(customerPayload, customerCallback);
    }

});