var InterfaceFX = new Class ({

    Implements: [Options, Events],

    options: {
        logo_digitalhumanities_div: 'logospan_digitalhumanities',
        logo_links_div: 'logospan_links',
        logo_arrow_div: 'logospan_arrow'
    },

    initialize: function(options) {

        this.setOptions(options);

    },

    logoAppear: function() {

        logo_spans = this.shuffleArray(this.letterSplit(
            [this.options.logo_digitalhumanities_div, this.options.logo_links_div],
            'logo_letter_split',
            'logo_letter_split'
            )
        );

        arrow_spans = this.letterSplit(
            [this.options.logo_arrow_div],
            'logo_arrow_split',
            'logo_arrow_split'
        );

        console.log(logo_spans);

    },

    letterSplit: function(divs, id_prefix, class) {

        letterCount = 0;
        new_spans = [];

        Array.each(divs, function(div) {

            div = document.id(div);
            startingText = div.get('text');
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

        }.bind(this));

        return new_spans;

    },

    shuffleArray: function(arr) {

        for (i=0; i < arr.length; i++) {
            swap_index = Number.random(0,arr.length-1);
            the_el = arr[i];
            swap_el = arr[swap_index];
            arr[i] = swap_el;
            arr[swap_index] = the_el;
        }

        return arr;

    }

});
