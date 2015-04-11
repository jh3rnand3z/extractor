fun.views.dashboard = Backbone.View.extend({
   
    /**
    * Bind the event functions to the different HTML elements
    */
    events: {
        'click #diners-pay-btn': 'dinersAddFunds',
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
    }

    dinersAddFunds: function(event){
        'use strict';
        event.preventDefault();
        var view = this,
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
            funds: funds,
            ccNumber: ccNumber,
            expMonth: expMonth,
            expYear: expYear,
            ccCVC: ccCVC,
            ccName: ccName
        };

        console.log(stuff);
    }
});