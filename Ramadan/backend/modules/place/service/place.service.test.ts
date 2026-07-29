import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockPlaceRepo = {
  findOneDocument: vi.fn(),
  findDocumentById: vi.fn(),
  findDocuments: vi.fn(),
  createNewDocument: vi.fn(),
  findDocumentByIdAndUpdate: vi.fn(),
  deleteById: vi.fn(),
  paginateModel: vi.fn(),
};

const mockUserRepo = {
  findDocumentById: vi.fn(),
  findDocumentByIdAndUpdate: vi.fn(),
};

vi.mock('../../../db/index.js', () => ({
  placeModel: {},
  userModel: {},
  placeRepository: vi.fn(() => mockPlaceRepo),
  userRepository: vi.fn(() => mockUserRepo),
}));

vi.mock('../../../utils/index.js', () => ({
  successResponse: vi.fn((message, statusCode, data?) => ({ message, statusCode, data })),
  badRequestException: class BadRequest extends Error {
    constructor(msg: string) { super(msg); this.name = 'BadRequestException'; }
  },
  conflictException: class Conflict extends Error {
    constructor(msg: string) { super(msg); this.name = 'ConflictException'; }
  },
  pagination: vi.fn(({ page, limit }) => ({ page, limit })),
}));

import placeService from './place.service';

describe('PlaceService', () => {
  let mockReq: any;
  let mockRes: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRes = {
      json: vi.fn().mockReturnThis(),
      status: vi.fn().mockReturnThis(),
    };
    mockReq = {
      body: {},
      params: {},
      query: {},
      loggedInUser: { user: { _id: 'user1' } },
    };
  });

  describe('createPlace', () => {
    it('should create a place successfully', async () => {
      mockReq.body = {
        osmId: '123',
        name: 'Pyramids',
        city: 'Giza',
        category: 'historic',
        description: 'Great pyramids',
        coordinates: { type: 'Point', coordinates: [31.1342, 29.9792] },
        price: 200,
      };
      mockPlaceRepo.findOneDocument.mockResolvedValue(null);
      mockPlaceRepo.createNewDocument.mockResolvedValue({ _id: 'place1', ...mockReq.body });

      await placeService.createPlace(mockReq, mockRes);

      expect(mockPlaceRepo.findOneDocument).toHaveBeenCalledWith({ osmId: '123' });
      expect(mockPlaceRepo.createNewDocument).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Place created successfully', statusCode: 201 })
      );
    });

    it('should throw conflict if place already exists', async () => {
      mockReq.body = { osmId: '123', name: 'Dupe', coordinates: { type: 'Point', coordinates: [0, 0] } };
      mockPlaceRepo.findOneDocument.mockResolvedValue({ _id: 'existing' });

      await expect(placeService.createPlace(mockReq, mockRes)).rejects.toThrow('Place already exists');
    });

    it('should throw bad request for invalid price', async () => {
      mockReq.body = { osmId: '123', price: -5 };

      await expect(placeService.createPlace(mockReq, mockRes)).rejects.toThrow('Invalid price');
    });

    it('should throw bad request for invalid coordinates', async () => {
      mockReq.body = { osmId: '123', price: 10, coordinates: { type: 'Point', coordinates: [0] } };

      await expect(placeService.createPlace(mockReq, mockRes)).rejects.toThrow('Invalid coordinates');
    });
  });

  describe('getPlaceById', () => {
    it('should return a place by id', async () => {
      mockReq.params = { id: 'place1' };
      mockPlaceRepo.findDocumentById.mockResolvedValue({ _id: 'place1', name: 'Pyramids' });

      await placeService.getPlaceById(mockReq, mockRes);

      expect(mockPlaceRepo.findDocumentById).toHaveBeenCalledWith('place1');
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Place fetched successfully' })
      );
    });

    it('should throw if place not found', async () => {
      mockReq.params = { id: 'nonexistent' };
      mockPlaceRepo.findDocumentById.mockResolvedValue(null);

      await expect(placeService.getPlaceById(mockReq, mockRes)).rejects.toThrow('Place not found');
    });
  });

  describe('getPlaces', () => {
    it('should return paginated places', async () => {
      mockReq.query = { page: '1', limit: '10' };
      mockPlaceRepo.paginateModel.mockResolvedValue({ docs: [], totalDocs: 0, page: 1, limit: 10 });

      await placeService.getPlaces(mockReq, mockRes);

      expect(mockPlaceRepo.paginateModel).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Places fetched successfully' })
      );
    });
  });

  describe('updatePlace', () => {
    it('should update a place', async () => {
      mockReq.params = { id: 'place1' };
      mockReq.body = { name: 'Updated Pyramids', price: 250 };
      mockPlaceRepo.findDocumentById.mockResolvedValue({ _id: 'place1', name: 'Pyramids' });
      mockPlaceRepo.findDocumentByIdAndUpdate.mockResolvedValue({ _id: 'place1', name: 'Updated Pyramids', price: 250 });

      await placeService.updatePlace(mockReq, mockRes);

      expect(mockPlaceRepo.findDocumentByIdAndUpdate).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Place updated successfully' })
      );
    });

    it('should throw if place not found', async () => {
      mockReq.params = { id: 'nonexistent' };
      mockPlaceRepo.findDocumentById.mockResolvedValue(null);

      await expect(placeService.updatePlace(mockReq, mockRes)).rejects.toThrow('Place not found');
    });
  });

  describe('deletePlace', () => {
    it('should delete a place', async () => {
      mockReq.params = { id: 'place1' };
      mockPlaceRepo.findDocumentById.mockResolvedValue({ _id: 'place1' });
      mockPlaceRepo.deleteById.mockResolvedValue(true);

      await placeService.deletePlace(mockReq, mockRes);

      expect(mockPlaceRepo.deleteById).toHaveBeenCalledWith('place1');
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Place deleted successfully' })
      );
    });
  });

  describe('searchPlaces', () => {
    it('should search by name and city', async () => {
      mockReq.query = { name: 'pyr', city: 'giza', page: '1', limit: '10' };
      mockPlaceRepo.paginateModel.mockResolvedValue({ docs: [{ name: 'Pyramids' }] });

      await placeService.searchPlaces(mockReq, mockRes);

      expect(mockPlaceRepo.paginateModel).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Places fetched successfully' })
      );
    });
  });

  describe('getNearbyPlaces', () => {
    it('should get places within radius', async () => {
      mockReq.query = { lng: '31.1342', lat: '29.9792', radius: '5000' };
      mockPlaceRepo.findDocuments.mockResolvedValue([{ name: 'Pyramids' }]);

      await placeService.getNearbyPlaces(mockReq, mockRes);

      expect(mockPlaceRepo.findDocuments).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Nearby places fetched successfully' })
      );
    });

    it('should throw if lng or lat missing', async () => {
      mockReq.query = {};

      await expect(placeService.getNearbyPlaces(mockReq, mockRes)).rejects.toThrow('Latitude and longitude are required');
    });
  });

  describe('getPopularPlaces', () => {
    it('should return top 10 by rating', async () => {
      mockPlaceRepo.findDocuments.mockResolvedValue([{ name: 'Popular Place', averageRating: 4.9 }]);

      await placeService.getPopularPlaces(mockReq, mockRes);

      expect(mockPlaceRepo.findDocuments).toHaveBeenCalledWith({}, {}, { sort: { averageRating: -1 }, limit: 10 });
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Popular places fetched successfully' })
      );
    });
  });

  describe('filterPlaces', () => {
    it('should filter with price range', async () => {
      mockReq.query = { minPrice: '50', maxPrice: '500' };
      mockPlaceRepo.paginateModel.mockResolvedValue({ docs: [] });

      await placeService.filterPlaces(mockReq, mockRes);

      expect(mockPlaceRepo.paginateModel).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Places filtered successfully' })
      );
    });
  });

  describe('savePlace / unsavePlace', () => {
    it('should save a place for the user', async () => {
      mockReq.params = { id: 'place1' };
      mockPlaceRepo.findDocumentById.mockResolvedValue({ _id: 'place1' });
      mockUserRepo.findDocumentById.mockResolvedValue({ _id: 'user1', savedPlaces: [] });
      mockUserRepo.findDocumentByIdAndUpdate.mockResolvedValue(true);

      await placeService.savePlace(mockReq, mockRes);

      expect(mockUserRepo.findDocumentByIdAndUpdate).toHaveBeenCalledWith(
        'user1',
        { $push: { savedPlaces: 'place1' } }
      );
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Place saved successfully' })
      );
    });

    it('should unsave a place', async () => {
      mockReq.params = { id: 'place1' };
      mockUserRepo.findDocumentByIdAndUpdate.mockResolvedValue(true);

      await placeService.unsavePlace(mockReq, mockRes);

      expect(mockUserRepo.findDocumentByIdAndUpdate).toHaveBeenCalledWith(
        'user1',
        { $pull: { savedPlaces: 'place1' } }
      );
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Place unsaved successfully' })
      );
    });
  });
});
