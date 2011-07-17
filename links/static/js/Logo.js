var Logo = new Class ({

    Implements: [Options, Events],

    options: {
        container_div: 'logo',
        dighum_div: 'logospan_dighum',
        links_div: 'logospan_links',
        arrow_div: 'logospan_arrow',
        pop_interval: 20,
        starting_color: '#fff',
        orange: '#f7ba36',
        blue: '#2b7bff',
        gray: '#9b9b9b',
        light_blue: '#9cc1ff'
    },

    initialize: function(options) {

        this.setOptions(options);
        this.original_state = true;

        this.container_div = document.id(this.options.container_div);
        this.dighum_div = document.id(this.options.dighum_div);
        this.links_div = document.id(this.options.links_div);
        this.arrow_div = document.id(this.options.arrow_div);

        this.disable_select = new DisableSelect(this.container_div);

        this.split();
        this.add_letter_glosses();

    },

    split: function() {

        this.dighum_split = new LetterSplitter(
            [this.dighum_div]
        );

        this.links_split = new LetterSplitter(
            [this.links_div]
        );

        this.arrow_split = new LetterSplitter(
            [this.arrow_div]
        );

    },

    add_letter_glosses: function() {

        Array.each(this.dighum_split.letters, function(letter) {

            letter.addEvents({

                'mouseenter': function() {

                    this.dighum_split.set_single_letter_tween(
                        letter, this.dighum_split.tween_templates.mouseover_fast);
                    this.dighum_split.shift_letter_color(letter, this.options.orange);

                }.bind(this),

                'mouseleave': function() {

                    this.dighum_split.set_single_letter_tween(
                        letter, this.dighum_split.tween_templates.mouseleave_medium);
                    this.dighum_split.shift_letter_color(letter, this.options.blue);

                }.bind(this)

            });

        }.bind(this));

        Array.each(this.links_split.letters, function(letter) {

            letter.addEvents({

                'mouseenter': function() {

                    this.dighum_split.set_single_letter_tween(
                        letter, this.dighum_split.tween_templates.mouseover_fast);
                    this.dighum_split.shift_letter_color(letter, this.options.blue);

                }.bind(this),

                'mouseleave': function() {

                    this.dighum_split.set_single_letter_tween(
                        letter, this.dighum_split.tween_templates.mouseleave_medium);
                    this.dighum_split.shift_letter_color(letter, this.options.orange);

                }.bind(this)

            });

        }.bind(this));

        Array.each(this.arrow_split.letters, function(letter) {

            letter.addEvents({

                'mouseenter': function() {

                    this.dighum_split.set_single_letter_tween(
                        letter, this.dighum_split.tween_templates.mouseover_fast);
                    this.dighum_split.shift_letter_color(letter, this.options.orange);

                }.bind(this),

                'mouseleave': function() {

                    this.dighum_split.set_single_letter_tween(
                        letter, this.dighum_split.tween_templates.mouseleave_medium);
                    this.dighum_split.shift_letter_color(letter, this.options.blue);

                }.bind(this)

            });

        }.bind(this));



    }

});

// dev usage
window.addEvent('domready', function() {
    this.logo = new Logo;
});
