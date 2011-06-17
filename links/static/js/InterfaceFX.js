var InterfaceFX = new Class ({

    Implements: [Options, Events],

    options: {
        logo_digitalhumanities_div: 'logospan_digitalhumanities',
        logo_links_div: 'logospan_links',
        logo_arrow_div: 'logospan_arrow',
        letter_tween_duration: 300,
        letter_tween_transition: 'quad:out',
        fps: 100,
        blue_hex: '#2b7bff',
        orange_hex: '#f7ba36',
        logo_appear_letter_delay: 20
    },

    initialize: function(options) {

        this.setOptions(options);

        this.logo_digitalhumanities_div = document.id(this.options.logo_digitalhumanities_div);
        this.logo_links_div = document.id(this.options.logo_links_div);

        this.logo_spans = this.letterSplit(
            [this.options.logo_digitalhumanities_div, this.options.logo_links_div],
            'logo_letter_split',
            'logo_letter_split'
        );

        this.arrow_spans = this.letterSplit(
            [this.options.logo_arrow_div],
            'logo_arrow_split',
            'logo_arrow_split'
        );

        this.shuffled_logo_spans = this.shuffleArray(this.logo_spans);

    },

    logoAppear: function() {

        var counter_letters = 0;
        var counter_arrow = 0;

        Array.each(this.shuffled_logo_spans, function(span) {

            span.set('tween', {
                duration: this.options.letter_tween_duration,
                fps: this.options.fps,
                transition: this.options.letter_tween_transition,
                property: 'color'
            });

            if (span.getParent() == this.logo_digitalhumanities_div) {

                span.tween.delay(this.options.logo_appear_letter_delay * counter_letters,
                                 span, this.options.blue_hex);

            } else {

                span.tween.delay(this.options.logo_appear_letter_delay * counter_letters,
                                 span, this.options.orange_hex);

            }

            counter_letters++;

        }.bind(this));

        Array.each(this.arrow_spans, function(span) {

            span.set('tween', {
                duration: this.options.letter_tween_duration,
                fps: this.options.fps,
                transition: this.options.letter_tween_transition,
                property: 'color'
            });

            span.tween.delay((this.options.logo_appear_letter_delay * this.shuffled_logo_spans.length) +
                             ((this.options.logo_appear_letter_delay * 5) * counter_arrow), span, this.options.blue_hex);

            counter_arrow++;

        }.bind(this));


    },

    letterSplit: function(divs, id_prefix, class) {

        var letterCount = 0;
        var new_spans = [];

        Array.each(divs, function(div) {

            var div = document.id(div);
            var startingText = div.get('text');
            div.set('html', '');

            for (i=0; i < startingText.length; i++) {

                letter = startingText[i];
                span = new Element('span', {
                    'html': letter,
                    'id': id_prefix + '_' + (letterCount + i),
                    'class': class
                }).inject(div);

                new_spans.push(span);

            }

            letterCount += startingText.length;

        });

        return new_spans;

    },

    shuffleArray: function(a) {

        for (i=0; i < a.length; i++) {
            j = Number.random(0,a.length-1);
            i_el = a[i];
            j_el = a[j];
            a[i] = j_el;
            a[j] = i_el;
        }

        return a;

    }

});


// dev usage

window.addEvent('domready', function() {
    var fx = new InterfaceFX;
    fx.logoAppear();
});
