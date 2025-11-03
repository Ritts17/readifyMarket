// __mocks__/axios.js

const mockAxios = {
  request: jest.fn(() => Promise.resolve({ data: {} })),
};

export default mockAxios;
