var Letter = new Class ({

    Implements: [Options, Events],

    options: {

    },

    initialize: function(span, options) {

        this.setOptions(options);
        this.span = span;

    }

});
