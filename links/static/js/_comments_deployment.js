window.addEvent('domready', function() {

    this.logo = new Logo('logo', 'logospan_dighum', 'logospan_links', 'logospan_arrow');

    this.navigation = new Navigation('navigation-link');

    this.tags = new Tags('tag');

    this.links = new Links('link-container');

    this.comments = new Comments('comments', 'comment-container', 'comment-form', { first: true });

});
