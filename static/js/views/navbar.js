fun.views.navbar = Backbone.View.extend({

	events: {
        "click #details-report-btn": 'detailsReport',
        "click #fun-signup": 'signupPopup',
        "click #fun-login": 'loginPopup',
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
        var template = _.template(fun.utils.getTemplate(fun.conf.templates.navbar));

        this.$el.html(template);
        this.$el.show();

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
        var template = _.template(fun.utils.getTemplate(fun.conf.templates.navLanding));

        var navLanding = this.$('#fun-nav-landing');
        navLanding.html(template);

        $('#signupModal').modal({
            'show': true,
            'backdrop': 'static',
            'keyboard': false
        });
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
        var template = _.template(fun.utils.getTemplate(fun.conf.templates.navAdmin));

        var navAdmin = this.$('#fun-nav-admin');
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

    login: function(event){
        event.preventDefault();
        
        var loginError = this.loginError;
        var username = this.username.val();
        var password = this.password.val();
        var view = this;

        var loginSuccess = function(view, loginError){
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
