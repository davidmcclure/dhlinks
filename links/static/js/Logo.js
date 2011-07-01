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
        ripple_speed: 800 // px per s
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

                var color = this._intensity_calculation(
                    distance,
                    this.options.orange,
                    this.options.blue
                );

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

                var color = this._intensity_calculation(
                    distance,
                    this.options.orange,
                    this.options.blue
                );

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

                var color = this._intensity_calculation(
                    distance,
                    this.options.orange,
                    this.options.blue
                );

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

    _intensity_calculation: function(distance, base, terminus) {

        var intensity = (Math.E).pow(-(distance/10)/10);
        var base_rgb = this._hex_to_rgb(base.substring(1,6));
        var terminus_rgb = this._hex_to_rgb(terminus.substring(1,6));
        var intermediary = this._calculate_intermediary(base_rgb, terminus_rgb, intensity);

        return '#' + this._rgb_to_hex(intermediary);

    }.protect(),

    randomize_materialize: function() {

        var number_of_functions = this.materialize_functions.length;
        var func = this.materialize_functions[Number.random(0,number_of_functions-1)];
        this[func]();

        console.log(func);

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

    // _rgb_to_hsv: function(rgb) {

    //     var r = rgb[0]/255;
    //     var g = rgb[1]/255;
    //     var b = rgb[2]/255;

    //     var h = null;
    //     var s = null;
    //     var v = null;

    //     var min = Math.min(r,g,b);
    //     var max = Math.max(r,g,b);
    //     var delta = max - min;

    //     v = max;

    //     if (delta == 0) {
    //         h = 0;
    //         s = 0;
    //     }

    //     else {

    //         s = delta / max;
    //         var delta_r = (((max - r) / 6) + (delta / 2)) / delta;
    //         var delta_g = (((max - g) / 6) + (delta / 2)) / delta;
    //         var delta_b = (((max - b) / 6) + (delta / 2)) / delta;

    //         if (r == max) { h = delta_b - delta_g; }
    //         else if (g == max) { h = (1/3) + delta_r - delta_b; }
    //         else if (b == max) { h = (2/3) + delta_g - delta_r; }

    //         if (h < 0) { h += 1; }
    //         if (h > 1) { h -= 1; }

    //     }

    //     h *= 360;
    //     s *= 100;
    //     v *= 100;

    //     return [h.round(),s.round(),v.round()];

    // }.protect(),

    // _hsv_to_rgb: function(hsv) {

    //     var h = hsv[0]/360;
    //     var s = hsv[1]/100;
    //     var v = hsv[2]/100;

    //     var r = null;
    //     var g = null;
    //     var b = null;

    //     if (s == 0) {
    //         r = v * 255;
    //         g = v * 255;
    //         b = v * 255;
    //     }

    //     else {

    //         var var_h = h * 6;
    //         var var_i = Math.floor(var_h);
    //         var var_1 = v * (1 - s);
    //         var var_2 = v * (1 - s * (var_h - var_i));
    //         var var_3 = v * (1 - s * (1 - (var_h - var_i)));

    //         if (var_i == 0) { r = v; g = var_3; b = var_1; }
    //         else if (var_i == 1) { r = var_2; g = v; b = var_1; }
    //         else if (var_i == 2) { r = var_1; g = v; b = var_3; }
    //         else if (var_i == 3) { r = var_1; g = var_2; b = v; }
    //         else if (var_i == 4) { r = var_3; g = var_1; b = v; }
    //         else { r = v; g = var_1; b = var_2; }

    //         r *= 255;
    //         g *= 255;
    //         b *= 255;

    //     }

    //     return [r.round(),g.round(),b.round()];

    // }.protect(),

    // _hex_to_hsv: function(hex) {

    //     return this._rgb_to_hsv(this._hex_to_rgb(hex));

    // }.protect(),

    // _hsv_to_hex: function(hex) {

    //     return this._rgb_to_hex(this._hsv_to_rgb(hex));

    // }.protect(),

    _calculate_intermediary: function(base, terminus, factor) {

        var intermediary = [];
        for (var i=0; i<3; i++) {
            intermediary.push(
                (base[i] + ((terminus[i] - base[i]) * factor)).round()
            );
        }

        return intermediary;

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
