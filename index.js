import { ApolloServer, gql } from "apollo-server";
import { v1 as uuidv1 } from "uuid";

const persons = [
	{
		id: 1,
		name: "victor",
		surname: "alonso",
		nickname: "victoraagg",
		city: "toledo",
		country: "spain",
		phone: "600000000",
	},
	{
		id: 2,
		name: "maria",
		surname: "perez",
		nickname: "mperez",
		city: "madrid",
		country: "spain",
		phone: "600600600",
	},
	{
		id: 3,
		name: "rally",
		nickname: "rally",
		city: "madrid",
	},
];

const typeDef = gql`
	type Address {
		city: String!
		country: String
	}

	type Person {
		id: ID!
		name: String!
		surname: String
		nickname: String!
		city: String
		phone: String
		nameComplete: String
		address: Address
	}

	type Query {
		personCount: Int!
		allPersons: [Person]!
		findPerson(name: String!): Person
	}

	type Mutation {
		addPerson(name: String!, phone: String, nickname: String!): Person
	}
`;

const resolvers = {
	Query: {
		personCount: () => persons.length,
		allPersons: () => persons,
		findPerson: (root, args) => {
			const { name } = args;
			return persons.find((person) => person.name === name);
		},
	},
	Mutation: {
		addPerson: (root, args) => {
			if (persons.find((p) => p.nickname === args.nickname)) {
				throw new Error("nickname must be unique");
			}
			const person = { ...args, id: uuidv1() };
			persons.push(person);
			return person;
		},
	},
	Person: {
		nameComplete: (root) => `${root.name} ${root.surname}`,
		address: (root) => {
			return {
				city: root.city,
				country: root.country,
			};
		},
	},
};

const server = new ApolloServer({
	typeDefs: typeDef,
	resolvers,
});

server.listen().then(({ url }) => {
	console.log(`server ready at ${url}`);
});
