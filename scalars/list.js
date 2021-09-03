const { GraphQLScalarType, Kind } = require('graphql')
const ValidationError = require('../lib/error')

module.exports = class ConstraintListType extends GraphQLScalarType {
  constructor (fieldName, uniqueTypeName, type, args) {
    super({
      name: uniqueTypeName,
      serialize (value) {
        value = type.serialize(value)

        validate(fieldName, args, value)

        return value
      },
      parseValue (value) {
        value = type.serialize(value)

        validate(fieldName, args, value)

        return type.parseValue(value)
      },
      parseLiteral (ast) {
        switch (ast.kind) {
          case Kind.BOOLEAN:
          case Kind.STRING:
            return ast.value
          case Kind.INT:
          case Kind.FLOAT:
            return Number(ast.value)
          case Kind.LIST: {
            const values = ast.values.map(this.parseLiteral)
            validate(fieldName, args, values)
            return values
          }
          case Kind.OBJECT:
            return ast.fields.reduce((accumulator, field) => {
              accumulator[field.name.value] = this.parseLiteral(field.value)
              return accumulator
            }, {})
          case Kind.NULL:
            return null
          default:
            throw new Error(`Unexpected kind in parseLiteral: ${ast.kind}`)
        }
      }
    })
  }
}

function validate (fieldName, args, list) {
  if (args.minListLength !== undefined && list.length < args.minListLength) {
    throw new ValidationError(fieldName,
      `Must be at least ${args.minListLength}`,
      [{ arg: 'minListLength', value: args.minListLength }])
  }

  if (args.maxListLength !== undefined && list.length > args.maxListLength) {
    throw new ValidationError(fieldName,
      `Must be no greater than ${args.maxListLength}`,
      [{ arg: 'maxListLength', value: args.maxListLength }])
  }
}
