import { User } from '@/components/UserContext';
import { PropertyType } from '@/types/PropertyTypes';
import { getStreetViewImage } from './utils';

const authKey = 'um.auth';

export type Auth = {
  user: User;
  token: string;
};

export function saveAuth(user: User, token: string): void {
  const auth: Auth = { user, token };
  localStorage.setItem(authKey, JSON.stringify(auth));
}

export function removeAuth(): void {
  localStorage.removeItem(authKey);
}

export function readUser(): User | undefined {
  const auth = localStorage.getItem(authKey);
  if (!auth) return undefined;
  return (JSON.parse(auth) as Auth).user;
}

export function readToken(): string | undefined {
  const auth = localStorage.getItem(authKey);
  if (!auth) return undefined;
  return (JSON.parse(auth) as Auth).token;
}

export async function fetchProperties(): Promise<PropertyType[]> {
  const token = readToken();
  if (!token) throw new Error('No token found');

  const response = await fetch('/api/properties', {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error('Failed to load properties');

  const dbProperties = await response.json();
  return dbProperties.map((prop: PropertyType) => ({
    ...prop,
    monthlyRent: prop.monthlyRent || 0,
    image: prop.image || getStreetViewImage(prop.formattedAddress),
    notes: prop.notes || '',
    mortgagePayment: prop.mortgagePayment || 0,
    mortgageBalance: prop.mortgageBalance || 0,
    hoaPayment: prop.hoaPayment || 0,
    interestRate: prop.interestRate || 0,
  }));
}

export async function updateProperty(
  updatedProperty: PropertyType
): Promise<void> {
  const token = readToken();
  if (!token) throw new Error('No token found');

  const response = await fetch(`/api/properties/${updatedProperty.id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      monthlyRent: updatedProperty.monthlyRent || 0,
      notes: updatedProperty.notes || '',
      mortgageBalance: updatedProperty.mortgageBalance || 0,
      mortgagePayment: updatedProperty.mortgagePayment || 0,
      interestRate: updatedProperty.interestRate || 0,
      hoaPayment: updatedProperty.hoaPayment || 0,
    }),
  });

  if (!response.ok) throw new Error('Failed to update property');
}

export async function deleteProperty(propertyId: number): Promise<void> {
  const token = readToken();
  if (!token) throw new Error('No token found');

  const response = await fetch(`/api/properties/${propertyId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error('Failed to delete property');
}
