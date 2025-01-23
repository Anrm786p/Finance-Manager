// utils/quarterUtils.js
const getQuarters = () => {
    const currentDate = new Date();
    
    // Get the current quarter start and end
    const currentQuarterStart = new Date(currentDate.getFullYear(), Math.floor((currentDate.getMonth()) / 3) * 3, 1);
    const currentQuarterEnd = new Date(currentQuarterStart.getFullYear(), currentQuarterStart.getMonth() + 3, 0);
  
    // Get the last quarter start and end
    const lastQuarterStart = new Date(currentQuarterStart.getFullYear(), currentQuarterStart.getMonth() - 3, 1);
    const lastQuarterEnd = new Date(currentQuarterStart.getFullYear(), currentQuarterStart.getMonth(), 0);
  
    return {
      currentQuarterStart,
      currentQuarterEnd,
      lastQuarterStart,
      lastQuarterEnd,
    };
  };
  
  module.exports = { getQuarters };
  