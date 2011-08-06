var Tags = new Class ({

    Implements: [Options, Events],

    options: {
        orange: '#f7ba36',
        blue: '#2b7bff',
        gray: '#9b9b9b',
        light_blue: '#9cc1ff'
    },

    initialize: function(tag_class, options) {

        this.setOptions(options);
        this.tags = $$('td.' + tag_class + ' a');
        this.tag_faders = [];
        this.view_more = document.id('view-all-tags');

        Array.each(this.tags, function(tag) {
            this.tag_faders.push(new LinkFader(tag, this.options.blue, this.options.orange));
        }.bind(this));

        new LinkFader(this.view_more.getElement('a'), this.options.gray, this.options.orange, { add_events: true });

        Array.each(this.tag_faders, function(fader) {

            if (!fader.div.getParent('tr').hasClass('selected-tag')) {

                fader.div.addEvents({

                    'mouseenter': function() {
                        fader.fade_up();
                    }.bind(this),

                    'mouseleave': function() {
                        fader.fade_down();
                    }.bind(this)

                });

            }

        }.bind(this));

    }

});
