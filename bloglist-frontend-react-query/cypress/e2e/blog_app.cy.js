describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })


  it('Login form is shown', function () {
    cy.contains('login')
    cy.get('#username')
    cy.get('#password')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.contains('Matti Luukkainen logged-in')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')

      cy.get('html').should('not.contain', 'Matti Luukkainen logged in')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'mluukkai', password: 'salainen' })
    })

    it('A blog can be created', function () {
      cy.contains('new blog').click()
      cy.get('#title').type('e2e testing title')
      cy.get('#author').type('e2e testing author')
      cy.get('#url').type('e2e testing url')
      cy.contains('create new').click()

      cy.contains('e2e testing title e2e testing author ')
    })

    describe('When logged in and blog created', function () {
      beforeEach(function () {
        cy.login({ username: 'mluukkai', password: 'salainen' })
        cy.createBlog({ title: 'title for testing', author: 'author for testing', url: 'test.com', likes: 0 })
      })

      it('user can like a blog', function () {
        cy.contains('view').click()
          .get('.like-span')
          .find('button').click()

        cy.get('.like-span').should('contain', '1')
      })

      it('user can delete the blog', function () {
        cy.contains('view').click()
        cy.contains('remove').click()

        cy.get('html').should('not.contain', 'title for testing author for testing')

      })

      it('other users can not delete the blog', function () {
        const user = {
          name: 'Arti',
          username: 'user',
          password: 'another'
        }
        cy.request('POST', 'http://localhost:3003/api/users/', user)
        cy.contains('logout').click()
        cy.login({ username: 'user', password: 'another' })
        cy.createBlog({ title: 'another blog', author: 'another title', url: 'another.com', likes: 0 })
        cy.contains('logout').click()
        cy.login({ username: 'mluukkai', password: 'salainen' })


        cy.contains('another')
          .contains('view').click()
        cy.contains('another.com').contains('remove').click()

        cy.get('html').should('contain', 'another blog another title')

      })

      it.only('blogs are ordered according to likes', async function () {
        cy.createBlog({ title: 'the title with the most likes', author: 'author with most likes', url: 'best.com', likes: 0 })
        cy.createBlog({ title: 'the title with the second most likes', author: 'author with the second most likes', url: 'best2.com', likes: 0 })
        cy.createBlog({ title: 'the title with the third most likes', author: 'author with the second most likes', url: 'best3.com', likes: 0 })

        cy.contains('the title with the most likes')
          .contains('view').click()


        for (let i = 0; i < 5; i++) {
          cy.contains('best.com')
            .contains('like').click()
          cy.wait(1400)
        }

        cy.contains('the title with the second most likes')
          .contains('view').click()


        for (let i = 0; i < 4; i++) {
          cy.contains('best2.com')
            .contains('like').click()
          cy.wait(1400)
        }

        cy.contains('the title with the third most likes')
          .contains('view').click()

        for (let i = 0; i < 3; i++) {
          cy.contains('best3.com')
            .contains('like').click()
          cy.wait(1400)
        }

        cy.get('.blog').eq(0).should('contain', 'the title with the most likes')
        cy.get('.blog').eq(1).should('contain', 'the title with the second most likes')
        cy.get('.blog').eq(2).should('contain', 'the title with the third most likes')




      })



    })
  })
})