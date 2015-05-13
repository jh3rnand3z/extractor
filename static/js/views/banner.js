fun.views.banner = Backbone.View.extend({

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
		fun.containers.banner = this.$el;
	},

	/**
	* Render view
	*/
	render: function(){
		console.log('render banner view');

		var template = _.template(fun.utils.getTemplate(fun.conf.templates.bannerImage));

		this.$el.html(template);
        this.$el.show();
	}
});