var Letterer = new Class ({

    Implements: [Options, Events],

    options: {

    },

    initialize: function(div_names, id_prefix, options) {

        this.setOptions(options);
        this.id_prefix = id_prefix;
        this.divs = this.get_div_dom(div_names);
        this.letters = this.split_letters(this.divs);

    },

    get_div_dom: function(div_names) {

        var divs = [];
        Array.each(div_names, function(name) {
            divs.push(document.id(name));
        });

        return divs;

    },

    split_letters: function() {

        var letter_count = 0;

        Array.each(this.divs, function(div) {

            var starting_text = div.get('text');
            div.set('html', '');

            for (i=0; i<starting_text.length; i++) {

                var letter = starting_text[i];
                span = new Element('span', {
                    'html': letter,
                    'id': this.id_prefix + '_' + i
                }).inject(div);

            }

            letter_count += starting_text.length;

        });

    },

    iterate_sequential: function(delay) {

        this.sequential_counter = 0;
        this._do_sequential_iterate_step(delay);

    },

    _do_sequential_iterate_step: function(delay) {

        if (this.sequential_counter < this.letters.length) {
            this.fireEvent('sequentialStep', this.letters[this.sequential_counter]);
            this._do_sequential_iterate_step(delay);
        }

        else {
            this.fireEvent('sequentialIterateFinished');
        }

    }.protect(),

    iterate_shuffled: function(delay) {

        this.shuffled_counter = 0;
        this.shuffeled_letters = this._shuffle_array(this.letters);
        this._do_shuffled_iterate_step(delay);

    },

    _do_shuffled_iterate_step: function(delay) {

        if (this.shuffled_counter < this.shuffled_letters.length) {
            this.fireEvent('shuffledStep', this.shuffled_letters[this.shuffled_counter]);
            this._do_shuffled_iterate_step(delay);
        }

        else {
            this.fireEvent('shuffledIterateFinished');
        }

    }.protect(),

    _shuffle_array: function(a) {

        for (i=0; i < a.length; i++) {
            j = Number.random(0,a.length-1);
            i_el = a[i];
            j_el = a[j];
            a[i] = j_el;
            a[j] = i_el;
        }

        return a;

    }.protect()

});
