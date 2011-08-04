window.addEvent('domready', function() {

    this.register_form = new Form('register-form',
        {
            'username': 'username',
            'password': 'password',
            'password_confirm': 'confirm',
            'email': 'email',
            'firstname': 'first name',
            'lastname': 'last name'
        },
        [
            'password',
            'password_confirm'
        ]
    );

});
