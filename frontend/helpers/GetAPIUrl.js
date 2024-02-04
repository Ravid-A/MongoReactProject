import "dotenv/config";

const GetAPIUrl = () => {
  return `http://${process.env.NEXT_PUBLIC_API_SERVER_HOST}:${process.env.NEXT_PUBLIC_API_SERVER_PORT}/api`;
};

export default GetAPIUrl;
