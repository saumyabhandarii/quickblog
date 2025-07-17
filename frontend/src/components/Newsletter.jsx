import React from 'react';

const Newsletter = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-4 my-32 px-4">
      <h1 className="text-3xl md:text-4xl font-bold">Never Miss a Blog!</h1>
      <p className="text-gray-500 text-base md:text-lg">
        Subscribe to get the latest blog, new tech, and exclusive news.
      </p>

      <form className="flex w-full max-w-xl">
        <input
          type="email"
          placeholder="Enter your email id"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-l-md outline-none text-gray-600"
        />
        <button
          type="submit"
          className="px-6 md:px-10 bg-purple-600 text-white rounded-r-md hover:bg-purple-700 transition-all"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default Newsletter;
