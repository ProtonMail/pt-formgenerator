context('Test username domain component', () => {
    const getNode = (type) => {
        if (type === 'domain') {
            return cy.get('select[name="domain"]');
        }
        if (type === 'username') {
            return cy.get('input[name="username"]');
        }
        if (type === 'error') {
            return cy.get('.error');
        }
        if (type === 'suggestions') {
            return cy.get('.suggestions');
        }
        if (type === 'success') {
            return cy.get('.success');
        }
    };

    beforeEach(() => {
        cy.visit(Cypress.env('server') + '?name=top');
    });

    it('displays the component', () => {
        cy.get('[id="app"][data-name="top"]').should('exist');
    });

    context('Username input', () => {
        it('displays the username input', () => {
            const input = getNode('username');

            input.should('exist');
            input.should('have.attr', 'placeholder', 'Thomas A. Anderson');
            input.should('have.attr', 'id', 'username');
            input.should('have.value', '');
        });

        it('contains validators the username input', () => {
            const input = getNode('username');

            input.should('have.attr', 'required');
            input.should('not.have.attr', 'maxlength');
            input.should('not.have.attr', 'minlength');
        });
    });

    context('Domains select', () => {
        it('displays the select domains', () => {
            const node = getNode('domain');

            node.should('exist');
            node.should('have.attr', 'name', 'domain');
            node.should('have.value', 'protonmail.com');
        });

        it('contains 2 options', () => {
            const node = getNode('domain');

            node.select('protonmail.com').should('have.value', 'protonmail.com');

            node.select('protonmail.ch').should('have.value', 'protonmail.ch');
        });
    });

    context('Validation: Invalid input', () => {
        it('displays nothing on the first load', () => {
            getNode('error').should('not.exist');
            getNode('success').should('not.exist');
            getNode('suggestions').should('not.exist');
        });

        it('displays a minlength error if value < 3', () => {
            const input = getNode('username');
            input.type('a');
            input.blur();

            const node = getNode('error');
            node.should('exist');

            node.invoke('text').then((txt) => {
                expect(txt).to.eq('Min length for a username is 3');
            });

            const input2 = getNode('username');
            input2.type('e');
            input2.blur();

            getNode('error')
                .invoke('text')
                .then((txt) => {
                    expect(txt).to.eq('Min length for a username is 3');
                });

            const input3 = getNode('username');
            input3.type('1');
            input3.blur();

            cy.wait(1000);

            getNode('error').should('not.exist');
        });

        it('displays a maxerror error if value > 15', () => {
            const input = getNode('username');
            input.clear();
            input.type('apokewofkweopfewfewfwefkweopfkwep');
            input.blur();

            const node = getNode('error');
            node.should('exist');

            node.invoke('text').then((txt) => {
                expect(txt).to.eq('Max length for a username is 15');
            });
        });

        it('displays an invalid error if invalid regexp', () => {
            const input = getNode('username');
            input.clear();
            input.type('#dewdewd');
            input.blur();

            const node = getNode('error');
            node.should('exist');

            node.invoke('text').then((txt) => {
                expect(txt).to.eq('It must contains only letters/digits or - and start with a letter/digit');
            });
        });

        it('displays an invalid error + suggestion if username exists', () => {
            const input = getNode('username');
            input.clear();
            input.type('dew');
            input.blur();

            const node = getNode('error');
            node.should('exist');

            node.invoke('text').then((txt) => {
                expect(txt).to.eq('Username already used');
            });
        });
    });

    context('Validation: Suggestion', () => {
        it('displays 3 buttons', () => {
            const input = getNode('username');
            input.clear();
            input.type('dew');
            input.blur();

            const node = getNode('suggestions');
            node.should('exist');
            node.find('button').should('have.length', 3);
        });

        it('selects one suggestion', () => {
            const input = getNode('username');
            input.clear();
            input.type('dew');
            input.blur();

            const node = getNode('suggestions');
            node.should('exist');
            node.find('button')
                .first()
                .click();

            getNode('suggestions').should('not.exist');
            const success = getNode('success');
            success.should('exist');

            success.invoke('text').then((txt) => {
                expect(txt).to.eq('Username available');
            });
        });

        it('binds the value from suggestion', () => {
            const input = getNode('username');
            input.clear();
            input.type('dew');
            input.blur();

            const node = getNode('suggestions');
            node.should('exist');
            const btn = node.find('button').first();

            btn.invoke('text').then((txt) => {
                const btn = getNode('suggestions')
                    .find('button')
                    .first();
                btn.click();
                getNode('username').should('have.value', txt);
            });
        });
    });
});
