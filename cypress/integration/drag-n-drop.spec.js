describe('app works correctly with routes', function() {
    before(function() {
        cy.visit('http://localhost:3000');
    });

    beforeEach(function() {
        cy.intercept('/api/auth/login', { fixture: "login.json" });
        cy.intercept("GET", "/api/auth/user", { fixture: "user.json" });
        cy.intercept("POST", "/api/auth/token", { fixture: "token.json" });
        cy.intercept("POST", "/api/orders", { fixture: "postOrder.json" });
        cy.intercept("GET", "/api/ingredients", { fixture: "ingredients.json" });

        cy.intercept('/api/*', (req) => {
            console.log('INTERCEPT', req)
        })

        window.localStorage.setItem(
            "refreshToken",
            "test-refreshToken"
        );
        cy.setCookie('accessToken', 'test-accessToken');
    });

    // afterEach(function () {
    //     cy.clearLocalStorage();
    //     cy.clearCookies();
    // });

    it('should open ingredients page by default', function() {
        cy.contains('Соберите бургер');
        // cy.contains('Загрузка ингредиентов');
        cy.contains('Краторная булка N-200i');
        cy.get('[class^=burger-ingredients_ingredientCardList]').first().as('scroll');
        cy.get('[class^=burger-constructor_emptyList]').first().as('drop-aria-empty');

        cy.get('[class^=burger-ingredients_ingredientCard]').first().as('bun');
        cy.get('@bun').trigger('dragstart');


        cy.get('@drop-aria-empty').trigger('drop')
        cy.get('@bun').find('[class^=counter_counter__num]').as('itemCounter');
        cy.get('@itemCounter').should('contain', '1');

        cy.get('[class^=burger-constructor_main__]').first().as('drop-aria');

        cy.get('[id=main]').within(() => {
            cy.get('[class^=burger-ingredients_ingredientCard]').first().as('main');
        })
        cy.get('@main').trigger('dragstart');
        cy.get('@drop-aria').trigger('drop')
        cy.get('@main').trigger('dragstart');
        cy.get('@drop-aria').trigger('drop')
        cy.get('@bun').find('[class^=counter_counter__num]').as('mainCounter');
        cy.get('@mainCounter').should('contain', '1');

    });

    it('should open delivery page after make order button click', function() {
        cy.get('button').contains('Оформить заказ').click();
        cy.contains('Вход');
    });

    it('should return to order after login order button click', function() {
        cy.get('input[type=email]').type('user@mail.com');
        cy.get('input[type=password]').type('password');

        cy.get('button').contains('Войти').click();
        cy.contains('Соберите бургер');
    });

    it('should open order popup after make order button click', function() {
        cy.get('button').contains('Оформить заказ').click();
        cy.contains('идентификатор заказа');
        cy.get('[class^=order-details_orderId]').first().as('orderNum');
        cy.get('@orderNum').should('contain', '123456')
    });

    it('should close order popup after button click', function() {
        cy.get('[class^=modal_headerContainerIcon]').first().click();
        cy.contains('Перетащите ингредиенты для добавления в заказ');
    });



    //
    // it('should open agreement page after continue button click', function() {
    //     cy.contains('Обычная доставка').click();
    //     cy.get('button').contains('Продолжить оформление').click();
    //     cy.contains('Подтверждение заказа');
    // });
});