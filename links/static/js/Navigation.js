var Navigation = new Class ({

    Implements: [Options, Events],

    options: {
        orange: '#f7ba36',
        blue: '#2b7bff',
        gray: '#9b9b9b',
        light_blue: '#9cc1ff'
    },

    initialize: function(navigation_class, options) {

        this.setOptions(options);
        this.links = $$('li.' + navigation_class);
        this.nav_items = [];

        Array.each(this.links, function(link) {

            var link_word = new LinkFader(link.getElement('span.navigation-main-word'), this.options.blue, this.options.orange);
            this.nav_items.push([link_word]);

        }.bind(this));

        Array.each(this.nav_items, function(item) {

            var aggregate_dom = [];

            Array.each(item, function(part) {
                aggregate_dom.push(part.div);
            }.bind(this))

            $$(aggregate_dom).addEvents({

                'mouseenter': function() {

                    Array.each(item, function(part) {
                        part.fade_up();
                    }.bind(this))

                }.bind(this),

                'mouseleave': function() {

                    Array.each(item, function(part) {
                        part.fade_down();
                    }.bind(this))


                }.bind(this)

            });

        });

    }

});
