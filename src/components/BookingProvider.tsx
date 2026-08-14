'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import BookingDrawer from './BookingDrawer';
import { fetchActiveServices, type PublicService } from '@/lib/services';

interface BookingContextType {
  isOpen: boolean;
  selectedService: PublicService | null;
  services: PublicService[];
  servicesLoading: boolean;
  servicesError: string | null;
  refreshServices: () => Promise<void>;
  openBooking: (service?: PublicService) => void;
  closeBooking: () => void;
}

const BookingContext = createContext<BookingContextType>({
  isOpen: false,
  selectedService: null,
  services: [],
  servicesLoading: false,
  servicesError: null,
  refreshServices: async () => {},
  openBooking: () => {},
  closeBooking: () => {},
});

export const useBooking = () => useContext(BookingContext);

export default function BookingProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<PublicService | null>(null);
  const [services, setServices] = useState<PublicService[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState<string | null>(null);

  const refreshServices = useCallback(async () => {
    setServicesLoading(true);
    setServicesError(null);

    try {
      setServices(await fetchActiveServices());
    } catch {
      setServicesError('Services are temporarily unavailable. Please try again.');
    } finally {
      setServicesLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshServices();
  }, [refreshServices]);

  const openBooking = (service?: PublicService) => {
    if (service) setSelectedService(service);
    setIsOpen(true);
  };

  const closeBooking = () => {
    setIsOpen(false);
  };

  return (
    <BookingContext.Provider value={{ isOpen, selectedService, services, servicesLoading, servicesError, refreshServices, openBooking, closeBooking }}>
      {children}
      <BookingDrawer
        isOpen={isOpen}
        onClose={closeBooking}
        initialService={selectedService}
        services={services}
        servicesLoading={servicesLoading}
        servicesError={servicesError}
        refreshServices={refreshServices}
      />
    </BookingContext.Provider>
  );
}
