var ScrollMonitor = new Class ({

    Implements: [Options, Events],

    options: {
        bottom_region_percentage: 3
    },

    initialize: function(options) {

        this.setOptions(options);
        this.percentage = this.options.bottom_region_percentage / 100;

        this.document_size = document.body.offsetHeight;
        this.window_size = window.getSize();

        this.in_loader_zone = false;

        this.add_listener();

    },

    add_listener: function() {

        window.addEvents({

            'scroll': function() {

                var scroll_position = window.getScroll();
                var min = this.document_size - (this.document_size * this.percentage);

                if (min <= (scroll_position.y + this.window_size.y) && this.in_loader_zone == false) {
                    this.fireEvent('enter');
                    this.in_loader_zone = true;
                }

                if (min >= (scroll_position.y + this.window_size.y) && this.in_loader_zone == false) {
                    this.fireEvent('exit');
                    this.in_loader_zone = false;
                }

            }.bind(this),

            'resize': function() {

                this.document_size = document.body.offsetHeight;
                this.window_size = window.getSize();

            }.bind(this)

        });

    }

});
