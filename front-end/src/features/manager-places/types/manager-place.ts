export interface PlaceMedia {
  id: string;
  src: string;
  alt: string;
  primary?: boolean;
}

export interface OperatingHour {
  id: string;
  day: string;
  open: string;
  close: string;
}

export interface ManagedPlaceForm {
  name: string;
  category: string;
  capacity: number;
  description: string;
  address: string;
  sessionPrice: string;
  additionalHourlyPrice: string;
  securityDeposit: string;
  facilities: string[];
  operatingHours: OperatingHour[];
}
