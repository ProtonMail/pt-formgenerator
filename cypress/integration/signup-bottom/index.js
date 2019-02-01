context('Test username domain component', () => {
    const getNode = (type) => {
        if (type === 'email') {
            return cy.get('input[name="notificationEmail"]');
        }
        if (type === 'error') {
            return cy.get('.error');
        }
        if (type === 'submit') {
            return cy.get('button[name="submitBtn"]');
        }
    };

    beforeEach(() => {
        cy.visit(Cypress.env('server') + '?name=bottom');
    });

    it('displays the component', () => {
        cy.get('[id="app"][data-name="bottom"]').should('exist');
    });

    context('Email input', () => {
        it('displays the email input', () => {
            const input = getNode('email');

            input.should('exist');
            input.should('have.attr', 'placeholder', 'Recovery Email');
            input.should('have.attr', 'id', 'notificationEmail');
            input.should('have.attr', 'type', 'email');
            input.should('have.value', '');
        });
    });

    context('Validation: Invalid input', () => {
        it('displays nothing on the first load', () => {
            getNode('error').should('not.exist');
        });

        it('displays an error if email is invalid', () => {
            const input = getNode('email');
            input.type('monique');
            input.blur();

            const node = getNode('error');
            node.should('exist');

            node.invoke('text').then((txt) => {
                expect(txt).to.eq('Invalid email');
            });
        });

        it('displays no errors if the email is valid', () => {
            const input = getNode('email');
            input.clear();
            input.type('monique@pm.me');
            input.blur();

            getNode('error').should('not.exist');
        });
    });
});
