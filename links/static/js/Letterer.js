var Letterer = new Class ({

    Implements: [Options, Events],

    options: {
        fade_duration: 300,
        fate_duration_mouseover: 40,
        fate_duration_mouseleave: 120,
        fps: 100,
        transition: 'quad:out'
    },

    initialize: function(div_names, id_prefix, options) {

        this.setOptions(options);
        this.id_prefix = id_prefix;
        this.divs = this.get_div_dom(div_names);
        this.split_letters();

        this.tween_templates = {
            default: {
                duration: this.options.fade_duration,
                fps: this.options.fps,
                transition: this.options.transition
            },
            mouseover_fast: {
                duration: this.options.fate_duration_mouseover,
                fps: this.options.fps,
                transition: this.options.transition
            },
            mouseleave_medium: {
                duration: this.options.fate_duration_mouseover,
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

    get_div_dom: function(div_names) {

        var divs = [];
        Array.each(div_names, function(name) {
            divs.push(document.id(name));
        });

        return divs;

    },

    split_letters: function() {

        this.letters = [];
        this.letter_count = 0;

        Array.each(this.divs, function(div) {

            var starting_text = div.get('text');
            div.set('html', '');

            for (var i=0; i<starting_text.length; i++) {

                var letter = starting_text[i];
                span = new Element('span', {
                    'html': letter,
                    'id': this.id_prefix + '_' + i
                }).inject(div);

                this.letters.push(span);

            }

            this.letter_count += starting_text.length;

        }.bind(this));

    },

    shift_letter_color: function(letter, color) {

        letter.tween('color', color);

    },

    pop_letter_color: function(letter, color) {

    }

});