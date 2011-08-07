var Letter = new Class ({

    Implements: [Options, Events],

    initialize: function(char, div) {

        this.div = new Element('span', {
            'html': char
        }).inject(div);

        this.tween_templates = {

            'default': {
                'duration': this.durations.fade_duration,
                'fps': this.durations.fps,
                'transition': this.durations.transition
            },
            'mouseover_fast': {
                'duration': this.durations.fade_duration_mouseover,
                'fps': this.durations.fps,
                'transition': this.durations.transition
            },
            'mouseleave_medium': {
                'duration': this.durations.fade_duration_mouseleave,
                'fps': this.durations.fps,
                'transition': this.durations.transition
            },
            'slow_pop': {
                'duration': this.durations.fade_duration_slow_pop,
                'fps': this.durations.fps,
                'transition': this.durations.transition
            },
            'fast_pop': {
                'duration': this.durations.fade_duration_fast_pop,
                'fps': this.durations.fps,
                'transition': this.durations.transition
            },
            'loader_pop': {
                'duration': this.durations.fade_duration_loader_pop,
                'fps': this.durations.fps,
                'transition': this.durations.transition
            }

        }

    },

    shift_color: function(color, tween_settings) {

        this._set_tween(tween_settings);
        this.div.tween('color', color);

    },

    pop: function(target_color, base_color, tween_settings) {

        this._set_tween(tween_settings);
        this.div.setStyle('color', target_color);
        this.div.tween('color', base_color);

    },

    _set_tween: function(settings) {

        this.div.set('tween', settings);

    },

    durations: {

        'fade_duration': 300,
        'fade_duration_mouseover': 30,
        'fade_duration_mouseleave': 30,
        'fade_duration_slow_pop': 2000,
        'fade_duration_fast_pop': 500,
        'fade_duration_loader_pop': 5,
        'transition': 'quad:in',
        'fps': 100

    }

});
