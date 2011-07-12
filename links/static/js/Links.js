var Links = new Class ({

    Implements: [Options, Events],

    options: {
        orange: '#f7ba36',
        blue: '#2b7bff',
        gray: '#9b9b9b',
        light_blue: '#9cc1ff',
        tween_settings: {
            duration: 90,
            fps: 100,
            transition: 'quad:out'
        },
        fadeout_duration: 250
    },

    initialize: function(link_container_class, batch_class, options) {

        this.setOptions(options);
        this.links_dom = $$('.' + link_container_class + '.' + batch_class);
        this.links = [];

        Array.each(this.links_dom, function(link_dom) {

            var link_title = link_dom.getElement('li.link a.link-title');
            var link_base_url = link_dom.getElement('li.link span.base-url-text');
            var comments_link = link_dom.getElement('.comments-link');

            this._set_tweens([link_title], this.options.tween_settings);
            if (link_base_url) { this._set_tweens([link_base_url], this.options.tween_settings); }
            if (comments_link) { this._set_tweens([comments_link], this.options.tween_settings); }

            if (link_base_url && !comments_link) {
                this.links.push($$([link_title, link_base_url]));
            }

            else if (link_base_url && comments_link) {
                this.links.push($$([link_title, link_base_url, comments_link]));
            }

            else {
                this.links.push($$([link_title]));
            }

        }.bind(this));

        Array.each(this.links, function(link) {

               link.addEvents({

                'mouseenter': function() {

                    this._set_tweens(link, { duration: this.options.tween_settings.duration });
                    link.tween('color', this.options.orange);

                }.bind(this),

                'mouseleave': function() {

                    this._set_tweens(link, { duration: this.options.fadeout_duration });

                    link[0].tween('color', this.options.blue);

                    if (link[1] != undefined) {
                        link[1].tween('color', this.options.light_blue);
                    }

                    if (link[2] != undefined) {
                        link[2].tween('color', this.options.blue);
                    }

                }.bind(this)

            });

        }.bind(this));

    },

    _set_tweens: function(dom, settings) {

        Array.each(dom, function(d) {
            d.set('tween', settings);
        });

    }

});

// dev usage
window.addEvent('domready', function() {
    this.links = new Links('link-container', 'batch1');
});
