import { buildVehicleQuery, buildVehicleSort } from '../../src/utils/queryBuilder.js';

describe('Search Query Builder Unit Tests', () => {
  it('should build default query hiding out-of-stock items when no filters passed', () => {
    const query = buildVehicleQuery({});
    expect(query).toEqual({ quantity: { $gt: 0 } });
  });

  it('should allow including out-of-stock items when includeOutOfStock is true', () => {
    const query = buildVehicleQuery({ includeOutOfStock: 'true' });
    expect(query.quantity).toBeUndefined();
  });

  it('should build case-insensitive regex for make and model with regex characters escaped', () => {
    const query = buildVehicleQuery({
      make: 'BMW (Special)',
      model: 'M3+',
    });

    expect(query.make).toBeInstanceOf(RegExp);
    expect(query.make.source).toBe('BMW \\(Special\\)');
    expect(query.make.flags).toBe('i');

    expect(query.model).toBeInstanceOf(RegExp);
    expect(query.model.source).toBe('M3\\+');
    expect(query.model.flags).toBe('i');
  });

  it('should filter by exact category', () => {
    const query = buildVehicleQuery({ category: 'SUV' });
    expect(query.category).toBe('SUV');
  });

  it('should filter by price range', () => {
    const query = buildVehicleQuery({ minPrice: '10000', maxPrice: '50000' });
    expect(query.price).toEqual({ $gte: 10000, $lte: 50000 });
  });

  it('should filter with only minPrice or only maxPrice', () => {
    const minQuery = buildVehicleQuery({ minPrice: '20000' });
    expect(minQuery.price).toEqual({ $gte: 20000 });

    const maxQuery = buildVehicleQuery({ maxPrice: '45000' });
    expect(maxQuery.price).toEqual({ $lte: 45000 });
  });

  it('should throw an ApiError if minPrice > maxPrice', () => {
    expect(() => {
      buildVehicleQuery({ minPrice: '50000', maxPrice: '10000' });
    }).toThrow(/minPrice cannot be greater than maxPrice/i);
  });

  it('should correctly build sort object for price_asc, price_desc, and newest', () => {
    expect(buildVehicleSort('price_asc')).toEqual({ price: 1 });
    expect(buildVehicleSort('price_desc')).toEqual({ price: -1 });
    expect(buildVehicleSort('newest')).toEqual({ createdAt: -1 });
    expect(buildVehicleSort(undefined)).toEqual({ createdAt: -1 });
  });
});
