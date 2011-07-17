var LetterSplitter = new Class ({

    Implements: [Options, Events],

    options: {
        fade_duration: 300,
        fade_duration_mouseover: 40,
        fade_duration_mouseleave: 40,
        fade_duration_slow_pop: 2000,
        fade_duration_fast_pop: 500,
        fps: 100,
        transition: 'quad:out'
    },

    initialize: function(divs, id_prefix, options) {

        this.setOptions(options);
        this.id_prefix = id_prefix;
        this.divs = divs;
        this.split_letters();

        this.tween_templates = {
            default: {
                duration: this.options.fade_duration,
                fps: this.options.fps,
                transition: this.options.transition
            },
            mouseover_fast: {
                duration: this.options.fade_duration_mouseover,
                fps: this.options.fps,
                transition: this.options.transition
            },
            mouseleave_medium: {
                duration: this.options.fade_duration_mouseleave,
                fps: this.options.fps,
                transition: this.options.transition
            },
            slow_pop: {
                duration: this.options.fade_duration_slow_pop,
                fps: this.options.fps,
                transition: this.options.transition
            },
            fast_pop: {
                duration: this.options.fade_duration_fast_pop,
                fps: this.options.fps,
                transition: this.options.transition
            }

        };

        this.set_all_letter_tweens(this.tween_templates.default);

    },

    set_all_letter_tweens: function(settings) {

        Array.each(this.letters, function(letter) {
            this.set_single_letter_tween(letter, settings);
        }.bind(this));

    },

    set_single_letter_tween: function(letter, settings) {

        letter.set('tween', settings);

    },

    split_letters: function() {

        this.letters = [];
        this.letter_count = 0;

        Array.each(this.divs, function(div) {

            var starting_text = div.get('text');
            div.set('html', '');

            for (var i=0; i<starting_text.length; i++) {

                var char = starting_text[i];
                var span = new Element('span', {
                    'html': char
                }).inject(div);

                this.letters.push(span);

            }

            this.letter_count += starting_text.length;

        }.bind(this));

    },

    shift_letter_color: function(letter, color) {

        letter.tween('color', color);

    },

    pop_letter: function(letter, color, base_color) {

        letter.setStyle('color', color);
        letter.tween('color', base_color);

    }

});
