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
        var template;
        if (!this.$el.html()){
            template = _.template(fun.utils.getTemplate(fun.conf.templates.navbar));
            this.$el.html(template);

            // Cache the DOM stuff
            this.signupError = this.$('#signup-alert');
            // Form inputs
            this.account = this.$('#signup_username');
            this.newAccount = this.account;
            this.firstName = this.$('#signup_firstname')
            this.email = this.$('#signup_email');
            this.phoneNumber = this.$('#signup_phone');
            this.password = this.$('#signup_password');
            this.confirmPassword = this.$('#confirm_password');
        }

        this.$el.show();

        // Check for logged account and render according to it.
        if(fun.utils.loggedIn()){
            console.log('Just enter the dungeon!');
            this.renderDashboard();
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
        template = _.template(fun.utils.getTemplate(fun.conf.templates.navLanding));

        navLanding = this.$('#fun-nav-landing');
        navLanding.html(template);

        /*
        $('#signupModal').modal({
            'show': true,
            'backdrop': 'static',
            'keyboard': false
        });
        */
    },

    renderDashboard: function(){
        'use strict';
        var template,
            navDashboard,
            account,
            context;

        template = _.template(fun.utils.getTemplate(fun.conf.templates.navDashboard));

        navDashboard = this.$('#fun-nav-dashboard');
        navDashboard.html(template);

        account = localStorage.getItem("username");
        context = sessionStorage.getItem("context");

        if (account !== context){
            this.$('#nav-new-member').removeClass('hide').addClass('show');
            this.$('#nav-new-team').removeClass('hide').addClass('show');
        } else {
            this.$('#nav-new-member').removeClass('show').addClass('hide');
            this.$('#nav-new-team').removeClass('show').addClass('hide');   
        }
    },

    renderAdmin: function(){
        'use strict';
        var template,
            navAdmin;

        template = _.template(fun.utils.getTemplate(fun.conf.templates.navAdmin));

        navAdmin = this.$('#fun-nav-admin');
        navAdmin.html(template);
    },

    detailsReport: function() {
        console.log('navbar detail reports')
    },

    loginPopup: function(event){
        event.preventDefault();
        console.log("login");
        // Cache the DOM stuff
        this.loginError = this.$('#signin-alert');
        
        // form inputs
        this.username = this.$('#username');
        this.password = this.$('#password');
    },

    signupPopup: function(event){
        event.preventDefault();
        console.log("signup");
    },

    // missing this.[signupError, account, password, confirmPassword, email, etc] 
    // basically all the signup fields, please check the example on seed signup.js view
    signup: function(event){
        'use strict';
        var signupError,
            account,
            password,
            confirmPassword,
            email,
            view,
            rules,
            validationRules,
            callbacks,
            validForm;
        event.preventDefault();
        signupError = this.signupError;
        account = this.account.val();
        password = this.password.val();
        confirmPassword = this.confirmPassword.val();
        email = this.email.val();
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
                view.$('#signup_email').val('');
                view.$('#signup_password').val('');
                view.$('#confirm_password').val('');
                signupError.hide();
                // login the created user
                fun.utils.login(account, password,
                    {
                        success : function(xhr, status){
                            // the right mutherfucking stuff is send the account
                            // to the dashboard, but you know... 

                            //fun.utils.redirect(fun.conf.hash.dashboard);
                            fun.utils.redirect(fun.conf.hash.landing);
                        },
                        error : function(xhr, status, error){
                            console.log('error inside fun.utils.login callbacks on navbar.js que putas...');
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
    },

    login: function(event){
        'use strict';
        event.preventDefault();

        var loginError,
            username,
            password,
            view,
            loginSuccess;

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
                        break;
                    default:
                        console.log('the monkey is down');
                        break;
                }
            }
        
        });
    }
});
