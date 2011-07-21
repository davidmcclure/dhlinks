var LetterSplitter = new Class ({

    Implements: [Events],

    initialize: function(divs) {

        this.divs = divs;
        this.split_letters();

    },

    split_letters: function() {

        this.letters = [];
        this.letter_count = 0;

        Array.each(this.divs, function(div) {

            var starting_text = div.get('text');
            div.set('html', '');

            for (var i=0; i<starting_text.length; i++) {

                var char = starting_text[i];
                var span = new Letter(char, div);

                this.letters.push(span);

            }

            this.letter_count += starting_text.length;

        }.bind(this));

    }

});
