var Sorters = new Class ({

    Implements: [Options, Events],

    options: {
        orange: '#f7ba36',
        blue: '#2b7bff',
        gray: '#9b9b9b',
        light_blue: '#9cc1ff'
    },

    initialize: function(sorter_class, options) {

        this.setOptions(options);
        this.sorters = $$('a.' + sorter_class);
        this.sorter_faders = [];

        Array.each(this.sorters, function(sorter) {
            this.sorter_faders.push(new LinkFader(sorter, this.options.light_blue, this.options.orange));
        }.bind(this));

        Array.each(this.sorter_faders, function(sorter) {

            if (!sorter.div.hasClass('selected')) {

                sorter.div.addEvents({

                    'mouseenter': function() {
                        console.log('test');
                        sorter.fade_up();
                    }.bind(this),

                    'mouseleave': function() {
                        sorter.fade_down();
                    }.bind(this)

                });

            }

        }.bind(this));

    }

});

// dev usage
window.addEvent('domready', function() {
    this.sorters = new Sorters('sort-menu-item');
});
