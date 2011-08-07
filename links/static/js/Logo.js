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

            letter.div.addEvents({

                'mouseenter': function() {

                    letter.shift_color(this.options.orange, letter.tween_templates.mouseover_fase);

                }.bind(this),

                'mouseleave': function() {

                    letter.shift_color(this.options.blue, letter.tween_templates.mouseleave_medium);

                }.bind(this)

            });

        }.bind(this));

        Array.each(this.links_split.letters, function(letter) {

            letter.div.addEvents({

                'mouseenter': function() {

                    letter.shift_color(this.options.blue, letter.tween_templates.mouseover_fast);

                }.bind(this),

                'mouseleave': function() {

                    letter.shift_color(this.options.orange, letter.tween_templates.mouseleave_medium);

                }.bind(this)

            });

        }.bind(this));

        Array.each(this.arrow_split.letters, function(letter) {

            letter.div.addEvents({

                'mouseenter': function() {

                    letter.shift_color(this.options.orange, letter.tween_templates.mouseover_fast);

                }.bind(this),

                'mouseleave': function() {

                    letter.shift_color(this.options.blue, letter.tween_templates.mouseleave_medium);

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

                letter.shift_color.delay(
                    this.options.pop_interval * logo_c, letter,
                    [this.options.blue, letter.tween_templates.fast_pop]);

            }

            else if (lk_range.contains(i)) {

                var letter = this.links_split.letters[i-dh_len];

                letter.shift_color.delay(
                    this.options.pop_interval * logo_c, letter,
                    [this.options.orange, letter.tween_templates.fast_pop]);

            }

            logo_c++;

        }.bind(this));

        Array.each(this.arrow_split.letters, function(letter) {

            letter.shift_color.delay(
                ((this.options.pop_interval * 5) * arrow_c) + arrow_offset, letter,
                [this.options.blue, letter.tween_templates.fast_pop]);

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
