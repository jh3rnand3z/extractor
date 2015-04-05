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
    
    //dashboard: function(account, org){
    dashboard: function(){
        'use strict';

        if(fun.utils.loggedIn()){

            fun.utils.hideAll();
            fun.instances.navbar.render();

            fun.instances.dashboard.render();

        } else {
            fun.utils.redirect(fun.conf.hash.login);
        }
        fun.instances.footer.render();
        /*
        console.log(account, org);

        if (!account){
            var account = localStorage.getItem("username");
        } else {
            if (account.substring(0, 1) == ':') { 
                account = account.substring(1);
            }
        }

        console.log(account);

        var modelCount = 0;
        
        var models = {
            user: new fun.models.User({'account':account}),
            records: new fun.models.Records(),
            billings: new fun.models.Billings(),
            summary: new fun.models.Summary(),
            lapseSummary: new fun.models.LapseSummary({
                lapse: 'hours'
            })
        };


        if (org) {
            models.org = new fun.models.Org({'account': org});
            //window.history.pushState('orgDashboard', 'Dashboard', '/orgs/iofun/dashboard');
        }

        var onSuccess = function(){
            if(++modelCount == _.keys(models).length){
                console.log('spawn daemon success!');

                fun.instances.dashboard.renderLatestRecords(
                    models.records
                );

                fun.instances.dashboard.renderTodaySummary(
                    models.summary, models.billing
                );

                fun.instances.dashboard.renderTodayActivityChart(
                    models.lapseSummary
                );

                fun.instances.dashboard.renderAccountDropdown(
                    models.user
                );

                // need to pass stuff to renderRecordType()                   
                fun.instances.dashboard.renderRecordType();
            }
        };

        if(fun.utils.loggedIn()){

            var dashboard = translate('dashboard');

            fun.utils.hideAll();
            fun.instances.navbar.render();

            fun.instances.subheader.render(dashboard);
            fun.instances.subheader.renderHeadNav();

            fun.instances.dashboard.render();
            for (var message in models){
                models[message].fetch({
                    success: onSuccess,
                    error: function() {
                        console.log('error!');
                    }
                });
            }
        } else {
            fun.utils.redirect(fun.conf.hash.login);
        }
        fun.instances.footer.render();
        */
    },

    settings: function(){
        var settings = translate('settings');
        fun.utils.hideAll();
        fun.instances.navbar.render();
        fun.instances.subheader.render(settings);
        fun.instances.settings.render();
        fun.instances.footer.render();
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