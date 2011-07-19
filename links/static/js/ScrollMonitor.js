var ScrollMonitor = new Class ({

    Implements: [Options, Events],

    options: {
        bottom_region_percentage: 3
    },

    initialize: function(options) {

        this.setOptions(options);
        this.percentage = this.options.bottom_region_percentage / 100;
        this.window_coords = window.getSize();

        this.add_listener();

    },

    add_listener: function() {

        window.addEvents({

            'scroll': function() {

                var scroll_position = window.getScroll();

                var trigger_height = this.window_coords.y * this.percentage;
                var min = this.window_coords.y - trigger_height;

                if (min <= scroll_position.y) {
                    this.fireEvent('enter');
                }

            }.bind(this),

            'resize': function() {

                this.window_coords = window.getSize();

            }.bind(this)

        });

    }

});
