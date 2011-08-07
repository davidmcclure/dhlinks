var Links = new Class ({

    Implements: [Options, Events],

    options: {
        'orange': '#f7ba36',
        'blue': '#2b7bff',
        'gray': '#9b9b9b',
        'light_blue': '#9cc1ff'
    },

    initialize: function(link_container_class, options) {

        this.setOptions(options);
        this.link_container_class = link_container_class;

        // this.link_batch = 1;

        // this.get_links = new Request.HTML({
        //     method: 'post',
        //     url: '/ajax/submissions/1',
        //     onSuccess: function(responseTree, responseElements, responseHTML, responseJavaScript) {
        //         this.update_links(responseHTML);
        //     }.bind(this)
        // });

        this.gloss_links();

    },

    gloss_links: function() {

        this.links_dom = $$('.' + this.link_container_class);
        this.links = [];
        this.comment_links = [];
        this.upvote_links = [];
        this.are_more = $$('.are-more');

        if(this.are_more.length > 0) {

            var are_more = this.are_more[0];
            var more = are_more.getElement('.are-more-more');
            var arrow = are_more.getElement('.are-more-arrow');
            var more_fader = new LinkFader(more, this.options.blue, this.options.orange);
            var arrow_fader = new LinkFader(arrow, this.options.orange, this.options.blue);

            are_more.addEvents({

                'mouseenter': function() {
                    more_fader.fade_up();
                    arrow_fader.fade_up();
                }.bind(this),

                'mouseleave': function() {
                    more_fader.fade_down();
                    arrow_fader.fade_down();
                }.bind(this)

            });

        }

        Array.each(this.links_dom, function(link_dom) {

            var link_title = link_dom.getElement('li.link a.link-title');
            var link_base_url = link_dom.getElement('li.link span.base-url-text');
            var comments_link = link_dom.getElement('a.comments-link');
            var start_comments_link = link_dom.getElement('a.start-comments-link');
            var upvote_link = link_dom.getElement('a.upvote-link');

            var link_pusher = [];

            if (link_title != null) {
                link_pusher.push(new LinkFader(link_title, this.options.blue, this.options.orange));
            }
            if (link_base_url != null) {
                link_pusher.push(new LinkFader(link_base_url, this.options.light_blue, this.options.orange));
            }
            if (comments_link != null) {
                this.comment_links.push(new LinkFader(comments_link, this.options.orange, this.options.blue));
            }
            if (start_comments_link != null) {
                this.comment_links.push(new LinkFader(start_comments_link, this.options.light_blue, this.options.orange));
            }
            if (upvote_link != null) {
                this.upvote_links.push(new LinkFader(upvote_link, this.options.blue, this.options.orange));
            }

            this.links.push(link_pusher);

        }.bind(this));

        Array.each(this.links, function(link) {

            var link_dom = [];

            Array.each(link, function(link_part) {
                link_dom.push(link_part.div);
            }.bind(this));

            $$(link_dom).addEvents({

                'mouseenter': function() {

                    Array.each(link, function(l) {
                        l.fade_up();
                    }.bind(this));

                }.bind(this),

                'mouseleave': function() {

                    Array.each(link, function(l) {
                        l.fade_down();
                    }.bind(this));

                }.bind(this)

            });

        }.bind(this));

        Array.each(this.comment_links, function(link) {

            link.div.addEvents({

                'mouseenter': function() {
                    link.fade_up();
                }.bind(this),

                'mouseleave': function() {
                    link.fade_down();
                }.bind(this)

            });

        }.bind(this));

        Array.each(this.upvote_links, function(link) {

            link.div.addEvents({

                'mouseenter': function() {
                    link.fade_up();
                }.bind(this),

                'mouseleave': function() {
                    link.fade_down();
                }.bind(this)

            });

        }.bind(this));

    }

});
