/**
 * TourMate API — OpenAPI 3 specification.
 *
 * Documents the REST surface of the MEAN-stack backend. Grouped by tag:
 * auth, users, admin, guides, drivers, vehicles, trips, votes,
 * notifications, lost-items, places, reviews, external, tracking.
 *
 * Mounted via swagger-ui-express at /api-docs (see src/index.js).
 */

const securityScheme = {
  bearerAuth: {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  },
};

const errorResponses = {
  400: { description: 'Bad Request' },
  401: { description: 'Unauthorized' },
  403: { description: 'Forbidden' },
  404: { description: 'Not Found' },
  500: { description: 'Internal Server Error' },
};

const spec = {
  openapi: '3.0.3',
  info: {
    title: 'TourMate API',
    version: '1.0.0',
    description:
      'REST API for the TourMate tourism platform (Tourist, Driver, Guide, Admin). ' +
      'JWT-authenticated, RBAC-protected, with polling-based location tracking and ' +
      'server-side POI/routing proxies.',
    contact: { name: 'TourMate Team' },
    license: { name: 'MIT' },
  },
  servers: [
    { url: 'http://localhost:4000/api', description: 'Local development' },
    { url: 'https://api.tourmate.example/api', description: 'Production' },
  ],
  components: {
    securitySchemes: securityScheme,
    schemas: {
      Error: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string' },
        },
      },
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string' },
          role: { type: 'string', enum: ['tourist', 'driver', 'guide', 'admin'] },
          isVerified: { type: 'boolean' },
          blocked: { type: 'boolean' },
        },
      },
      Guide: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          user: { type: 'string' },
          bio: { type: 'string' },
          languages: { type: 'array', items: { type: 'string' } },
          specialties: { type: 'array', items: { type: 'string' } },
          location: {
            type: 'object',
            properties: { type: { type: 'string', example: 'Point' }, coordinates: { type: 'array', items: { type: 'number' } } },
          },
          available: { type: 'boolean' },
          approved: { type: 'boolean' },
        },
      },
      Driver: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          user: { type: 'string' },
          licenseNumber: { type: 'string' },
          experienceYears: { type: 'number' },
          available: { type: 'boolean' },
          approved: { type: 'boolean' },
        },
      },
      Vehicle: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          driver: { type: 'string' },
          type: { type: 'string' },
          model: { type: 'string' },
          plateNumber: { type: 'string' },
          capacity: { type: 'number' },
          imageUrl: { type: 'string' },
        },
      },
      Trip: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          tourist: { type: 'string' },
          guide: { type: 'string' },
          driver: { type: 'string' },
          vehicle: { type: 'string' },
          status: { type: 'string', enum: ['draft', 'pending', 'confirmed', 'ongoing', 'completed', 'cancelled'] },
          startDate: { type: 'string', format: 'date-time' },
          endDate: { type: 'string', format: 'date-time' },
          price: { type: 'number' },
          shared: { type: 'boolean' },
        },
      },
      Place: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          category: { type: 'string' },
          description: { type: 'string' },
          location: {
            type: 'object',
            properties: { type: { type: 'string', example: 'Point' }, coordinates: { type: 'array', items: { type: 'number' } } },
          },
          savedBy: { type: 'array', items: { type: 'string' } },
        },
      },
      Review: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          author: { type: 'string' },
          targetType: { type: 'string', enum: ['trip', 'guide', 'driver', 'place'] },
          targetId: { type: 'string' },
          rating: { type: 'number', minimum: 1, maximum: 5 },
          comment: { type: 'string' },
        },
      },
      Vote: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          user: { type: 'string' },
          place: { type: 'string' },
          value: { type: 'number', enum: [-1, 1] },
        },
      },
      Notification: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          recipient: { type: 'string' },
          title: { type: 'string' },
          message: { type: 'string' },
          read: { type: 'boolean' },
        },
      },
      LostItem: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          reporter: { type: 'string' },
          trip: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          status: { type: 'string', enum: ['open', 'found', 'closed'] },
        },
      },
      Location: {
        type: 'object',
        properties: {
          driver: { type: 'string' },
          coordinates: { type: 'array', items: { type: 'number' }, example: [31.2, 30.0] },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  tags: [
    { name: 'auth', description: 'Authentication & account' },
    { name: 'users', description: 'User profile & account management' },
    { name: 'admin', description: 'Administrative oversight' },
    { name: 'guides', description: 'Guide profiles' },
    { name: 'drivers', description: 'Driver profiles' },
    { name: 'vehicles', description: 'Vehicle fleet' },
    { name: 'trips', description: 'Trip lifecycle' },
    { name: 'votes', description: 'Place votes' },
    { name: 'notifications', description: 'Notifications' },
    { name: 'lost-items', description: 'Lost & found' },
    { name: 'places', description: 'Points of interest' },
    { name: 'reviews', description: 'Ratings & reviews' },
    { name: 'external', description: 'POI & routing proxies' },
    { name: 'tracking', description: 'Polling-based location tracking' },
  ],
  paths: {
    '/auth/register': {
      post: {
        tags: ['auth'], summary: 'Register a new user', security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password', 'role'],
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string' },
                  password: { type: 'string' },
                  role: { type: 'string', enum: ['tourist', 'driver', 'guide'] },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Created' }, ...errorResponses },
      },
    },
    '/auth/login': {
      post: {
        tags: ['auth'], summary: 'Login', security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { type: 'object', required: ['email', 'password'], properties: { email: { type: 'string' }, password: { type: 'string' } } },
            },
          },
        },
        responses: { 200: { description: 'Token pair' }, ...errorResponses },
      },
    },
    '/auth/logout': { post: { tags: ['auth'], summary: 'Logout', responses: { 200: { description: 'OK' }, ...errorResponses } } },
    '/auth/refresh-token': { post: { tags: ['auth'], summary: 'Refresh access token', security: [], responses: { 200: { description: 'New token' }, ...errorResponses } } },
    '/auth/profile': {
      get: { tags: ['auth'], summary: 'Get own profile', responses: { 200: { description: 'Profile' }, ...errorResponses } },
      patch: { tags: ['auth'], summary: 'Update own profile', responses: { 200: { description: 'Updated' }, ...errorResponses } },
    },
    '/auth/change-password': { patch: { tags: ['auth'], summary: 'Change password', responses: { 200: { description: 'OK' }, ...errorResponses } } },
    '/auth/forgot-password': { post: { tags: ['auth'], summary: 'Request password reset', security: [], responses: { 200: { description: 'OK' }, ...errorResponses } } },
    '/auth/verify-reset-code': { post: { tags: ['auth'], summary: 'Verify reset code', security: [], responses: { 200: { description: 'OK' }, ...errorResponses } } },
    '/auth/reset-password': { post: { tags: ['auth'], summary: 'Reset password', security: [], responses: { 200: { description: 'OK' }, ...errorResponses } } },
    '/auth/verify-email': { post: { tags: ['auth'], summary: 'Verify email', security: [], responses: { 200: { description: 'OK' }, ...errorResponses } } },
    '/auth/resend-verification': { post: { tags: ['auth'], summary: 'Resend verification email', security: [], responses: { 200: { description: 'OK' }, ...errorResponses } } },

    '/users/me': {
      get: { tags: ['users'], summary: 'Get own user', responses: { 200: { description: 'User' }, ...errorResponses } },
      patch: { tags: ['users'], summary: 'Update own user', responses: { 200: { description: 'User' }, ...errorResponses } },
    },
    '/users/:id': { get: { tags: ['users'], summary: 'Get user by id', responses: { 200: { description: 'User' }, ...errorResponses } } },
    '/users/profile-image': {
      post: { tags: ['users'], summary: 'Upload profile image (multipart)', requestBody: { content: { 'multipart/form-data': { schema: { type: 'object', properties: { image: { type: 'string', format: 'binary' } } } } } }, responses: { 200: { description: 'OK' }, ...errorResponses } },
      delete: { tags: ['users'], summary: 'Delete profile image', responses: { 200: { description: 'OK' }, ...errorResponses } },
    },
    '/users/account': { delete: { tags: ['users'], summary: 'Delete own account', responses: { 200: { description: 'OK' }, ...errorResponses } } },

    '/admin/guides/pending': { get: { tags: ['admin'], summary: 'List pending guides', responses: { 200: { description: 'OK' }, ...errorResponses } } },
    '/admin/drivers/pending': { get: { tags: ['admin'], summary: 'List pending drivers', responses: { 200: { description: 'OK' }, ...errorResponses } } },
    '/admin/users': { get: { tags: ['admin'], summary: 'List users', responses: { 200: { description: 'OK' }, ...errorResponses } } },
    '/admin/users/:id': { get: { tags: ['admin'], summary: 'Get user by id', responses: { 200: { description: 'OK' }, ...errorResponses } }, delete: { tags: ['admin'], summary: 'Delete user', responses: { 200: { description: 'OK' }, ...errorResponses } } },
    '/admin/users/:id/block': { patch: { tags: ['admin'], summary: 'Block user', responses: { 200: { description: 'OK' }, ...errorResponses } } },
    '/admin/users/:id/unblock': { patch: { tags: ['admin'], summary: 'Unblock user', responses: { 200: { description: 'OK' }, ...errorResponses } } },
    '/admin/trips/:id': { delete: { tags: ['admin'], summary: 'Delete trip', responses: { 200: { description: 'OK' }, ...errorResponses } } },
    '/admin/guides/:id/approve': { patch: { tags: ['admin'], summary: 'Approve guide', responses: { 200: { description: 'OK' }, ...errorResponses } } },
    '/admin/guides/:id/reject': { patch: { tags: ['admin'], summary: 'Reject guide', responses: { 200: { description: 'OK' }, ...errorResponses } } },
    '/admin/drivers/:id/approve': { patch: { tags: ['admin'], summary: 'Approve driver', responses: { 200: { description: 'OK' }, ...errorResponses } } },
    '/admin/drivers/:id/reject': { patch: { tags: ['admin'], summary: 'Reject driver', responses: { 200: { description: 'OK' }, ...errorResponses } } },
    '/admin/stats': { get: { tags: ['admin'], summary: 'Platform statistics', responses: { 200: { description: 'OK' }, ...errorResponses } } },
    '/admin/reports': { get: { tags: ['admin'], summary: 'Generated reports', responses: { 200: { description: 'OK' }, ...errorResponses } } },

    '/guides': {
      get: { tags: ['guides'], summary: 'List guides', responses: { 200: { description: 'OK' }, ...errorResponses } },
      post: { tags: ['guides'], summary: 'Create guide (admin)', responses: { 201: { description: 'Created' }, ...errorResponses } },
    },
    '/guides/search': { get: { tags: ['guides'], summary: 'Search guides', responses: { 200: { description: 'OK' }, ...errorResponses } } },
    '/guides/:id': {
      get: { tags: ['guides'], summary: 'Get guide', responses: { 200: { description: 'OK' }, ...errorResponses } },
      patch: { tags: ['guides'], summary: 'Update guide', responses: { 200: { description: 'OK' }, ...errorResponses } },
      delete: { tags: ['guides'], summary: 'Delete guide', responses: { 200: { description: 'OK' }, ...errorResponses } },
    },
    '/guides/:id/availability': { patch: { tags: ['guides'], summary: 'Update guide availability', responses: { 200: { description: 'OK' }, ...errorResponses } } },
    '/guides/:id/certificate': {
      post: { tags: ['guides'], summary: 'Upload certificate (multipart)', requestBody: { content: { 'multipart/form-data': { schema: { type: 'object', properties: { certificate: { type: 'string', format: 'binary' } } } } } }, responses: { 200: { description: 'OK' }, ...errorResponses } },
      delete: { tags: ['guides'], summary: 'Delete certificate', responses: { 200: { description: 'OK' }, ...errorResponses } },
    },

    '/drivers': {
      get: { tags: ['drivers'], summary: 'List drivers', responses: { 200: { description: 'OK' }, ...errorResponses } },
      post: { tags: ['drivers'], summary: 'Create driver (admin)', responses: { 201: { description: 'Created' }, ...errorResponses } },
    },
    '/drivers/search': { get: { tags: ['drivers'], summary: 'Search drivers', responses: { 200: { description: 'OK' }, ...errorResponses } } },
    '/drivers/:id': {
      get: { tags: ['drivers'], summary: 'Get driver', responses: { 200: { description: 'OK' }, ...errorResponses } },
      patch: { tags: ['drivers'], summary: 'Update driver', responses: { 200: { description: 'OK' }, ...errorResponses } },
      delete: { tags: ['drivers'], summary: 'Delete driver', responses: { 200: { description: 'OK' }, ...errorResponses } },
    },
    '/drivers/:id/availability': { patch: { tags: ['drivers'], summary: 'Update driver availability', responses: { 200: { description: 'OK' }, ...errorResponses } } },

    '/vehicles': {
      get: { tags: ['vehicles'], summary: 'List vehicles', responses: { 200: { description: 'OK' }, ...errorResponses } },
      post: { tags: ['vehicles'], summary: 'Create vehicle (admin/driver)', responses: { 201: { description: 'Created' }, ...errorResponses } },
    },
    '/vehicles/driver/:driverId': { get: { tags: ['vehicles'], summary: 'List vehicles for a driver', responses: { 200: { description: 'OK' }, ...errorResponses } } },
    '/vehicles/:id': {
      get: { tags: ['vehicles'], summary: 'Get vehicle', responses: { 200: { description: 'OK' }, ...errorResponses } },
      patch: { tags: ['vehicles'], summary: 'Update vehicle', responses: { 200: { description: 'OK' }, ...errorResponses } },
      delete: { tags: ['vehicles'], summary: 'Delete vehicle', responses: { 200: { description: 'OK' }, ...errorResponses } },
    },
    '/vehicles/:id/image': {
      post: { tags: ['vehicles'], summary: 'Upload vehicle image (multipart)', requestBody: { content: { 'multipart/form-data': { schema: { type: 'object', properties: { image: { type: 'string', format: 'binary' } } } } } }, responses: { 200: { description: 'OK' }, ...errorResponses } },
      delete: { tags: ['vehicles'], summary: 'Delete vehicle image', responses: { 200: { description: 'OK' }, ...errorResponses } },
    },

    '/trips/my': { get: { tags: ['trips'], summary: 'My trips', responses: { 200: { description: 'OK' }, ...errorResponses } } },
    '/trips/shared': { get: { tags: ['trips'], summary: 'Shared trips', responses: { 200: { description: 'OK' }, ...errorResponses } } },
    '/trips/calculate-price': { post: { tags: ['trips'], summary: 'Calculate trip price', responses: { 200: { description: 'OK' }, ...errorResponses } } },
    '/trips': {
      get: { tags: ['trips'], summary: 'List trips', responses: { 200: { description: 'OK' }, ...errorResponses } },
      post: { tags: ['trips'], summary: 'Create trip (tourist/admin)', responses: { 201: { description: 'Created' }, ...errorResponses } },
    },
    '/trips/:id': {
      get: { tags: ['trips'], summary: 'Get trip', responses: { 200: { description: 'OK' }, ...errorResponses } },
      patch: { tags: ['trips'], summary: 'Update trip', responses: { 200: { description: 'OK' }, ...errorResponses } },
      delete: { tags: ['trips'], summary: 'Delete trip', responses: { 200: { description: 'OK' }, ...errorResponses } },
    },
    '/trips/:id/assign-guide': { patch: { tags: ['trips'], summary: 'Assign guide', responses: { 200: { description: 'OK' }, ...errorResponses } } },
    '/trips/:id/assign-driver': { patch: { tags: ['trips'], summary: 'Assign driver', responses: { 200: { description: 'OK' }, ...errorResponses } } },
    '/trips/:id/assign-vehicle': { patch: { tags: ['trips'], summary: 'Assign vehicle', responses: { 200: { description: 'OK' }, ...errorResponses } } },
    '/trips/:id/start': { patch: { tags: ['trips'], summary: 'Start trip', responses: { 200: { description: 'OK' }, ...errorResponses } } },
    '/trips/:id/complete': { patch: { tags: ['trips'], summary: 'Complete trip', responses: { 200: { description: 'OK' }, ...errorResponses } } },
    '/trips/:id/cancel': { patch: { tags: ['trips'], summary: 'Cancel trip', responses: { 200: { description: 'OK' }, ...errorResponses } } },
    '/trips/:id/share': { patch: { tags: ['trips'], summary: 'Share trip', responses: { 200: { description: 'OK' }, ...errorResponses } } },
    '/trips/:id/duplicate': { post: { tags: ['trips'], summary: 'Duplicate trip', responses: { 200: { description: 'OK' }, ...errorResponses } } },
    '/trips/:id/route': { get: { tags: ['trips'], summary: 'Get trip route', responses: { 200: { description: 'OK' }, ...errorResponses } } },

    '/votes/user': { get: { tags: ['votes'], summary: 'My votes', responses: { 200: { description: 'OK' }, ...errorResponses } } },
    '/votes/place/:placeId': { get: { tags: ['votes'], summary: 'Votes for a place', responses: { 200: { description: 'OK' }, ...errorResponses } } },
    '/votes': {
      post: { tags: ['votes'], summary: 'Create vote', responses: { 201: { description: 'Created' }, ...errorResponses } },
    },
    '/votes/:id': {
      patch: { tags: ['votes'], summary: 'Update vote', responses: { 200: { description: 'OK' }, ...errorResponses } },
      delete: { tags: ['votes'], summary: 'Delete vote', responses: { 200: { description: 'OK' }, ...errorResponses } },
    },

    '/notifications': {
      get: { tags: ['notifications'], summary: 'List notifications', responses: { 200: { description: 'OK' }, ...errorResponses } },
      post: { tags: ['notifications'], summary: 'Create notification', responses: { 201: { description: 'Created' }, ...errorResponses } },
      delete: { tags: ['notifications'], summary: 'Delete all notifications', responses: { 200: { description: 'OK' }, ...errorResponses } },
    },
    '/notifications/unread-count': { get: { tags: ['notifications'], summary: 'Unread count', responses: { 200: { description: 'OK' }, ...errorResponses } } },
    '/notifications/:id': {
      get: { tags: ['notifications'], summary: 'Get notification', responses: { 200: { description: 'OK' }, ...errorResponses } },
      delete: { tags: ['notifications'], summary: 'Delete notification', responses: { 200: { description: 'OK' }, ...errorResponses } },
    },
    '/notifications/:id/read': { patch: { tags: ['notifications'], summary: 'Mark as read', responses: { 200: { description: 'OK' }, ...errorResponses } } },
    '/notifications/read-all': { patch: { tags: ['notifications'], summary: 'Mark all as read', responses: { 200: { description: 'OK' }, ...errorResponses } } },

    '/lost-items/my': { get: { tags: ['lost-items'], summary: 'My lost items', responses: { 200: { description: 'OK' }, ...errorResponses } } },
    '/lost-items/trip/:tripId': { get: { tags: ['lost-items'], summary: 'Lost items for a trip', responses: { 200: { description: 'OK' }, ...errorResponses } } },
    '/lost-items': {
      get: { tags: ['lost-items'], summary: 'List lost items', responses: { 200: { description: 'OK' }, ...errorResponses } },
      post: { tags: ['lost-items'], summary: 'Report lost item', responses: { 201: { description: 'Created' }, ...errorResponses } },
    },
    '/lost-items/:id': {
      get: { tags: ['lost-items'], summary: 'Get lost item', responses: { 200: { description: 'OK' }, ...errorResponses } },
      patch: { tags: ['lost-items'], summary: 'Update lost item', responses: { 200: { description: 'OK' }, ...errorResponses } },
      delete: { tags: ['lost-items'], summary: 'Delete lost item', responses: { 200: { description: 'OK' }, ...errorResponses } },
    },
    '/lost-items/:id/status': { patch: { tags: ['lost-items'], summary: 'Update status', responses: { 200: { description: 'OK' }, ...errorResponses } } },
    '/lost-items/:id/report-found': { patch: { tags: ['lost-items'], summary: 'Report found', responses: { 200: { description: 'OK' }, ...errorResponses } } },
    '/lost-items/:id/close': { patch: { tags: ['lost-items'], summary: 'Close item', responses: { 200: { description: 'OK' }, ...errorResponses } } },
    '/lost-items/:id/reopen': { patch: { tags: ['lost-items'], summary: 'Reopen item', responses: { 200: { description: 'OK' }, ...errorResponses } } },

    '/places/search': { get: { tags: ['places'], summary: 'Search places', responses: { 200: { description: 'OK' }, ...errorResponses } } },
    '/places/filter': { get: { tags: ['places'], summary: 'Filter places', responses: { 200: { description: 'OK' }, ...errorResponses } } },
    '/places/nearby': { get: { tags: ['places'], summary: 'Nearby places', responses: { 200: { description: 'OK' }, ...errorResponses } } },
    '/places/popular': { get: { tags: ['places'], summary: 'Popular places', responses: { 200: { description: 'OK' }, ...errorResponses } } },
    '/places': {
      get: { tags: ['places'], summary: 'List places', responses: { 200: { description: 'OK' }, ...errorResponses } },
      post: { tags: ['places'], summary: 'Create place (admin)', responses: { 201: { description: 'Created' }, ...errorResponses } },
    },
    '/places/save': { post: { tags: ['places'], summary: 'Save place for user', responses: { 200: { description: 'OK' }, ...errorResponses } } },
    '/places/:id': {
      get: { tags: ['places'], summary: 'Get place', responses: { 200: { description: 'OK' }, ...errorResponses } },
      patch: { tags: ['places'], summary: 'Update place', responses: { 200: { description: 'OK' }, ...errorResponses } },
      delete: { tags: ['places'], summary: 'Delete place', responses: { 200: { description: 'OK' }, ...errorResponses } },
    },

    '/reviews/trip/:tripId': { get: { tags: ['reviews'], summary: 'Trip reviews', responses: { 200: { description: 'OK' }, ...errorResponses } } },
    '/reviews/guide/:guideId': { get: { tags: ['reviews'], summary: 'Guide reviews', responses: { 200: { description: 'OK' }, ...errorResponses } } },
    '/reviews/driver/:driverId': { get: { tags: ['reviews'], summary: 'Driver reviews', responses: { 200: { description: 'OK' }, ...errorResponses } } },
    '/reviews/place/:placeId': { get: { tags: ['reviews'], summary: 'Place reviews', responses: { 200: { description: 'OK' }, ...errorResponses } } },
    '/reviews/my': { get: { tags: ['reviews'], summary: 'My reviews', responses: { 200: { description: 'OK' }, ...errorResponses } } },
    '/reviews': {
      get: { tags: ['reviews'], summary: 'List reviews', responses: { 200: { description: 'OK' }, ...errorResponses } },
      post: { tags: ['reviews'], summary: 'Create review', responses: { 201: { description: 'Created' }, ...errorResponses } },
    },
    '/reviews/:id': {
      get: { tags: ['reviews'], summary: 'Get review', responses: { 200: { description: 'OK' }, ...errorResponses } },
      patch: { tags: ['reviews'], summary: 'Update review', responses: { 200: { description: 'OK' }, ...errorResponses } },
      delete: { tags: ['reviews'], summary: 'Delete review', responses: { 200: { description: 'OK' }, ...errorResponses } },
    },

    '/external/pois': { get: { tags: ['external'], summary: 'POIs from Overpass', security: [], responses: { 200: { description: 'OK' }, ...errorResponses } } },
    '/external/route': { get: { tags: ['external'], summary: 'Route from OSRM/ORS', security: [], responses: { 200: { description: 'OK' }, ...errorResponses } } },
    '/external/cache': { get: { tags: ['external'], summary: 'Cache stats', responses: { 200: { description: 'OK' }, ...errorResponses } } },

    '/tracking/driver/:driverId/location': { post: { tags: ['tracking'], summary: 'Push driver location (polling source)', responses: { 200: { description: 'OK' }, ...errorResponses } } },
    '/tracking/driver/:driverId': {
      get: { tags: ['tracking'], summary: 'Poll a driver location', responses: { 200: { description: 'OK' }, ...errorResponses } },
      delete: { tags: ['tracking'], summary: 'Clear driver location', responses: { 200: { description: 'OK' }, ...errorResponses } },
    },
    '/tracking/all': { get: { tags: ['tracking'], summary: 'Poll all locations', responses: { 200: { description: 'OK' }, ...errorResponses } } },
    '/tracking/active-trips': { get: { tags: ['tracking'], summary: 'Poll active trips', responses: { 200: { description: 'OK' }, ...errorResponses } } },
  },
};

export default spec;
