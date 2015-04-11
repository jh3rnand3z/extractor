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

        template = _.template(fun.utils.getTemplate(fun.conf.templates.dashboard));
        
        this.$el.html(template);
        this.$el.show();
        
        
        console.log("username = " + this.account)
    },

    dinersAddFunds: function(){
        console.log('add funds diners');
    }
});