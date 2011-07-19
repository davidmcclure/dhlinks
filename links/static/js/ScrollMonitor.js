var ScrollMonitor = new Class ({

    Implements: [Options, Events],

    options: {
        bottom_region_percentage: 10
    },

    initialize: function() {

        this.setOptions(options);

        window.addEvent('scroll', function() {

            

        }.bind(this));

    }

});
