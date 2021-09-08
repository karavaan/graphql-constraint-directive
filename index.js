const { GraphQLFloat, GraphQLInt, GraphQLString, GraphQLNonNull, isNonNullType, isScalarType } = require('graphql')
const { getDirectives, mapSchema, MapperKind } = require('@graphql-tools/utils')
const ConstraintStringType = require('./scalars/string')
const ConstraintNumberType = require('./scalars/number')
const { isListType } = require('graphql/type/definition')
const ConstraintListType = require('./scalars/list')

function constraintDirective () {
  const constraintTypes = {}

  function getConstraintType (fieldName, type, notNull, directiveArgumentMap) {
    // Names must match /^[_a-zA-Z][_a-zA-Z0-9]*$/ as p er graphql-js
    let uniqueTypeName
    if (directiveArgumentMap.uniqueTypeName) {
      uniqueTypeName = directiveArgumentMap.uniqueTypeName.replace(/\W/g, '')
    } else {
      uniqueTypeName = `${fieldName}_${isListType(type) ? 'List' : type.name}_${notNull ? 'NotNull_' : ''}` + Object.entries(directiveArgumentMap)
        .map(([key, value]) => `${key}_${value.toString().replace(/\W/g, '')}`)
        .join('_')
    }
    const key = Symbol.for(uniqueTypeName)
    let constraintType = constraintTypes[key]

    if (constraintType) return constraintType

    if (type === GraphQLString) {
      if (notNull) {
        constraintType = new GraphQLNonNull(new ConstraintStringType(fieldName, uniqueTypeName, type, directiveArgumentMap))
      } else {
        constraintType = new ConstraintStringType(fieldName, uniqueTypeName, type, directiveArgumentMap)
      }
    } else if (type === GraphQLFloat || type === GraphQLInt) {
      if (notNull) {
        constraintType = new GraphQLNonNull(new ConstraintNumberType(fieldName, uniqueTypeName, type, directiveArgumentMap))
      } else {
        constraintType = new ConstraintNumberType(fieldName, uniqueTypeName, type, directiveArgumentMap)
      }
    } else if (isListType(type)) {
      if (notNull) {
        constraintType = new GraphQLNonNull(new ConstraintListType(fieldName, uniqueTypeName, type, directiveArgumentMap))
      } else {
        constraintType = new ConstraintListType(fieldName, uniqueTypeName, type, directiveArgumentMap)
      }
    } else {
      throw new Error(`Not a valid scalar type: ${type.toString()}`)
    }

    constraintTypes[key] = constraintType

    return constraintType
  }

  function wrapType (fieldConfig, directiveArgumentMap) {
    let originalType, notNull

    if (isNonNullType(fieldConfig.type)) {
      originalType = fieldConfig.type.ofType
      notNull = true
    } else if (isScalarType(fieldConfig.type)) {
      originalType = fieldConfig.type
    } else {
      throw new Error(`Not a scalar type: ${fieldConfig.type.toString()}`)
    }

    const fieldName = fieldConfig.astNode.name.value

    fieldConfig.type = getConstraintType(fieldName, originalType, notNull, directiveArgumentMap)
  }

  return schema => mapSchema(schema, {
    [MapperKind.FIELD]: (fieldConfig) => {
      const directives = getDirectives(schema, fieldConfig)
      const directiveArgumentMap = directives.constraint

      if (directiveArgumentMap) {
        wrapType(fieldConfig, directiveArgumentMap)

        return fieldConfig
      }
    }
  })
}

const constraintDirectiveTypeDefs = `
  directive @constraint(
    # String constraints
    """
    Restrict to a minimum length
    """
    minLength: Int
     """
    Restrict to a maximum length
    """
    maxLength: Int
    """
    Ensure value starts with foo
    """
    startsWith: String
    """
    Ensure value ends with foo
    """
    endsWith: String
    """
    Ensure value contains foo
    """
    contains: String
    """
    Ensure value does not contain foo
    """
    notContains: String
    """
    Ensure value matches regex, e.g. alphanumeric
    """
    pattern: String
    """
    Ensure value is in a particular format

    Supported formats:
      byte: Base64
      date-time: RFC 3339
      date: ISO 8601
      email
      ipv4
      ipv6
      uri
      uuid
    """
    format: String
    """
    Value should be equal to one of the strings supplied
    """
    oneOf: [String]
    
    # Number constraints
    """
    Ensure value is greater than or equal to
    """
    min: Int
    """
    Ensure value is less than or equal to
    """
    max: Int
    """
    Ensure value is greater than
    """
    exclusiveMin: Int
    """
    Ensure value is less than
    """
    exclusiveMax: Int
    """
    Ensure value is a multiple
    """
    multipleOf: Int
    """
    Override the unique type name generate by the library to the one passed as an argument
    """
    uniqueTypeName: String
    
    # List constraints
    """
    Ensure list length is greater than
    """
    minListLength: Int
    """
    Ensure list length is less than
    """
    maxListLength: Int
  ) on INPUT_FIELD_DEFINITION | FIELD_DEFINITION`

module.exports = { constraintDirective, constraintDirectiveTypeDefs }
