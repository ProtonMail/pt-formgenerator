function loadPage(username) {
    const query = username ? `&username=monique` : '';
    beforeEach(() => {
        cy.visit(Cypress.env('server') + '?name=top'.concat(query).trim());
    });
}

context('Test username domain component', () => {
    const getNode = (type) => {
        if (type === 'domain') {
            return cy.get('select[name="domain"]');
        }
        if (type === 'username') {
            return cy.get('input[name="username"]');
        }
        if (type === 'loader') {
            return cy.get('.loader');
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

    loadPage();

    it('displays the component', () => {
        cy.get('[id="app"][data-name="top"]').should('exist');
    });

    context('Username input', () => {
        loadPage();

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
        loadPage();

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
        loadPage();

        it('displays nothing on the first load', () => {
            getNode('error').should('not.exist');
            getNode('success').should('not.exist');
            getNode('suggestions').should('not.exist');
        });

        it('displays a maxerror error if value > 40', () => {
            const input = getNode('username');
            input.clear();
            input.type('a'.repeat(41));
            input.blur();

            const node = getNode('error');
            node.should('exist');

            node.invoke('text').then((txt) => {
                expect(txt).to.eq('Max length for a username is 40');
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

    context('Validation: valid input value', () => {
        loadPage();

        it('has a loader', () => {
            const input = getNode('username');
            input.clear();
            input.type('e');
            input.blur();

            const node = getNode('loader');
            node.should('exist');
        });

        it('validates input >=1', () => {
            const input = getNode('username');
            input.clear();
            input.type('e');
            input.blur();

            // None for input length === 1
            getNode('suggestions').should('not.exist');
            const error = getNode('error');
            error.should('exist');

            error.invoke('text').then((txt) => {
                expect(txt).to.eq('Username already used');
            });
        });

        it('validates input random', () => {
            const input = getNode('username');
            input.clear();
            input.type(`polo-${Date.now()}`);
            input.blur();

            getNode('suggestions').should('not.exist');
            const success = getNode('success');
            success.should('exist');

            success.invoke('text').then((txt) => {
                expect(txt).to.eq('Username available');
            });
        });

        it('validates an username with a . inside', () => {
            const input = getNode('username');
            input.clear();
            input.type(`polo.${Date.now()}`);
            input.blur();

            getNode('suggestions').should('not.exist');
            const success = getNode('success');
            success.should('exist');

            success.invoke('text').then((txt) => {
                expect(txt).to.eq('Username available');
            });
        });
    });

    context('Validation: Suggestion', () => {
        loadPage();

        it('has a loader', () => {
            const input = getNode('username');
            input.clear();
            input.type('dew');
            input.blur();

            const node = getNode('loader');
            node.should('exist');
        });

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
    context('Load the page with a username', () => {
        loadPage('monique');

        it('binds the value inside the input', () => {
            const input = getNode('username');

            input.should('exist');
            input.should('have.attr', 'id', 'username');
            input.should('have.value', 'monique');
        });
    });
});
