'use client';

import React, { createContext, useContext, useState } from 'react';
import BookingDrawer from './BookingDrawer';

interface BookingContextType {
  isOpen: boolean;
  selectedService: string;
  openBooking: (serviceName?: string) => void;
  closeBooking: () => void;
}

const BookingContext = createContext<BookingContextType>({
  isOpen: false,
  selectedService: 'Hydrafacial',
  openBooking: () => {},
  closeBooking: () => {},
});

export const useBooking = () => useContext(BookingContext);

export default function BookingProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('Hydrafacial');

  const openBooking = (serviceName?: string) => {
    if (serviceName) {
      setSelectedService(serviceName);
    }
    setIsOpen(true);
  };

  const closeBooking = () => {
    setIsOpen(false);
  };

  return (
    <BookingContext.Provider value={{ isOpen, selectedService, openBooking, closeBooking }}>
      {children}
      <BookingDrawer isOpen={isOpen} onClose={closeBooking} initialService={selectedService} />
    </BookingContext.Provider>
  );
}
