var DisableSelect = new Class ({

    initialize: function(div) {

        this.div = div;
        this.disable_select();

    },

    disable_select: function() {

        if (Browser.ie) {
            this.div.addEvent('selectstart', function() { return false; });
        }

        else if (Browser.firefox) {
            this.div.setStyle('MozUserSelect', 'none');
        }

        else {
            this.div.addEvent('mousedown', function() { return false; });
        }

        this.div.setStyle('cursor', 'default');

    }


});
