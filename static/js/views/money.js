fun.views.money = Backbone.View.extend({
	
    events : {
        'click #fun-btn-send' : 'sendMoney',
    },
    
	initialize: function(options){
        fun.containers.reports = this.$el;
	},

	render: function(){
        'use strict';
        var template;
		
        console.log('render reports view');

		template = _.template(fun.utils.getTemplate(fun.conf.templates.sendMoney));

		this.$el.html(template);
        this.$el.show();
	},

    sendMoney: function (event){
        /*
         find report
        */
        'use strict';
        var modelCount = 0,
            fromDate,
            toDate,
            startEnd,
            startEndLapse,
            models,
            success;
        
        event.preventDefault();
        var fromDate = this.fromDate.data('datepicker').getDate();
        var toDate = this.toDate.data('datepicker').getDate();
        
        // unix timestamps
        this.start = Math.round(fromDate.getTime()/1000);
        this.end = Math.round(toDate.getTime()/1000);


        console.log(fun.utils.format('start %s and %s end unix timestamps', this.start, this.end));

        var startEnd = {
            start:this.start,
            end:this.end
        };

        var startEndLapse = {
            start:this.start,
            end:this.end,
            
            // get time lapse from dom
            // lapse:this.lapse,
            lapse:this.lapse
        };

        console.log(startEnd)

        var models = {
            payments: new fun.models.PaymentsStartEnd(startEnd),
            //summary: new fun.models.SummaryStartEnd(startEnd),
            //summaries: new fun.models.SummariesStartEnd(startEnd),
            //billing: new fun.models.BillingStartEnd(startEnd)

            // lapseSummary : new fun.models.LapseSummaryStartEnd(startEndLapse)
        };

        var success = function() {
            if (++modelCount == _.keys(models).length) {
                fun.instances.reports.renderRecordsDetails(models.payments);
                //fun.instances.reports.renderRecordsSummary(models.summary, models.billing);
            }
        };

        for (var x in models){
            models[x].fetch({
                success: success,
                error: function() {
                    console.log('error');
                }
            });
        }
    }

});