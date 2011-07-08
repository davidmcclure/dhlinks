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

        this.dighum = document.id(this.options.dighum_div);
        this.links = document.id(this.options.links_div);
        this.arrow = document.id(this.options.arrow_div);

        this.original_texts = {
            dighum: this.dighum.get('text'),
            links: this.links.get('text'),
            arrow: this.arrow.get('text')
        };

        this.materialize_functions = [
            'fx_materialize_random',
            'fx_materialize_sequential_scissors',
            'fx_materialize_sequential_scissors_reversed',
            'fx_materialize_left_to_right'
        ];

        this.disable_select = new DisableSelect(this.container_div);

        this.split();

    },

    split: function() {

        this.dighum_split = new LetterSplitter(
            [this.dighum_div],
            'dighum'
        );

        this.links_split = new LetterSplitter(
            [this.links_div],
            'links'
        );

        this.arrow_split = new LetterSplitter(
            [this.arrow_div],
            'arrow'
        );

    },

    reset_divs: function() {

        this.dighum.set('html', this.original_texts.dighum);
        this.links.set('html', this.original_texts.links);
        this.arrow.set('html', this.original_texts.arrow);

        this.dighum.setStyle('color', this.options.starting_color);
        this.links.setStyle('color', this.options.starting_color);
        this.arrow.setStyle('color', this.options.starting_color);

        this.split();
        this.original_state = true;

    },

    check_state: function() {

        if (this.original_state == false) {
            this.reset_divs();
        }

    },

    materialize_done: function() {

        this.add_letter_glosses();

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

                }.bind(this),

                'mousedown': function() {

                    this.shockwave(letter);

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

                }.bind(this),

                'mousedown': function() {

                    this.shockwave(letter);

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

                }.bind(this),

                'mousedown': function() {

                    this.shockwave(letter);

                }.bind(this)

            });

        }.bind(this));

    },

    shockwave: function(trigger_letter) {

        var origin = trigger_letter.retrieve('center');

        Array.each(this.links_split.letters, function(letter) {

            if (letter != trigger_letter) {

                var target = letter.retrieve('center');
                var distance = ((target[0]-origin[0]).pow(2) + (target[1]-origin[1]).pow(2)).sqrt();
                var delay = ((distance * 1000) / this.options.ripple_speed).round();

                this.links_split.set_single_letter_tween(
                    letter,
                    this.links_split.tween_templates.shockwave
                );

                this.links_split.shockwave_ripple.delay(
                    delay,
                    this.links_split, [letter, this.options.blue, this.options.orange]
                );

            }

        }.bind(this));

        Array.each(this.dighum_split.letters, function(letter) {

            if (letter != trigger_letter) {

                var target = letter.retrieve('center');
                var distance = ((target[0]-origin[0]).pow(2) + (target[1]-origin[1]).pow(2)).sqrt();
                var delay = ((distance * 1000) / this.options.ripple_speed).round();

                this.dighum_split.set_single_letter_tween(
                    letter,
                    this.dighum_split.tween_templates.shockwave
                );

                this.dighum_split.shockwave_ripple.delay(
                    delay,
                    this.dighum_split, [letter, this.options.orange, this.options.blue]
                );

            }

        }.bind(this));

        Array.each(this.arrow_split.letters, function(letter) {

            if (letter != trigger_letter) {

                var target = letter.retrieve('center');
                var distance = ((target[0]-origin[0]).pow(2) + (target[1]-origin[1]).pow(2)).sqrt();
                var delay = ((distance * 1000) / this.options.ripple_speed).round();

                this.arrow_split.set_single_letter_tween(
                    letter,
                    this.arrow_split.tween_templates.shockwave
                );

                this.arrow_split.shockwave_ripple.delay(
                    delay,
                    this.arrow_split, [letter, this.options.orange, this.options.blue]
                );

            }

        }.bind(this));

    },

    randomize_materialize: function() {

        var number_of_functions = this.materialize_functions.length;
        var func = this.materialize_functions[Number.random(0,number_of_functions-1)];
        this[func]();

    },

    fx_materialize_random: function() {

        this.check_state();

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
                this.dighum_split.shift_letter_color.delay(
                    this.options.pop_interval * logo_c,
                    this.dighum_split,
                    [this.dighum_split.letters[i], this.options.blue]
                );
            }

            else if (lk_range.contains(i)) {
                this.links_split.shift_letter_color.delay(
                    this.options.pop_interval * logo_c,
                    this.links_split,
                    [this.links_split.letters[i-dh_len], this.options.orange]
                );
            }

            logo_c++;

        }.bind(this));

        Array.each(this.arrow_split.letters, function(letter) {

            this.arrow_split.shift_letter_color.delay(
                ((this.options.pop_interval * 5) * arrow_c) + arrow_offset,
                this.arrow_split,
                [letter, this.options.blue]
            );

            arrow_c++;

        }.bind(this));

        this.original_state = false;
        this.materialize_done.delay(((this.options.pop_interval * 5) * (arrow_c + 1)) + arrow_offset, this);

    },

    fx_materialize_sequential_scissors: function() {

        this.check_state();

        var dh_len = this.dighum_split.letter_count;
        var lk_len = this.links_split.letter_count;

        var dh_total_dur = dh_len * this.options.pop_interval;
        var lk_interval = (dh_total_dur - this.options.pop_interval) / (lk_len - 1);
        var arrow_offset = (dh_len + 1) * this.options.pop_interval;

        var dighum_c = 0;
        var links_c = 0;
        var arrow_c = 0;

        Array.each(this._reverse_array(this.dighum_split.letters), function(letter) {

            this.dighum_split.shift_letter_color.delay(
                this.options.pop_interval * dighum_c,
                this.dighum_split,
                [letter, this.options.blue]
            );

            dighum_c++;

        }.bind(this));

        Array.each(this.links_split.letters, function(letter) {

            this.dighum_split.shift_letter_color.delay(
                lk_interval * links_c,
                this.dighum_split,
                [letter, this.options.orange]
            );

            links_c++;

        }.bind(this));

        Array.each(this.arrow_split.letters, function(letter) {

            this.arrow_split.shift_letter_color.delay(
                ((this.options.pop_interval * 5) * arrow_c) + arrow_offset,
                this.arrow_split,
                [letter, this.options.blue]
            );

            arrow_c++;

        }.bind(this));

        this.original_state = false;
        this.materialize_done.delay(((this.options.pop_interval * 5) * (arrow_c + 1)) + arrow_offset, this);

    },

    fx_materialize_sequential_scissors_reversed: function() {

        this.check_state();

        var dh_len = this.dighum_split.letter_count;
        var lk_len = this.links_split.letter_count;

        var dh_total_dur = dh_len * this.options.pop_interval;
        var lk_interval = (dh_total_dur - this.options.pop_interval) / (lk_len - 1);
        var arrow_offset = (dh_len + 1) * this.options.pop_interval;

        var dighum_c = 0;
        var links_c = 0;
        var arrow_c = 0;

        Array.each(this.dighum_split.letters, function(letter) {

            this.dighum_split.shift_letter_color.delay(
                this.options.pop_interval * dighum_c,
                this.dighum_split,
                [letter, this.options.blue]
            );

            dighum_c++;

        }.bind(this));

        Array.each(this._reverse_array(this.links_split.letters), function(letter) {

            this.dighum_split.shift_letter_color.delay(
                lk_interval * links_c,
                this.dighum_split,
                [letter, this.options.orange]
            );

            links_c++;

        }.bind(this));

        Array.each(this.arrow_split.letters, function(letter) {

            this.arrow_split.shift_letter_color.delay(
                ((this.options.pop_interval * 5) * arrow_c) + arrow_offset,
                this.arrow_split,
                [letter, this.options.blue]
            );

            arrow_c++;

        }.bind(this));

        this.original_state = false;
        this.materialize_done.delay(((this.options.pop_interval * 5) * (arrow_c + 1)) + arrow_offset, this);

    },

    fx_materialize_left_to_right: function() {

        this.check_state();

        var dh_len = this.dighum_split.letter_count;
        var lk_len = this.links_split.letter_count;

        var dh_total_dur = dh_len * this.options.pop_interval;
        var lk_interval = (dh_total_dur - this.options.pop_interval) / (lk_len - 1);
        var arrow_offset = (dh_len + 1) * this.options.pop_interval;

        var dighum_c = 0;
        var links_c = 0;
        var arrow_c = 0;

        Array.each(this.dighum_split.letters, function(letter) {

            this.dighum_split.shift_letter_color.delay(
                this.options.pop_interval * dighum_c,
                this.dighum_split,
                [letter, this.options.blue]
            );

            dighum_c++;

        }.bind(this));

        Array.each(this.links_split.letters, function(letter) {

            this.dighum_split.shift_letter_color.delay(
                lk_interval * links_c,
                this.dighum_split,
                [letter, this.options.orange]
            );

            links_c++;

        }.bind(this));

        Array.each(this.arrow_split.letters, function(letter) {

            this.arrow_split.shift_letter_color.delay(
                ((this.options.pop_interval * 5) * arrow_c) + arrow_offset,
                this.arrow_split,
                [letter, this.options.blue]
            );

            arrow_c++;

        }.bind(this));

        this.original_state = false;
        this.materialize_done.delay(((this.options.pop_interval * 5) * (arrow_c + 1)) + arrow_offset, this);

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

    _reverse_array: function(a) {

        var i = a.length - 1;
        var b = [];

        while (i >= 0) {
            b.push(a[i]);
            i--;
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

// dev usage
window.addEvent('domready', function() {
    this.logo = new Logo;
    this.logo.randomize_materialize();
});
