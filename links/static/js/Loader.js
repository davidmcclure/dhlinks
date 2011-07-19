var Loader = new Class ({

    Implements: [Options, Events],

    options: {
        orange: '#f7ba36',
        blue: '#2b7bff',
        gray: '#9b9b9b',
        light_blue: '#9cc1ff',
        pop_interval: 40
    },

    initialize: function(div, options) {

        this.setOptions(options);
        this.div = div;

        this.split = new LetterSplitter([this.div]);

    },

    start: function() {

        this.letter_count = this.split.letters.length;
        this.direction = 'right';
        this.counter = 0;

        this.div.setStyle('display', 'inline');
        this.loader = this.letter_pop.periodical(this.options.pop_interval, this);

    },

    stop: function() {

        clearInterval(this.loader);

    },

    letter_pop: function() {

        switch (this.direction) {

            case 'right':

                if (this.counter + 1 <= this.letter_count) {
                    this.split.pop_letter(this.split.letters[this.counter], this.options.blue, this.options.orange);
                    this.counter++;
                }

                else {
                    this.counter -= 2;
                    this.split.pop_letter(this.split.letters[this.counter], this.options.blue, this.options.orange);
                    this.direction = 'left';
                    this.counter--;
                }

            break;

            case 'left':

                if (this.counter != 0) {
                    this.split.pop_letter(this.split.letters[this.counter], this.options.blue, this.options.orange);
                    this.counter--;
                }

                else {
                    this.split.pop_letter(this.split.letters[this.counter], this.options.blue, this.options.orange);
                    this.direction = 'right';
                    this.counter++;
                }

            break;

        }

    }

});
