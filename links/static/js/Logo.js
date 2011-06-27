var Logo = new Class ({

    Implements: [Options, Events],

    options: {
        container_div: 'logo',
        dighum_div: 'logospan_dighum',
        links_div: 'logospan_links',
        arrow_div: 'logospan_arrow',
        pop_interval: 20,
        starting_color: '#fff'
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
        }

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
                    [this.dighum_split.letters[i], '#2b7bff']
                );
            }

            else if (lk_range.contains(i)) {
                this.links_split.shift_letter_color.delay(
                    this.options.pop_interval * logo_c,
                    this.links_split,
                    [this.links_split.letters[i-dh_len], '#f7ba36']
                );
            }

            logo_c++;

        }.bind(this));

        Array.each(this.arrow_split.letters, function(letter) {

            this.arrow_split.shift_letter_color.delay(
                ((this.options.pop_interval * 5) * arrow_c) + arrow_offset,
                this.arrow_split,
                [letter, '#2b7bff']
            );

            arrow_c++;

        }.bind(this));

        this.original_state = false;

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
                [letter, '#2b7bff']
            );

            dighum_c++;

        }.bind(this));

        Array.each(this.links_split.letters, function(letter) {

            this.dighum_split.shift_letter_color.delay(
                lk_interval * links_c,
                this.dighum_split,
                [letter, '#f7ba36']
            );

            links_c++;

        }.bind(this));

        Array.each(this.arrow_split.letters, function(letter) {

            this.arrow_split.shift_letter_color.delay(
                ((this.options.pop_interval * 5) * arrow_c) + arrow_offset,
                this.arrow_split,
                [letter, '#2b7bff']
            );

            arrow_c++;

        }.bind(this));

        this.original_state = false;

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
                [letter, '#2b7bff']
            );

            dighum_c++;

        }.bind(this));

        Array.each(this._reverse_array(this.links_split.letters), function(letter) {

            this.dighum_split.shift_letter_color.delay(
                lk_interval * links_c,
                this.dighum_split,
                [letter, '#f7ba36']
            );

            links_c++;

        }.bind(this));

        Array.each(this.arrow_split.letters, function(letter) {

            this.arrow_split.shift_letter_color.delay(
                ((this.options.pop_interval * 5) * arrow_c) + arrow_offset,
                this.arrow_split,
                [letter, '#2b7bff']
            );

            arrow_c++;

        }.bind(this));

        this.original_state = false;

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
                [letter, '#2b7bff']
            );

            dighum_c++;

        }.bind(this));

        Array.each(this.links_split.letters, function(letter) {

            this.dighum_split.shift_letter_color.delay(
                (lk_interval * links_c) + lk_offset,
                this.dighum_split,
                [letter, '#f7ba36']
            );

            links_c++;

        }.bind(this));

        Array.each(this.arrow_split.letters, function(letter) {

            this.arrow_split.shift_letter_color.delay(
                ((this.options.pop_interval * 5) * arrow_c) + arrow_offset,
                this.arrow_split,
                [letter, '#2b7bff']
            );

            arrow_c++;

        }.bind(this));

        this.original_state = false;

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
                [letter, '#2b7bff']
            );

            dighum_c++;

        }.bind(this));

        Array.each(this._reverse_array(this.links_split.letters), function(letter) {

            this.dighum_split.shift_letter_color.delay(
                (lk_interval * links_c) + lk_offset,
                this.dighum_split,
                [letter, '#f7ba36']
            );

            links_c++;

        }.bind(this));

        Array.each(this.arrow_split.letters, function(letter) {

            this.arrow_split.shift_letter_color.delay(
                ((this.options.pop_interval * 5) * arrow_c) + arrow_offset,
                this.arrow_split,
                [letter, '#2b7bff']
            );

            arrow_c++;

        }.bind(this));

        this.original_state = false;

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
                [letter, '#2b7bff']
            );

            dighum_c++;

        }.bind(this));

        Array.each(this.links_split.letters, function(letter) {

            this.dighum_split.shift_letter_color.delay(
                lk_interval * links_c,
                this.dighum_split,
                [letter, '#f7ba36']
            );

            links_c++;

        }.bind(this));

        Array.each(this.arrow_split.letters, function(letter) {

            this.arrow_split.shift_letter_color.delay(
                ((this.options.pop_interval * 5) * arrow_c) + arrow_offset,
                this.arrow_split,
                [letter, '#2b7bff']
            );

            arrow_c++;

        }.bind(this));

        this.original_state = false;

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
                [letter, '#2b7bff']
            );

            dighum_c++;

        }.bind(this));

        Array.each(this._reverse_array(this.links_split.letters), function(letter) {

            this.dighum_split.shift_letter_color.delay(
                lk_interval * links_c,
                this.dighum_split,
                [letter, '#f7ba36']
            );

            links_c++;

        }.bind(this));

        Array.each(this.arrow_split.letters, function(letter) {

            this.arrow_split.shift_letter_color.delay(
                ((this.options.pop_interval * 5) * arrow_c) + arrow_offset,
                this.arrow_split,
                [letter, '#2b7bff']
            );

            arrow_c++;

        }.bind(this));

        this.original_state = false;

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
    this.logo.fx_materialize_sequential_scissors();
});
