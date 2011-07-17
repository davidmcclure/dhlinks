var LinkFader = new Class ({

    Implements: [Options, Events],

    options: {
        fps: 100,
        fadein_base_duration: 20,
        fadeout_base_duration: 250,
        transition: 'quad:out',
        fadeout_variance_interval: 100
    },

    initialize: function(div, starting_color, target_color, options) {

        this.setOptions(options);
        this.div = div;
        this.starting_color = starting_color;
        this.target_color = target_color;

        this.splitter = new LetterSplitter([div]);
        this.splitter.set_all_letter_tweens({
            fps: this.options.fps,
            transition: this.options.transition
        });

    },

    fade_up: function() {

        Array.each(this.splitter.letters, function(letter) {

            this.splitter.set_single_letter_tween(letter, { duration: this.options.fadein_base_duration });
            this.splitter.shift_letter_color(letter, this.target_color);

        }.bind(this));

    },

    fade_down: function() {

        Array.each(this.splitter.letters, function(letter) {

            var delay = Number.random(0, this.options.fadeout_variance_interval);
            this.splitter.set_single_letter_tween(letter, { duration: this.options.fadeout_base_duration });
            this.splitter.shift_letter_color.delay(delay, this.splitter, [letter, this.starting_color]);

        }.bind(this));

    }

});
