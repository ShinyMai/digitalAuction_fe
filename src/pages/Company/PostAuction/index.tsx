import AuctionCreateForm from "./components/AuctionCreateForm";

const PostAuction = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
      <div className="w-full max-w-7xl p-4 sm:p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
          Tạo Đấu Giá Mới
        </h1>
        <div className="w-full bg-white rounded-xl p-6 hover:shadow-xl transition-shadow duration-300">
          <AuctionCreateForm />
        </div>
      </div>
    </div>
  );
};

export default PostAuction;
