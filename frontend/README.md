# Banking System Frontend

A modern React TypeScript frontend application that consumes the MERN backend APIs for managing banks, branches, and ATMs.

## Features

- **Authentication System**: Login, registration, and user profile management
- **Bank Management**: CRUD operations for banks
- **Branch Management**: CRUD operations for branches
- **ATM Management**: CRUD operations for ATMs
- **Modern UI**: Built with Tailwind CSS for a responsive design
- **Type Safety**: Full TypeScript support with proper interfaces
- **API Integration**: Complete integration with your Node.js backend

## API Endpoints Covered

### Authentication APIs
- `POST /auth/register` - User registration
- `GET /auth/activate/:token` - Activate user profile
- `POST /auth/login` - User login
- `POST /auth/me` - Get logged in user profile
- `PATCH /auth/logout` - Logout user

### Bank APIs
- `GET /bank/for-home` - Banks for home page
- `GET /bank` - List all banks
- `GET /bank/:id` - Get bank by ID
- `PUT /bank/:id` - Update bank
- `DELETE /bank/:id` - Delete bank
- `GET /bank/branches/:slug` - Get bank branches by slug
- `POST /bank` - Create new bank

### Branch APIs
- `GET /branch/for-home` - Branches for home page
- `GET /branch` - List all branches
- `GET /branch/:id` - Get branch by ID
- `PUT /branch/:id` - Update branch
- `DELETE /branch/:id` - Delete branch
- `GET /branch/atms/:id` - Get ATMs by branch ID
- `POST /branch` - Create new branch

### ATM APIs
- `GET /atm/for-home` - ATMs for home page
- `GET /atm/:slug/branches` - Get ATM branches by slug
- `GET /atm` - List all ATMs
- `GET /atm/:id` - Get ATM by ID
- `PUT /atm/:id` - Update ATM
- `DELETE /atm/:id` - Delete ATM
- `POST /atm` - Create new ATM

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── Login.tsx
│   │   ├── banks/
│   │   │   └── BanksList.tsx
│   │   └── atms/
│   │       └── ATMsList.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── hooks/
│   │   └── useAuth.ts
│   ├── services/
│   │   └── api.ts
│   ├── types/
│   │   └── api.ts
│   └── App.tsx
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Your MERN backend running on `http://localhost:8000`

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Usage Examples

### Authentication

```typescript
import { useAuth } from './hooks/useAuth';

const MyComponent = () => {
    const { user, login, logout, loading } = useAuth();

    const handleLogin = async () => {
        try {
            await login({
                email: 'user@example.com',
                password: 'password123'
            });
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    if (loading) return <div>Loading...</div>;
    
    return user ? (
        <div>
            <p>Welcome, {user.name}!</p>
            <button onClick={logout}>Logout</button>
        </div>
    ) : (
        <button onClick={handleLogin}>Login</button>
    );
};
```

### Bank Management

```typescript
import { bankApi } from './services/api';

// Get all banks
const fetchBanks = async () => {
    try {
        const response = await bankApi.getAllBanks();
        const banks = response.data.data;
        console.log('Banks:', banks);
    } catch (error) {
        console.error('Failed to fetch banks:', error);
    }
};

// Create a new bank
const createBank = async () => {
    try {
        const newBank = await bankApi.createBank({
            name: 'New Bank',
            description: 'A new bank',
            website: 'https://newbank.com',
            contactNumber: '+1234567890',
            email: 'info@newbank.com',
            address: '123 Main St, City, State'
        });
        console.log('Created bank:', newBank.data.data);
    } catch (error) {
        console.error('Failed to create bank:', error);
    }
};
```

### ATM Management

```typescript
import { atmApi } from './services/api';

// Get all ATMs
const fetchATMs = async () => {
    try {
        const response = await atmApi.getAllATMs();
        const atms = response.data.data;
        console.log('ATMs:', atms);
    } catch (error) {
        console.error('Failed to fetch ATMs:', error);
    }
};

// Create a new ATM
const createATM = async () => {
    try {
        const newATM = await atmApi.createATM({
            name: 'Downtown ATM',
            bankId: 'bank_id_here',
            address: '456 Downtown St',
            location: {
                type: 'Point',
                coordinates: [-73.935242, 40.730610] // [longitude, latitude]
            },
            isWorking: true
        });
        console.log('Created ATM:', newATM.data.data);
    } catch (error) {
        console.error('Failed to create ATM:', error);
    }
};
```

## Configuration

### API Base URL

The API base URL is configured in `src/services/api.ts`. By default, it's set to `http://localhost:8000`. You can change this to match your backend URL:

```typescript
const API_URL = 'http://localhost:8000'; // Change this to your backend URL
```

### Environment Variables

You can also use environment variables to configure the API URL. Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:8000
```

Then update the API configuration:

```typescript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
```

## Authentication Flow

1. **Login**: User enters credentials → API call to `/auth/login` → Token stored in localStorage
2. **Protected Routes**: Token automatically added to request headers via axios interceptor
3. **Token Validation**: App checks token validity on startup via `/auth/me`
4. **Logout**: Token removed from localStorage and API call to `/auth/logout`

## Error Handling

The application includes comprehensive error handling:

- API errors are caught and displayed to users
- Network errors are logged to console
- Authentication errors automatically clear invalid tokens
- Loading states are managed for better UX

## Styling

The application uses Tailwind CSS for styling. You can customize the design by:

1. Modifying the Tailwind configuration in `tailwind.config.js`
2. Adding custom CSS classes
3. Using Tailwind's utility classes directly in components

## Building for Production

To build the application for production:

```bash
npm run build
```

This creates an optimized build in the `build` folder that you can deploy to any static hosting service.

## Troubleshooting

### CORS Issues

If you encounter CORS issues, make sure your backend is configured to allow requests from `http://localhost:3000`.

### API Connection Issues

1. Verify your backend is running on the correct port
2. Check the API URL configuration in `src/services/api.ts`
3. Ensure your backend endpoints match the expected URLs

### Authentication Issues

1. Check that your backend is properly configured for JWT authentication
2. Verify the token format matches what your backend expects
3. Ensure the `/auth/me` endpoint is working correctly

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License. 