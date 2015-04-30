fun.views.reports = Backbone.View.extend({
	
    events : {
        'click #fun-btn-find' : 'findReport',
        'click #fun-btn-hours' : 'hours',
        "click #details-report-btn": 'detailsReport',
        'click #fun-btn-days' : 'days',
        'click #fun-btn-weeks' : 'weeks',
        'click #fun-btn-months' : 'months',
        'click #fun-btn-years' : 'years'
    },
    
	initialize: function(options){
        fun.containers.reports = this.$el;
	},

	render: function(){
		console.log('render reports view');

		var template = _.template(fun.utils.getTemplate(fun.conf.templates.reports));

		this.$el.html(template);
        this.$el.show();

        this.renderControl();
	},

	renderControl : function(){

        var templateFrom = _.template(fun.utils.getTemplate(fun.conf.templates.controlFrom));
        var templateTo = _.template(fun.utils.getTemplate(fun.conf.templates.controlTo));
        var templateFindLapse = _.template(fun.utils.getTemplate(fun.conf.templates.findLapse));

        this.controlFrom = this.$('#fun-control-from');
        this.controlTo = this.$('#fun-control-to');
        this.findLapse = this.$('#fun-find-lapse');

        this.controlFrom.html(templateFrom);
        this.controlTo.html(templateTo);
        this.findLapse.html(templateFindLapse);

        this.fromDate = this.$('#from-date');
        this.toDate = this.$('#to-date');
   
        this.$('#from-date').datepicker({
            'format':'yyyy-mm-dd'
        });
        this.$('#to-date').datepicker({
            'format':'yyyy-mm-dd'
        });
    },

    findReport : function (event){
        /*
         find report
        */
        event.preventDefault();
        var modelCount = 0;
        var fromDate = this.fromDate.data('datepicker').getDate();
        var toDate = this.toDate.data('datepicker').getDate();
        
        // unix timestamps
        this.start = Math.round(fromDate.getTime()/1000);
        this.end = Math.round(toDate.getTime()/1000);

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

        var models = {
            records: new fun.models.RecordsStartEnd(startEnd),
            summary: new fun.models.SummaryStartEnd(startEnd),
            summaries: new fun.models.SummariesStartEnd(startEnd),
            billing: new fun.models.BillingStartEnd(startEnd)

            // lapseSummary : new fun.models.LapseSummaryStartEnd(startEndLapse)
        };

        var success = function() {
            if (++modelCount == _.keys(models).length) {
                fun.instances.reports.renderRecordsDetails(models.records);
                fun.instances.reports.renderRecordsSummary(models.summary, models.billing);
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
    },

    hours : function(event){
        /*
         time lapse in hours
        */
        console.log('hours');
    },

    days : function(event){
        /*
         time lapse in days
        */
        console.log('days');
    },

    weeks : function(event){
        /*
         time lapse in weeks
        */
        console.log('weeks');
    },

    months : function(event){
        /*
         time lapse in months
        */
        console.log('months');
    },

    years : function(event){
        /*
         time lapse in years
        */
        console.log('years');
    },

    renderDetailsRows : function(){
        /*
         render details rows
        */
        var i = 0;
        var length = this.collection.length;

        if (length > 0){
            var rows = this.tbody.html('');
           
            for ( i; i < length; ++i ) {
                var data = _.extend(this.collection.at(i).toJSON(), {i:i})
                var recordRow = _.template(fun.utils.getTemplate(fun.conf.tpls.cdrRow))(data)
                
                rows.append(recordRow);
            }
        } else {
            // Render a no data message
            this.noCalls();
        }
    },
    
    noCalls : function() {
        /*
         no data available box
        */
        var htmlId = this.$('#no-records');
        htmlId.html(_.template(
                        fun.utils.getTemplate(fun.conf.tpls.warning)
                    )({msg:'noDataAvailable'})
        );
    },

    renderSummariesRows: function(){

    },

    renderRecordsDetails:function(collection){
        /*
         render records details
        */
        if (collection) {
            this.collection = collection;
        } else {
            this.collection = 0;
        }

        this.tbody = this.$('#cdr-list > tbody');

        this.renderDetailsRows();
    },

    renderRecordsSummary:function(summary, billing){
        /*
         render records summary
        */
        if(summary && cost){
            this.summary = summary;
            this.billing = billing;
            
            var data = _.extend(
                this.summary.toJSON(), 
                this.billing.toJSON()
            );
        } else {
            var data = {
                minutes:0,
                records:0,
                rec_avg: 0,
                billing:0.0
            };
        }

        this.data = data;
        this.stuffSummary = this.$('#summary-list > tbody');
        this.renderSummaryRows();
    },

    detailsReport: function() {
        console.log('navbar detail reports')
    }


});