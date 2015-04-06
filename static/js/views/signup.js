fun.views.signup = Backbone.View.extend({

    /*
     * Bind the events functions to the different HTML elements
     */
    events : {
        'click #login-btn': 'login',
        'click #signup-btn': 'signup'
    },
    
    /*
     * Class constructor
     */
    initialize : function(options) {
        fun.containers.signup = this.$el;
    },
    
    /*
     * Renders the signup view
     */
    render : function(){
        'use strict';
        var template;
        if (!this.$el.html()){
            template = _.template(fun.utils.getTemplate(fun.conf.templates.signup));
            this.$el.html(template);

            // Cache the DOM stuff
            this.signupError = this.$('#signup-error');
            // Form inputs
            this.account = this.$('#signup_username');
            this.firstname = this('#signup_firstname');
            this.newAccount = this.account;
            this.email = this.$('#signup_email');
            this.phone = this.$('#signup_phone');
            this.password = this.$('#signup_password');
            this.confirmPassword = this.$('#confirm_password');
        }
        this.$el.show();
    },
    
    /*
     * login event
     */
    login: function() {
        window.location = fun.conf.hash.login;
    },
    
    /*
     * signup event
     */
    signup: function(event){
        'use strict';
        var signupError,
            account,
            firstname,
            password,
            confirmPassword,
            email,
            phone,
            view,
            rules,
            validationRules,
            callbacks,
            clxCbacks,
            validForm;
        event.preventDefault();
        signupError = this.signupError;
        account = this.account.val();
        firstname = this.firstname.val();
        password = this.password.val();
        confirmPassword = this.confirmPassword.val();
        email = this.email.val();
        phone = this.phone.val();
        // check if this view stuff is really needed
        view = this;
        // form validation rules
        rules = {
            rules: {
                signup_username: {
                    minlength: 2,
                    required: true
                },
                signup_email: {
                    required: true,
                    email: true
                },
                signup_password: {
                    minlength: 6,
                    required: true
                },
                confirm_password: {
                    required: false,
                    minlength: 6,
                    equalTo: '#signup_password'
                    
                }
            }
        }
        validationRules = $.extend (rules, fun.utils.validationRules);

        console.log(validationRules);

        $('#signup-form').validate(validationRules);
        
        // new user account callbacks
        callbacks = {
            success: function(){
                // Clear the stuff from the inputs ;)
                view.$('#signup_username').val('');
                view.$('#signup_firstname').val('');
                view.$('#signup_email').val('');
                view.$('#signup_phone').val('');
                view.$('#signup_password').val('');
                view.$('#confirm_password').val('');
                signupError.hide();
                // login the created user
                fun.utils.login(account, password,
                    {
                        success : function(xhr, status){
                            $('#signupModal').modal('hide');
                            fun.utils.redirect(fun.conf.hash.dashboard);
                        },
                        error : function(xhr, status, error){
                            // aqui es donde tiene sentido 
                            // enviar al dude a login con un error.
                            fun.utils.redirect(fun.conf.hash.login);
                        }
                    }
                );
            },

            error: function(model, error){
                // Catch duplicate errors or some random stuff
                signupError.show();
                // TODO: on error add class error and label to the input field
                if (error.responseText.indexOf('account') != -1){
                    signupError.find('p').html('Username is already taken.');
                }
                else if (error.responseText.indexOf('email') != -1){
                    signupError.find('p').html('Email is invalid or already taken.');
                }
                else {
                    signupError.find('p').html('what daa!?');
                }
                
            }
        };
        
        // check for a valid form and create the new user account
        validForm = $('#signup-form').valid();
        if (validForm){
            //event.preventDefault();

            clxCbacks = {
                success: function(){
                    console.log('CLX Success');
                },
                error: function(model, error){
                    console.log('CLX Error');
                }
            };

            this.clxRegister = new fun.models.Register();
            this.clxRegister.save({
                "Culture" : "en-US",
                "ApplicationId" : fun.conf.clxAppId,
                "User" : {
                    "Name": firstname, 
                    "LastName": "Doe", 
                    "Password": password,
                    "Email": email,
                    "CountryCode": "1",
                    "CellPhone": phone
                }
            }, clxCbacks);

            this.model = new fun.models.Account();
            this.model.save(
                {
                    account: account,
                    password: password,
                    email: email
                },
                callbacks
            );
        }
    }
});