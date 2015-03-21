fun.views.settings = Backbone.View.extend({

	/**
	* Bind the event functions to the different HTML elements
	*/
	// click events missing
	events: {

	},
	
	/**
	* Class constructor
	*/
	initialize: function(options){
		fun.containers.settings = this.$el;
	},

	/**
	* Render view
	*/
	render: function(){
		console.log('render settings view');

		var template = _.template(fun.utils.getTemplate(fun.conf.templates.settings));

		this.$el.html(template);
        this.$el.show();
	}
});