import { Edit, Home, Plus, Trash } from 'lucide-react';
import { ButtonWithIcon } from './ui/buttonwithicon';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

// Sample property data - structure aligned with the API response format
const properties = [
  {
    id: 'prop1',
    address: '123 Main Street',
    formattedAddress: '123 Main Street, San Francisco, CA 94107',
    propertyType: 'Single Family Home',
    bedrooms: 3,
    bathrooms: 2,
    squareFootage: 1800,
    yearBuilt: 2005,
    lastSaleDate: '2018-05-12',
    lastSalePrice: 350000,
    estimatedValue: 425000,
    estimatedRangeLow: 405000,
    estimatedRangeHigh: 445000,
    monthlyRent: 2200,
  },
  {
    id: 'prop2',
    address: '456 Maple Avenue',
    formattedAddress: '456 Maple Avenue, Oakland, CA 94611',
    propertyType: 'Rental Property',
    bedrooms: 2,
    bathrooms: 1,
    squareFootage: 1200,
    yearBuilt: 1998,
    lastSaleDate: '2019-08-23',
    lastSalePrice: 280000,
    estimatedValue: 320000,
    estimatedRangeLow: 310000,
    estimatedRangeHigh: 330000,
    monthlyRent: 1800,
  },
];

export default function PropertiesTab() {
  // For future API Integration
  // const [properties, setProperties] = useState([]);
  // useEffect(() => {
  //   async function fetchProperties() {
  //     const response = await fetch('/api/properties');
  //     const data = await response.json();
  //     setProperties(data);
  //   }
  //   fetchProperties();
  // }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">My Properties</h2>
        <ButtonWithIcon icon={Plus} children="Add Property" />
      </div>

      <Accordion type="single" collapsible className="w-full">
        {properties.map((property) => (
          <AccordionItem value={property.id} key={property.id}>
            <AccordionTrigger>
              <div className="flex items-center">
                <Home className="mr-2 h-5 w-5 text-muted-foreground" />
                <span>{property.address}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Card className="p-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-xl font-semibold">
                    {property.formattedAddress}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0 grid gap-4">
                  <div className="grid gap-2">
                    <div className="text-sm font-medium">Estimated Value</div>
                    <div className="text-2xl font-bold">
                      {formatCurrency(property.estimatedValue)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Range: {formatCurrency(property.estimatedRangeLow)} -{' '}
                      {formatCurrency(property.estimatedRangeHigh)}
                    </div>
                  </div>

                  <div className="grid gap-1">
                    <div className="text-sm font-medium">Property Details</div>
                    <div className="text-sm">
                      {property.propertyType} • {property.bedrooms} bed •{' '}
                      {property.bathrooms} bath •{' '}
                      {property.squareFootage.toLocaleString()} sqft
                    </div>
                    <div className="text-sm">Built in {property.yearBuilt}</div>
                  </div>

                  <div className="grid gap-1">
                    <div className="text-sm font-medium">Last Sale</div>
                    <div className="text-sm">
                      {new Date(property.lastSaleDate).toLocaleDateString()} •{' '}
                      {formatCurrency(property.lastSalePrice)}
                    </div>
                  </div>

                  <div className="grid gap-1">
                    <div className="text-sm font-medium">Monthly Rent</div>
                    <div className="text-sm">
                      {formatCurrency(property.monthlyRent)}
                    </div>
                  </div>

                  <div className="flex justify-end mt-4 pt-2 border-t">
                    <div className="flex space-x-2">
                      <ButtonWithIcon icon={Edit} variant="outline">
                        Edit
                      </ButtonWithIcon>
                      <ButtonWithIcon icon={Trash} variant="destructive">
                        Delete
                      </ButtonWithIcon>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
