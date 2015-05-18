fun.views.error = Backbone.View.extend({

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
		fun.containers.error = this.$el;
	},

	/**
	* Render view
	*/
	render: function(){
		console.log('render error view');

		var template = _.template(fun.utils.getTemplate(fun.conf.templates.cuallixError));

		this.$el.html(template);
        this.$el.show();

        var message = translate('transactionDenied')
        alert(message);
	}
});