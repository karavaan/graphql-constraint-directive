const { GraphQLScalarType, Kind, coerceInputValue } = require('graphql')
const { parseInputValueLiteral } = require('@graphql-tools/utils')
const ValidationError = require('../lib/error')

module.exports = class ConstraintListType extends GraphQLScalarType {
  constructor (fieldName, uniqueTypeName, type, args) {
    super({
      name: uniqueTypeName,
      serialize (outputValue) {
        validate(fieldName, args, outputValue)
        return outputValue
      },
      parseValue (inputValue) {
        coerceInputValue(inputValue, type)
        validate(fieldName, args, inputValue)
        return inputValue
      },
      parseLiteral (valueNode) {
        switch (valueNode.kind) {
          case Kind.BOOLEAN:
          case Kind.STRING:
            return valueNode.value
          case Kind.INT:
          case Kind.FLOAT:
            return Number(valueNode.value)
          case Kind.LIST: {
            const values = parseInputValueLiteral(type, valueNode.values)
            validate(fieldName, args, values)
            return values
          }
          case Kind.OBJECT:
            return valueNode.fields.reduce((object, field) => {
              object[field.name.value] = this.parseLiteral(field.value)
              return object
            }, {})
          case Kind.NULL:
            return null
          case Kind.VARIABLE:
            return { kind: 'Variable', variableName: valueNode.name.value }
          default:
            return valueNode.value
        }
      }
    })
  }
}

function validate (fieldName, args, list) {
  if (args.minListLength !== undefined && list.length < args.minListLength) {
    throw new ValidationError(fieldName,
      `Length of list must be at least ${args.minListLength}`,
      [{ arg: 'minListLength', value: args.minListLength }])
  }

  if (args.maxListLength !== undefined && list.length > args.maxListLength) {
    throw new ValidationError(fieldName,
      `Length of List must be no greater than ${args.maxListLength}`,
      [{ arg: 'maxListLength', value: args.maxListLength }])
  }
}
