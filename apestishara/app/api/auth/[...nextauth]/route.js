import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/utils/dbconnect";
import mongoose from "mongoose";

const authOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(credentials) {
        console.log("Authorize function triggered");
        const { email, password } = credentials;


        if (!email || !password) {
          console.error("Email or password missing");
          throw new Error("Please provide both email and password");
        }

        console.log("Credentials received:", { email, password });

        console.log("Attempting to connect to MongoDB...");
        await connectDB();

        const adminCollection = mongoose.connection.db.collection("Admin");

       
        const admin = await adminCollection.findOne({ email });

        if (!admin || admin.password !== password) {
          throw new Error("Incorrect email or password");
        }

        return {
          id: admin._id.toString(),
          username: admin.username,
          email: admin.email,
        };
      },
    }),
  ],
  pages: {
    signIn: "/",
    error: "/auth/error",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
