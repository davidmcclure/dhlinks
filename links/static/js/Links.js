var Links = new Class ({

    Implements: [Options, Events],

    options: {
        orange: '#f7ba36',
        blue: '#2b7bff',
        ripple_speed: 2000 // px per s
    },

    initialize: function(link_class, options) {

        this.links = $$('.' + link_class);
        this.split_links();

    },

    split_links: function() {

        Array.each(this.links, function(link) {

            var splitter = new Letterer([link], 'linkletter');

            link.addEvents({

                'mouseleave': function() {
                    this.shockwave(this.last_letter, splitter, this.options.blue);
                }.bind(this)

            });

            Array.each(splitter.letters, function(letter) {

                letter.addEvents({

                    'mouseenter': function() {
                        this.shockwave(letter, splitter, this.options.orange);
                    }.bind(this),

                    'mouseleave': function() {
                        this.last_letter = letter;
                    }.bind(this)

                });

            }.bind(this));

        }.bind(this));

    },

    shockwave: function(target_letter, splitter, color) {

        var origin = target_letter.retrieve('center');

        Array.each(splitter.letters, function(letter) {

            var target = letter.retrieve('center');
            var distance = ((target[0]-origin[0]).pow(2) + (target[1]-origin[1]).pow(2)).sqrt();
            var delay = ((distance * 1000) / this.options.ripple_speed).round();

            splitter.set_single_letter_tween(
                letter,
                splitter.tween_templates.shockwave
            );

            splitter.shift_letter_color.delay(
                delay,
                splitter, [letter, color]
            );

        }.bind(this));

    }

});

// dev usage
window.addEvent('domready', function() {
    this.links = new Links('link-title');
});
