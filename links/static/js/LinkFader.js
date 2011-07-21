var LinkFader = new Class ({

    Implements: [Options, Events],

    options: {
        fps: 100,
        fadein_duration: 40,
        fadeout_duration: 500,
        transition: Fx.Transitions.Quad.easeOut,
        fadeout_variance_interval: 100
    },

    initialize: function(div, starting_color, target_color, options) {

        this.setOptions(options);
        this.div = div;
        this.starting_color = starting_color;
        this.target_color = target_color;

        this.div.set('tween', {
            transition: this.options.transition,
            fps: this.options.fps
        });

    },

    fade_up: function() {

        this.div.set('tween', { duration: this.options.fadein_duration });
        this.div.tween('color', this.target_color);

    },

    fade_down: function() {

        this.div.set('tween', { duration: this.options.fadeout_duration });
        this.div.tween('color', this.starting_color);

    }

});
