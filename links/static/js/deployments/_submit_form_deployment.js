window.addEvent('domready', function() {

    this.login_form = new Form('submit-form',
        {
            'title': 'title',
            'url': 'url - leave blank to post a discussion thread',
            'tags': 'tags',
            'comment': 'comment',
        },
        []
    );

});
