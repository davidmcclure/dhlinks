var Logo = new Class ({

    Implements: [Options, Events],

    options: {
        dighum_div: 'logospan_dighum',
        links_div: 'logospan_links',
        arrow_div: 'logospan_arrow',
        pop_interval: 20
    },

    initialize: function(options) {

        this.setOptions(options);

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

    },

    _shuffle_array: function(a) {

        var b = Array.clone(a);
        for (i=0; i < b.length; i++) {
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
            r.append([a]);
            a++
        }

        return r;

    }.protect()

});

// dev usage
window.addEvent('domready', function() {
    this.logo = new Logo;
    this.logo.fx_materialize_random();
});
