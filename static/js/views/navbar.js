fun.views.navbar = Backbone.View.extend({

	events: {
        "click #details-report-btn": 'detailsReport',
        "click #fun-signup": 'signupPopup',
        "click #fun-login": 'loginPopup'
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

        $('#signupModal').modal('show');
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

    loginPopup: function(){
        console.log("login");
    },

    signupPopup: function(){
        console.log("signup");

    }
});
