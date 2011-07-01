var Links = new Class ({

    Implements: [Options, Events],

    options: {
        orange: '#f7ba36',
        blue: '#2b7bff'
    },

    initialize: function(link_class, options) {

        this.links = $$('.' + link_class);
        this.split_links();

    },

    split_links: function() {

        Array.each(this.links, function(link) {

            

        }.bind(this));

    },

});

// dev usage
window.addEvent('domready', function() {
    this.links = new Links('link-title');
});
