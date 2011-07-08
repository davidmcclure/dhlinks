var Tags = new Class ({

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

    initialize: function(tag_class, options) {

        this.setOptions(options);
        this.tags = $$('li.' + tag_class + ' a');

        this._set_tweens(this.tags, this.options.tween_settings);

        Array.each(this.tags, function(tag) {

            if (!tag.getParent('li').hasClass('selected-tag')) {

                tag.addEvents({

                    'mouseenter': function() {
                        this.fade_tag(tag, this.options.orange);
                    }.bind(this),

                    'mouseleave': function() {
                        this.fade_tag(tag, this.options.gray);
                    }.bind(this)

                });

            }

        }.bind(this));

    },

    fade_tag: function(tag, color) {

        tag.tween('color', color);

    },

    _set_tweens: function(dom, settings) {

        dom.set('tween', settings);

    }.protect()

});

// dev usage
window.addEvent('domready', function() {
    this.tags = new Tags('tag');
});
