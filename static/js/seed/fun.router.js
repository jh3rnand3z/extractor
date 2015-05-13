fun.Router = Backbone.Router.extend({

    /*
     Seed routes
    */
    routes: {
        "": "home",
        "home": "home",
        "landing": "landing",
        "signup": "signup",
        "login": "login",

        "dashboard": "dashboard",        
        "dashboard/a:account": "dashboard",
        "dashboard/a:account/o:org": "dashboard",

        "send": "money",
        "error": "error",
        "banner": "banner",

        "reports": "reports",
        "reports/p:page": "reports",

        "settings": "settings",
        "logout": "logout"
    },
 
    initialize: function(options){
        //this.appView = options.appView;
    
        // navigation bar
        fun.instances.navbar = new fun.views.navbar({
            el:"#fun-navbar"
        });

        // sub header
        fun.instances.subheader = new fun.views.subheader({
            el:"#fun-subheader"
        });

        // landing
        fun.instances.landing = new fun.views.landing({
            el:"#fun-landing"
        });

        // login
        fun.instances.login = new fun.views.login({
            el:"#fun-login"
        });

        // dashboard
        fun.instances.dashboard = new fun.views.dashboard({
            el:"#fun-dashboard"
        });

        // send money
        fun.instances.money = new fun.views.money({
            el:"#fun-money"
        });

        // cuallix error
        fun.instances.error = new fun.views.error({
            el: "#fun-error"
        });

        // preway banner
        fun.instances.banner = new fun.views.banner({
            el: "#fun-banner"
        });

        // reports
        fun.instances.reports = new fun.views.reports({
            el:"#fun-reports"
        });

        // signup
        fun.instances.signup = new fun.views.signup({
            el:"#fun-signup"
        });
        
        // settings
        fun.instances.settings = new fun.views.settings({
            el:"#fun-settings"
        });

        // footer
        fun.instances.footer = new fun.views.footer({
            el:"#fun-footer"
        });
    },
    
    home: function(){

        console.log('spawn some fun get stuff going');

        if(fun.utils.loggedIn()){
            fun.utils.redirect(fun.conf.hash.dashboard);
        } else {
            fun.utils.redirect(fun.conf.hash.landing);
        }
        fun.instances.footer.render();
    },

    landing: function(){

        fun.utils.hideAll();

        fun.instances.navbar.render();
        fun.instances.landing.render();
        fun.instances.footer.render();
    },

    signup: function(){
        var signup = translate('signup');
        if(fun.utils.loggedIn()){
            fun.utils.redirect(fun.conf.hash.dashboard);
        } else {
            fun.utils.hideAll();
            fun.instances.navbar.render();
            fun.instances.subheader.render('Signup');
            fun.instances.signup.render();
        }
        //fun.instances.footer.render();
    },
    
    login: function(){
        var login = translate('login');
        if(fun.utils.loggedIn()){
            fun.utils.redirect(fun.conf.hash.dashboard);
        } else {
            fun.utils.hideAll();
            fun.instances.navbar.render();
            //fun.instances.subheader.render(login);
            fun.instances.login.render();
        }

        //fun.instances.footer.render();
    },
    
    dashboard: function(account){
        'use strict';

        if(fun.utils.loggedIn()){
            fun.utils.hideAll();
            fun.instances.navbar.render();
            fun.instances.dashboard.render();
        } else {
            fun.utils.redirect(fun.conf.hash.login);
        }

        var account,
            resourceCount = 0,
            resources,
            callbacks,
            dashboard,
            message;

        console.log('dashboard parsed account', account);

        if (!account){
            account = localStorage.getItem('username');
        } else {
            if (account.substring(0,1) == ':') {
                account = account.substring(1);
            }
        }

        console.log('dashboard account', account);

        resources = {
            user: new fun.models.User({'account':account})
        };

        callbacks = {
            success: function(model, response){
                if(++resourceCount == _.keys(resources).length){
                    //console.log(resources.user);
                    localStorage.setItem("UserId", resources.user.get('UserId'));
                    localStorage.setItem("UserCountryCode", resources.user.get('country_code'));
                    localStorage.setItem("UserPhoneNumber", resources.user.get('phone_number'));
                    localStorage.setItem("UserEmail",resources.user.get('email'));
                }
            },
            error: function(model, error){
                console.log('resources error');
            }
        };

        if(fun.utils.loggedIn()){

            fun.utils.hideAll();
            fun.instances.navbar.render();

            fun.instances.dashboard.render();

            for (message in resources){
                resources[message].fetch(callbacks);
            }

        } else {
            fun.utils.redirect(fun.conf.hash.login);
        }
        //fun.instances.footer.render();
    },

    money: function(){
        'use strict';
        if(fun.utils.loggedIn()){
            
            //var sendMoney = translate('sendMoney');
            
            fun.utils.hideAll();
            
            //fun.instances.navbar.render();

            //fun.instances.subheader.render(sendMoney);
            
            //fun.instances.subheader.renderHeadNavReports();

            fun.instances.money.render();
        } else {
            fun.utils.redirect(fun.conf.hash.login);
        }
        
        //fun.instances.footer.render();
    },

    error: function(){
        'use strict';
        if(fun.utils.loggedIn()){
            fun.utils.hideAll();

            fun.instances.error.render();
        } else {
            fun.utils.redirect(fun.conf.hash.login);
        }

        // fun.instances.footer.render();
    },

    banner: function(){
        'use strict';
        if(fun.utils.loggedIn()){
            fun.utils.hideAll();
            fun.instances.banner.render();

        } else {
            fun.utils.redirect(fun.conf.hash.login);
        }

        // fun.instances.footer.render();
    },

    reports: function(page){
        'use strict';
        if(fun.utils.loggedIn()){

            fun.utils.hideAll();

            fun.instances.navbar.render();

            fun.instances.reports.render();
        } else {
            fun.utils.redirect(fun.conf.hash.login);
        }
        
        //fun.instances.footer.render();
    },

    settings: function(){
        var settings = translate('settings');
        fun.utils.hideAll();
        fun.instances.navbar.render();
        fun.instances.subheader.render(settings);
        fun.instances.settings.render();
        //fun.instances.footer.render();
    },

    logout: function(){
        var goodBye = translate('goodBye');
        fun.utils.logout();
        fun.utils.hideAll();
        fun.instances.navbar.render()
        fun.instances.subheader.render(goodBye);      
        fun.instances.login.render();
        //fun.instances.footer.render();
    }

});

// init the shit out of this
$(function(){
    fun.instances.router = new fun.Router();
    Backbone.history.start();
});