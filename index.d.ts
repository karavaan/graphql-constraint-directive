import { GraphQLSchema } from 'graphql';

export const constraintDirective: () => (
    schema: GraphQLSchema,
) => GraphQLSchema;

export const constraintDirectiveTypeDefs: string;
