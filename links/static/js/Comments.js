var Comments = new Class ({

    Implements: [Options, Events],

    options: {
        orange: '#f7ba36',
        blue: '#2b7bff',
        gray: '#9b9b9b',
        light_blue: '#9cc1ff',
        base_text_color: '#484848'
    },

    initialize: function(comment_container_class, options) {

        this.setOptions(options);
        this.comments = $$('.' + comment_container_class);

        this.gloss_comments();

    },

    gloss_comments: function() {

        Array.each(this.comments, function(comment) {

            var comment_author = comment.getElement('.comment-author');
            var comment_details = comment.getElement('.comment-details');
            var upvote_link = comment.getElement('.upvote-link');
            var opaque_content = $$([comment_author, comment_details, upvote_link]);
            var comment_text = comment.getElement('.comment-text');

            var link_text_fader = new LinkFader(comment_text, this.options.base_text_color, this.options.blue);
            var link_details_fader = new LinkFader(opaque_content, 0.6, 1.0, { property: 'opacity' });
            var upvote_fader = new LinkFader(upvote_link, this.options.blue, this.options.orange);
            var author_fader = new LinkFader(comment_author, this.options.blue, this.options.orange);

            comment.addEvents({

                'mouseenter': function() {

                    link_text_fader.fade_up();
                    link_details_fader.fade_up();
                    author_fader.fade_up();

                }.bind(this),

                'mouseleave': function() {

                    link_text_fader.fade_down();
                    link_details_fader.fade_down();
                    author_fader.fade_down();

                }.bind(this)

            });

        }.bind(this));

    }

});
