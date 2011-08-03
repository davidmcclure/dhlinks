var Comments = new Class ({

    Implements: [Options, Events],

    options: {
        orange: '#f7ba36',
        blue: '#2b7bff',
        gray: '#9b9b9b',
        light_blue: '#9cc1ff',
        base_text_color: '#484848',
        preview_height: 2000
    },

    initialize: function(comment_block_container_id, comment_container_class, options) {

        this.setOptions(options);
        this.comments_container = document.id('comment_block_container_id');
        this.comments = $$('.' + comment_container_class);

        this.get_window_size_and_link_overflows()

        window.addEvent('resize', function() {
            this.get_window_size_and_link_overflows()
        }.bind(this))

        this.gloss_comments();

    },

    gloss_comments: function() {

        Array.each(this.comments, function(comment) {

            new DisableSelect(comment);

            comment.store('status', 'collapsed'); // collapsed or expanded
            comment.store('on_upvote', false);

            var comment_author = comment.getElement('.comment-author');
            var comment_details = comment.getElement('.comment-details');
            var upvote_link = comment.getElement('.upvote-link');
            var opaque_content = $$([comment_author, comment_details, upvote_link]);
            var comment_text = comment.getElement('.comment-text');
            var comment_paragraphs = comment_text.getElements('p');
            var last_comment_paragraph = comment_text.getElement('p:last-child');

            var link_text_fader = new LinkFader(comment_text, this.options.base_text_color, this.options.blue);
            var link_details_fader = new LinkFader(opaque_content, 0.6, 1.0, { property: 'opacity' });
            var upvote_fader = new LinkFader(upvote_link, this.options.blue, this.options.orange);
            var author_fader = new LinkFader(comment_author, this.options.light_blue, this.options.orange);

            comment.addEvents({

                'mouseenter': function() {

                    link_details_fader.fade_up();
                    author_fader.fade_up();

                    if (comment.retrieve('overflowing')) {
                        this.do_preview(comment_author, comment_text);
                    }

                }.bind(this),

                'mouseleave': function() {

                    link_details_fader.fade_down();
                    author_fader.fade_down();

                    // something of a hack to get around an issue where
                    // mouseleave isn't fired on the upvote link when the
                    // cursor goes out of the whole comment block.
                    if (!upvote_link.hasClass('has-voted')) {
                        upvote_link.setStyle('color', this.options.blue);
                        comment.store('on_upvote', false);
                    }

                }.bind(this),

                'mousedown': function() {

                    switch (comment.retrieve('status')) {

                        case 'collapsed':

                            if (!comment.retrieve('on_upvote')) {

                                comment_text.setStyles({
                                    'white-space': 'normal',
                                    'margin-right': '5em'
                                });

                                comment_paragraphs.setStyle('display', 'block');
                                last_comment_paragraph.setStyle('margin', 0);

                                comment.store('status', 'expanded');

                            }

                        break;

                        case 'expanded':

                            if (!comment.retrieve('on_upvote')) {

                                comment_text.setStyles({
                                    'white-space': 'nowrap',
                                    'margin-right': '0'
                                });

                                comment_paragraphs.setStyles({
                                    'display': 'inline'
                                });

                                comment.store('status', 'collapsed');

                            }

                        break;

                    }

                }.bind(this)

            });

            upvote_link.addEvents({

                'mouseenter': function() {

                    if (!upvote_link.hasClass('has-voted')) {
                        upvote_fader.fade_up();
                        comment.store('on_upvote', true);
                    }

                }.bind(this),

                'mouseleave': function() {

                    if (!upvote_link.hasClass('has-voted')) {
                        upvote_fader.fade_down();
                        comment.store('on_upvote', false);
                    }

                }.bind(this)

            });

        }.bind(this));

    },

    do_preview: function(comment_author, comment_text) {

        new Element('div', {
            html: comment_text.get('html'),
            'class': 'comment-preview'
        }).inject(document.body);

    },

    get_window_size_and_link_overflows: function() {

        this.window_size = window.getSize();
        this.window_coordinates = window.getCoordinates();

        Array.each(this.comments, function(comment) {

            var last_paragraph_coordinates = comment.getElement('p:last-child').getCoordinates();

            if ((last_paragraph_coordinates.right + 30) > this.window_coordinates.right) {
                comment.store('overflowing', true);
            }

            else {
                comment.store('overflowing', false);
            }

        }.bind(this));

    }

});
