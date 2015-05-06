fun.views.dashboard = Backbone.View.extend({
   
    /**
    * Bind the event functions to the different HTML elements
    */
    events: {
        'click #diners-pay-btn': 'dinersAddFunds',
        'click #discover-pay-btn': 'discoverAddFunds',
        'click #master-pay-btn': 'masterAddFunds',
        'click #visa-pay-btn': 'visaAddFunds',
        'click #amex-pay-btn': 'amexAddFunds'
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

            // Diners
            this.dinersMerchant = this.$('#diners-merchant');
            this.dinersAddress = this.$('#diners-address');
            this.dinersPhone = this.$('#diners-phone');

            this.dinersEmail = this.$('#diners-email');
            this.dinersFunds = this.$('#diners-funds');
            this.dinersCCnumber = this.$('#diners-cc-number');
            this.dinersExpMonth = this.$('#diners-exp-month');
            this.dinersExpYear = this.$('#diners-exp-year');
            this.dinersCVC = this.$('#diners-cc-cvc');
            this.dinersName = this.$('#diners-cc-name');

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
        
            // MasterCard
            this.masterMerchant = this.$('#master-merchant');
            this.masterAddress = this.$('#master-address');
            this.masterPhone = this.$('#master-phone');

            this.masterEmail = this.$('#master-email');
            this.masterFunds = this.$('#master-funds');
            this.masterCCnumber = this.$('#master-cc-number');
            this.masterExpMonth = this.$('#master-exp-month');
            this.masterExpYear = this.$('#master-exp-year');
            this.masterCVC = this.$('#master-cc-cvc');
            this.masterName = this.$('#master-cc-name');

            // Visa
            this.visaMerchant = this.$('#visa-merchant');
            this.visaAddress = this.$('#visa-address');
            this.visaPhone = this.$('#visa-phone');

            this.visaEmail = this.$('#visa-email');
            this.visaFunds = this.$('#visa-funds');
            this.visaCCnumber = this.$('#visa-cc-number');
            this.visaExpMonth = this.$('#visa-exp-month');
            this.visaExpYear = this.$('#visa-exp-year');
            this.visaCVC = this.$('#visa-cc-cvc');
            this.visaName = this.$('#visa-cc-name');

            // Amex
            this.amexMerchant = this.$('#amex-merchant');
            this.amexAddress = this.$('#amex-address');
            this.amexPhone = this.$('#amex-phone');

            this.amexEmail = this.$('#amex-email');
            this.amexFunds = this.$('#amex-funds');
            this.amexCCnumber = this.$('#amex-cc-number');
            this.amexExpMonth = this.$('#amex-exp-month');
            this.amexExpYear = this.$('#amex-exp-year');
            this.amexCVC = this.$('#amex-cc-cvc');
            this.amexName = this.$('#amex-cc-name');
        }
        this.$el.show();
        console.log("username = " + this.account);
    },

    dinersAddFunds: function(event){
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

        console.log('add funds diners');

        userId = localStorage.getItem("UserId");

        merchant = this.dinersMerchant.val();
        address = this.dinersAddress.val();
        phone = this.dinersPhone.val();

        email = this.dinersEmail.val();
        funds = this.dinersFunds.val();
        ccNumber = this.dinersCCnumber.val();
        expMonth = this.dinersExpMonth.val();
        expYear = this.dinersExpYear.val();
        ccCVC = this.dinersCVC.val();
        ccName = this.dinersName.val();

        stuff = {
            merchant: merchant,
            address: address,
            phone: phone,
            email: email,
            card_name: ccName,
            amount_funds: funds,
            credit_card_number: ccNumber,
            credit_card_cvc: ccCVC,
            credit_card_type: 'diners',
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
                console.log(error);
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

                console.log(stuff);

            },
            error: function(model, error){
                console.log('CLX Error!');
            }
        };

        fundsCallback = {
            success: function(model, response){
                'use strict';
                var message;

                console.log('CLX load funds success');
                console.log(model);
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
                    message = translate('transactionBlocked'); 
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

                console.log(stuff);

            }
        };

        addFunds = new fun.models.Funds();
        addFunds.save(fundsPayload, fundsCallback);

        // Clear the stuff from the inputs
        view.$('#diners-merchant').val('');
        view.$('#diners-address').val('');
        view.$('#diners-phone').val('');
        

        view.$('#diners-email').val('');
        view.$('#diners-funds').val('');
        view.$('#diners-cc-number').val('');
        view.$('#diners-exp-month').val('');
        view.$('#diners-exp-year').val('');
        view.$('#diners-cc-cvc').val('');
        view.$('#diners-cc-name').val('');
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

    masterAddFunds: function(event){
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

        console.log('add funds master card');

        userId = localStorage.getItem("UserId");

        merchant = this.masterMerchant.val();
        address = this.masterAddress.val();
        phone = this.masterPhone.val();

        email = this.masterEmail.val();
        funds = this.masterFunds.val();
        ccNumber = this.masterCCnumber.val();
        expMonth = this.masterExpMonth.val();
        expYear = this.masterExpYear.val();
        ccCVC = this.masterCVC.val();
        ccName = this.masterName.val();

        var stuff = {
            merchant: merchant,
            address: address,
            phone: phone,
            email: email,
            card_name: ccName,
            amount_funds: funds,
            credit_card_number: ccNumber,
            credit_card_cvc: ccCVC,
            credit_card_type: 'master',
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

                console.log(stuff);

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

                console.log(stuff);
            }
        };

        addFunds = new fun.models.Funds();
        addFunds.save(fundsPayload, fundsCallback);

        // Clear the stuff from the inputs
        view.$('#master-merchant').val('');
        view.$('#master-address').val('');
        view.$('#master-phone').val('');

        view.$('#master-email').val('');
        view.$('#master-funds').val('');
        view.$('#master-cc-number').val('');
        view.$('#master-exp-month').val('');
        view.$('#master-exp-year').val('');
        view.$('#master-cc-cvc').val('');
        view.$('#master-cc-name').val('');
    },

    visaAddFunds: function(event){
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

        console.log('add funds visa card');

        userId = localStorage.getItem("UserId");

        merchant = this.visaMerchant.val();
        address = this.visaAddress.val();
        phone = this.visaPhone.val();

        email = this.visaEmail.val();
        funds = this.visaFunds.val();
        ccNumber = this.visaCCnumber.val();
        expMonth = this.visaExpMonth.val();
        expYear = this.visaExpYear.val();
        ccCVC = this.visaCVC.val();
        ccName = this.visaName.val();

        var stuff = {
            merchant: merchant,
            address: address,
            phone: phone,
            email: email,
            card_name: ccName,
            amount_funds: funds,
            credit_card_number: ccNumber,
            credit_card_cvc: ccCVC,
            credit_card_type: 'visa',
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

                console.log(stuff);

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

                console.log(stuff);
            }
        };

        addFunds = new fun.models.Funds();
        addFunds.save(fundsPayload, fundsCallback);

        // Clear the stuff from the inputs
        view.$('#visa-merchant').val('');
        view.$('#visa-address').val('');
        view.$('#visa-phone').val('');

        view.$('#visa-email').val('');
        view.$('#visa-funds').val('');
        view.$('#visa-cc-number').val('');
        view.$('#visa-exp-month').val('');
        view.$('#visa-exp-year').val('');
        view.$('#visa-cc-cvc').val('');
        view.$('#visa-cc-name').val('');
    },

    amexAddFunds: function(event){
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

        console.log('add funds amex card');

        userId = localStorage.getItem("UserId");

        merchant = this.amexMerchant.val();
        address = this.amexAddress.val();
        phone = this.amexPhone.val();

        email = this.amexEmail.val();
        funds = this.amexFunds.val();
        ccNumber = this.amexCCnumber.val();
        expMonth = this.amexExpMonth.val();
        expYear = this.amexExpYear.val();
        ccCVC = this.amexCVC.val();
        ccName = this.amexName.val();

        stuff = {
            merchant: merchant,
            address: address,
            phone: phone,
            email: email,
            card_name: ccName,
            amount_funds: funds,
            credit_card_number: ccNumber,
            credit_card_cvc: ccCVC,
            credit_card_type: 'amex',
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

                console.log(stuff);

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

                console.log(stuff);
            }
        };

        addFunds = new fun.models.Funds();
        addFunds.save(fundsPayload, fundsCallback);

        // Clear the stuff from the inputs
        view.$('#amex-merchant').val('');
        view.$('#amex-address').val('');
        view.$('#amex-phone').val('');

        view.$('#amex-email').val('');
        view.$('#amex-funds').val('');
        view.$('#amex-cc-number').val('');
        view.$('#amex-exp-month').val('');
        view.$('#amex-exp-year').val('');
        view.$('#amex-cc-cvc').val('');
        view.$('#amex-cc-name').val('');
    }
});