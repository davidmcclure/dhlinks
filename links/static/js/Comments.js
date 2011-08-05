var Comments = new Class ({

    Implements: [Options, Events],

    options: {
        orange: '#f7ba36',
        blue: '#2b7bff',
        gray: '#9b9b9b',
        light_blue: '#9cc1ff',
        base_text_color: '#484848'
    },

    initialize: function(comment_block_container_id, comment_container_class, reply_form_id, options) {

        this.setOptions(options);
        this.comments_container = document.id('comment_block_container_id');
        this.comments = $$('.' + comment_container_class);
        this.reply_form = document.id(reply_form_id);
        this.root_reply_container = document.id('root-reply');

        this.gloss_comments();
        this.gloss_root_reply();

    },

    gloss_comments: function() {

        Array.each(this.comments, function(comment) {

            comment.store('status', 'expanded'); // collapsed or expanded
            comment.store('on_upvote', false);
            comment.store('reply_form', false);

            var reply_link = comment.getElement('.reply-link a');
            var reply_fader = new LinkFader(reply_link, this.options.blue, this.options.orange);

            var id = comment.getElement('id').get('html');

            reply_link.addEvents({

                'mouseenter': function() {

                    reply_fader.fade_up();

                },

                'mouseleave': function() {

                    reply_fader.fade_down();

                },

                'mousedown': function(event) {

                    event.stop();

                    if (!comment.retrieve('reply_form')) {
                        var reply_form = this.get_reply_form(id);
                        reply_form.inject(comment.getElement('.comment'));
                        new Form('reply-form-' + id, { 'comment': 'comment' }, []);
                        comment.store('reply_form', true);
                    }

                    else {
                        comment.getElement('form').destroy();
                        comment.store('reply_form', false);
                    }

                }.bind(this),

                'click': function(event) {

                    event.stop();

                }.bind(this)

            });

        }.bind(this));

    },

    gloss_root_reply: function() {

        new Form('root-reply', {}, []);

        var starting_input_p = this.root_reply_container.getElement('p');
        var input = starting_input_p.getElement('input');

        input.addEvents({

            'mousedown': function() {

                var reply_form = this.get_reply_form('root');
                starting_input_p.destroy();
                reply_form.setStyle('margin-left', '1em').inject(this.root_reply_container);
                new Form('reply-form-' + 'root', { 'comment': 'comment' }, []);

            }.bind(this)

        });

    },

    get_reply_form: function(id) {

        var new_form = this.reply_form.clone();
        var id_input = new_form.getElement('.parent-id-hidden');
        id_input.setProperty('value', id);
        new_form.setProperty('id', 'reply-form-' + id);


        return new_form;

    }

});
