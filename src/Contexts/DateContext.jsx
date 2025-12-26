import React, { createContext, useContext } from 'react';

const DateContext = createContext();

export const DateProvider = ({ children }) => {
  const currentDate = new Date();
  
  // تاريخ اليوم
  const today = currentDate.toISOString().split("T")[0];
  
  // تاريخ الأسبوع الماضي
  const lastWeekDate = new Date(currentDate);
  lastWeekDate.setDate(currentDate.getDate() - 7);
  const lastWeek = lastWeekDate.toISOString().split("T")[0];
  
  // رقم الشهر الحالي
  const currentMonth = currentDate.getMonth() + 1;

  const getLastWeekDate = () => {
    const lastWeek = new Date(currentDate);
    lastWeek.setDate(currentDate.getDate() - 7);
    return lastWeek.toISOString().split("T")[0];
  };

  const getMonthNumber = (dateObj) => {
    return dateObj.getMonth() + 1;
  };

  const value = {
    date: currentDate,
    today,
    lastWeek,
    currentMonth,
    getLastWeekDate,
    getMonthNumber
  };

  return (
    <DateContext.Provider value={value}>
      {children}
    </DateContext.Provider>
  );
};

export const useDate = () => {
  const context = useContext(DateContext);
  if (!context) {
    throw new Error('useDate must be used within a DateProvider');
  }
  return context;
};