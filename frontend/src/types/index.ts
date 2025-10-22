// User types
export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  isActive: boolean;
  dateCreated: string;
  lastLogin?: string;
}

export interface AuthUser extends Omit<User, 'isActive' | 'dateCreated' | 'lastLogin'> {}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'user' | 'admin';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
  };
}

// Pet types
export interface Pet {
  _id: string;
  name: string;
  breed: string;
  age: number;
  image: string;
  costRange: number;
  personalityCharacteristics: string;
  isAdopted: boolean;
  dateAdded: string;
  lastUpdated: string;
}

export interface PetFormData {
  name: string;
  breed: string;
  age: number;
  image: string;
  costRange: number;
  personalityCharacteristics: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface PetsResponse {
  pets: Pet[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalPets: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface UsersResponse {
  users: User[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Filter types
export interface FilterOptions {
  breeds: string[];
  ageRanges: Array<{
    value: string;
    label: string;
  }>;
  costRanges: Array<{
    value: string;
    label: string;
  }>;
}

export interface PetFilters {
  name?: string;
  breed?: string;
  ageRange?: string;
  costRange?: string;
  isAdopted?: boolean;
}

// Socket.IO types
export interface SocketEvents {
  // Client to Server
  authenticate: (data: { token: string }) => void;
  pet_updated: (data: { pet: Pet }) => void;
  pet_created: (data: { pet: Pet }) => void;
  pet_deleted: (data: { petId: string }) => void;
  user_updated: (data: { user: User }) => void;

  // Server to Client
  authenticated: (data: { user: AuthUser }) => void;
  auth_error: (data: { message: string }) => void;
  pet_updated: (data: { pet: Pet; timestamp: string }) => void;
  pet_created: (data: { pet: Pet; timestamp: string }) => void;
  pet_deleted: (data: { petId: string; timestamp: string }) => void;
  user_updated: (data: { user: User; timestamp: string }) => void;
  notification: (data: { type: string; data: any; message?: string; timestamp: string }) => void;
  error: (data: { message: string }) => void;
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  role?: 'user' | 'admin';
}

// Navigation types
export interface NavItem {
  label: string;
  path: string;
  icon?: React.ComponentType;
  requiresAuth?: boolean;
  requiresAdmin?: boolean;
}

// Theme types
export interface Theme {
  palette: {
    primary: {
      main: string;
      light: string;
      dark: string;
    };
    secondary: {
      main: string;
      light: string;
      dark: string;
    };
    background: {
      default: string;
      paper: string;
    };
    text: {
      primary: string;
      secondary: string;
    };
  };
}

