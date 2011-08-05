window.addEvent('domready', function() {

    this.logo = new Logo('logo', 'logospan_dighum', 'logospan_links', 'logospan_arrow');

    this.navigation = new Navigation('navigation-link');

    this.links = new Links('link-container');

    this.sorters = new Sorters('sort-menu-item');

    this.tags = new Tags('tag');

    this.scroller = new ScrollMonitor({

        onEnter: function() {

            // fire get new links method
            // start loader

            this.loader.start();

        }.bind(this)

    });

    if (document.id('loader-text') != null) {
        this.loader = new Loader(document.id('loader-text'));
    }

});
