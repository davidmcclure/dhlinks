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
        }
    },

    initialize: function(link_container_class, has_voted_class, options) {

        this.setOptions(options);
        this.links_dom = $$('.' + link_container_class);
        this.links = [];
        this.has_voted_upvotelinks = $$('.' + has_voted_class);

        Array.each(this.links_dom, function(link_dom) {

            var link_title = link_dom.getChildren('li.link a.link-title');
            var link_base_url = link_dom.getChildren('li.link span.base-url-text');

            this.links.push([
                new LetterSplitter([link_title], 'linklet'),
                new LetterSplitter([link_base_url], 'urllet')
            ]);

        }.bind(this));

    }

});

// dev usage
window.addEvent('domready', function() {
    this.links = new Links('link-container', 'has-voted');
});
