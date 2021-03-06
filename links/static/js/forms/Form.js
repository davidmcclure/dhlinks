var Form = new Class ({

    Implements: [Options, Events],

    options: {
        orange: '#f7ba36',
        blue: '#2b7bff',
        gray: '#9b9b9b',
        light_blue: '#9cc1ff',
        input_gray: '#dbdbdb',
        purple: '#540ead',
        fps: 100,
        fadein_duration: 10,
        fadeout_duration: 70,
        transition: Fx.Transitions.Quad.easeOut,
        password_input_name: 'password'
    },

    initialize: function(form_id, names_to_prompts, password_names, options) {

        this.setOptions(options);
        this.form = document.id(form_id);
        this.names_to_prompts = names_to_prompts;
        this.password_names = password_names;

        this.gloss_text_inputs();
        this.gloss_submits();
        this.gloss_password_input();
        this.gloss_checkboxes();
        this.gloss_textareas();
        this.gloss_form_links();

    },

    gloss_text_inputs: function() {

        this.text_inputs = $$('input[type=text], input[type=password]');

        this.text_inputs.set('tween', {
            transition: this.options.transition,
            fps: this.options.fps
        });

        Array.each(this.text_inputs, function(input) {

            input.set('autocomplete', 'off')
            input.store('focus_status', false);
            input.store('has_typed', false);
            input.store('is_error', false);

            // does the field have an error output, meaning that the field
            // should be glossed on by default?
            var error_messages = input.getParent('.fieldWrapper').getElements('ul.errorlist li');

            // if so set focus_status and has_typed to true
            if (error_messages.length != 0 && (input.getAttribute('value') != this.names_to_prompts[input.getAttribute('name')])) {
                input.store('focus_status', true);
                input.store('has_typed', true);
                input.setStyle('color', 'red');
                input.store('is_error', true);
            }

            // if so set focus_status and has_typed to true
            if (error_messages.length != 0 && (input.getAttribute('value') == this.names_to_prompts[input.getAttribute('name')])) {
                input.store('focus_status', true);
                input.store('has_typed', true);
                input.setStyle('color', 'red');
                input.store('is_error', true);
                input.set('value', '');
            }

            // if data was entered in the last submit, gloss the field and keep
            // the data.
            else if (error_messages.length == 0 && input.getAttribute('value') != this.names_to_prompts[input.getAttribute('name')]) {
                input.store('focus_status', true);
                input.store('has_typed', true);
                input.setStyle('color', this.options.blue);
            }

            input.addEvents({

                'focus': function() {

                    if (!input.retrieve('has_typed') || input.retrieve('is_error')) {
                        input.set('value', '');
                    }

                    input.store('focus_status', true);
                    input.set('tween', { duration: this.options.fadein_duration });
                    input.tween('color', this.options.blue);

                }.bind(this),

                'blur': function() {

                    if (!input.retrieve('has_typed') || input.get('value') == '') {
                        input.setStyle('color', this.options.form_gray);
                        input.set('value', this.names_to_prompts[input.getAttribute('name')]);
                        input.store('has_typed', false);
                    }

                    else {
                        input.set('tween', { duration: this.options.fadeout_duration });
                        input.tween('color', this.options.blue);
                    }

                    input.store('focus_status', false);

                }.bind(this),

                'keydown': function() {

                    input.store('has_typed', true);

                }.bind(this),

                'mouseenter': function() {

                    if (!input.retrieve('focus_status') && !input.retrieve('has_typed')) {
                        input.set('tween', { duration: this.options.fadein_duration });
                        input.tween('color', this.options.blue);
                    }

                }.bind(this),

                'mouseleave': function() {

                    if (!input.retrieve('focus_status') && !input.retrieve('has_typed')) {
                        input.set('tween', { duration: this.options.fadeout_duration });
                        input.tween('color', this.options.input_gray);
                    }

                    else if (!input.retrieve('focus_status') && input.retrieve('has_typed')) {
                        input.set('tween', { duration: this.options.fadeout_duration });
                        input.tween('color', this.options.blue);
                    }

                }.bind(this)

            });

        }.bind(this));

    },

    gloss_password_input: function() {

        var passwords_selector = [];
        Array.each(this.password_names, function(name) {
            passwords_selector.push('input[name=' + name + ']');
        }.bind(this));

        this.password_inputs = $$(passwords_selector.join(','));

        Array.each(this.password_inputs, function(input) {

            // does the field have an error output, meaning that the field
            // should be glossed on by default?

            var error_messages = input.getParent('.fieldWrapper').getElements('ul.errorlist li');

            // if so, set focus_status and has_typed to true

            if (error_messages.length != 0) {
                input.store('focus_status', true);
                input.store('has_typed', true);
                input.setStyle('color', this.options.blue);
                input.set('type', 'password');
                input.set('value', '');
            }

            input.addEvents({

                'focus': function() {
                    input.set('type', 'password');
                }.bind(this),

                'blur': function() {
                    if (!input.retrieve('has_typed') || input.get('value') == '') {
                        input.set('type', 'text');
                    }
                }.bind(this)

            });

        }.bind(this));

    },

    gloss_submits: function() {

        this.submits = $$('input[type=submit]');

        this.submits.set('tween', {
            transition: this.options.transition,
            fps: this.options.fps
        });

        Array.each(this.submits, function(input) {

            var starting_color = input.getStyle('background-color');

            input.addEvents({

                'mouseenter': function() {
                    input.set('tween', { duration: this.options.fadein_duration });
                    input.tween('background-color', this.options.orange);
                }.bind(this),

                'mouseleave': function() {
                    input.set('tween', { duration: this.options.fadeout_duration + 200 });
                    input.tween('background-color', starting_color);
                }.bind(this),

                'mousedown': function() {
                    input.setStyle('background-color', this.options.purple);
                }.bind(this)

            });

        }.bind(this));

    },

    gloss_checkboxes: function() {

        this.checkboxes = $$('input[type=checkbox]');

        Array.each(this.checkboxes, function(input) {

            var container = input.getParent('.fieldWrapper');
            var label = container.getElement('label');

            new DisableSelect(container);

            if (label.hasClass('selected')) {
                container.store('checked', true);
            } else {
                container.store('checked', false);
            }

            container.set('tween', {
                transition: this.options.transition,
                fps: this.options.fps
            });

            container.addEvents({

                'mouseenter': function() {

                    if (!container.retrieve('checked')) {
                        label.set('tween', { duration: this.options.fadein_duration });
                        label.tween('color', this.options.light_blue);
                    }

                }.bind(this),

                'mouseleave': function() {

                    if (!container.retrieve('checked')) {
                        label.set('tween', { duration: this.options.fadeout_duration });
                        label.tween('color', this.options.input_gray);
                    }

                }.bind(this),

                'mousedown': function() {

                    if (!container.retrieve('checked')) {
                        input.checked = true;
                        label.setStyle('color', this.options.blue);
                        container.store('checked', true);
                    }

                    else {
                        input.checked = false;
                        label.setStyle('color', this.options.light_blue);
                        container.store('checked', false);
                    }

                }.bind(this)

            });

            input.addEvents({

                'click': function(event) {
                    event.stop();
                }

            });

        }.bind(this));

    },

    gloss_textareas: function() {

        this.textareas = $$('textarea');

        this.textareas.set('tween', {
            transition: this.options.transition,
            fps: this.options.fps
        });

        Array.each(this.textareas, function(input) {

            input.store('focus_status', false);
            input.store('has_typed', false);
            input.store('is_error', false);

            // does the field have an error output, meaning that the field
            // should be glossed on by default?
            var error_messages = input.getParent('.fieldWrapper').getElements('ul.errorlist li');

            // if so set focus_status and has_typed to true
            if (error_messages.length != 0 && (input.get('html') != this.names_to_prompts[input.getAttribute('name')])) {
                input.store('focus_status', true);
                input.store('has_typed', true);
                input.setStyle('color', 'red');
                input.store('is_error', true);
            }

            // if so set focus_status and has_typed to true
            if (error_messages.length != 0 && (input.get('html') == this.names_to_prompts[input.getAttribute('name')])) {
                input.store('focus_status', true);
                input.store('has_typed', true);
                input.setStyle('color', 'red');
                input.store('is_error', true);
                input.set('html', '');
            }

            // if data was entered in the last submit, gloss the field and keep
            // the data.
            else if (error_messages.length == 0 &&
                     input.get('html') != this.names_to_prompts[input.getAttribute('name')] &&
                     input.getParent('form').getProperty('action') != '/addcomment') {
                input.store('focus_status', true);
                input.store('has_typed', true);
                input.setStyle('color', '#484848');
            }

            input.addEvents({

                'focus': function() {

                    if (!input.retrieve('has_typed') || input.retrieve('is_error')) {
                        input.set('value', '');
                    }

                    input.store('focus_status', true);
                    input.set('tween', { duration: this.options.fadein_duration });
                    input.setStyle('color', '#484848');
                    input.setStyle('font-size', '0.85em');

                }.bind(this),

                'blur': function() {

                    if (!input.retrieve('has_typed') || input.get('value') == '') {
                        input.setStyle('color', this.options.form_gray);
                        input.set('value', input.getAttribute('name'));
                        input.store('has_typed', false);
                        this.fireEvent('nocontent');
                    }

                    else {
                        input.set('tween', { duration: this.options.fadeout_duration });
                        input.tween('color', this.options.blue);
                    }

                    input.store('focus_status', false);

                }.bind(this),

                'keydown': function() {

                    input.store('has_typed', true);
                    this.fireEvent('content');

                }.bind(this),

                'mouseenter': function() {

                    if (!input.retrieve('focus_status') && !input.retrieve('has_typed')) {
                        input.set('tween', { duration: this.options.fadein_duration });
                        input.tween('color', this.options.blue);
                    }

                }.bind(this),

                'mouseleave': function() {

                    if (!input.retrieve('focus_status') && !input.retrieve('has_typed')) {
                        input.set('tween', { duration: this.options.fadeout_duration });
                        input.tween('color', this.options.input_gray);
                    }

                    else if (!input.retrieve('focus_status') && input.retrieve('has_typed')) {
                        input.set('tween', { duration: this.options.fadeout_duration });
                        input.tween('color', this.options.blue);
                    }

                }.bind(this)

            });

        }.bind(this));

    },

    gloss_form_links: function() {

        this.form_links = $$('.form-link');

        Array.each(this.form_links, function(link) {
            var fader = new LinkFader(link, this.options.blue, this.options.orange);

            link.addEvents({
                'mouseenter': function() { fader.fade_up(); },
                'mouseleave': function() { fader.fade_down(); }
            });

        }.bind(this));

    }

});
