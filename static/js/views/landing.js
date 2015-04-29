fun.views.landing = Backbone.View.extend({

    /**
    * Bind the event functions to the different HTML elements
    */

    events : {

    },
    
    /**
    * Class constructor
    */
    initialize: function(options){
        fun.containers.landing = this.$el;
    },

    /**
    * Render view
    */
    render: function(){
        var template = _.template(fun.utils.getTemplate(fun.conf.templates.landing));
        this.$el.html(template);
        this.$el.show();

        $('#signupModal').modal({
            'show': true,
            'backdrop': 'static',
            'keyboard': true
        });
    }
});