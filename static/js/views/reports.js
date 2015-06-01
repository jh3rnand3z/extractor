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

        this.dates = {
            'from': clxStart,
            'to': clxEnd
        }

/*
        var rangeDateCallbacks = {
            success: function(model, response){
                //console.log(response);
                console.log('success in range date callback');
                fun.instances.reports.renderTransactionLists(response['TransactionList']);
            },
            error: function(model, error){
                console.log(error);
            }
        };

        var rangetrans = new fun.models.DateRange();

        rangetrans.save(reportPayload, rangeDateCallbacks);
*/

        var reportPayload = {
            "Culture": fun.conf.clxCulture,
            "ApplicationId": fun.conf.clxAppId,
            "UserId" : fun.conf.clxUserId,
            "DateFrom" : clxStart,
            "DateTo" : clxEnd
        };

        var reportCallbacks = {
            success: function(model, response){
                console.log('success in report transaction callback');
                fun.instances.reports.renderTransactionLists(response['Rows']);
            },
            error: function(model, error){
                console.log(error);
            }
        };

        // new report method and stuff

        var reporttrans = new fun.models.reportTransactions();

        reporttrans.save(reportPayload, reportCallbacks);

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
            console.log(transactions);
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
            rows = this.tbody.html(''),
            totalAmount,
            totalFee,
            data = {},
            status,
            template;

        var statusMap = {
            'CANCELLED': 'Denied',
            'REFUSED': 'Denied',
            'APPROVED': 'Approved',
            'DENIED': 'Denied',
            'AUTHORISED': 'Approved'
        };

        length = this.transactions.length;

        var approved = translate("approved");
        var denied = translate("denied");
        var amount, amountTotal = 0;
        var fee, feeTotal = 0;

        //new totals by status
        var approvedTotal = 0;
        var deniedTotal = 0;

        var approvedCount = 0;
        var deniedCount = 0;

        if (length > 0){

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

                        // check the status and break
                        //console.log(o);

                    }
                }

                if (typeof(statusMap[status]) !== 'undefined'){
                    data['account'] = 'missing';
                    data['date'] = 'missing';
                    data['uuid'] = 'missing';

                    amount = Number(o['Amount']);
                    fee = Number(o['Fee']);

                    if (data['status'] == 'Approved'){
                        approvedTotal += amount;
                        approvedCount += 1;
                    }

                    if (data['status'] == 'Denied'){
                        deniedTotal += amount;
                        deniedCount += 1;
                    }

                    amountTotal += amount;

                    feeTotal += fee;

                    o['Amount'] = amount.toFixed(2);

                    var transinfo = new fun.models.Transaction({'TransactionNum':transNum});

                    console.log(approvedTotal, deniedTotal);

                    transinfo.fetch({
                        success: function(response){
                            data['cc_info'] = response.get('cc_info');
                            data['holder_name'] = response.get('holder_name');
                            data['email'] = response.get('email');
                            data['phone'] = response.get('phone');
                            
                            
                            data = _.extend(o, data);

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
                }
                
            });

            //var dada = _.sortBy(rows, 'date');
            //
            //console.log(dada);

            var summary = {
                'amount': amountTotal.toFixed(2),
                'approved': approvedTotal.toFixed(2),
                'approvedCount': approvedCount,
                'deniedCount': deniedCount,
                'denied': deniedTotal.toFixed(2)
            };

            // testing now the sum of the stuff
            //this.renderTransactionTotals();
            console.log('processing transactions completed');
            console.log('setting up summaries');
            
            this.setTotalTransactions(summary);
            this.getSettlement(summary);
            console.log(this.dates);
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

    genRows: function(rows){
        'use strict';

    },

    getSettlement: function(data){
        'use strict';
        // get fees and totals
        var fees  = {
            'transaction': 15,      //15%
            'rolling_reserve': 10,  //10%
            'per_transaction': 0.85
        }
        console.log(data, fees);
        var amountProcessed = this.$('#settle-amount-processed');
        var approvedCount = this.$('#settle-approved-count');
        var deniedCount = this.$('#settle-denied-count');

        var totalProcessingFee = this.$('#settle-total-processing-fee');
        var rollCount = this.$('#settle-count-roll-reserve');
        var perTransTotal = this.$('#settle-total-per-trans-fee');
        var netTotal = this.$('#settle-net-total');

        var rollStuff = (Number(data['approved']) * 0.10);// 0.fees['transaction']);
        var proveStuff = (Number(data['approved']) * 0.15);
        var perTrans = (Number(data['approvedCount']) * fees['per_transaction'])

        var totalFee = (rollStuff + proveStuff + perTrans);
        var netPay = (Number(data['approved']) - totalFee);

        amountProcessed.html(data['approved']);
        approvedCount.html(data['approvedCount']);
        deniedCount.html(data['deniedCount']);
        totalProcessingFee.html(proveStuff.toFixed(2));
        rollCount.html(rollStuff.toFixed(2));
        perTransTotal.html(perTrans.toFixed(2));
        netTotal.html(netPay.toFixed(2));
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

    setTotalTransactions: function(amounts) {
        var approved, denied, random;
        approved = amounts['approved'];
        denied = amounts['denied'];
        random = amounts['amount'];

        var recordTotal = this.$('#records-total');

        var sumApproved = this.$('#sum-approved');
        var sumDenied = this.$('#sum-denied');

        recordTotal.html('$'+String(random));
        sumApproved.html('$'+String(approved));
        sumDenied.html('$'+String(denied));
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
                rec_avg:0,
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