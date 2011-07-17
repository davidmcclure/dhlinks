var LinkFader = new Class ({

    Implements: [Options, Events],

    options: {
        fps: 100,
        fadein_base_duration: 20,
        fadeout_base_duration: 250,
        transition: 'quad:out',
        fadeout_variance_interval: 100
    },

    initialize: function(div, starting_color, target_color, options) {

        this.setOptions(options);
        this.div = div;
        this.starting_color = starting_color;
        this.target_color = target_color;

        this._set_tween({
            fps: this.options.fps,
            transition: this.options.transition
        });

    },

    fade_up: function() {

        this._set_tween({ duration: this.options.fadein_base_duration });
        this.div.tween('color', this.target_color);

    },

    fade_down: function() {

        this._set_tween({ duration: this.options.fadeout_base_duration });
        this.div.tween('color', this.starting_color);

    },

    _set_tween: function(properties) {

        this.div.set('tween', properties);

    }

});
