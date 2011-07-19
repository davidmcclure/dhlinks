var Logo = new Class ({

    Implements: [Options, Events],

    options: {
        starting_color: '#fff',
        orange: '#f7ba36',
        blue: '#2b7bff',
        gray: '#9b9b9b',
        light_blue: '#9cc1ff',
        pop_interval: 20
    },

    initialize: function(container, dighum, links, arrow, options) {

        this.setOptions(options);
        this.original_state = true;

        this.container_div = document.id(container);
        this.dighum_div = document.id(dighum);
        this.links_div = document.id(links);
        this.arrow_div = document.id(arrow);

        this.disable_select = new DisableSelect(this.container_div);

        this.split();
        this.add_letter_glosses();
        this.fx_materialize_random();

    },

    split: function() {

        this.dighum_split = new LetterSplitter([this.dighum_div]);
        this.links_split = new LetterSplitter([this.links_div]);
        this.arrow_split = new LetterSplitter([this.arrow_div]);

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

    },

    fx_materialize_random: function() {

        var dh_len = this.dighum_split.letter_count;
        var lk_len = this.links_split.letter_count;

        var dh_range = this._generate_range(0, dh_len);
        var lk_range = this._generate_range(dh_len, dh_len + lk_len);
        var total_range = this._generate_range(0, dh_len + lk_len);

        var order = this._shuffle_array(total_range);
        var arrow_offset = (dh_len + lk_len + 1) * this.options.pop_interval;

        var logo_c = 0;
        var arrow_c = 0;

        Array.each(order, function(i) {

            if (dh_range.contains(i)) {

                var letter = this.dighum_split.letters[i];

                this.dighum_split.set_single_letter_tween(
                    letter, this.dighum_split.tween_templates.fast_pop);

                this.dighum_split.pop_letter.delay(
                    this.options.pop_interval * logo_c,
                    this.dighum_split,
                    [letter, this.options.orange, this.options.blue]
                );

            }

            else if (lk_range.contains(i)) {

                var letter = this.links_split.letters[i-dh_len];

                this.links_split.set_single_letter_tween(
                    letter, this.links_split.tween_templates.fast_pop);

                this.links_split.pop_letter.delay(
                    this.options.pop_interval * logo_c,
                    this.links_split,
                    [letter, this.options.blue, this.options.orange]
                );

            }

            logo_c++;

        }.bind(this));

        Array.each(this.arrow_split.letters, function(letter) {

            this.arrow_split.set_single_letter_tween(
                letter, this.arrow_split.tween_templates.fast_pop);

            this.arrow_split.pop_letter.delay(
                ((this.options.pop_interval * 5) * arrow_c) + arrow_offset,
                this.arrow_split,
                [letter, this.options.orange, this.options.blue]
            );

            arrow_c++;

        }.bind(this));

    },

    _shuffle_array: function(a) {

        var b = Array.clone(a);

        for (var i=0; i < b.length; i++) {
            j = Number.random(0,b.length-1);
            i_el = b[i];
            j_el = b[j];
            b[i] = j_el;
            b[j] = i_el;
        }

        return b;

    }.protect(),

    _generate_range: function(a, b) {

        var r = [];
        while (a < b) {
            r.push(a);
            a++
        }

        return r;

    }.protect()

});
