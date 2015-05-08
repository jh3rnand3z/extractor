fun.views.navbar = Backbone.View.extend({

	events: {
        "click #details-report-btn": 'detailsReport',
        "click #fun-signup": 'signupPopup',
        "click #fun-login": 'loginPopup',
        "click #signup-btn": 'signup',
        "click #login-btn": 'login'
	},

    initialize: function(options) {
        fun.containers.navbar = this.$el;
        // get account and context from local and session storages.
        this.account = localStorage.getItem("username");
        this.context = sessionStorage.getItem("context");

        fun.omnibus.on("change:context", function(){
            this.renderDashboard();
        }, this);
    },
    
    render: function(){
        'use strict';
        var template,
            data;

        data = {
            account: this.account
        }
        if (!this.$el.html()){
            template = _.template(fun.utils.getTemplate(fun.conf.templates.navbar))(data);
            this.$el.html(template);

            // Cache the DOM stuff
            this.signupError = this.$('#signup-alert');
            // Form inputs
            this.account = this.$('#signup_username');
            this.newAccount = this.account;
            this.firstName = this.$('#signup_firstname');
            this.lastName = this.$('#signup_lastname');
            this.email = this.$('#signup_email');
            
            //this.phoneNumber = this.$('#signup_phone');

            this.PhoneNumber = this.$('#signup_phone');

            this.PhoneNumber.intlTelInput({
                utilsScript: "static/js/plugins/libphonenumber/utils.js"
            });

            this.password = this.$('#signup_password');
            this.confirmPassword = this.$('#confirm_password');
        }

        this.$el.show();

        // Check for logged account and render according to it.
        if(fun.utils.loggedIn()){
            console.log('Just enter the dungeon!');
            //this.renderDashboard();
        } else {
            console.log('Out of the dungeon');
            //this.renderLanding();
            console.log('And this is no dungeon');
        }
    },

    renderLanding: function(){
        'use strict';
        var template,
            navLanding;

        template = _.template(
            fun.utils.getTemplate(fun.conf.templates.navLanding)
        );

        navLanding = this.$('#fun-nav-landing');
        navLanding.html(template);
    },

    renderDashboard: function(){
        'use strict';
        var template,
            navDashboard;

        data = {
            'account': this.account
        }

        template = _.template(
            fun.utils.getTemplate(fun.conf.templates.navDashboard)
        )(data);

        navDashboard = this.$('#fun-nav-dashboard');
        navDashboard.html(template);
    },

    renderAdmin: function(){
        'use strict';
        var template,
            data,
            navAdmin;

        data = {
            'account': this.account
        }

        template = _.template(fun.utils.getTemplate(fun.conf.templates.navAdmin))(data);

        navAdmin = this.$('#fun-nav-admin');
        navAdmin.html(template);
    },

    detailsReport: function() {
        console.log('navbar detail reports')
    },

    loginPopup: function(event){
        event.preventDefault();
        console.log("login popup event");
        // Cache the DOM stuff
        this.loginError = this.$('#signin-alert');
        
        // form inputs
        this.username = this.$('#username');
        this.password = this.$('#password');

        //test this stuff out
        $('#signupModal').modal('hide');
        $('#loginModal').modal({
            'show': true,
            'backdrop': 'static',
            'keyboard': false
        });
    },

    signupPopup: function(event){
        event.preventDefault();
        console.log("signup popup event");

        // test this shit out
        $('#loginModal').modal('hide');
        $('#signupModal').modal({
            'show': true,
            'backdrop': 'static',
            'keyboard': false
        });
    },

    // missing this.[signupError, account, password, confirmPassword, email, etc] 
    // basically all the signup fields, please check the example on seed signup.js view
    signup: function(event){
        'use strict';
        var signupError,
            view = this,
            account,
            firstName,
            lastName,
            password,
            confirmPassword,
            
            email,
            phoneNumber,
            countryCode,
            cleanNumber,

            rules,
            validationRules,

            stuff,
            callbacks,

            clxCustomerPayload,
            
            clxPayload,
            clxCallbacks,
            
            assignPayload,
            assignCallbacks,
            
            mangoModel,
            mangoPayload,
            validForm;
        
        event.preventDefault();

        signupError = this.signupError;
        account = this.account.val();
        firstName = this.firstName.val();
        lastName = this.lastName.val();
        password = this.password.val();
        confirmPassword = this.confirmPassword.val();
        email = this.email.val();
        
        countryCode = this.PhoneNumber.intlTelInput("getSelectedCountryData")['dialCode'];

        cleanNumber = this.PhoneNumber.intlTelInput("getNumber", intlTelInputUtils.numberFormat.NATIONAL);

        phoneNumber = this.PhoneNumber.intlTelInput("getNumber");
        
        // form validation rules
        rules = {
            rules: {
                signup_username: {
                    minlength: 2,
                    required: true
                },
                signup_lastname: {
                    minlength: 2,
                    required: true
                },
                signup_firstname: {
                    minlength: 2,
                    required: true
                },
                signup_email: {
                    required: true,
                    email: true
                },
                signup_phone: {
                    required: true,
                    minlength: 8
                },
                signup_password: {
                    minlength: 8,
                    required: true
                },
                confirm_password: {
                    required: false,
                    minlength: 8,
                    equalTo: '#signup_password'
                    
                }
            }
        }
        validationRules = $.extend (rules, fun.utils.validationRules);

        $('#signup-form').validate(validationRules);
        
        // new user account callbacks
        callbacks = {
            success: function(){
                // Clear the stuff from the inputs ;)
                view.$('#signup_username').val('');
                view.$('#signup_email').val('');
                view.$('#signup_password').val('');
                view.$('#confirm_password').val('');
                view.$('#signup_phone').val('');

                signupError.hide();
                // login the created user
                fun.utils.login(account, password,
                    {
                        success : function(xhr, status){
                            // the right mutherfucking stuff is send the account
                            // to the dashboard, but you know...
                            // for some reasons the callback always return an error
                            // so we catch the status code; if 200 OK then the shit
                            // was a success and stuff.
                            fun.utils.redirect(fun.conf.hash.dashboard);
                        },
                        error : function(xhr, status, error) {
                            switch(xhr.status) {
                                case 403:
                                    var message = fun.utils.translate("usernameOrPasswordError");
                                    loginError.find('p').html(message);
                                    loginError.removeClass("hide" ).addClass("show");
                                    break;
                                case 200:
                                    $('#signupModal').modal('hide');
                                    
                                    // Check browser support
                                    if (typeof(Storage) != "undefined") {
                                        // Store
                                        localStorage.setItem("username", account);
                                    }
                                    fun.utils.redirect(fun.conf.hash.login);
                                    //loginSuccess(view, loginError);
                                    //$('#loginModal').modal('hide');
                                    break;
                                default:
                                    console.log('the monkey is down');
                                    break;
                            }
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

        assignCallbacks = {
            success: function(model, response){
                mangoPayload['AccountNum'] = response['AccountNum'];
                mangoModel = new fun.models.Account();
                mangoModel.save(
                    mangoPayload,
                    callbacks
                );
            },
            error: function(model, error){
                console.log('CLX error on assign callbacks!');
            }
        }

        clxCallbacks = {
            success: function(model, response){
                assignPayload = {
                    "Culture": fun.conf.clxCulture,
                    "ApplicationId": fun.conf.clxAppId,
                    "UserId": response['UserId']
                };
                mangoPayload['UserId'] = response['UserId'];

                stuff = new fun.models.Assign();
                stuff.save(assignPayload, assignCallbacks);
            },
            error: function(model, error){
                console.log('CLX Error');
            }
        };

        clxPayload = {
            "Culture": fun.conf.clxCulture,
            "ApplicationId": fun.conf.clxAppId,
            "User": {
                "CellPhone": phoneNumber.substr(1),
                "CountryCode": countryCode,
                "Email": email,
                "LastName": lastName, 
                "Name": firstName,
                "Password": password
            }
        };

        clxCustomerPayload = {
            "Culture": fun.conf.clxCulture,
            "ApplicationId": fun.conf.clxAppId,
            "Customer": {
                "CellPhone": phoneNumber.substr(1),
                "CountryCode": countryCode,
                "Email": email,
                "LastName": lastName, 
                "Name": firstName,
                "Password": password
            }
        };

        mangoPayload = {
            account: account,
            password: password,
            email: email,
            phone_number: phoneNumber,
            country_code: countryCode
        };
        
        // check for a valid form and create the new user account
        validForm = $('#signup-form').valid();
        if (validForm){

            //this.clxRegister = new fun.models.Register();
            //this.clxRegister.save(clxPayload, clxCallbacks);

            this.clxCustomerRegister = new fun.models.customerRegister();
            this.clxCustomerRegister.save(clxCustomerPayload, clxCallbacks);
        }
    },

    login: function(event){
        'use strict';
        event.preventDefault();

        var loginError,
            username,
            password,
            view,
            loginSuccess;

        this.loginError = this.$('#signin-alert');

        this.username = this.$('#username');
        this.password = this.$('#password');

        // form fields and stuff
        loginError = this.loginError;

        username = this.username.val();
        password = this.password.val();
        view = this;

        loginSuccess = function(view, loginError){
            // Clear the stuff from the inputs ;)
            view.$('#username').val('');
            view.$('#password').val('');
            loginError.removeClass("show" ).addClass("hide");
            fun.utils.redirect(fun.conf.hash.dashboard);
        };
        
        fun.utils.login(username, password, {
            success : function(jqXHR, textStatus){
                // currently this success call is never executed
                // the success stuff is going on case 200 of the error function.
                // Why? well... I really don't fucking know...
                loginSuccess(view, loginError);
            },
            error : function(jqXHR, textStatus, errorThrown) {
                switch(jqXHR.status) {
                    case 403:
                        var message = fun.utils.translate("usernameOrPasswordError");
                        loginError.find('p').html(message);
                        loginError.removeClass("hide" ).addClass("show");
                        break;
                    case 200:
                        // Check browser support
                        if (typeof(Storage) != "undefined") {
                            // Store
                            localStorage.setItem("username", username);
                        }
                        loginSuccess(view, loginError);
                        $('#loginModal').modal('hide');
                        break;
                    default:
                        console.log('the monkey is down');
                        break;
                }
            }
        
        });
    }
});