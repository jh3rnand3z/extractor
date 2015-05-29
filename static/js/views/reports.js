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
        'use strict';
        var template;
		
        console.log('render reports view');

		template = _.template(fun.utils.getTemplate(fun.conf.templates.reports));

		this.$el.html(template);
        this.$el.show();

        this.renderControl();
	},

	renderControl : function(){
        'use strict';
        var templateFrom, templateTo, templateFindLapse;

        templateFrom = _.template(fun.utils.getTemplate(fun.conf.templates.controlFrom));
        templateTo = _.template(fun.utils.getTemplate(fun.conf.templates.controlTo));
        templateFindLapse = _.template(fun.utils.getTemplate(fun.conf.templates.findLapse));

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
        'use strict';
        var modelCount = 0,
            fromDate,
            toDate,
            startEnd,
            startEndLapse,
            models,
            success;

        var clxStart, clxEnd, fromDay, fromMonth, fromYear, toDay, toMonth, toYear;
        
        event.preventDefault();

        fromDate = this.fromDate.data('datepicker').getDate();
        toDate = this.toDate.data('datepicker').getDate();
        
        // unix timestamps
        this.start = Math.round(fromDate.getTime()/1000);
        this.end = Math.round(toDate.getTime()/1000);

        fromDay = fromDate.getDate();
        if (Number(fromDay) < 10) {
            fromDay = '0' + String(fromDay);
        };
        fromMonth = fromDate.getMonth();
        fromMonth = Number(fromMonth) + 1;
        if (Number(fromMonth) < 10) {
            fromMonth = '0' + String(fromMonth);
        };

        fromYear = fromDate.getFullYear();

        // need the money 2 buy drugs.
        toDay = toDate.getDate();
        if (Number(toDay) < 10) {
            toDay = '0' + String(toDay);
        };

        toMonth = toDate.getMonth();
        toMonth = Number(toMonth) + 1;
        if (Number(toMonth) < 10) {
            toMonth = '0' + String(toMonth);
        };

        toYear = toDate.getFullYear();

        clxStart = fun.utils.format('%s%s%s', toYear, toMonth, toDay);
        clxEnd = fun.utils.format('%s%s%s', fromYear, fromMonth, fromDay);

        var rangeDateTransactionPayload = {
            "Culture": fun.conf.clxCulture,
            "ApplicationId": fun.conf.clxAppId,
            "UserId" : fun.conf.clxUserId,
            "DateFrom" : clxStart,
            "DateTo" : clxEnd
        };

        var rangeDateCallbacks = {
            success: function(model, response){
                console.log(response);
                console.log('success in range date callback');
                fun.instances.reports.renderTransactionLists(response['TransactionList']);
            },
            error: function(model, error){
                console.log(error);
            }
        };

        var reportCallbacks = {
            success: function(model, response){
                console.log(response);
                console.log('success in report transaction callback');
                fun.instances.reports.renderTransactionLists(response['Rows']);
            },
            error: function(model, error){
                console.log(error);
            }
        };

        var rangetrans = new fun.models.DateRange();

        rangetrans.save(rangeDateTransactionPayload, rangeDateCallbacks);


        // new report method and stuff

        var reporttrans = new fun.models.reportTransactions();

        reporttrans.save(rangeDateTransactionPayload, reportCallbacks);

        // end of new report method stuff


        //console.log(fun.utils.format('start %s and %s end unix timestamps', this.start, this.end));

        //startEnd = {
        //    start:this.start,
        //    end:this.end
        //};

        //startEndLapse = {
        //    start:this.start,
        //    end:this.end,

            // get time lapse from dom
            // lapse:this.lapse,

        //    lapse:this.lapse
        //};

        //console.log(startEnd)

        //var models = {
        //    payments: new fun.models.PaymentsStartEnd(startEnd),
        //};

        //var success = function() {
        //    if (++modelCount == _.keys(models).length) {
        //        fun.instances.reports.renderRecordsDetails(models.payments);
        //    }
        //};

        //for (var x in models){
        //    models[x].fetch({
        //        success: success,
        //        error: function() {
        //            console.log('error');
        //        }
        //    });
        //}
    },

    /*
    * Render transaction lists
    */
    renderTransactionLists: function(transactions){
        'use strict';
        console.log('render transaction lists');
        
        if (transactions) {
            this.transactions = transactions;
        }

        this.tbody = this.$('#cdr-list > tbody');
        this.renderTransactionRows();
    },

    /*
    * Render transaction rows
    */
    renderTransactionRows: function(){
        'use strict';
        var length,
            i = 0,
            rows,
            totalAmount,
            totalFee,
            data = {},
            status,
            template;

        var statusMap = {
            'CANCELLED': 'Denied',
            'APPROVED': 'Approved',
            'DENIED': 'Denied'
        };

        length = this.transactions.length;

        var approved = translate("approved");
        var denied = translate("denied");
        var amount, amountTotal = 0;
        var fee, feeTotal = 0;

        if (length > 0){
            rows = this.tbody.html('');

            _.each(this.transactions, function(o) {

                var data = {};

                length = Number(length) - 1;

                var transNum = o['TransactionNum'];

                if (transNum){
                    transNum = transNum.slice(0,6) + transNum.slice(7,12);
                    transNum = Number(transNum) - 1;
                    status = 'APPROVED';
                    data['status'] = statusMap[status];
                    
                } else {
                    if (typeof(transNum) === 'undefined'){
                        transNum = o['Transaction'];
                        status = o['TransactionStatus'];
                        data['Summary'] = o['Date'] + ' - ' + o['TransactionType'];
                        data['TransactionNum'] = transNum;
                        data['status'] = statusMap[status];
                    }
                }

                data['account'] = 'missing';
                data['date'] = 'missing';
                data['uuid'] = 'missing';

                amount = Number(o['Amount']);
                fee = Number(o['Fee']);

                amountTotal += amount;

                feeTotal += fee;

                o['Amount'] = amount.toFixed(2);

                var transinfo = new fun.models.Transaction({'TransactionNum':transNum});
                transinfo.fetch({
                    success: function(response){
                        console.log();
                        data['cc_info'] = response.get('cc_info');
                        data['holder_name'] = response.get('holder_name');
                        data['email'] = response.get('email');
                        data['phone'] = response.get('phone');
                        
                        
                        data = _.extend(o, data);

                        console.log(data);

                        template = _.template(
                            fun.utils.getTemplate(fun.conf.templates.transRow)
                        )(data);

                        rows.append(template);

                    },
                    error: function(error){
                        //console.log(error);
                        data['cc_info'] = 'Unknown';
                        data['holder_name'] = 'John Doe';
                        data['email'] = 'john@doe.com';
                        data['phone'] = '21255555555';
                        

                        data = _.extend(o, data);

                        template = _.template(
                            fun.utils.getTemplate(fun.conf.templates.transRow)
                        )(data);

                        rows.append(template);
                    }
                });
            });

            // testing now the sum of the stuff
            //this.renderTransactionTotals();
            console.log('processing transactions completed');
            console.log('setting up summaries');
            this.setTotalTransactions(amountTotal);
        } else {
            this.noTransactions();
        }
    },

    renderTransactionTotals: function(){
        'use strict';
        var amountTotal,
            feeTotal,
            data,
            template;

        console.log(this.amountTotal);
        console.log(this.feeTotal);
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
                var recordRow = _.template(fun.utils.getTemplate(fun.conf.templates.recordRow))(data)
                
                rows.append(recordRow);
            }
        } else {
            // Render a no data message
            this.noCalls();
        }
    },

    setTotalTransactions: function(amount) {
        var recordTotal = this.$('#records-total');
        recordTotal.html('$'+String(amount));
    },
    
    noTransactions: function() {
        /*
         no data available box
        */
        var htmlId = this.$('#no-records');
        htmlId.html(_.template(
                        fun.utils.getTemplate(fun.conf.templates.warning)
                    )({message:'noDataAvailable'})
        );
    },

    noCalls: function() {
        /*
         no data available box
        */
        var htmlId = this.$('#no-records');
        htmlId.html(_.template(
                        fun.utils.getTemplate(fun.conf.templates.warning)
                    )({message:'noDataAvailable'})
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

});