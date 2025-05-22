export default () => ({
  google: {
    apiKey: process.env.GOOGLE_API_KEY,
  },
  data: {
    path: process.env.DATA_PATH || 'data',
  },
}); 