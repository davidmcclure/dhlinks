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
        blue: '#2b7bff'
    },

    initialize: function(options) {

        this.setOptions(options);
        this.original_state = true;

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
            'fx_materialize_sequential_circuit',
            'fx_materialize_sequential_circuit_reversed',
            'fx_materialize_sequential_circuit_bottom_up',
            'fx_materialize_sequential_circuit_bottom_up_reversed'
        ];

        this.disable_select = new DisableSelect(this.options.container_div);

        this.split();

    },

    split: function() {

        this.dighum_split = new Letterer(
            [this.options.dighum_div],
            'dighum'
        );

        this.links_split = new Letterer(
            [this.options.links_div],
            'links'
        );

        this.arrow_split = new Letterer(
            [this.options.arrow_div],
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

    randomize_materialize: function() {

        var number_of_functions = this.materialize_functions.length;
        this[this.materialize_functions[Number.random(0,number_of_functions-1)]]();

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

    fx_materialize_sequential_circuit: function() {

        this.check_state();

        var dh_len = this.dighum_split.letter_count;
        var lk_len = this.links_split.letter_count;

        var dh_total_dur = dh_len * this.options.pop_interval;
        var lk_interval = (dh_total_dur - this.options.pop_interval) / (lk_len - 1);
        var lk_offset = (dh_len + 1) * this.options.pop_interval;
        var arrow_offset = ((dh_len) * this.options.pop_interval) +((lk_len) * lk_interval);

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
                (lk_interval * links_c) + lk_offset,
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

    fx_materialize_sequential_circuit_reversed: function() {

        this.check_state();

        var dh_len = this.dighum_split.letter_count;
        var lk_len = this.links_split.letter_count;

        var dh_total_dur = dh_len * this.options.pop_interval;
        var lk_interval = (dh_total_dur - this.options.pop_interval) / (lk_len - 1);
        var lk_offset = (dh_len + 1) * this.options.pop_interval;
        var arrow_offset = ((dh_len) * this.options.pop_interval) +((lk_len) * lk_interval);

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
                (lk_interval * links_c) + lk_offset,
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

    fx_materialize_sequential_circuit_bottom_up: function() {

        this.check_state();

        var dh_len = this.dighum_split.letter_count;
        var lk_len = this.links_split.letter_count;

        var dh_total_dur = dh_len * this.options.pop_interval;
        var lk_interval = (dh_total_dur - this.options.pop_interval) / (lk_len - 1);
        var dh_offset = (lk_len + 1) * lk_interval;
        var arrow_offset = ((dh_len + 1) * this.options.pop_interval) + ((lk_len + 1) * lk_interval);

        var dighum_c = 0;
        var links_c = 0;
        var arrow_c = 0;

        Array.each(this._reverse_array(this.dighum_split.letters), function(letter) {

            this.dighum_split.shift_letter_color.delay(
                (this.options.pop_interval * dighum_c) + dh_offset,
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

    fx_materialize_sequential_circuit_bottom_up_reversed: function() {

        this.check_state();

        var dh_len = this.dighum_split.letter_count;
        var lk_len = this.links_split.letter_count;

        var dh_total_dur = dh_len * this.options.pop_interval;
        var lk_interval = (dh_total_dur - this.options.pop_interval) / (lk_len - 1);
        var dh_offset = (lk_len + 1) * lk_interval;
        var arrow_offset = ((dh_len + 1) * this.options.pop_interval) + ((lk_len + 1) * lk_interval);

        var dighum_c = 0;
        var links_c = 0;
        var arrow_c = 0;

        Array.each(this.dighum_split.letters, function(letter) {

            this.dighum_split.shift_letter_color.delay(
                (this.options.pop_interval * dighum_c) + dh_offset,
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

    _hex_to_rgb: function(hex) {

        var r = parseInt(hex.substring(0,2), 16);
        var g = parseInt(hex.substring(2,4), 16);
        var b = parseInt(hex.substring(4,6), 16);
        return [r,g,b];

    }.protect(),

    _rgb_to_hex: function(rgb) {

        var hex = '';
        var hex_chars = '0123456789abcdef';

        Array.each(rgb, function(i) {

            var n = parseInt(i,10);

            if (isNaN(n)) {
                hex += '00';
            }

            else {
                n = Math.max(0,Math.min(n,255));
                hex += (hex_chars[(n-n%16)/16] + hex_chars[n%16])
            }

        });

        return hex;

    },

    _rgb_to_hsv: function(rgb) {

        var r = rgb[0]/255;
        var g = rgb[1]/255;
        var b = rgb[2]/255;

        var h = null;
        var s = null;
        var v = null;

        var min = Math.min(r,g,b);
        var max = Math.max(r,g,b);
        var delta = max - min;

        v = max;

        if (delta == 0) {
            h = 0;
            s = 0;
        }

        else {
            
        }

    },

    _hsv_to_rgb: function(hsv) {



    }.protect(),

    _hex_to_hsv: function(hex) {



    }.protect(),

    _hsv_to_hex: function(hex) {



    }.protect(),

    // Now, three adorably taught little utility functions that perform really
    // rather rote array manipulations and number generation tasks. Boring, yes, but,
    // tender reader, do brood carefully on the breathtaking physiognomy of these
    // humble critters! See, with code as with poesy, I am constantly interested in
    // the physical shape constituted by the text. Is it lean and boxy? Bloated and
    // lopsided? What the curve of the edges of the text, the overall impression
    // generated by the blot of characters that meets the eye?
    //
    // You exclaim "Nonsense! This is claw-clicking critical violence at its worst, a
    // matter of raging hermeneutical transgression. The poet or programmer rarely, if
    // ever, considers these types of manifest topographies in the act of creation.
    // You see figuration where there is only incident, the non-signifying emergence of
    // stochiastic structure atop, or around, the authentically meaning-bearing or
    // functional content of the code or language."
    //
    // And I rejoin "Coward! Own your profession, turf-ceeding hater of all things
    // free-playish and intellectually vigorous. It's the job and sacred privilege of
    // the critic to conjure meaning from all the banal stuffs that populate the earth.
    // Typographical morphology is off limits? Then why is rather nearly nothing else
    // barred from admission as ingredient to our bubbling interpretive potion pots?"
    //
    // "Observe and grow. I shall undertake to perform humanistic exegeses of each of
    // the following three functions that hinge firmly on the associative impressions
    // engendered by their shapes. As we (yes, skeptic, we - by reading you indulge,
    // and so we sojourn critically together) progress,
    //
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
            b.append([a[i]]);
            i--;
        }

        return b;

    }.protect(),

    _generate_range: function(a, b) {

        var r = [];
        while (a < b) {
            r.append([a]);
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
