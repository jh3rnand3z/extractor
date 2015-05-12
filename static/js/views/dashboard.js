fun.views.dashboard = Backbone.View.extend({
   
    /**
    * Bind the event functions to the different HTML elements
    */
    events: {
        'click #discover-pay-btn': 'discoverAddFunds',
        'click #new-cc-payment': 'newPayment',
        'click #load-iframe': 'loadIframe',
    },

    initialize: function(options){
        // initialize view constructor
        'use strict';
        fun.containers.dashboard = this.$el;

        this.account = localStorage.getItem("username");

        this.userId = localStorage.getItem("UserId");
    },

    render: function(){
        'use strict';
        var template;
        if (!this.$el.html()){
            template = _.template(fun.utils.getTemplate(fun.conf.templates.dashboard));
            this.$el.html(template);

            // DOM cache stuff on form fields.

            // Discover
            this.discoverMerchant = this.$('#discover-merchant');
            this.discoverAddress = this.$('#discover-address');
            this.discoverPhone = this.$('#discover-phone');

            this.discoverEmail = this.$('#discover-email');
            this.discoverFunds = this.$('#discover-funds');
            this.discoverCCnumber = this.$('#discover-cc-number');
            this.discoverExpMonth = this.$('#discover-exp-month');
            this.discoverExpYear = this.$('#discover-exp-year');
            this.discoverCVC = this.$('#discover-cc-cvc');
            this.discoverName = this.$('#discover-cc-name');
        }
        this.$el.show();
        console.log("username = " + this.account);
    },

    discoverAddFunds: function(event){
        'use strict';
        event.preventDefault();
        var view = this,
            stuff,
            userId,
            payment,
            payCallbacks,
            addFunds,
            fundsPayload,
            fundsCallback,
            message,
            merchant,
            address,
            phone,
            email,
            funds,
            settle,
            settlePayload,
            settleCallback,
            customerToken,
            transactionNum,
            ccNumber,
            expYear,
            expMonth,
            ccCVC,
            ccName;

        console.log('add funds discover');

        userId = localStorage.getItem("UserId");

        merchant = this.discoverMerchant.val();
        address = this.discoverAddress.val();
        phone = this.discoverPhone.val();

        email = this.discoverEmail.val();
        funds = this.discoverFunds.val();
        ccNumber = this.discoverCCnumber.val();
        expMonth = this.discoverExpMonth.val();
        expYear = this.discoverExpYear.val();
        ccCVC = this.discoverCVC.val();
        ccName = this.discoverName.val();

        var stuff = {
            merchant: merchant,
            address: address,
            phone: phone,
            email: email,
            card_name: ccName,
            amount_funds: funds,
            credit_card_number: ccNumber,
            credit_card_cvc: ccCVC,
            credit_card_type: 'discover',
            exp_month: expMonth,
            exp_year: expYear
        };

        payCallbacks = {
            success: function(model, response){
                console.log('payment callbacks success');
                console.log(response);
            },
            error: function(model, error){
                console.log('CLX Error');
            }
        };

        fundsPayload = {
            "Culture": fun.conf.clxCulture,
            "ApplicationId": fun.conf.clxAppId,
            "UserId": userId,
            "Amount": funds
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

        fundsCallback = {
            success: function(model, response){
                console.log('CLX load funds success');
                console.log(response);
                stuff['CustomerToken'] = response['CustomerToken'];
                stuff['Transaction'] = response['Transaction'];
                stuff['Status'] = response['Status'];

                // cuallix settle transaction

                settle = new fun.models.Settle();

                settlePayload['CustomerToken'] = response['CustomerToken'];

                settlePayload['TransactionNum'] = response['Transaction']['TransactionNum'];

                settle.save(settlePayload, settleCallback);

                
                if (response['Status']['Code'] == 200000){
                    message = translate('transactionSubmitted'); 
                    alert(message);
                } else {
                    var message = translate('transactionBlocked'); 
                    alert(message);
                }

            },
            error: function(model, error){
                console.log('CLX Error');
                console.log(error);

                console.log('inside error in fundsCallback');

                stuff['Status'] = error['Status'];

                payment = new fun.models.Payment();
                payment.save(stuff, payCallbacks);

                console.log(stuff)
            }
        };

        addFunds = new fun.models.Funds();
        addFunds.save(fundsPayload, fundsCallback);

        // Clear the stuff from the inputs
        view.$('#discover-merchant').val('');
        view.$('#discover-address').val('');
        view.$('#discover-phone').val('');
        
        view.$('#discover-email').val('');
        view.$('#discover-funds').val('');
        view.$('#discover-cc-number').val('');
        view.$('#discover-exp-month').val('');
        view.$('#discover-exp-year').val('');
        view.$('#discover-cc-cvc').val('');
        view.$('#discover-cc-name').val('');
    },

    newPayment: function(event){
        'use strict';
        event.preventDefault();
        var view = this,
            countryCode,
            cellPhone,
            stuff,
            paymentStuff,
            stuffCallback,
            callbackStuff,
            customer,
            request_url,
            userId;

        console.log('process new payment');

        userId = localStorage.getItem("UserId");

        if (typeof(userId) != "undefined"){
            userId = fun.conf.clxUserId;
        }

        countryCode = localStorage.getItem("UserCountryCode");

        cellPhone = localStorage.getItem("UserPhoneNumber").substr(1);

        console.log(userId);

        stuff = {
            "Culture": fun.conf.clxCulture,
            "ApplicationId": fun.conf.clxAppId,
            "UserId": userId,
            "CountryCode": countryCode,
            "CellPhone": cellPhone
        },

        paymentStuff = {
             "Culture": fun.conf.clxCulture,
             "ApplicationId": fun.conf.clxAppId,
             "UserId": userId,
             "Service": 3,
             "SessionDuration": 5,
             "urlOk": "http://demo.techgcs.com/cuallix/send/money/",
             "urlError": "http://demo.techgcs.com/#error" // test sending this to the backend and get the arg values.
        },

        callbackStuff = {
            success: function(model, response) {

                //fun.utils.openTab(response['Url']);

                fun.utils.openInIframe('#cuallix-iframe', response['Url']);

                // some stuff is missing but we don't know what stuffs ...
                console.log(response);
            },
            error: function(model, error) {
                console.log(error);
            }
        }

        stuffCallback = {
            success: function(model, response) {
                console.log(response);
                paymentStuff['CustomerToken'] = response['CustomerSummary']['CustomerToken'];

                request_url = new fun.models.paymentUrl();
                request_url.save(paymentStuff, callbackStuff)

            },
            error: function(model, error) {
                console.log(error);
            }
        }

        customer = new fun.models.customerSearch();
        customer.save(stuff, stuffCallback);


    },

    loadIframe: function(event){
        'use strict';
        event.preventDefault();
        var view = this;
        console.log('log iframe bitches!');
    }
});