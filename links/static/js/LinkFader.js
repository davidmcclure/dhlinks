var LinkFader = new Class ({

    Implements: [Options, Events],

    options: {
        fps: 100,
        fadein_duration: 10,
        fadeout_duration: 70,
        transition: Fx.Transitions.Quad.easeOut,
        fadeout_variance_interval: 100,
        property: 'color',
        add_events: false
    },

    initialize: function(div, starting_color, target_color, options) {

        this.setOptions(options);
        this.div = div;
        this.starting_color = starting_color;
        this.target_color = target_color;

        this.up = true;

        this.div.set('tween', {
            transition: this.options.transition,
            fps: this.options.fps
        });

        if(this.options.add_events) {

            this.div.addEvents({
                'mouseenter': function() { this.fade_up(); }.bind(this),
                'mouseleave': function() { this.fade_down(); }.bind(this)
            });

        }

    },

    fade_up: function() {

        // this.div.set('tween', { duration: this.options.fadein_duration });
        // this.div.tween('color', this.target_color);
        this.div.setStyle(this.options.property, this.target_color);
        this.up = true;

    },

    fade_down: function() {

        this.div.set('tween', { duration: this.options.fadeout_duration });
        this.div.tween(this.options.property, this.starting_color);
        // this.div.setStyle(this.options.property, this.starting_color);
        this.up = false;

    }

});
