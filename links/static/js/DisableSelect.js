var DisableSelect = new Class ({

    initialize: function(div_name) {

        this.div = document.id(div_name);
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
