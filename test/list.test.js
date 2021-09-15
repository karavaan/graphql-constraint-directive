const setup = require('./setup')
const { strictEqual, deepStrictEqual } = require('assert')
const formatError = (error) => {
  const { message, code, fieldName, context } = error.originalError.originalError || error.originalError

  return { message, code, fieldName, context }
}

describe('@constraint LIST in INPUT_FIELD_DEFINITION', function () {
  const query = `mutation createBook($input: BookInput) {
    createBook(input: $input) {
      title
    }
  }`

  describe('#minListLength', function () {
    describe('string list', function () {
      before(function () {
        this.typeDefs = `
       type Query {
        books: [Book]
      }
      type Book {
        title: String
      }
      type Mutation {
        createBook(input: BookInput): Book
      }
      input BookInput {
        titles: [String!]! @constraint(minListLength: 3)
      }`
        this.request = setup(this.typeDefs)
      })

      it('should pass', async function () {
        const { body, statusCode } = await this.request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({
            query, variables: { input: { titles: ['1', '2', '3'] } }
          })
        strictEqual(statusCode, 200)
        deepStrictEqual(body, { data: { createBook: null } })
      })

      it('should fail', async function () {
        const { body, statusCode } = await this.request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({
            query, variables: { input: { titles: ['1', '2'] } }
          })

        strictEqual(statusCode, 400)
        strictEqual(body.errors[0].message,
          'Variable "$input" got invalid value ["1", "2"] at "input.titles"; Expected type "titles_List_NotNull_minListLength_3". Length of list must be at least 3')
      })

      it('should throw custom error', async function () {
        const request = setup(this.typeDefs, formatError)
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query, variables: { input: { titles: ['a💩'] } } })

        strictEqual(statusCode, 400)
        deepStrictEqual(body.errors[0], {
          message: 'Length of list must be at least 3',
          code: 'ERR_GRAPHQL_CONSTRAINT_VALIDATION',
          fieldName: 'titles',
          context: [{ arg: 'minListLength', value: 3 }]
        })
      })
    })

    describe('int list', function () {
      before(function () {
        this.typeDefs = `
       type Query {
        books: [Book]
      }
      type Book {
        title: String
      }
      type Mutation {
        createBook(input: BookInput): Book
      }
      input BookInput {
        titles: [Int!]! @constraint(minListLength: 3)
      }`
        this.request = setup(this.typeDefs)
      })

      it('should pass', async function () {
        const { body, statusCode } = await this.request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({
            query, variables: { input: { titles: [1, 2, 3] } }
          })
        strictEqual(statusCode, 200)
        deepStrictEqual(body, { data: { createBook: null } })
      })

      it('should fail', async function () {
        const { body, statusCode } = await this.request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({
            query, variables: { input: { titles: [1, 2] } }
          })
        strictEqual(statusCode, 400)
        strictEqual(body.errors[0].message,
          'Variable "$input" got invalid value [1, 2] at "input.titles"; Expected type "titles_List_NotNull_minListLength_3". Length of list must be at least 3')
      })

      it('should throw custom error', async function () {
        const request = setup(this.typeDefs, formatError)
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query, variables: { input: { titles: [1] } } })

        strictEqual(statusCode, 400)
        deepStrictEqual(body.errors[0], {
          message: 'Length of list must be at least 3',
          code: 'ERR_GRAPHQL_CONSTRAINT_VALIDATION',
          fieldName: 'titles',
          context: [{ arg: 'minListLength', value: 3 }]
        })
      })
    })

    describe('boolean list', function () {
      before(function () {
        this.typeDefs = `
       type Query {
        books: [Book]
      }
      type Book {
        title: String
      }
      type Mutation {
        createBook(input: BookInput): Book
      }
      input BookInput {
        titles: [Boolean!]! @constraint(minListLength: 3)
      }`
        this.request = setup(this.typeDefs)
      })

      it('should pass', async function () {
        const { body, statusCode } = await this.request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({
            query, variables: { input: { titles: [true, true, false] } }
          })
        strictEqual(statusCode, 200)
        deepStrictEqual(body, { data: { createBook: null } })
      })

      it('should fail', async function () {
        const { body, statusCode } = await this.request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({
            query, variables: { input: { titles: [true, false] } }
          })
        strictEqual(statusCode, 400)
        strictEqual(body.errors[0].message,
          'Variable "$input" got invalid value [true, false] at "input.titles"; Expected type "titles_List_NotNull_minListLength_3". Length of list must be at least 3')
      })

      it('should throw custom error', async function () {
        const request = setup(this.typeDefs, formatError)
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query, variables: { input: { titles: [true] } } })

        strictEqual(statusCode, 400)
        deepStrictEqual(body.errors[0], {
          message: 'Length of list must be at least 3',
          code: 'ERR_GRAPHQL_CONSTRAINT_VALIDATION',
          fieldName: 'titles',
          context: [{ arg: 'minListLength', value: 3 }]
        })
      })
    })

    describe('float list', function () {
      before(function () {
        this.typeDefs = `
       type Query {
        books: [Book]
      }
      type Book {
        title: String
      }
      type Mutation {
        createBook(input: BookInput): Book
      }
      input BookInput {
        titles: [Float!]! @constraint(minListLength: 3)
      }`
        this.request = setup(this.typeDefs)
      })

      it('should pass', async function () {
        const { body, statusCode } = await this.request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({
            query, variables: { input: { titles: [1.1, 2.2, 3.3] } }
          })
        strictEqual(statusCode, 200)
        deepStrictEqual(body, { data: { createBook: null } })
      })

      it('should fail', async function () {
        const { body, statusCode } = await this.request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({
            query, variables: { input: { titles: [1.1, 2.2] } }
          })
        strictEqual(statusCode, 400)
        strictEqual(body.errors[0].message,
          'Variable "$input" got invalid value [1.1, 2.2] at "input.titles"; Expected type "titles_List_NotNull_minListLength_3". Length of list must be at least 3')
      })

      it('should throw custom error', async function () {
        const request = setup(this.typeDefs, formatError)
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query, variables: { input: { titles: [1.1] } } })

        strictEqual(statusCode, 400)
        deepStrictEqual(body.errors[0], {
          message: 'Length of list must be at least 3',
          code: 'ERR_GRAPHQL_CONSTRAINT_VALIDATION',
          fieldName: 'titles',
          context: [{ arg: 'minListLength', value: 3 }]
        })
      })
    })

    describe('object list', function () {
      before(function () {
        this.typeDefs = `
       type Query {
        books: [Book]
      }
      type Book {
        title: String
      }
      type Mutation {
        createBook(input: BookInput): Book
      }
      input Title {
        name: String!
      }
      input BookInput {
        titles: [Title!]! @constraint(minListLength: 3)
      }`
        this.request = setup(this.typeDefs)
      })

      it('should pass', async function () {
        const { body, statusCode } = await this.request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({
            query, variables: { input: { titles: [{ name: '1' }, { name: '2' }, { name: '3' }] } }
          })
        strictEqual(statusCode, 200)
        deepStrictEqual(body, { data: { createBook: null } })
      })

      it('should fail', async function () {
        const { body, statusCode } = await this.request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({
            query, variables: { input: { titles: [{ name: '1' }, { name: '2' }] } }
          })
        strictEqual(statusCode, 400)
        strictEqual(body.errors[0].message,
          'Variable "$input" got invalid value [{ name: "1" }, { name: "2" }] at "input.titles"; Expected type "titles_List_NotNull_minListLength_3". Length of list must be at least 3')
      })

      it('should throw custom error', async function () {
        const request = setup(this.typeDefs, formatError)
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query, variables: { input: { titles: [{ name: '1' }] } } })

        strictEqual(statusCode, 400)
        deepStrictEqual(body.errors[0], {
          message: 'Length of list must be at least 3',
          code: 'ERR_GRAPHQL_CONSTRAINT_VALIDATION',
          fieldName: 'titles',
          context: [{ arg: 'minListLength', value: 3 }]
        })
      })
    })
    describe('enum list', function () {
      before(function () {
        this.typeDefs = `
       type Query {
        books: [Book]
      }
      type Book {
        title: String
      }
      type Mutation {
        createBook(input: BookInput): Book
      }
      enum Rating {
        AMAZING
        BAD
      }
      input BookInput {
        titles: [Rating!]! @constraint(minListLength: 3)
      }`
        this.request = setup(this.typeDefs)
      })

      it('should pass', async function () {
        const { body, statusCode } = await this.request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({
            query, variables: { input: { titles: ['AMAZING', 'BAD', 'AMAZING'] } }
          })
        strictEqual(statusCode, 200)
        deepStrictEqual(body, { data: { createBook: null } })
      })

      it('should fail', async function () {
        const { body, statusCode } = await this.request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({
            query, variables: { input: { titles: ['AMAZING', 'BAD'] } }
          })
        strictEqual(statusCode, 400)
        strictEqual(body.errors[0].message,
          'Variable "$input" got invalid value ["AMAZING", "BAD"] at "input.titles"; Expected type "titles_List_NotNull_minListLength_3". Length of list must be at least 3')
      })

      it('should throw custom error', async function () {
        const request = setup(this.typeDefs, formatError)
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query, variables: { input: { titles: ['AMAZING'] } } })

        strictEqual(statusCode, 400)
        deepStrictEqual(body.errors[0], {
          message: 'Length of list must be at least 3',
          code: 'ERR_GRAPHQL_CONSTRAINT_VALIDATION',
          fieldName: 'titles',
          context: [{ arg: 'minListLength', value: 3 }]
        })
      })
    })

    describe('#notNull', function () {
      before(function () {
        this.typeDefs = `
      type Query {
        books: [Book]
      }
      type Book {
        title: String
      }
      type Mutation {
        createBook(input: BookInput): Book
      }
      input BookInput {
        title: [String!]! @constraint(minListLength: 3)
      }`

        this.request = setup(this.typeDefs)
      })

      it('should fail with null', async function () {
        const { body, statusCode } = await this.request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({
            query, variables: { input: { title: null } }
          })

        strictEqual(statusCode, 400)
        strictEqual(body.errors[0].message,
          'Variable "$input" got invalid value null at "input.title"; Expected non-nullable type "title_List_NotNull_minListLength_3!" not to be null.')
      })

      it('should fail with undefined', async function () {
        const { body, statusCode } = await this.request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({
            query, variables: { input: { title: undefined } }
          })

        strictEqual(statusCode, 400)
        strictEqual(body.errors[0].message,
          'Variable "$input" got invalid value {}; Field "title" of required type "title_List_NotNull_minListLength_3!" was not provided.')
      })
    })

    describe('#uniqueTypeName', function () {
      before(function () {
        this.typeDefs = `
         type Query {
        books: [Book]
      }
      type Book {
        title: String
      }
      type Mutation {
        createBook(input: BookInput): Book
      }
      input BookInput {
        titles: [String!]! @constraint(minListLength: 3, uniqueTypeName: "BookInput_Title")
      }`

        this.request = setup(this.typeDefs)
      })

      it('should pass', async function () {
        const { body, statusCode } = await this.request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({
            query, variables: { input: { titles: ['1', '2', '3'] } }
          })
        strictEqual(statusCode, 200)
        deepStrictEqual(body, { data: { createBook: null } })
      })

      it('should fail', async function () {
        const { body, statusCode } = await this.request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({
            query, variables: { input: { titles: ['1', '2'] } }
          })

        strictEqual(statusCode, 400)
        strictEqual(body.errors[0].message,
          'Variable "$input" got invalid value ["1", "2"] at "input.titles"; Expected type "BookInput_Title". Length of list must be at least 3')
      })

      it('should throw custom error', async function () {
        const request = setup(this.typeDefs, formatError)
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query, variables: { input: { titles: ['1'] } } })

        strictEqual(statusCode, 400)
        deepStrictEqual(body.errors[0], {
          message: 'Length of list must be at least 3',
          code: 'ERR_GRAPHQL_CONSTRAINT_VALIDATION',
          fieldName: 'titles',
          context: [{ arg: 'minListLength', value: 3 }]
        })
      })
    })
  })

  describe('#maxListLength', function () {
    describe('string list', function () {
      before(function () {
        this.typeDefs = `
       type Query {
        books: [Book]
      }
      type Book {
        title: String
      }
      type Mutation {
        createBook(input: BookInput): Book
      }
      input BookInput {
        titles: [String!]! @constraint(maxListLength: 2)
      }`
        this.request = setup(this.typeDefs)
      })

      it('should pass', async function () {
        const { body, statusCode } = await this.request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({
            query, variables: { input: { titles: ['1', '2'] } }
          })
        strictEqual(statusCode, 200)
        deepStrictEqual(body, { data: { createBook: null } })
      })

      it('should fail', async function () {
        const { body, statusCode } = await this.request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({
            query, variables: { input: { titles: ['1', '2', '3'] } }
          })

        strictEqual(statusCode, 400)
        strictEqual(body.errors[0].message,
          'Variable "$input" got invalid value ["1", "2", "3"] at "input.titles"; Expected type "titles_List_NotNull_maxListLength_2". Length of List must be no greater than 2')
      })

      it('should throw custom error', async function () {
        const request = setup(this.typeDefs, formatError)
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query, variables: { input: { titles: ['a💩', 'b💩', 'c💩'] } } })

        strictEqual(statusCode, 400)
        deepStrictEqual(body.errors[0], {
          message: 'Length of List must be no greater than 2',
          code: 'ERR_GRAPHQL_CONSTRAINT_VALIDATION',
          fieldName: 'titles',
          context: [{ arg: 'maxListLength', value: 2 }]
        })
      })
    })

    describe('int list', function () {
      before(function () {
        this.typeDefs = `
       type Query {
        books: [Book]
      }
      type Book {
        title: String
      }
      type Mutation {
        createBook(input: BookInput): Book
      }
      input BookInput {
        titles: [Int!]! @constraint(maxListLength: 2)
      }`
        this.request = setup(this.typeDefs)
      })

      it('should pass', async function () {
        const { body, statusCode } = await this.request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({
            query, variables: { input: { titles: [1, 2] } }
          })
        strictEqual(statusCode, 200)
        deepStrictEqual(body, { data: { createBook: null } })
      })

      it('should fail', async function () {
        const { body, statusCode } = await this.request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({
            query, variables: { input: { titles: [1, 2, 3] } }
          })
        strictEqual(statusCode, 400)
        strictEqual(body.errors[0].message,
          'Variable "$input" got invalid value [1, 2, 3] at "input.titles"; Expected type "titles_List_NotNull_maxListLength_2". Length of List must be no greater than 2')
      })

      it('should throw custom error', async function () {
        const request = setup(this.typeDefs, formatError)
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query, variables: { input: { titles: [1, 2, 3] } } })

        strictEqual(statusCode, 400)
        deepStrictEqual(body.errors[0], {
          message: 'Length of List must be no greater than 2',
          code: 'ERR_GRAPHQL_CONSTRAINT_VALIDATION',
          fieldName: 'titles',
          context: [{ arg: 'maxListLength', value: 2 }]
        })
      })
    })

    describe('boolean list', function () {
      before(function () {
        this.typeDefs = `
       type Query {
        books: [Book]
      }
      type Book {
        title: String
      }
      type Mutation {
        createBook(input: BookInput): Book
      }
      input BookInput {
        titles: [Boolean!]! @constraint(maxListLength: 2)
      }`
        this.request = setup(this.typeDefs)
      })

      it('should pass', async function () {
        const { body, statusCode } = await this.request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({
            query, variables: { input: { titles: [false, true] } }
          })
        strictEqual(statusCode, 200)
        deepStrictEqual(body, { data: { createBook: null } })
      })

      it('should fail', async function () {
        const { body, statusCode } = await this.request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({
            query, variables: { input: { titles: [false, true, false] } }
          })
        strictEqual(statusCode, 400)
        strictEqual(body.errors[0].message,
          'Variable "$input" got invalid value [false, true, false] at "input.titles"; Expected type "titles_List_NotNull_maxListLength_2". Length of List must be no greater than 2')
      })

      it('should throw custom error', async function () {
        const request = setup(this.typeDefs, formatError)
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query, variables: { input: { titles: [false, true, false] } } })

        strictEqual(statusCode, 400)
        deepStrictEqual(body.errors[0], {
          message: 'Length of List must be no greater than 2',
          code: 'ERR_GRAPHQL_CONSTRAINT_VALIDATION',
          fieldName: 'titles',
          context: [{ arg: 'maxListLength', value: 2 }]
        })
      })
    })

    describe('float list', function () {
      before(function () {
        this.typeDefs = `
       type Query {
        books: [Book]
      }
      type Book {
        title: String
      }
      type Mutation {
        createBook(input: BookInput): Book
      }
      input BookInput {
        titles: [Float!]! @constraint(maxListLength: 2)
      }`
        this.request = setup(this.typeDefs)
      })

      it('should pass', async function () {
        const { body, statusCode } = await this.request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({
            query, variables: { input: { titles: [1.1, 2.2] } }
          })
        strictEqual(statusCode, 200)
        deepStrictEqual(body, { data: { createBook: null } })
      })

      it('should fail', async function () {
        const { body, statusCode } = await this.request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({
            query, variables: { input: { titles: [1.1, 2.2, 3.3] } }
          })
        strictEqual(statusCode, 400)
        strictEqual(body.errors[0].message,
          'Variable "$input" got invalid value [1.1, 2.2, 3.3] at "input.titles"; Expected type "titles_List_NotNull_maxListLength_2". Length of List must be no greater than 2')
      })

      it('should throw custom error', async function () {
        const request = setup(this.typeDefs, formatError)
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query, variables: { input: { titles: [1.1, 2.2, 3.3] } } })

        strictEqual(statusCode, 400)
        deepStrictEqual(body.errors[0], {
          message: 'Length of List must be no greater than 2',
          code: 'ERR_GRAPHQL_CONSTRAINT_VALIDATION',
          fieldName: 'titles',
          context: [{ arg: 'maxListLength', value: 2 }]
        })
      })
    })

    describe('object list', function () {
      before(function () {
        this.typeDefs = `
       type Query {
        books: [Book]
      }
      type Book {
        title: String
      }
      type Mutation {
        createBook(input: BookInput): Book
      }
      input Title {
        name: String!
      }
      input BookInput {
        titles: [Title!]! @constraint(maxListLength: 2)
      }`
        this.request = setup(this.typeDefs)
      })

      it('should pass', async function () {
        const { body, statusCode } = await this.request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({
            query, variables: { input: { titles: [{ name: '1' }, { name: '2' }] } }
          })
        strictEqual(statusCode, 200)
        deepStrictEqual(body, { data: { createBook: null } })
      })

      it('should fail', async function () {
        const { body, statusCode } = await this.request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({
            query, variables: { input: { titles: [{ name: '1' }, { name: '2' }, { name: '3' }] } }
          })
        strictEqual(statusCode, 400)
        strictEqual(body.errors[0].message,
          'Variable "$input" got invalid value [{ name: "1" }, { name: "2" }, { name: "3" }] at "input.titles"; Expected type "titles_List_NotNull_maxListLength_2". Length of List must be no greater than 2')
      })

      it('should throw custom error', async function () {
        const request = setup(this.typeDefs, formatError)
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query, variables: { input: { titles: [{ name: '1' }, { name: '2' }, { name: '3' }] } } })

        strictEqual(statusCode, 400)
        deepStrictEqual(body.errors[0], {
          message: 'Length of List must be no greater than 2',
          code: 'ERR_GRAPHQL_CONSTRAINT_VALIDATION',
          fieldName: 'titles',
          context: [{ arg: 'maxListLength', value: 2 }]
        })
      })
    })

    describe('enum list', function () {
      before(function () {
        this.typeDefs = `
       type Query {
        books: [Book]
      }
      type Book {
        title: String
      }
      type Mutation {
        createBook(input: BookInput): Book
      }
      enum Rating {
        AMAZING
        BAD
      }
      input BookInput {
        titles: [Rating!]! @constraint(maxListLength: 2)
      }`
        this.request = setup(this.typeDefs)
      })

      it('should pass', async function () {
        const { body, statusCode } = await this.request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({
            query, variables: { input: { titles: ['AMAZING', 'BAD'] } }
          })
        strictEqual(statusCode, 200)
        deepStrictEqual(body, { data: { createBook: null } })
      })

      it('should fail', async function () {
        const { body, statusCode } = await this.request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({
            query, variables: { input: { titles: ['AMAZING', 'BAD', 'AMAZING'] } }
          })
        strictEqual(statusCode, 400)
        strictEqual(body.errors[0].message,
          'Variable "$input" got invalid value ["AMAZING", "BAD", "AMAZING"] at "input.titles"; Expected type "titles_List_NotNull_maxListLength_2". Length of List must be no greater than 2')
      })

      it('should throw custom error', async function () {
        const request = setup(this.typeDefs, formatError)
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query, variables: { input: { titles: ['AMAZING', 'BAD', 'AMAZING'] } } })

        strictEqual(statusCode, 400)
        deepStrictEqual(body.errors[0], {
          message: 'Length of List must be no greater than 2',
          code: 'ERR_GRAPHQL_CONSTRAINT_VALIDATION',
          fieldName: 'titles',
          context: [{ arg: 'maxListLength', value: 2 }]
        })
      })
    })

    describe('#notNull', function () {
      before(function () {
        this.typeDefs = `
      type Query {
        books: [Book]
      }
      type Book {
        title: String
      }
      type Mutation {
        createBook(input: BookInput): Book
      }
      input BookInput {
        title: [String!]! @constraint(maxListLength: 3)
      }`

        this.request = setup(this.typeDefs)
      })

      it('should fail with null', async function () {
        const { body, statusCode } = await this.request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({
            query, variables: { input: { title: null } }
          })

        strictEqual(statusCode, 400)
        strictEqual(body.errors[0].message,
          'Variable "$input" got invalid value null at "input.title"; Expected non-nullable type "title_List_NotNull_maxListLength_3!" not to be null.')
      })

      it('should fail with undefined', async function () {
        const { body, statusCode } = await this.request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({
            query, variables: { input: { title: undefined } }
          })

        strictEqual(statusCode, 400)
        strictEqual(body.errors[0].message,
          'Variable "$input" got invalid value {}; Field "title" of required type "title_List_NotNull_maxListLength_3!" was not provided.')
      })
    })

    describe('#uniqueTypeName', function () {
      before(function () {
        this.typeDefs = `
         type Query {
        books: [Book]
      }
      type Book {
        title: String
      }
      type Mutation {
        createBook(input: BookInput): Book
      }
      input BookInput {
        titles: [String!]! @constraint(maxListLength: 2, uniqueTypeName: "BookInput_Title")
      }`

        this.request = setup(this.typeDefs)
      })

      it('should pass', async function () {
        const { body, statusCode } = await this.request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({
            query, variables: { input: { titles: ['1', '2'] } }
          })
        strictEqual(statusCode, 200)
        deepStrictEqual(body, { data: { createBook: null } })
      })

      it('should fail', async function () {
        const { body, statusCode } = await this.request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({
            query, variables: { input: { titles: ['1', '2', '3'] } }
          })

        strictEqual(statusCode, 400)
        strictEqual(body.errors[0].message,
          'Variable "$input" got invalid value ["1", "2", "3"] at "input.titles"; Expected type "BookInput_Title". Length of List must be no greater than 2')
      })

      it('should throw custom error', async function () {
        const request = setup(this.typeDefs, formatError)
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query, variables: { input: { titles: ['1', '2', '3'] } } })

        strictEqual(statusCode, 400)
        deepStrictEqual(body.errors[0], {
          message: 'Length of List must be no greater than 2',
          code: 'ERR_GRAPHQL_CONSTRAINT_VALIDATION',
          fieldName: 'titles',
          context: [{ arg: 'maxListLength', value: 2 }]
        })
      })
    })
  })

  describe('List should still work as expected', () => {
    before(function () {
      this.typeDefs = `
       type Query {
        books: [Book]
      }
      type Book {
        title: String
      }
      type Mutation {
        createBook(input: BookInput): Book
      }
      input BookInput {
        titles: [String!]! @constraint(minListLength: 3)
      }`
      this.request = setup(this.typeDefs)
    })

    it('should fail with mixed values', async function () {
      const { body, statusCode } = await this.request
        .post('/graphql')
        .set('Accept', 'application/json')
        .send({
          query, variables: { input: { titles: [1, '2', '3'] } }
        })
      strictEqual(statusCode, 400)
      strictEqual(body.errors[0].message,
        'Variable "$input" got invalid value [1, "2", "3"] at "input.titles"; Invalid value 1 at "value[0]": String cannot represent a non string value: 1')
    })
  })
})

describe('@constraint Int in FIELD_DEFINITION', function () {
  const query = `query {
    books {
      title
    }
  }`
  const resolvers = function (data) {
    return {
      Query: {
        books () {
          return data
        }
      }
    }
  }

  describe('#minListLength', function () {
    describe('Int list', function () {
      before(function () {
        this.typeDefs = `
      type Query {
        books: Book
      }
      type Book {
        title: [Int!]! @constraint(minListLength: 2)
      }
      `
      })

      it('should pass', async function () {
        const mockData = { title: [1, 2, 3] }
        const request = setup(this.typeDefs, formatError, resolvers(mockData))
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query })

        strictEqual(statusCode, 200)
        deepStrictEqual(body, { data: { books: mockData } })
      })

      it('should fail', async function () {
        const mockData = { title: [1] }
        const request = setup(this.typeDefs, formatError, resolvers(mockData))
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query })

        strictEqual(statusCode, 200)
        strictEqual(body.errors[0].message, 'Length of list must be at least 2')
      })

      it('should throw custom error', async function () {
        const mockData = { title: [1] }
        const request = setup(this.typeDefs, formatError, resolvers(mockData))
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query })

        strictEqual(statusCode, 200)
        deepStrictEqual(body.errors[0], {
          message: 'Length of list must be at least 2',
          code: 'ERR_GRAPHQL_CONSTRAINT_VALIDATION',
          fieldName: 'title',
          context: [{ arg: 'minListLength', value: 2 }]
        })
      })
    })

    describe('String list', function () {
      before(function () {
        this.typeDefs = `
      type Query {
        books: Book
      }
      type Book {
        title: [String!]! @constraint(minListLength: 2)
      }
      `
      })

      it('should pass', async function () {
        const mockData = { title: ['1', '2', '3'] }
        const request = setup(this.typeDefs, formatError, resolvers(mockData))
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query })

        strictEqual(statusCode, 200)
        deepStrictEqual(body, { data: { books: mockData } })
      })

      it('should fail', async function () {
        const mockData = { title: ['1'] }
        const request = setup(this.typeDefs, formatError, resolvers(mockData))
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query })

        strictEqual(statusCode, 200)
        strictEqual(body.errors[0].message, 'Length of list must be at least 2')
      })

      it('should throw custom error', async function () {
        const mockData = { title: ['1'] }
        const request = setup(this.typeDefs, formatError, resolvers(mockData))
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query })

        strictEqual(statusCode, 200)
        deepStrictEqual(body.errors[0], {
          message: 'Length of list must be at least 2',
          code: 'ERR_GRAPHQL_CONSTRAINT_VALIDATION',
          fieldName: 'title',
          context: [{ arg: 'minListLength', value: 2 }]
        })
      })
    })

    describe('Float list', function () {
      before(function () {
        this.typeDefs = `
      type Query {
        books: Book
      }
      type Book {
        title: [Float!]! @constraint(minListLength: 2)
      }
      `
      })

      it('should pass', async function () {
        const mockData = { title: [1.1, 2.2, 3.3] }
        const request = setup(this.typeDefs, formatError, resolvers(mockData))
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query })

        strictEqual(statusCode, 200)
        deepStrictEqual(body, { data: { books: mockData } })
      })

      it('should fail', async function () {
        const mockData = { title: [1.1] }
        const request = setup(this.typeDefs, formatError, resolvers(mockData))
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query })

        strictEqual(statusCode, 200)
        strictEqual(body.errors[0].message, 'Length of list must be at least 2')
      })

      it('should throw custom error', async function () {
        const mockData = { title: [1.1] }
        const request = setup(this.typeDefs, formatError, resolvers(mockData))
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query })

        strictEqual(statusCode, 200)
        deepStrictEqual(body.errors[0], {
          message: 'Length of list must be at least 2',
          code: 'ERR_GRAPHQL_CONSTRAINT_VALIDATION',
          fieldName: 'title',
          context: [{ arg: 'minListLength', value: 2 }]
        })
      })
    })
    describe('Boolean list', function () {
      before(function () {
        this.typeDefs = `
      type Query {
        books: Book
      }
      type Book {
        title: [Boolean!]! @constraint(minListLength: 2)
      }
      `
      })

      it('should pass', async function () {
        const mockData = { title: [true, true, false] }
        const request = setup(this.typeDefs, formatError, resolvers(mockData))
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query })

        strictEqual(statusCode, 200)
        deepStrictEqual(body, { data: { books: mockData } })
      })

      it('should fail', async function () {
        const mockData = { title: [true] }
        const request = setup(this.typeDefs, formatError, resolvers(mockData))
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query })

        strictEqual(statusCode, 200)
        strictEqual(body.errors[0].message, 'Length of list must be at least 2')
      })

      it('should throw custom error', async function () {
        const mockData = { title: [true] }
        const request = setup(this.typeDefs, formatError, resolvers(mockData))
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query })

        strictEqual(statusCode, 200)
        deepStrictEqual(body.errors[0], {
          message: 'Length of list must be at least 2',
          code: 'ERR_GRAPHQL_CONSTRAINT_VALIDATION',
          fieldName: 'title',
          context: [{ arg: 'minListLength', value: 2 }]
        })
      })
    })
    describe('Object list', function () {
      const objectQuery = `query {
          books {
            title {
               name
            }
          }
        }`
      before(function () {
        this.typeDefs = `
      type Query {
        books: Book
      }
      type Title {
        name: String!
      }
      type Book {
        title: [Title!]! @constraint(minListLength: 2)
      }
      `
      })

      it('should pass', async function () {
        const mockData = { title: [{ name: '1' }, { name: '2' }, { name: '3' }] }
        const request = setup(this.typeDefs, formatError, resolvers(mockData))
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query: objectQuery })
        strictEqual(statusCode, 200)
        deepStrictEqual(body, { data: { books: mockData } })
      })

      it('can be queried', async function () {
        const mockData = { title: [{ name: '1' }, { name: '2' }, { name: '3' }] }
        const request = setup(this.typeDefs, formatError, resolvers(mockData))
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query: objectQuery })
        strictEqual(statusCode, 200)
        deepStrictEqual(body, { data: { books: mockData } })
      })

      it('should fail', async function () {
        const mockData = { title: [{ name: '1' }] }
        const request = setup(this.typeDefs, formatError, resolvers(mockData))
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query: objectQuery })

        strictEqual(statusCode, 200)
        strictEqual(body.errors[0].message, 'Length of list must be at least 2')
      })

      it('should throw custom error', async function () {
        const mockData = { title: [{ name: '1' }] }
        const request = setup(this.typeDefs, formatError, resolvers(mockData))
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query: objectQuery })

        strictEqual(statusCode, 200)
        deepStrictEqual(body.errors[0], {
          message: 'Length of list must be at least 2',
          code: 'ERR_GRAPHQL_CONSTRAINT_VALIDATION',
          fieldName: 'title',
          context: [{ arg: 'minListLength', value: 2 }]
        })
      })
    })
    describe('Complex Object list', function () {
      const complexObjectQuery = `query {
          books {
            title {
               name
               size
               origin {
                  country
                  code
               }
            }
          }
        }`
      before(function () {
        this.typeDefs = `
      type Query {
        books: Book
      }
      enum Codes {
        YES
        NO
      }
      type Origin {
        country: String!
        code: Codes!
      }
      type Title {
        name: String!
        size: Int
        origin: Origin!
      }
      type Book {
        title: [Title!]! @constraint(minListLength: 2)
      }
      `
      })

      it('should pass', async function () {
        const mockData = {
          title: [
            { name: '1', size: 100, origin: { country: 'a', code: 'YES' } },
            { name: '2', size: 200, origin: { country: 'b', code: 'NO' } },
            { name: '3', size: 300, origin: { country: 'c', code: 'YES' } }
          ]
        }
        const request = setup(this.typeDefs, formatError, resolvers(mockData))
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query })

        strictEqual(statusCode, 200)
        deepStrictEqual(body, { data: { books: mockData } })
      })

      it('can be queried', async function () {
        const mockData = {
          title: [
            { name: '1', size: 100, origin: { country: 'a', code: 'YES' } },
            { name: '2', size: 200, origin: { country: 'b', code: 'NO' } },
            { name: '3', size: 300, origin: { country: 'c', code: 'YES' } }
          ]
        }
        const request = setup(this.typeDefs, formatError, resolvers(mockData))
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query: complexObjectQuery })
        strictEqual(statusCode, 200)
        deepStrictEqual(body, { data: { books: mockData } })
      })

      it('should fail', async function () {
        const mockData = { title: [{ name: '1', size: 100, origin: { country: 'a', code: 'YES' } }] }
        const request = setup(this.typeDefs, formatError, resolvers(mockData))
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query })

        strictEqual(statusCode, 200)
        strictEqual(body.errors[0].message, 'Length of list must be at least 2')
      })

      it('should throw custom error', async function () {
        const mockData = { title: [{ name: '1', size: 100, origin: { country: 'a', code: 'YES' } }] }
        const request = setup(this.typeDefs, formatError, resolvers(mockData))
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query })

        strictEqual(statusCode, 200)
        deepStrictEqual(body.errors[0], {
          message: 'Length of list must be at least 2',
          code: 'ERR_GRAPHQL_CONSTRAINT_VALIDATION',
          fieldName: 'title',
          context: [{ arg: 'minListLength', value: 2 }]
        })
      })
    })
    describe('Enum list', function () {
      before(function () {
        this.typeDefs = `
      type Query {
        books: Book
      }
      enum Rating { 
        GOOD
        BAD
      }
      type Book {
        title: [Rating!]! @constraint(minListLength: 2)
      }
      `
      })

      it('should pass', async function () {
        const mockData = { title: ['GOOD', 'BAD', 'GOOD'] }
        const request = setup(this.typeDefs, formatError, resolvers(mockData))
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query })

        strictEqual(statusCode, 200)
        deepStrictEqual(body, { data: { books: mockData } })
      })

      it('should fail', async function () {
        const mockData = { title: ['GOOD'] }
        const request = setup(this.typeDefs, formatError, resolvers(mockData))
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query })

        strictEqual(statusCode, 200)
        strictEqual(body.errors[0].message, 'Length of list must be at least 2')
      })

      it('should throw custom error', async function () {
        const mockData = { title: ['GOOD'] }
        const request = setup(this.typeDefs, formatError, resolvers(mockData))
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query })

        strictEqual(statusCode, 200)
        deepStrictEqual(body.errors[0], {
          message: 'Length of list must be at least 2',
          code: 'ERR_GRAPHQL_CONSTRAINT_VALIDATION',
          fieldName: 'title',
          context: [{ arg: 'minListLength', value: 2 }]
        })
      })
    })
    describe('#uniqueTypeName', function () {
      before(function () {
        this.typeDefs = `
         type Query {
        books: Book
      }
      type Book {
        title: [Int!]! @constraint(minListLength: 2, uniqueTypeName: "BookInput_Title")
      }`

        this.request = setup(this.typeDefs)
      })

      it('should pass', async function () {
        const mockData = { title: [1, 2, 3] }
        const request = setup(this.typeDefs, formatError, resolvers(mockData))
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query })

        strictEqual(statusCode, 200)
        deepStrictEqual(body, { data: { books: mockData } })
      })

      it('should fail', async function () {
        const mockData = { title: [1] }
        const request = setup(this.typeDefs, formatError, resolvers(mockData))
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query })

        strictEqual(statusCode, 200)
        strictEqual(body.errors[0].message, 'Length of list must be at least 2')
      })

      it('should throw custom error', async function () {
        const mockData = { title: [1] }
        const request = setup(this.typeDefs, formatError, resolvers(mockData))
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query })

        strictEqual(statusCode, 200)
        deepStrictEqual(body.errors[0], {
          message: 'Length of list must be at least 2',
          code: 'ERR_GRAPHQL_CONSTRAINT_VALIDATION',
          fieldName: 'title',
          context: [{ arg: 'minListLength', value: 2 }]
        })
      })
    })
  })

  describe('#maxListLength', function () {
    describe('Int list', function () {
      before(function () {
        this.typeDefs = `
      type Query {
        books: Book
      }
      type Book {
        title: [Int!]! @constraint(maxListLength: 2)
      }
      `
      })

      it('should pass', async function () {
        const mockData = { title: [1, 2] }
        const request = setup(this.typeDefs, formatError, resolvers(mockData))
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query })

        strictEqual(statusCode, 200)
        deepStrictEqual(body, { data: { books: mockData } })
      })

      it('should fail', async function () {
        const mockData = { title: [1, 2, 3] }
        const request = setup(this.typeDefs, formatError, resolvers(mockData))
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query })

        strictEqual(statusCode, 200)
        strictEqual(body.errors[0].message, 'Length of List must be no greater than 2')
      })

      it('should throw custom error', async function () {
        const mockData = { title: [1, 2, 3] }
        const request = setup(this.typeDefs, formatError, resolvers(mockData))
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query })

        strictEqual(statusCode, 200)
        deepStrictEqual(body.errors[0], {
          message: 'Length of List must be no greater than 2',
          code: 'ERR_GRAPHQL_CONSTRAINT_VALIDATION',
          fieldName: 'title',
          context: [{ arg: 'maxListLength', value: 2 }]
        })
      })
    })

    describe('String list', function () {
      before(function () {
        this.typeDefs = `
      type Query {
        books: Book
      }
      type Book {
        title: [String!]! @constraint(maxListLength: 2)
      }
      `
      })

      it('should pass', async function () {
        const mockData = { title: ['1', '2'] }
        const request = setup(this.typeDefs, formatError, resolvers(mockData))
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query })

        strictEqual(statusCode, 200)
        deepStrictEqual(body, { data: { books: mockData } })
      })

      it('should fail', async function () {
        const mockData = { title: ['1', '2', '3'] }
        const request = setup(this.typeDefs, formatError, resolvers(mockData))
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query })

        strictEqual(statusCode, 200)
        strictEqual(body.errors[0].message, 'Length of List must be no greater than 2')
      })

      it('should throw custom error', async function () {
        const mockData = { title: ['1', '2', '3'] }
        const request = setup(this.typeDefs, formatError, resolvers(mockData))
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query })

        strictEqual(statusCode, 200)
        deepStrictEqual(body.errors[0], {
          message: 'Length of List must be no greater than 2',
          code: 'ERR_GRAPHQL_CONSTRAINT_VALIDATION',
          fieldName: 'title',
          context: [{ arg: 'maxListLength', value: 2 }]
        })
      })
    })

    describe('Float list', function () {
      before(function () {
        this.typeDefs = `
      type Query {
        books: Book
      }
      type Book {
        title: [Float!]! @constraint(maxListLength: 2)
      }
      `
      })

      it('should pass', async function () {
        const mockData = { title: [1.1, 2.2] }
        const request = setup(this.typeDefs, formatError, resolvers(mockData))
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query })

        strictEqual(statusCode, 200)
        deepStrictEqual(body, { data: { books: mockData } })
      })

      it('should fail', async function () {
        const mockData = { title: [1.1, 2.2, 3.3] }
        const request = setup(this.typeDefs, formatError, resolvers(mockData))
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query })
        strictEqual(statusCode, 200)
        strictEqual(body.errors[0].message, 'Length of List must be no greater than 2')
      })

      it('should throw custom error', async function () {
        const mockData = { title: [1.1, 2.2, 3.3] }
        const request = setup(this.typeDefs, formatError, resolvers(mockData))
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query })

        strictEqual(statusCode, 200)
        deepStrictEqual(body.errors[0], {
          message: 'Length of List must be no greater than 2',
          code: 'ERR_GRAPHQL_CONSTRAINT_VALIDATION',
          fieldName: 'title',
          context: [{ arg: 'maxListLength', value: 2 }]
        })
      })
    })
    describe('Boolean list', function () {
      before(function () {
        this.typeDefs = `
      type Query {
        books: Book
      }
      type Book {
        title: [Boolean!]! @constraint(maxListLength: 2)
      }
      `
      })

      it('should pass', async function () {
        const mockData = { title: [true, false] }
        const request = setup(this.typeDefs, formatError, resolvers(mockData))
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query })

        strictEqual(statusCode, 200)
        deepStrictEqual(body, { data: { books: mockData } })
      })

      it('should fail', async function () {
        const mockData = { title: [true, true, false] }
        const request = setup(this.typeDefs, formatError, resolvers(mockData))
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query })

        strictEqual(statusCode, 200)
        strictEqual(body.errors[0].message, 'Length of List must be no greater than 2')
      })

      it('should throw custom error', async function () {
        const mockData = { title: [true, true, false] }
        const request = setup(this.typeDefs, formatError, resolvers(mockData))
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query })

        strictEqual(statusCode, 200)
        deepStrictEqual(body.errors[0], {
          message: 'Length of List must be no greater than 2',
          code: 'ERR_GRAPHQL_CONSTRAINT_VALIDATION',
          fieldName: 'title',
          context: [{ arg: 'maxListLength', value: 2 }]
        })
      })
    })
    describe('Object list', function () {
      const objectQuery = `query {
          books {
            title {
               name
            }
          }
        }`
      before(function () {
        this.typeDefs = `
      type Query {
        books: Book
      }
      type Title {
        name: String!
      }
      type Book {
        title: [Title!]! @constraint(maxListLength: 2)
      }
      `
      })

      it('should pass', async function () {
        const mockData = { title: [{ name: '1' }, { name: '2' }] }
        const request = setup(this.typeDefs, formatError, resolvers(mockData))
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query: objectQuery })

        strictEqual(statusCode, 200)
        deepStrictEqual(body, { data: { books: mockData } })
      })

      it('should fail', async function () {
        const mockData = { title: [{ name: '1' }, { name: '2' }, { name: '3' }] }
        const request = setup(this.typeDefs, formatError, resolvers(mockData))
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query: objectQuery })

        strictEqual(statusCode, 200)
        strictEqual(body.errors[0].message, 'Length of List must be no greater than 2')
      })

      it('should throw custom error', async function () {
        const mockData = { title: [{ name: '1' }, { name: '2' }, { name: '3' }] }
        const request = setup(this.typeDefs, formatError, resolvers(mockData))
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query: objectQuery })

        strictEqual(statusCode, 200)
        deepStrictEqual(body.errors[0], {
          message: 'Length of List must be no greater than 2',
          code: 'ERR_GRAPHQL_CONSTRAINT_VALIDATION',
          fieldName: 'title',
          context: [{ arg: 'maxListLength', value: 2 }]
        })
      })
    })
    describe('Complex Object list', function () {
      const complexObjectQuery = `query {
          books {
            title {
               name
               size
               origin {
                  country
                  code
               }
            }
          }
        }`
      before(function () {
        this.typeDefs = `
      type Query {
        books: Book
      }
      enum Codes {
        YES
        NO
      }
      type Origin {
        country: String!
        code: Codes!
      }
      type Title {
        name: String!
        size: Int
        origin: Origin!
      }
      type Book {
        title: [Title!]! @constraint(maxListLength: 2)
      }
      `
      })

      it('should pass', async function () {
        const mockData = {
          title: [
            { name: '1', size: 100, origin: { country: 'a', code: 'YES' } },
            { name: '2', size: 200, origin: { country: 'b', code: 'NO' } }
          ]
        }
        const request = setup(this.typeDefs, formatError, resolvers(mockData))
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query: complexObjectQuery })

        strictEqual(statusCode, 200)
        deepStrictEqual(body, { data: { books: mockData } })
      })

      it('should fail', async function () {
        const mockData = {
          title: [
            { name: '1', size: 100, origin: { country: 'a', code: 'YES' } },
            { name: '2', size: 200, origin: { country: 'b', code: 'NO' } },
            { name: '3', size: 300, origin: { country: 'c', code: 'YES' } }
          ]
        }
        const request = setup(this.typeDefs, formatError, resolvers(mockData))
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query: complexObjectQuery })

        strictEqual(statusCode, 200)
        strictEqual(body.errors[0].message, 'Length of List must be no greater than 2')
      })

      it('should throw custom error', async function () {
        const mockData = {
          title: [
            { name: '1', size: 100, origin: { country: 'a', code: 'YES' } },
            { name: '2', size: 200, origin: { country: 'b', code: 'NO' } },
            { name: '3', size: 300, origin: { country: 'c', code: 'YES' } }
          ]
        }
        const request = setup(this.typeDefs, formatError, resolvers(mockData))
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query: complexObjectQuery })

        strictEqual(statusCode, 200)
        deepStrictEqual(body.errors[0], {
          message: 'Length of List must be no greater than 2',
          code: 'ERR_GRAPHQL_CONSTRAINT_VALIDATION',
          fieldName: 'title',
          context: [{ arg: 'maxListLength', value: 2 }]
        })
      })
    })
    describe('Enum list', function () {
      before(function () {
        this.typeDefs = `
      type Query {
        books: Book
      }
      enum Rating { 
        GOOD
        BAD
      }
      type Book {
        title: [Rating!]! @constraint(maxListLength: 2)
      }
      `
      })

      it('should pass', async function () {
        const mockData = { title: ['GOOD', 'BAD'] }
        const request = setup(this.typeDefs, formatError, resolvers(mockData))
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query })

        strictEqual(statusCode, 200)
        deepStrictEqual(body, { data: { books: mockData } })
      })

      it('should fail', async function () {
        const mockData = { title: ['GOOD', 'BAD', 'GOOD'] }
        const request = setup(this.typeDefs, formatError, resolvers(mockData))
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query })

        strictEqual(statusCode, 200)
        strictEqual(body.errors[0].message, 'Length of List must be no greater than 2')
      })

      it('should throw custom error', async function () {
        const mockData = { title: ['GOOD', 'BAD', 'GOOD'] }
        const request = setup(this.typeDefs, formatError, resolvers(mockData))
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query })

        strictEqual(statusCode, 200)
        deepStrictEqual(body.errors[0], {
          message: 'Length of List must be no greater than 2',
          code: 'ERR_GRAPHQL_CONSTRAINT_VALIDATION',
          fieldName: 'title',
          context: [{ arg: 'maxListLength', value: 2 }]
        })
      })
    })
    describe('#uniqueTypeName', function () {
      before(function () {
        this.typeDefs = `
         type Query {
        books: Book
      }
      type Book {
        title: [Int!]! @constraint(maxListLength: 2, uniqueTypeName: "BookInput_Title")
      }`

        this.request = setup(this.typeDefs)
      })

      it('should pass', async function () {
        const mockData = { title: [1, 2] }
        const request = setup(this.typeDefs, formatError, resolvers(mockData))
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query })

        strictEqual(statusCode, 200)
        deepStrictEqual(body, { data: { books: mockData } })
      })

      it('should fail', async function () {
        const mockData = { title: [1, 2, 3] }
        const request = setup(this.typeDefs, formatError, resolvers(mockData))
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query })

        strictEqual(statusCode, 200)
        strictEqual(body.errors[0].message, 'Length of List must be no greater than 2')
      })

      it('should throw custom error', async function () {
        const mockData = { title: [1, 2, 3] }
        const request = setup(this.typeDefs, formatError, resolvers(mockData))
        const { body, statusCode } = await request
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query })

        strictEqual(statusCode, 200)
        deepStrictEqual(body.errors[0], {
          message: 'Length of List must be no greater than 2',
          code: 'ERR_GRAPHQL_CONSTRAINT_VALIDATION',
          fieldName: 'title',
          context: [{ arg: 'maxListLength', value: 2 }]
        })
      })
    })
  })
})
