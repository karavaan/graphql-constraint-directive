const { GraphQLScalarType, Kind, coerceInputValue, valueFromASTUntyped } = require('graphql')
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
        if (valueNode.kind === Kind.LIST) {
          const values = parseInputValueLiteral(type, valueNode.values)
          validate(fieldName, args, values)
          return values
        }
        return valueFromASTUntyped(valueNode)
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
