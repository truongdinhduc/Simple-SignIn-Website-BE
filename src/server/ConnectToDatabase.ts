import mongoose from "mongoose";

const connectToMongoDB = (url: string, onDone: () => void) => {
  mongoose.connect(
    url,
    {},
    function (err) {
        if (err) throw err;
        console.log("Successfully connected to database");
        onDone && onDone();
    }
  );
};

export { connectToMongoDB };
