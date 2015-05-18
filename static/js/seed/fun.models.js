/*
 Seed models configuration
*/

/*

    The token needs to be passed in every request using the Authorization header.

    The authorization scheme for this token will be "CLXTKN".

    A request Authorization header must be similar to this one: 

    "Authorization: CLXTKN token_value"

*/

/*
 * Store a version of Backbone.sync to call from the
 * modified version we create
 */
var backboneSync = Backbone.sync;

Backbone.sync = function (method, model, options) {
    /*
     * The jQuery 'ajax' method includes a 'headers' option
     * which lets you set any headers you like
     */
    options.crossDomain = true;
    options.contentType = 'application/json';

    options.headers = {
        /*
         * Set the 'Authorization' header and get the access
         * token from the 'fun.conf' module
         */
        'Authorization': 'CLXTKN ' + fun.conf.clxTKN
    };
    /*
     * Call the stored original Backbone.sync method with
     * extra headers argument added
     */
    backboneSync(method, model, options);
};


fun.models.Register = Backbone.Model.extend({
    
    idAttribute: 'UserId',

    urlRoot: fun.conf.urls.register,

    url: function(){
        return this.urlRoot;
    },
});


fun.models.Assign = Backbone.Model.extend({
    
    idAttribute: 'AccountNum',

    urlRoot: fun.conf.urls.assign,

    url: function(){
        return this.urlRoot;
    },
});


fun.models.Funds = Backbone.Model.extend({
    
    idAttribute: 'CustomerToken',

    urlRoot: fun.conf.urls.funds,

    url: function(){
        return this.urlRoot;
    },
});


fun.models.Settle = Backbone.Model.extend({
    
    idAttribute: 'AuthorizationNum',

    urlRoot: fun.conf.urls.settle,

    url: function(){
        return this.urlRoot;
    },
});


fun.models.customerSearch = Backbone.Model.extend({
    urlRoot: fun.conf.urls.customerSearch,

    url: function(){
        return this.urlRoot;
    }, 
});


fun.models.customerRegister = Backbone.Model.extend({
    urlRoot: fun.conf.urls.customerRegister,

    url: function(){
        return this.urlRoot;
    }, 
});


fun.models.transactionStatus = Backbone.Model.extend({
    
    idAttribute: 'TransactionStatus',

    urlRoot: fun.conf.urls.transactionStatus,

    url: function(){
        return this.urlRoot;
    },
});


fun.models.searchTransactions = Backbone.Model.extend({
    urlRoot: fun.conf.urls.searchTransactions,

    url: function(){
        return this.urlRoot;
    },
});


fun.models.sendMoney = Backbone.Model.extend({
    
    urlRoot: fun.conf.urls.sendMoney,

    url: function(){
        return this.urlRoot;
    },
});


fun.models.paymentUrl = Backbone.Model.extend({
    
    urlRoot: fun.conf.urls.paymentUrl,

    url: function(){
        return this.urlRoot;
    },
});



fun.models.DateRange = Backbone.Model.extend({

    urlRoot: fun.conf.urls.dateRangeTransactions,

    url: function() {
        return this.urlRoot;
    },

});


fun.models.Payment = Backbone.Model.extend({
    
    idAttribute: 'uuid',

    initialize: function(options) {
        if (typeof options != 'undefined'){
            this.paymentId = options.paymentId;
        }
    },
    
    urlRoot: fun.conf.urls.payment,

    url: function() {
        var url;
        if (this.paymentId){
            url = this.urlRoot.replace(fun.conf.paymentId, this.paymentId);
        }
        if (!this.isNew()){
            url += '/' + this.id;
        } else {
            url = fun.conf.urls.payments;
        }
        return url;
    },
    
    sync: function(method, model, options) {
        options.contentType = 'application/json';
        return Backbone.sync(method, model, options);
    }
})


fun.models.Transaction = Backbone.Model.extend({
    
    idAttribute: 'TransactionNum',

    urlRoot: fun.conf.urls.transaction,

    url: function(){
        'use strict';
        var url;
        if (!this.isNew()){
            url = this.urlRoot.replace(fun.conf.uuidTransaction, this.id);
        } else {
            url = fun.conf.urls.transactions;
        }
        return url;
    }
});


fun.models.Transactions = Backbone.Collection.extend({
    model: fun.models.Transaction,

    urlRoot: fun.conf.urls.transactions,

    url: function(){
        return this.urlRoot;
    },
    sync: function(method, model, options) {
        options.contentType = 'application/json';
        return Backbone.sync(method, model, options);
    },
    
    parse: function(response) {
        return response.transactions;
    }
});


fun.models.Payments = Backbone.Collection.extend({
    
    model: fun.models.Payment,
    
    urlRoot: fun.conf.urls.payments,
    
    url: function() {
        return this.urlRoot;
    },
    
    sync: function(method, model, options) {
        options.contentType = 'application/json';
        return Backbone.sync(method, model, options);
    },
    
    parse: function(response) {
        return response.payments;
    }
});


fun.models.PaymentsStartEnd = Backbone.Collection.extend({
    
    model: fun.models.Payment,

    initialize: function(options){
        this.start = options.start;
        this.end = options.end;
    },

    urlRoot: fun.conf.urls.paymentsStartEnd,

    url: function(){
        var url = this.urlRoot.replace(fun.conf.startTime, this.start);

        url = url.replace(fun.conf.endTime, this.end);
        
        return url;
    },

    sync: function(method, model, options){
        options.contentType = 'application/json';
        return Backbone.sync(method, model, options);
    },

    parse: function(response){
        return response.results;
    }
});


// --------


fun.models.Account = Backbone.Model.extend({
    urlRoot: fun.conf.urls.users
});


fun.models.login = Backbone.Model.extend({

    urlRoot: fun.conf.urls.login,

    url: function(){
        return this.urlRoot;
    }
});


fun.models.logout = Backbone.Model.extend({

    urlRoot: fun.conf.urls.logout,

    url: function(){
        return this.urlRoot;
    }
});


fun.models.User = Backbone.Model.extend({

    idAttribute: 'uuid',
    
    initialize: function(options) {
        this.account = options.account;
    },
    
    urlRoot: fun.conf.urls.user,
    
    url: function(){
        var url = this.urlRoot.replace(fun.conf.account, this.account);
        if (!this.isNew()){
            url += '/' + this.id;
        }
        return url;
    },
    
    sync: function(method, model, options){
        options.contentType = 'application/json';
        //delete options.headers["Authorization"];
        return Backbone.sync(method, model, options);
    }
}); 


fun.models.Users = Backbone.Collection.extend({

    model: fun.models.User,
    
    urlRoot: fun.conf.urls.users,
    
    url: function(){
        return this.urlRoot;
    },
    
    sync: function(method, model, options) {
        options.contentType = 'application/json';
        //delete options.headers["Authorization"];
        return Backbone.sync(method, model, options);
    }
});


fun.models.Org = Backbone.Model.extend({

    idAttribute: 'uuid',
    
    initialize: function(options) {
        this.account = options.account;
    },
    
    urlRoot: fun.conf.urls.org,

    url: function(){
        var url = this.urlRoot.replace(fun.conf.account, this.account);
        if (!this.isNew()){
            url += '/' + this.id;
        }
        return url;
    },
    
    sync: function(method, model, options){
        options.contentType = 'application/json';
        return Backbone.sync(method, model, options);
    }
}); 


fun.models.Orgs = Backbone.Collection.extend({

    model: fun.models.Org,
    
    urlRoot: fun.conf.urls.orgs,
    
    url: function(){
        return this.urlRoot;
    },
    
    sync: function(method, model, options) {
        options.contentType = 'application/json';
        return Backbone.sync(method, model, options);
    }
});


fun.models.Record = Backbone.Model.extend({

    idAttribute: 'uuid',

    initialize: function(options) {
        this.recordId = options.recordId;
    },
    
    urlRoot: fun.conf.urls.record,
    
    url: function() {
        var url = this.urlRoot.replace(fun.conf.recordId, this.recordId);
        if (!this.isNew()){
            url += '/' + this.id;
        }
        return url;
    },
    
    sync: function(method, model, options) {
        options.contentType = 'application/json';
        return Backbone.sync(method, model, options);
    }
});


fun.models.Records = Backbone.Collection.extend({
    
    model: fun.models.Record,
    
    urlRoot: fun.conf.urls.records,
    
    url: function() {
        return this.urlRoot;
    },
    
    sync: function(method, model, options) {
        options.contentType = 'application/json';
        return Backbone.sync(method, model, options);
    },
    
    parse: function(response) {
        return response.results;
    }
});


fun.models.RecordsStart = Backbone.Collection.extend({
    
    model: fun.models.Record,

    initialize: function(options){
        this.start = options.start;
    },

    urlRoot: fun.conf.urls.recordsStart,

    url: function(){
        var url = this.urlRoot.replace(fun.conf.startTime, this.start);
        //url = url.replace(fun.conf.startTime, this.start);
        return url;
    },

    sync: function(method, model, options){
        options.contentType = 'application/json';
        return Backbone.sync(method, model, options);
    },

    parse: function(response){
        return response.results;
    }
});


fun.models.RecordsStartEnd = Backbone.Collection.extend({
    
    model: fun.models.Record,

    initialize: function(options){
        this.start = options.start;
        this.end = options.end;
    },

    urlRoot: fun.conf.urls.recordsStartEnd,

    url: function(){
        var url = this.urlRoot.replace(fun.conf.startTime, this.start);

        url = url.replace(fun.conf.endTime, this.end);
        
        return url;
    },

    sync: function(method, model, options){
        options.contentType = 'application/json';
        return Backbone.sync(method, model, options);
    },

    parse: function(response){
        return response.results;
    }
});

fun.models.PaymentsStartEnd = Backbone.Collection.extend({
    
    model: fun.models.Payment,

    initialize: function(options){
        this.start = options.start;
        this.end = options.end;
    },

    urlRoot: fun.conf.urls.paymentsStartEnd,

    url: function(){
        var url = this.urlRoot.replace(fun.conf.startTime, this.start);

        url = url.replace(fun.conf.endTime, this.end);
        
        return url;
    },

    sync: function(method, model, options){
        options.contentType = 'application/json';
        return Backbone.sync(method, model, options);
    },

    parse: function(response){
        return response.results;
    }
});


fun.models.LapseSummary = Backbone.Model.extend({

    idAttribute: 'uuid',
    
    initialize: function(options) {
        this.lapse = options.lapse;
    },
    
    urlRoot: fun.conf.urls.lapseSummary,
    
    url: function(){
        var url = this.urlRoot.replace(fun.conf.lapse, this.lapse);
        return url;
    },
    
    sync: function(method, model, options) {
        options.contentType = 'application/json';
        return Backbone.sync(method, model, options);
    }
});


fun.models.LapseSummaries = Backbone.Collection.extend({
    
    model: fun.models.LapseSummary,

    initialize: function(options) {
        this.lapse = options.lapse;
    },

    urlRoot: fun.conf.urls.lapseSummaries,

    url: function(){
        var url = this.urlRoot.replace(fun.conf.lapse, this.lapse);
        return url;
    },

    sync: function(method, model, options){
        options.contentType = 'application/json';
        return Backbone.sync(method, model, options);
    },

    parse: function(response){
        return response.results;
    }
});


fun.models.LapseSummaryStart = Backbone.Model.extend({

    idAttribute: 'uuid',

    initialize: function(options){
        this.lapse = options.lapse;
        this.start = options.start;
    },

    urlRoot: fun.conf.urls.lapseSummaryStart,

    url: function(){
        var url = this.urlRoot.replace(fun.conf.lapse, this.lapse);
        url = url.replace(fun.conf.startTime, this.start);
        return url;
    },

    sync: function(method, model, options) {
        options.contentType = 'application/json';
        return Backbone.sync(method, model, options);
    }

});


fun.models.LapseSummaryStartEnd = Backbone.Model.extend({

    idAttribute: 'uuid',
    
    initialize: function(options){
        this.lapse = options.lapse;
        this.start = options.start;
        this.end = options.end;
    },

    urlRoot: fun.conf.urls.lapseSummaryStartEnd,

    url: function(){
        var url = this.urlRoot.replace(fun.conf.lapse, this.lapse);
        url = url.replace(fun.conf.startTime, this.start);
        url = url.replace(fun.conf.endTime, this.end);
        return url;
    },

    sync: function(method, model, options) {
        options.contentType = 'application/json';
        return Backbone.sync(method, model, options);
    }

});


fun.models.Summary = Backbone.Model.extend({

    idAttribute: 'uuid',
    
    urlRoot: fun.conf.urls.summary,
    
    url: function(){
        return this.urlRoot;
    },
    
    sync: function(method, model, options) {
        options.contentType = 'application/json';
        return Backbone.sync(method, model, options);
    }
});


fun.models.Summaries = Backbone.Collection.extend({
   
    model: fun.models.Summary,

    urlRoot: fun.conf.urls.summaries,

    url: function(){
        return this.urlRoot;
    },

    sync: function(method, model, options){
        options.contentType = 'application/json';
        return Backbone.sync(method, model, options);
    },

    parse: function(response){
        return response.results;
    }
});


fun.models.SummaryStart = Backbone.Model.extend({

    idAttribute: 'uuid',

    initialize: function(options){
        this.start = options.start;
    },

    urlRoot: fun.conf.urls.summaryStart,

    url: function(){
        var url = this.urlRoot.replace(fun.conf.startTime, this.start);
        return url;
    },

    sync: function(method, model, options){
        options.contentType = 'application/json';
        return Backbone.sync(method, model, options);
    }

});


fun.models.SummariesStart = Backbone.Collection.extend({
   
    model: fun.models.SummaryStart,

    initialize: function(options){
        this.start = options.start;
    },

    urlRoot: fun.conf.urls.summariesStart,

    url: function(){
        var url = this.urlRoot.replace(fun.conf.startTime, this.start);
        return url;
    },

    sync: function(method, model, options){
        options.contentType = 'application/json';
        return Backbone.sync(method, model, options);
    },

    parse: function(response){
        return response.results;
    }
});


fun.models.SummaryStartEnd = Backbone.Model.extend({

    idAttribute: 'uuid',

    initialize: function(options){
        this.start = options.start;
        this.end = options.end;
    },

    urlRoot: fun.conf.urls.summaryStartEnd,

    url: function(){
        var url = this.urlRoot.replace(fun.conf.startTime, this.start);
        url = url.replace(fun.conf.endTime, this.end);
        return url;
    },

    sync: function(method, model, options){
        options.contentType = 'application/json';
        return Backbone.sync(method, model, options);
    }
});


fun.models.SummariesStartEnd = Backbone.Collection.extend({
   
    model: fun.models.SummaryStartEnd,

    initialize:function(options){
        this.start = options.start;
        this.end = options.end;
    },

    urlRoot: fun.conf.urls.summariesStartEnd,

    url: function(){
        var url = this.urlRoot.replace(fun.conf.startTime, this.start);
        url = url.replace(fun.conf.endTime, this.end);
        return url;
    },

    sync: function(method, model, options){
        options.contentType = 'application/json';
        return Backbone.sync(method, model, options);
    },

    parse: function(response){
        return response.results;
    }
});


fun.models.Billing = Backbone.Model.extend({

    idAttribute: 'uuid',
    
    urlRoot: fun.conf.urls.billing,
    
    url: function(){
        return this.urlRoot;
    },
    
    sync: function(method, model, options) {
        options.contentType = 'application/json';
        return Backbone.sync(method, model, options);
    }
});


fun.models.Billings = Backbone.Collection.extend({

    model: fun.models.Billing,

    urlRoot: fun.conf.urls.billings,

    url: function(){
        return this.urlRoot;
    },

    sync: function(method, model, options){
        options.contentType = 'application/json';
        return Backbone.sync(method, model, options);
    },

    parse: function(response){
        return response.results;
    }
});


fun.models.BillingStart = Backbone.Model.extend({

    idAttribute: 'uuid',

    initialize: function(options){
        this.start = options.start;
    },

    urlRoot: fun.conf.urls.billingStart,

    url: function(){
        var url = this.urlRoot.replace(fun.conf.startTime, this.start);
        return url;
    },

    sync: function(method, model, options){
        options.contentType = 'application/json';
        return Backbone.sync(method, model, options);
    }
});


fun.models.BillingStartEnd = Backbone.Model.extend({

    idAttribute: 'uuid',

    initialize: function(options){
        this.start = options.start;
        this.end = options.end;
    },

    urlRoot: fun.conf.urls.billingStartEnd,

    url: function(){
        var url = this.urlRoot.replace(fun.conf.startTime, this.start);
        url = url.replace(fun.conf.endTime, this.end);
        return url;
    },

    sync: function(method, model, options){
        options.contentType = 'application/json';
        return Backbone.sync(method, model, options);
    }
});


fun.models.PhoneNumber = Backbone.Model.extend({

    idAttribute: 'uuid',

    initialize: function(options) {
        this.phoneNumberId = options.phoneNumberId;
    },

    urlRoot: fun.conf.urls.phoneNumber,

    url: function() {
        var url = this.urlRoot.replace(fun.conf.phoneNumberId, this.phoneNumberId);
        if (!this.isNew()){
            url += '/' + this.id;
        } else {
            url = fun.conf.urls.phoneNumbers;
        }
        return url;
    },

    sync: function(method, model, options) {
        options.contentType = 'application/json';
        return Backbone.sync(method, model, options);
    }
});


fun.models.PhoneNumbers = Backbone.Collection.extend({

    model: fun.models.PhoneNumber,

    urlRoot: fun.conf.urls.PhoneNumbers,

    url: function() {
        return this.urlRoot;
    },

    sync: function(method, model, options) {
        options.contentType = 'application/json';
        return Backbone.sync(method, model, options);
    },

    parse: function(response){
        return response.phoneNumbers;
    }
});


fun.models.Contact = Backbone.Model.extend({

    idAttribute: 'uuid',

    initialize: function(options) {
        this.contactId = options.contactId;
    },

    urlRoot: fun.conf.urls.contact,

    url: function() {
        var url = this.urlRoot.replace(fun.conf.contactId, this.contactId);
        if (!this.isNew()){
            url += '/' + this.id;
        } else {
            url = fun.conf.urls.contacts;
        }
        return url;
    },

    sync: function(method, model, options) {
        options.contentType = 'application/json';
        return Backbone.sync(method, model, options);
    }
});


fun.models.Contacts = Backbone.Collection.extend({

    model: fun.models.Contact,

    urlRoot: fun.conf.urls.contacts,

    url: function() {
        return this.urlRoot;
    },

    sync: function(method, model, options) {
        options.contentType = 'application/json';
        return Backbone.sync(method, model, options);
    },

    parse: function(response){
        return response.contacts;
    }
});


fun.models.Directory = Backbone.Model.extend({

    idAttribute: 'uuid',

    initialize: function(options) {
        this.directoryId = options.directoryId;
    },

    urlRoot: fun.conf.urls.directory,

    url: function() {
        var url = this.urlRoot.replace(fun.conf.directoryId, this.directoryId);
        if (!this.isNew()){
            url += '/' + this.id;
        }
        return url;
    },

    sync: function(method, model, options) {
        options.contentType = 'application/json';
        return Backbone.sync(method, model, options);
    }
});


fun.models.Directories = Backbone.Collection.extend({

    model: fun.models.Directory,

    urlRoot: fun.conf.urls.directories,

    url: function() {
        return this.urlRoot;
    },

    sync: function(method, model, options) {
        options.contentType = 'application/json';
        return Backbone.sync(method, model, options);
    },

    parse: function(response){
        return response.directories;
    }
});


fun.models.Campaign = Backbone.Model.extend({

    idAttribute: 'uuid',

    initialize: function(options) {
        this.campaignId = options.campaignId;
    },


    urlRoot: fun.conf.urls.contact,

    url: function() {
        var url = this.urlRoot.replace(fun.conf.campaignId, this.campaignId);
        if (!this.isNew()){
            url += '/' + this.id;
        } else {
            url = fun.conf.urls.campaigns;
        }
        return url;
    },

    sync: function(method, model, options) {
        options.contentType = 'application/json';
        return Backbone.sync(method, model, options);
    }
});


fun.models.Campaigns = Backbone.Collection.extend({

    model: fun.models.Campaign,

    urlRoot: fun.conf.urls.campaigns,

    url: function() {
        return this.urlRoot;
    },

    sync: function(method, model, options) {
        options.contentType = 'application/json';
        return Backbone.sync(method, model, options);
    },

    parse: function(response){
        return response.results;
    }
});


fun.models.Call = Backbone.Model.extend({

    idAttribute: 'uuid',

    initialize: function(options) {
        this.campaignId = options.callId;
    },

    urlRoot: fun.conf.urls.calls,

    url: function() {
        var url = this.urlRoot.replace(fun.conf.callId, this.callId);
        if (!this.isNew()){
            url += '/' + this.id;
        }
        return url;
    },

    sync: function(method, model, options) {
        options.contentType = 'application/json';
        return Backbone.sync(method, model, options);
    }
});


fun.models.Calls = Backbone.Collection.extend({

    model: fun.models.Call,

    urlRoot: fun.conf.urls.calls,

    url: function() {
        return this.urlRoot;
    },

    sync: function(method, model, options) {
        options.contentType = 'application/json';
        return Backbone.sync(method, model, options);
    },

    parse: function(response){
        return response.calls;
    }
});


fun.models.Carrier = Backbone.Model.extend({

    idAttribute: 'uuid',

    initialize: function(options) {
        this.carrierId = options.carrierId;
    },

    urlRoot: fun.conf.urls.carrier,

    url: function() {
        var url = this.urlRoot.replace(fun.conf.carrierId, this.carrierId);
        if (!this.isNew()){
            url += '/' + this.id;
        } else {
            url = fun.conf.urls.carriers;
        }
        return url;
    },

    sync: function(method, model, options) {
        options.contentType = 'application/json';
        return Backbone.sync(method, model, options);
    }
});


fun.models.Carriers = Backbone.Collection.extend({

    model: fun.models.Carriers,

    urlRoot: fun.conf.urls.carriers,

    url: function() {
        return this.urlRoot;
    },

    sync: function(method, model, options) {
        options.contentType = 'application/json';
        return Backbone.sync(method, model, options);
    },

    parse: function(response){
        return response.results;
    }
});