var LogoFX = new Class ({

    Implements: [Options, Events],

    options: {
        dighum_div_name: 'logospan_digitalhumanities',
        links_div_name: 'logospan_links',
        arrow_div_name: 'logospan_arrow'
    },

    initialize: function(options) {

        this.setOptions(options);

        this.divs = {
            dighum: document.id(this.options.dighum_div_name),
            links: document.id(this.options.links_div_name),
            arrow: document.id(this.options.arrow_div_name)
        };

        this.original_texts = {
            dighum: this.divs.dighum.get('text'),
            links: this.divs.links.get('text'),
            arrow: this.divs.arrow.get('text')
        };

    },

    reset_divs: function() {

        this.divs.dighum.set('html', '').set('text', this.original_texts.dighum);
        this.divs.links.set('html', '').set('text', this.original_texts.links);
        this.divs.arrow.set('html', '').set('text', this.original_texts.arrow);

    },

    materialize_logo: function() {

        var logo_letterer = new Letterer(
            [this.options.dighum_div_name, this.options.links_div_name],
            'logoletters',
            {
                onShuffledStep: function(letter) {
                    // console.log(letter);
                }
            }
        );

        var arrow_letterer = new Letterer(
            [this.options.arrow_div_name],
            'arrowletters',
            {
                onSequentialStep: function(letter) {

                }
            }
        );

        logo_letterer.iterate_shuffled(20);

    },

});


// dev usage

window.addEvent('domready', function() {
    var logofx = new LogoFX;
    logofx.materialize_logo();
});
