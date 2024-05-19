const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (_, __, context) => {
            if (!context.user) {
                throw AuthenticationError;
            }
            const foundUser = await User.findById(context.user._id).populate('savedBooks');
            if (!foundUser) {
                throw new Error('No user found with that ID');
            }
            return foundUser;
        },
    },
    Mutation: {
        login: async (_, { email, password }) => {
            const user = await User.findOne({ $or: [{ username: email }, { email }] });
            if (!user) {
                throw new Error('No user found with that ID');
            }

            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw AuthenticationError;
            }

            const token = signToken(user);
            return { token, user };
        },
        addUser: async (_, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            if (!user) {
                throw new Error('Unable to add new user');
            }

            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (_, { book }, context) => {
            if (!context.user) {
                throw AuthenticationError;
            }

            try {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: book } },
                    { new: true, runValidators: true }
                ).populate('savedBooks');
                return updatedUser;
            } catch (err) {
                console.log('error: ', err);
                throw new Error('Unable to save book');
            }
        },
        removeBook: async (_, { bookId }, context) => {
            if (!context.user) {
                throw AuthenticationError;
            }

            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId } } },
                { new: true }
            ).populate('savedBooks');
            if (!updatedUser) {
                throw new Error('Could not find a user with that ID');
            }
            return updatedUser;
        },
    },
};

module.exports = resolvers;