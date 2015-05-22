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
    render: function() {
        console.log('render error view');

        var template = _.template(fun.utils.getTemplate(fun.conf.templates.cuallixError));

        this.$el.html(template);
        this.$el.show();

        var message = translate('transactionDenied');
        alert(message);


        // Q sample by Jeff Cogswell

        /*===========
         We want to call these three functions in sequence, one after the other:
         
         First we want to call one, which initiates an ajax call. Once that 
         ajax call is complete, we want to call two. Once two's ajax call is 
         complete, we want to call three.
         
         BUT, we don't want to just call our three functions in sequence, as this quick 
         demo will show. Look at this sample function and think about what order 
         the console.log calls will happen:
        ===========*/

        var demo = function() {
            $.ajax( {
                url: '/',
                success: function() {
                    console.log('AJAX FINISHED');
                }
            });
        };

        console.log('Calling demo');
        demo();
        console.log('Finished calling demo');

        /*====
        The function returns almost immediately, before the ajax call is complete.
        That means we will likely see 'Finished calling demo' before we see the 
        results of the ajax call: 
        ====*/

        //Calling demo
        //Finished calling demo
        //AJAX FINISHED

        /*==== 
        If we want to chain a following function, when do we call it? 
        We call it from inside the success function:
        ====*/

        var demo = function () {
            $.ajax( {
                url: '/',
                success: function() {
                    console.log('AJAX FINISHED');
                    
                    // >>>> THIS IS WHEN you would call another function <<<<<
                    
                }
            });
        };

        /* ==============
         Now let's try using q.
        =============*/


        var one = function () {
            
            var deferred = Q.defer(); // Don't worry yet what this is
                                      // until after you understand the flow
            
            console.log("Starting one's ajax");
            $.ajax( {
                url: '/',
                success: function() {
                    
                    // Here's where you want to call the next function in the
                    // list if there is one. To do it, call deferred.resolve()
                    console.log('Finished with one. Ready to call next.');
                    deferred.resolve();
                    
                }
                
            });
            
            // The deferred object has a "promise" member, 
            // which has a "then" function
            return deferred.promise;
        };

        var two = function () {
            var deferred = Q.defer();
            console.log("Starting two's ajax");
            $.ajax( {
                url: '/',
                success: function() {
                    
                    // Again, this is where you want to call the next function
                    // in the list if there is one.
                    console.log('Finished with two. Ready to call next.');
                    deferred.resolve();
                    
                }
                
            });
            // The deferred object has a "promise" member,
            // which has a "then" function
            return deferred.promise;
        };

        var three = function () {
            var deferred = Q.defer();
            console.log("Starting three's ajax");
            $.ajax( {
                url: '/',
                success: function() {
                    
                    // Again, this is where you want to call the next function
                    // in the list if there is one.
                    console.log('Finished with three. Ready to call next if there is one.');
                    deferred.resolve();
                    
                }
                
            });
            // The deferred object has a "promise" member, which has a "then" function
            return deferred.promise;
        };

        // Test it out. Call the first. Pass the functions 
        // (without calling them, so no parentheses) into the then calls.

        one().then(two).then(three);

        /* =====
        Think about where the "then" function comes from. Each function 
        creates a new defer instance and returns that object's promise 
        member. That promise object has a "then" function. On return 
        from the first function, you get back a defer function, and 
        call the "then" function, passing the *next* function that is 
        to be called. Internally, Q stores that function. When your 
        ajax call returns, in your "success" function, you call the 
        next function by calling deferred.resolve().
        ======*/
    }
});