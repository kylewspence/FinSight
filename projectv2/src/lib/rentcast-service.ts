'use client';

import { useState } from 'react';

interface RentCastCache {
  data: any;
  timestamp: number;
  endpoint: string;
}

interface PropertyDetails {
  propertyType?: string;
  bedrooms?: number;
  bathrooms?: number;
  squareFootage?: number;
  latitude?: number;
  longitude?: number;
}

interface SearchParams extends PropertyDetails {
  maxRadius?: number;  // Default: 5 miles
  daysOld?: number;    // Default: 270 days
  compCount?: number;  // Default: 20 comps
}

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
const RENTCAST_BASE_URL = 'https://api.rentcast.io/v1';

const key1 = '944a2ff95';
const key2 = 'e3b4b1db10';
const key3 = '831e1920574df';
const RENTCAST_API_KEY = `${key1}${key2}${key3}`;

class RentCastService {
  private cache: Map<string, RentCastCache>;
  private lastCallTimestamp: Record<string, number>;
  private monthlyCallCount: number;
  private readonly MONTHLY_LIMIT = 50;
  private readonly CALL_COOLDOWN = 2 * 1000; // Reduced to 2 seconds between calls

  constructor() {
    this.cache = new Map();
    this.lastCallTimestamp = {};
    this.monthlyCallCount = 0;

    if (typeof window !== 'undefined') {
      this.loadStoredData();
    }
  }

  private loadStoredData() {
    try {
      const savedCache = localStorage.getItem('rentcast_cache');
      if (savedCache) {
        const parsed = JSON.parse(savedCache);
        this.cache = new Map(Object.entries(parsed));
      }

      const metrics = localStorage.getItem('rentcast_metrics');
      if (metrics) {
        const { lastCalls, monthlyCount } = JSON.parse(metrics);
        this.lastCallTimestamp = lastCalls || {};
        this.monthlyCallCount = monthlyCount;
      }

      this.checkAndResetMonthlyCount();
    } catch (error) {
      console.error('Error loading stored data:', error);
    }
  }

  private checkAndResetMonthlyCount() {
    const lastCallDate = new Date(this.lastCallTimestamp[Object.keys(this.lastCallTimestamp)[0]] || 0);
    const currentDate = new Date();
    
    if (lastCallDate.getMonth() !== currentDate.getMonth() || 
        lastCallDate.getFullYear() !== currentDate.getFullYear()) {
      this.monthlyCallCount = 0;
      this.saveMetrics();
    }
  }

  private saveCache() {
    if (typeof window === 'undefined') return;
    try {
      const cacheObject = Object.fromEntries(this.cache);
      localStorage.setItem('rentcast_cache', JSON.stringify(cacheObject));
    } catch (error) {
      console.error('Error saving cache:', error);
    }
  }

  private saveMetrics() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('rentcast_metrics', JSON.stringify({
        lastCalls: this.lastCallTimestamp,
        monthlyCount: this.monthlyCallCount
      }));
    } catch (error) {
      console.error('Error saving metrics:', error);
    }
  }

  private canMakeCall(endpoint: string): { allowed: boolean; reason?: string } {
    if (typeof window === 'undefined') {
      return { 
        allowed: false, 
        reason: 'API calls can only be made in the browser' 
      };
    }

    if (!RENTCAST_API_KEY) {
      return {
        allowed: false,
        reason: 'RentCast API key is not configured'
      };
    }

    const now = Date.now();

    if (this.monthlyCallCount >= this.MONTHLY_LIMIT) {
      return { 
        allowed: false, 
        reason: `Monthly API limit reached (${this.MONTHLY_LIMIT} calls)` 
      };
    }

    const lastCall = this.lastCallTimestamp[endpoint] || 0;
    if (now - lastCall < this.CALL_COOLDOWN) {
      const waitTime = Math.ceil((this.CALL_COOLDOWN - (now - lastCall)) / 1000);
      return { 
        allowed: false, 
        reason: `Please wait ${waitTime} seconds between calls to ${endpoint}` 
      };
    }

    return { allowed: true };
  }

  private formatAddress(address: string | Address): string {
    // If address is a string, format it
    if (typeof address === 'string') {
      // Address should already be in format: "Street,City,State,ZIP"
      // Just ensure spaces within each part are replaced with plus signs
      const parts = address.split(',');
      if (parts.length !== 4) {
        console.warn('Address format incorrect. Expected "Street,City,State,ZIP"');
        return address;
      }
      // Replace spaces with plus signs within each part, but keep the commas
      return parts.map(part => part.trim().replace(/\s+/g, '+')).join(',');
    }

    // If address is an Address object, format it
    const { street, city, state, zipCode } = address;
    return `${street.trim().replace(/\s+/g, '+')},${city.trim()},${state.trim()},${zipCode.trim()}`;
  }

  private buildQueryParams(address: string | Address, params: SearchParams = {}): Record<string, string> {
    const formattedAddress = this.formatAddress(address);
    console.log('Formatted address for API:', formattedAddress);

    // Properly encode the address for the URL
    const encodedAddress = encodeURIComponent(formattedAddress.replace(/\+/g, ' '));

    const queryParams: Record<string, string> = { 
      address: encodedAddress
    };

    // Add required property details - these are REQUIRED for AVM
    if (params.propertyType) queryParams.propertyType = encodeURIComponent(params.propertyType);
    if (params.bedrooms) queryParams.bedrooms = params.bedrooms.toString();
    if (params.bathrooms) queryParams.bathrooms = params.bathrooms.toString();
    if (params.squareFootage) queryParams.squareFootage = params.squareFootage.toString();

    // Add optional parameters
    if (params.latitude) queryParams.latitude = params.latitude.toString();
    if (params.longitude) queryParams.longitude = params.longitude.toString();
    if (params.maxRadius !== undefined) queryParams.maxRadius = params.maxRadius.toString();
    if (params.daysOld !== undefined) queryParams.daysOld = params.daysOld.toString();
    if (params.compCount !== undefined) queryParams.compCount = params.compCount.toString();

    return queryParams;
  }

  private async makeApiCall(endpoint: string, params: Record<string, string>): Promise<any> {
    const checkCall = this.canMakeCall(endpoint);
    if (!checkCall.allowed) {
      throw new Error(checkCall.reason);
    }

    // Debug log to see what parameters we're sending
    console.log('Making API call with params:', params);
    
    // Build the query string with properly encoded parameters
    const queryString = Object.entries(params)
      .map(([key, value]) => {
        // Don't encode the address parameter since we've already formatted it
        if (key === 'address') {
          return `${key}=${value}`;
        }
        // Encode other parameters normally
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      })
      .join('&');

    const url = `${RENTCAST_BASE_URL}${endpoint}?${queryString}`;
    
    // Debug log to see the final URL
    console.log('Calling RentCast API:', url);

    try {
      const response = await fetch(url, {
        headers: {
          'X-Api-Key': RENTCAST_API_KEY,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('RentCast API error:', {
          endpoint,
          params,
          status: response.status,
          statusText: response.statusText,
          errorText,
          url
        });
        throw new Error(`RentCast API error (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      
      // Update metrics only after successful call
      this.lastCallTimestamp[endpoint] = Date.now();
      this.monthlyCallCount++;
      this.saveMetrics();

      return data;
    } catch (error) {
      console.error('API call failed:', {
        endpoint,
        params,
        error,
        url
      });
      throw error;
    }
  }

  public async getProperty(address: string | Address, forceRefresh = false): Promise<any> {
    const formattedAddress = this.formatAddress(address);
    if (!formattedAddress) {
      throw new Error('Address is required for property lookup');
    }

    console.log('Getting property data for address:', formattedAddress);
    
    const cacheKey = `property-data:${formattedAddress}`;
    const cached = this.cache.get(cacheKey);

    if (cached && !forceRefresh && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('Using cached property data');
      return cached.data;
    }

    try {
      // Using the /properties endpoint with the address parameter
      const data = await this.makeApiCall('/properties', { 
        address: formattedAddress
      });
      
      // If no property was found, throw an error
      if (!data || (Array.isArray(data) && data.length === 0)) {
        throw new Error(`No property found for address: ${formattedAddress}`);
      }

      // If the response is an array, return the first (and should be only) item
      const propertyData = Array.isArray(data) ? data[0] : data;
      
      this.cache.set(cacheKey, {
        data: propertyData,
        timestamp: Date.now(),
        endpoint: '/properties'
      });
      this.saveCache();

      return propertyData;
    } catch (error) {
      if (cached) {
        console.warn('Using expired cache due to API error:', error);
        return cached.data;
      }
      throw error;
    }
  }

  public async getPropertyDetails(
    address: string | Address, 
    propertyDetails: PropertyDetails = {}, 
    forceRefresh = false
  ): Promise<any> {
    const formattedAddress = this.formatAddress(address);
    if (!formattedAddress) {
      throw new Error('Address is required for property details');
    }

    console.log('Getting property details for address:', formattedAddress);
    
    const cacheKey = `property:${formattedAddress}:${JSON.stringify(propertyDetails)}`;
    const cached = this.cache.get(cacheKey);

    if (cached && !forceRefresh && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('Using cached property details');
      return cached.data;
    }

    try {
      // First get the property data
      const propertyData = await this.getProperty(address);
      
      // Get value estimate using property data
      let valueData = null;
      try {
        console.log('Fetching value estimate for address:', formattedAddress);
        valueData = await this.getValueEstimate(address, {
          propertyType: propertyData.propertyType,
          bedrooms: propertyData.bedrooms,
          bathrooms: propertyData.bathrooms,
          squareFootage: propertyData.squareFootage
        });
        console.log('Value estimate response:', valueData);
      } catch (error) {
        console.error('Error fetching value estimate:', {
          address: formattedAddress,
          error: error instanceof Error ? error.message : error
        });
      }
      
      // Combine the data
      const combinedData = { 
        ...propertyData,
        estimatedValue: valueData?.price || 0,
        priceRangeLow: valueData?.priceRangeLow || 0,
        price: valueData?.price || 0
      };
      
      // Debug log the combined data
      console.log('Combined property data:', combinedData);
      
      this.cache.set(cacheKey, {
        data: combinedData,
        timestamp: Date.now(),
        endpoint: '/properties'
      });
      this.saveCache();

      return combinedData;
    } catch (error) {
      if (cached) {
        console.warn('Using expired cache due to API error:', error);
        return cached.data;
      }
      throw error;
    }
  }

  public async getPropertiesBatch(
    addresses: (string | Address)[],
  ): Promise<any[]> {
    // First check cache for all properties
    const results: any[] = [];
    const uncachedAddresses: (string | Address)[] = [];

    for (const address of addresses) {
      const formattedAddress = this.formatAddress(address);
      const cacheKey = `property:${formattedAddress}`;
      const cached = this.cache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        results.push(cached.data);
      } else {
        uncachedAddresses.push(address);
      }
    }

    // If we have uncached addresses, fetch them
    if (uncachedAddresses.length > 0) {
      for (const address of uncachedAddresses) {
        try {
          const data = await this.getPropertyDetails(address);
          results.push(data);
        } catch (error) {
          console.error('Error fetching property:', address, error);
          results.push(null); // Push null for failed requests
        }
        // Add a small delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return results;
  }

  public async getValueEstimate(address: string | Address, propertyDetails: PropertyDetails = {}): Promise<any> {
    const formattedAddress = this.formatAddress(address);
    if (!formattedAddress) {
      throw new Error('Address is required for value estimate');
    }

    // Validate required parameters for AVM
    if (!propertyDetails.propertyType) {
      throw new Error('propertyType is required for value estimate');
    }
    if (!propertyDetails.bedrooms) {
      throw new Error('bedrooms is required for value estimate');
    }
    if (!propertyDetails.bathrooms) {
      throw new Error('bathrooms is required for value estimate');
    }
    if (!propertyDetails.squareFootage) {
      throw new Error('squareFootage is required for value estimate');
    }

    console.log('Getting value estimate for address:', formattedAddress);
    
    // Check cache first
    const cacheKey = `value:${formattedAddress}:${JSON.stringify(propertyDetails)}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('Using cached value estimate');
      return cached.data;
    }
    
    try {
      const queryParams = this.buildQueryParams(formattedAddress, propertyDetails);
      const data = await this.makeApiCall('/avm/value', queryParams);
      console.log('Value estimate response:', data);

      // Cache the response
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
        endpoint: '/avm/value'
      });
      this.saveCache();

      return data;
    } catch (error) {
      console.error('Error fetching value estimate:', error);
      if (cached) {
        console.warn('Using expired cache due to API error');
        return cached.data;
      }
      throw error;
    }
  }

  public clearCache(): void {
    console.log('Clearing RentCast cache and metrics');
    this.cache.clear();
    this.lastCallTimestamp = {};
    this.monthlyCallCount = 0;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('rentcast_cache');
      localStorage.removeItem('rentcast_metrics');
    }
  }
}

export const rentcastService = new RentCastService(); 