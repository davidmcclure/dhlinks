var Letterer = new Class ({

    Implements: [Options, Events],

    options: {
        fade_duration: 300,
        fps: 100,
        transition: 'quad:out'
    },

    initialize: function(div_names, id_prefix, options) {

        this.setOptions(options);
        this.id_prefix = id_prefix;
        this.divs = this.get_div_dom(div_names);
        this.split_letters();
        this.set_all_letter_tweens({
            duration: this.options.fade_duration,
            fps: this.options.fps,
            transition: this.options.transition
        });

    },

    set_all_letter_tweens: function(settings) {

        Array.each(this.letters, function(letter) {
            this._set_single_letter_tween(letter, settings);
        }.bind(this));

    },

    _set_single_letter_tween: function(letter, settings) {

        letter.set('tween', settings);

    }.protect(),

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
