fun.views.dashboard = Backbone.View.extend({
   
    /**
    * Bind the event functions to the different HTML elements
    */
    events: {
    
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
    }
});