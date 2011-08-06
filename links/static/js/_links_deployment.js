window.addEvent('domready', function() {

    this.logo = new Logo('logo', 'logospan_dighum', 'logospan_links', 'logospan_arrow');

    this.navigation = new Navigation('navigation-link');

    this.links = new Links('link-container');

    this.sorters = new Sorters('sort-menu-item');

    this.tags = new Tags('tag');

    this.scroller = new ScrollMonitor();

    // this.links_loader = new Loader(document.id('links-loader-text'));

    // this.tags_loader = new Loader(document.id('tags-loader-text'));

});
