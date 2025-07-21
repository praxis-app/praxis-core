export const getHealth = () => {
  return {
    status: 'healthy',
    timestamp: new Date().toLocaleString(),
  };
};
