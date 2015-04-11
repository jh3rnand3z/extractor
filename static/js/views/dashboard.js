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
    },

    render: function(){
        'use strict';
        var template;
        if (!this.$el.html()){
            template = _.template(fun.utils.getTemplate(fun.conf.templates.dashboard));
            this.$el.html(template);

            // DOM cache stuff on form fields.

            // Diners
            this.dinersEmail = this.$('#diners-email');
            this.dinersFunds = this.$('#diners-funds');
            this.dinersCCnumber = this.$('#diners-cc-number');
            this.dinersExpMonth = this.$('#diners-exp-month');
            this.dinersExpYear = this.$('#diners-exp-year');
            this.dinersCVC = this.$('#diners-cc-cvc');
            this.dinersName = this.$('#diners-cc-name');

            // Discover
            this.discoverEmail = this.$('#discover-email');
            this.discoverFunds = this.$('#discover-funds');
            this.discoverCCnumber = this.$('#discover-cc-number');
            this.discoverExpMonth = this.$('#discover-exp-month');
            this.discoverExpYear = this.$('#discover-exp-year');
            this.discoverCVC = this.$('#discover-cc-cvc');
            this.discoverName = this.$('#discover-cc-name');
        
            // MasterCard
            this.masterEmail = this.$('#master-email');
            this.masterFunds = this.$('#master-funds');
            this.masterCCnumber = this.$('#master-cc-number');
            this.masterExpMonth = this.$('#master-exp-month');
            this.masterExpYear = this.$('#master-exp-year');
            this.masterCVC = this.$('#master-cc-cvc');
            this.masterName = this.$('#master-cc-name');

            // Visa
            this.visaEmail = this.$('#visa-email');
            this.visaFunds = this.$('#visa-funds');
            this.visaCCnumber = this.$('#visa-cc-number');
            this.visaExpMonth = this.$('#visa-exp-month');
            this.visaExpYear = this.$('#visa-exp-year');
            this.visaCVC = this.$('#visa-cc-cvc');
            this.visaName = this.$('#visa-cc-name');

            // Amex
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
            payment,
            payCallbacks,
            email,
            funds,
            ccNumber,
            expYear,
            expMonth,
            ccCVC,
            ccName;

        console.log('add funds diners');

        email = this.dinersEmail.val();
        funds = this.dinersFunds.val();
        ccNumber = this.dinersCCnumber.val();
        expMonth = this.dinersExpMonth.val();
        expYear = this.dinersExpYear.val();
        ccCVC = this.dinersCVC.val();
        ccName = this.dinersName.val();

        var stuff = {
            email: email,
            card_name: ccName,
            amount_funds: funds,
            credit_card_number: ccNumber,
            credit_card_cvc: ccCVC,
            credit_card_type: 'diners',
            exp_month: expMonth,
            exp_year: expYear
        };

        console.log(stuff);

        payCallbacks = {
            success: function(model, response){
                /*
                assignPayload = {
                    "Culture": fun.conf.clxCulture,
                    "ApplicationId": fun.conf.clxAppId,
                    "UserId": response['UserId']
                };
                mangoPayload['UserId'] = response['UserId'];

                var stuff = new fun.models.Assign();
                stuff.save(assignPayload, assignCbacks);
                */

                console.log('payment callbacks success');
                console.log(response);
            },
            error: function(model, error){
                console.log('CLX Error');
            }
        };

        payment = new fun.models.Payment();
        payment.save(stuff, payCallbacks);

        // Clear the stuff from the inputs
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
            payment,
            payCallbacks,
            email,
            funds,
            ccNumber,
            expYear,
            expMonth,
            ccCVC,
            ccName;

        console.log('add funds discover');

        email = this.discoverEmail.val();
        funds = this.discoverFunds.val();
        ccNumber = this.discoverCCnumber.val();
        expMonth = this.discoverExpMonth.val();
        expYear = this.discoverExpYear.val();
        ccCVC = this.discoverCVC.val();
        ccName = this.discoverName.val();

        var stuff = {
            email: email,
            card_name: ccName,
            amount_funds: funds,
            credit_card_number: ccNumber,
            credit_card_cvc: ccCVC,
            credit_card_type: 'discover',
            exp_month: expMonth,
            exp_year: expYear
        };

        console.log(stuff);

        payCallbacks = {
            success: function(model, response){
                /*
                assignPayload = {
                    "Culture": fun.conf.clxCulture,
                    "ApplicationId": fun.conf.clxAppId,
                    "UserId": response['UserId']
                };
                mangoPayload['UserId'] = response['UserId'];

                var stuff = new fun.models.Assign();
                stuff.save(assignPayload, assignCbacks);
                */

                console.log('payment callbacks success');
                console.log(response);
            },
            error: function(model, error){
                console.log('CLX Error');
            }
        };

        payment = new fun.models.Payment();
        payment.save(stuff, payCallbacks);

        // Clear the stuff from the inputs
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
            payment,
            payCallbacks,
            email,
            funds,
            ccNumber,
            expYear,
            expMonth,
            ccCVC,
            ccName;

        console.log('add funds master card');

        email = this.masterEmail.val();
        funds = this.masterFunds.val();
        ccNumber = this.masterCCnumber.val();
        expMonth = this.masterExpMonth.val();
        expYear = this.masterExpYear.val();
        ccCVC = this.masterCVC.val();
        ccName = this.masterName.val();

        var stuff = {
            email: email,
            card_name: ccName,
            amount_funds: funds,
            credit_card_number: ccNumber,
            credit_card_cvc: ccCVC,
            credit_card_type: 'master',
            exp_month: expMonth,
            exp_year: expYear
        };

        console.log(stuff);

        payCallbacks = {
            success: function(model, response){
                /*
                assignPayload = {
                    "Culture": fun.conf.clxCulture,
                    "ApplicationId": fun.conf.clxAppId,
                    "UserId": response['UserId']
                };
                mangoPayload['UserId'] = response['UserId'];

                var stuff = new fun.models.Assign();
                stuff.save(assignPayload, assignCbacks);
                */

                console.log('payment callbacks success');
                console.log(response);
            },
            error: function(model, error){
                console.log('CLX Error');
            }
        };

        payment = new fun.models.Payment();
        payment.save(stuff, payCallbacks);

        // Clear the stuff from the inputs
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
            payment,
            payCallbacks,
            email,
            funds,
            ccNumber,
            expYear,
            expMonth,
            ccCVC,
            ccName;

        console.log('add funds master card');

        email = this.visaEmail.val();
        funds = this.visaFunds.val();
        ccNumber = this.visaCCnumber.val();
        expMonth = this.visaExpMonth.val();
        expYear = this.visaExpYear.val();
        ccCVC = this.visaCVC.val();
        ccName = this.visaName.val();

        var stuff = {
            email: email,
            card_name: ccName,
            amount_funds: funds,
            credit_card_number: ccNumber,
            credit_card_cvc: ccCVC,
            credit_card_type: 'master',
            exp_month: expMonth,
            exp_year: expYear
        };

        console.log(stuff);

        payCallbacks = {
            success: function(model, response){
                /*
                assignPayload = {
                    "Culture": fun.conf.clxCulture,
                    "ApplicationId": fun.conf.clxAppId,
                    "UserId": response['UserId']
                };
                mangoPayload['UserId'] = response['UserId'];

                var stuff = new fun.models.Assign();
                stuff.save(assignPayload, assignCbacks);
                */

                console.log('payment callbacks success');
                console.log(response);
            },
            error: function(model, error){
                console.log('CLX Error');
            }
        };

        payment = new fun.models.Payment();
        payment.save(stuff, payCallbacks);

        // Clear the stuff from the inputs
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
            payment,
            payCallbacks,
            email,
            funds,
            ccNumber,
            expYear,
            expMonth,
            ccCVC,
            ccName;

        console.log('add funds master card');

        email = this.amexEmail.val();
        funds = this.amexFunds.val();
        ccNumber = this.amexCCnumber.val();
        expMonth = this.amexExpMonth.val();
        expYear = this.amexExpYear.val();
        ccCVC = this.amexCVC.val();
        ccName = this.amexName.val();

        var stuff = {
            email: email,
            card_name: ccName,
            amount_funds: funds,
            credit_card_number: ccNumber,
            credit_card_cvc: ccCVC,
            credit_card_type: 'master',
            exp_month: expMonth,
            exp_year: expYear
        };

        console.log(stuff);

        payCallbacks = {
            success: function(model, response){
                /*
                assignPayload = {
                    "Culture": fun.conf.clxCulture,
                    "ApplicationId": fun.conf.clxAppId,
                    "UserId": response['UserId']
                };
                mangoPayload['UserId'] = response['UserId'];

                var stuff = new fun.models.Assign();
                stuff.save(assignPayload, assignCbacks);
                */

                console.log('payment callbacks success');
                console.log(response);
            },
            error: function(model, error){
                console.log('CLX Error');
            }
        };

        payment = new fun.models.Payment();
        payment.save(stuff, payCallbacks);

        // Clear the stuff from the inputs
        view.$('#amex-email').val('');
        view.$('#amex-funds').val('');
        view.$('#amex-cc-number').val('');
        view.$('#amex-exp-month').val('');
        view.$('#amex-exp-year').val('');
        view.$('#amex-cc-cvc').val('');
        view.$('#amex-cc-name').val('');
    }
});