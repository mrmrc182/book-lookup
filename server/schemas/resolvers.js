const {User} = require("../models");
const {signToken} = require("../utils/auth");
const {AuthenticationError} = require("apollo-server-express");

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({_id: context.user._id})
                    .populate("books");
                return userData;
            }
            throw new AuthenticationError("Not logged in");
        }
    },
    Mutation: {
        addUser: async (parent, args) => {
            try{
                const user = await User.create(args);
                const token = signToken(user);
                return {token, user};
            }
            catch (error) {
                console.log(error);
            }
        },
        loginUser: async (parent, {email, password}) => {
            const user = await User.findOne({email})
            const correctPassword = await user.isCorrectPassword({password})
            if (!user || !correctPassword) {
                throw new AuthenticationError("Incorrect credentials");
            }
            const token = signToken(user);
            return {token, user};
        },
        saveBook: async (parents, args, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    {_id: context.user._id},
                    {$addToSet: {savedBooks: args.input}},
                    {new: true, runValidators: true}
                );
                return updatedUser;
            }
            throw new AuthenticationError("You need to log in");
        },
        removeBook: async (parent, args, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    {_id: context.user._id},
                    {$pull: {savedBooks: {bookId: args.bookId}}},
                    {new: true}
                );
                return updatedUser;
            }
            throw new AuthenticationError("You need to log in");
        }
    }
}

module.exports= resolvers;