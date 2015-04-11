fun.views.dashboard = Backbone.View.extend({
   
    /**
    * Bind the event functions to the different HTML elements
    */
    events: {
        'click #diners-pay-btn': 'dinersAddFunds',
        'click #discover-pay-btn': 'discoverAddFunds'
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
        }
        this.$el.show();
        console.log("username = " + this.account);
    },

    addContact: function(event){
        'use strict';
        event.preventDefault();
        var view = this,
            firstName,
            lastName,
            newNumber,
            countryData,
            numberType,
            contact;

        console.log('new contact event');

        firstName = this.contactFirstName.val();

        lastName = this.contactLastName.val();

        newNumber = this.newPhoneNumber.intlTelInput("getNumber");

        countryData = this.newPhoneNumber.intlTelInput("getSelectedCountryData");

        numberType = this.newPhoneNumber.intlTelInput("getNumberType");

        contact = new fun.models.Contact({
            first_name: firstName,
            last_name: lastName,
            phone_number: newNumber,
            number_type: numberType
        });

        contact.save();
        
        // Clear the stuff from the inputs ;)
        view.$('#contact_first_name').val('');
        view.$('#contact_last_name').val('');
        view.$('#new-phone-number').val('');
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
    }
});