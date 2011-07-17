var Logo = new Class ({

    Implements: [Options, Events],

    options: {
        container_div: 'logo',
        dighum_div: 'logospan_dighum',
        links_div: 'logospan_links',
        arrow_div: 'logospan_arrow',
        orange: '#f7ba36',
        blue: '#2b7bff',
        gray: '#9b9b9b',
        light_blue: '#9cc1ff'
    },

    initialize: function(options) {

        this.setOptions(options);

        this.container = document.id(this.options.container_div);
        this.dighum = document.id(this.options.dighum_div);
        this.links = document.id(this.options.links_div);
        this.arrow = document.id(this.options.arrow_div);

        this.gloss();

    },

    gloss: function() {

        this.dighum_fader = new LinkFader(this.dighum, this.options.blue, this.options.orange, {
            fadein_base_duration: 100,
            fadeout_base_duration: 100
        });
        this.links_fader = new LinkFader(this.links, this.options.orange, this.options.blue, {
            fadein_base_duration: 100,
            fadeout_base_duration: 100
        });
        this.arrow_fader = new LinkFader(this.arrow, this.options.blue, this.options.orange, {
            fadein_base_duration: 100,
            fadeout_base_duration: 100
        });

        this.container.addEvents({

            'mouseenter': function() {
                this.dighum_fader.fade_up();
                this.links_fader.fade_up();
                this.arrow_fader.fade_up();
            }.bind(this),

            'mouseleave': function() {
                this.dighum_fader.fade_down();
                this.links_fader.fade_down();
                this.arrow_fader.fade_down();
            }.bind(this)

        });

    }

});

// dev usage
window.addEvent('domready', function() {
    this.logo = new Logo;
});
