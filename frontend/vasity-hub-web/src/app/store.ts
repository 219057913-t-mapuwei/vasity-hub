// Mock data store for Vasity Hub platform
export interface User {
  id: string;
  email: string;
  password: string;
  role: 'student' | 'super_admin' | 'super_university_admin' | 'university_admin' | 'super_doe_admin' | 'doe_admin';
  name: string;
  university?: string;
  createdBy?: string; // ID of the admin who created this user
}

export interface UniversityAPSScore {
  universityId: string;
  universityName: string;
  apsScore: number;
  calculationMethod: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  saId: string; // South African ID Number (13 digits) - Primary Identifier for SA citizens
  studentType?: 'south_african' | 'foreign';
  passportNumber?: string;
  countryOfCitizenship?: string;
  visaStatus?: string;
  medicalCoverStatus?: string;
  saqaStatus?: string;
  usafExemptionStatus?: string;
  grade11APS?: number;
  grade12APS?: number;
  finalAPS?: number;
  universityAPS: UniversityAPSScore[]; // APS per university
  subjects?: { subject: string; mark: number }[]; // Student's subject marks
  careerTestCompleted: boolean;
  careerProfile?: CareerProfile;
  applications: Application[];
  documents: Document[];
  payments: Payment[];
  premiumServices: StudentPremiumPurchase[];
}

export interface CareerProfile {
  personalityType: string;
  suggestedCareers: string[];
  skills: { name: string; score: number }[];
  interests: string[];
}

export interface Course {
  id: string;
  name: string;
  university: string;
  apsRequired: number;
  field: string;
  duration: string;
  description: string;
  isFeatured?: boolean;
  featuredUntil?: string;
}

export interface UniversityBilling {
  id: string;
  universityId: string;
  universityName: string;
  amountOwed: number;
  paymentStatus: 'pending' | 'paid' | 'overdue';
  billingPeriod: string;
  dueDate: string;
  paidDate?: string;
  invoiceNumber?: string;
  itemizedCharges: BillingCharge[];
}

export interface BillingCharge {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: 'course_listing' | 'featured_course' | 'application_processing';
}

export interface PremiumService {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
}

export interface StudentPremiumPurchase {
  id: string;
  studentId: string;
  serviceId: string;
  serviceName: string;
  amount: number;
  purchaseDate: string;
  status: 'active' | 'expired';
}

export interface UniversityAPSCalculationRule {
  universityId: string;
  universityName: string;
  subjectCount: 6 | 7;
  includeLifeOrientation: boolean;
  useWeighting: boolean;
  requiresNBT: boolean;
  nbtWeight?: number;
  calculationMethod: string;
}

export interface University {
  id: string;
  name: string;
  location: string;
  ranking: number;
  courses: Course[];
  imageUrl: string;
  apsCalculationRule: UniversityAPSCalculationRule;
}

export interface Payment {
  id: string;
  applicationId: string;
  studentId: string;
  studentSaId: string;
  amount: number;
  method: 'card' | 'eft';
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  createdDate: string;
  paidDate?: string;
  referenceNumber?: string;
  cardLastFour?: string;
  refundStatus?: 'requested' | 'approved' | 'refunded';
  refundReason?: string;
  refundDate?: string;
}

export interface PaymentReceipt {
  id: string;
  paymentId: string;
  studentName: string;
  studentSaId: string;
  courseName: string;
  university: string;
  amount: number;
  paymentDate: string;
  referenceNumber: string;
  paymentMethod: string;
}

export interface Application {
  id: string;
  courseId: string;
  courseName: string;
  university: string;
  studentSaId: string; // SA ID for tracking across systems
  status: 'submitted' | 'under_review' | 'accepted' | 'rejected' | 'waitlisted';
  submittedDate: string;
  lastUpdated: string;
  paymentId?: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
}

export interface Document {
  id: string;
  name: string;
  type: string;
  status: 'uploaded' | 'pending' | 'approved' | 'rejected';
  uploadedDate: string;
}

export interface Recommendation {
  type: 'course' | 'university' | 'career';
  item: Course | University | string;
  matchScore: 'high' | 'medium' | 'low';
  reason: string;
}

// Mock users with demo credentials - stored in memory (in a real app, this would be a database)
export let users: User[] = [
  { id: '1', email: 'student@test.com', password: '1234', role: 'student', name: 'Thabo Molefe' },
  { id: '2', email: 'superadmin@vasityhub.co.za', password: 'ChangeMe@12345', role: 'super_admin', name: 'Vasity Hub Super Administrator' },
  { id: '3', email: 'admin@vasityhub.co.za', password: 'ChangeMe@12345', role: 'super_university_admin', name: 'Vasity Hub Admin', createdBy: '2' },
  { id: '4', email: 'university@vasityhub.co.za', password: 'ChangeMe@12345', role: 'university_admin', name: 'University Staff', university: 'University of Cape Town', createdBy: '3' },
  { id: '5', email: 'super-doe@test.com', password: '1234', role: 'super_doe_admin', name: 'Super Education Department Admin', createdBy: '2' },
  { id: '6', email: 'support@vasityhub.co.za', password: 'ChangeMe@12345', role: 'doe_admin', name: 'Support Staff', createdBy: '5' },
];

// Load users from localStorage on initialization
if (typeof window !== 'undefined') {
  const savedUsers = localStorage.getItem('vasityhub_users');
  if (savedUsers) {
    try {
      users = JSON.parse(savedUsers);
    } catch (e) {
      console.error('Failed to load users from localStorage');
    }
  }
}

// Mock universities
export const universities: University[] = [
  {
    id: 'uct',
    name: 'University of Cape Town',
    location: 'Cape Town, Western Cape',
    ranking: 1,
    imageUrl: 'https://images.unsplash.com/photo-1638636214032-581196ffd400?w=1080',
    courses: [],
    apsCalculationRule: {
      universityId: 'uct',
      universityName: 'University of Cape Town',
      subjectCount: 6,
      includeLifeOrientation: false,
      useWeighting: true,
      requiresNBT: true,
      nbtWeight: 20,
      calculationMethod: 'UCT uses best 6 subjects (excluding LO), adds NBT score. Total out of 600 (7×6 subjects + NBT)'
    }
  },
  {
    id: 'wits',
    name: 'University of the Witwatersrand',
    location: 'Johannesburg, Gauteng',
    ranking: 2,
    imageUrl: 'https://images.unsplash.com/photo-1638636199555-5085c5f4fc56?w=1080',
    courses: [],
    apsCalculationRule: {
      universityId: 'wits',
      universityName: 'University of the Witwatersrand',
      subjectCount: 6,
      includeLifeOrientation: false,
      useWeighting: false,
      requiresNBT: false,
      calculationMethod: 'Wits uses best 6 subjects (excluding LO). Standard APS calculation.'
    }
  },
  {
    id: 'stellenbosch',
    name: 'Stellenbosch University',
    location: 'Stellenbosch, Western Cape',
    ranking: 3,
    imageUrl: 'https://images.unsplash.com/photo-1609184024274-28de3127ca0c?w=1080',
    courses: [],
    apsCalculationRule: {
      universityId: 'stellenbosch',
      universityName: 'Stellenbosch University',
      subjectCount: 7,
      includeLifeOrientation: true,
      useWeighting: false,
      requiresNBT: false,
      calculationMethod: 'Stellenbosch uses all 7 subjects (including LO). Standard APS calculation.'
    }
  },
  {
    id: 'up',
    name: 'University of Pretoria',
    location: 'Pretoria, Gauteng',
    ranking: 4,
    imageUrl: 'https://images.unsplash.com/photo-1770721666603-ff87f3c2ed04?w=1080',
    courses: [],
    apsCalculationRule: {
      universityId: 'up',
      universityName: 'University of Pretoria',
      subjectCount: 6,
      includeLifeOrientation: false,
      useWeighting: false,
      requiresNBT: false,
      calculationMethod: 'UP uses best 6 subjects (excluding LO). Standard APS calculation.'
    }
  },
];

// Application fee constant
export const APPLICATION_FEE = 100; // R100

// Premium services catalog
export const premiumServices: PremiumService[] = [
  {
    id: 'ps1',
    name: 'Advanced Career Report',
    description: 'Get detailed insights into career paths, salary expectations, and industry trends',
    price: 250,
    features: [
      'In-depth personality analysis',
      '20+ career recommendations',
      'Industry salary benchmarks',
      'Skills gap analysis',
      '5-year career roadmap'
    ]
  },
  {
    id: 'ps2',
    name: 'Professional CV Builder',
    description: 'Create ATS-optimized CVs with professional templates',
    price: 150,
    features: [
      'ATS-friendly templates',
      'Export to PDF/Word',
      'Cover letter generator',
      'LinkedIn profile optimization',
      'Unlimited revisions'
    ]
  },
  {
    id: 'ps3',
    name: 'Priority Application Support',
    description: 'Fast-track your applications with dedicated support',
    price: 500,
    features: [
      'Dedicated support agent',
      'Application review service',
      'Document verification assistance',
      'Priority processing',
      'Email/phone support'
    ]
  }
];

// Mock courses
export const courses: Course[] = [
  { id: 'c1', name: 'BSc Computer Science', university: 'University of Cape Town', apsRequired: 35, field: 'Technology', duration: '3 years', description: 'Comprehensive computer science program', isFeatured: true, featuredUntil: '2026-12-31' },
  { id: 'c2', name: 'Bachelor of Engineering', university: 'University of the Witwatersrand', apsRequired: 38, field: 'Engineering', duration: '4 years', description: 'Mechanical and electrical engineering', isFeatured: true, featuredUntil: '2026-12-31' },
  { id: 'c3', name: 'BCom Accounting', university: 'Stellenbosch University', apsRequired: 32, field: 'Business', duration: '3 years', description: 'Accounting and financial management' },
  { id: 'c4', name: 'Bachelor of Medicine', university: 'University of Pretoria', apsRequired: 40, field: 'Medicine', duration: '6 years', description: 'Medical degree program', isFeatured: true, featuredUntil: '2026-12-31' },
  { id: 'c5', name: 'BA Law', university: 'University of Cape Town', apsRequired: 36, field: 'Law', duration: '4 years', description: 'Legal studies and practice' },
  { id: 'c6', name: 'BSc Data Science', university: 'University of the Witwatersrand', apsRequired: 34, field: 'Technology', duration: '3 years', description: 'Data analytics and machine learning' },
  { id: 'c7', name: 'BCom Economics', university: 'Stellenbosch University', apsRequired: 33, field: 'Business', duration: '3 years', description: 'Economic theory and policy' },
  { id: 'c8', name: 'Bachelor of Architecture', university: 'University of Pretoria', apsRequired: 35, field: 'Architecture', duration: '5 years', description: 'Architectural design and planning' },
];

// Payments storage
export let payments: Payment[] = [];

// University billing storage
export let universityBillings: UniversityBilling[] = [
  {
    id: 'bill-1',
    universityId: 'uct',
    universityName: 'University of Cape Town',
    amountOwed: 15000,
    paymentStatus: 'pending',
    billingPeriod: 'Q1 2026',
    dueDate: '2026-04-30',
    invoiceNumber: 'INV-2026-001',
    itemizedCharges: [
      { id: 'charge-1', description: 'Course listings (3 courses)', amount: 9000, date: '2026-01-15', type: 'course_listing' },
      { id: 'charge-2', description: 'Featured course promotion', amount: 6000, date: '2026-02-01', type: 'featured_course' }
    ]
  },
  {
    id: 'bill-2',
    universityId: 'wits',
    universityName: 'University of the Witwatersrand',
    amountOwed: 12000,
    paymentStatus: 'paid',
    billingPeriod: 'Q1 2026',
    dueDate: '2026-04-30',
    paidDate: '2026-03-15',
    invoiceNumber: 'INV-2026-002',
    itemizedCharges: [
      { id: 'charge-3', description: 'Course listings (2 courses)', amount: 6000, date: '2026-01-15', type: 'course_listing' },
      { id: 'charge-4', description: 'Featured course promotion', amount: 6000, date: '2026-02-01', type: 'featured_course' }
    ]
  }
];

// Student profiles storage
export let studentProfiles: { [key: string]: StudentProfile } = {
  '1': {
    id: '1',
    name: 'Thabo Molefe',
    email: 'student@test.com',
    saId: '9801015800089', // Demo SA ID
    studentType: 'south_african',
    passportNumber: '',
    countryOfCitizenship: 'South Africa',
    visaStatus: '',
    medicalCoverStatus: '',
    saqaStatus: '',
    usafExemptionStatus: '',
    grade11APS: undefined,
    grade12APS: undefined,
    finalAPS: undefined,
    universityAPS: [],
    subjects: undefined,
    careerTestCompleted: false,
    careerProfile: undefined,
    applications: [],
    documents: [],
    payments: [],
    premiumServices: []
  }
};

// Load student profiles from localStorage
if (typeof window !== 'undefined') {
  const savedProfiles = localStorage.getItem('vasityhub_student_profiles');
  if (savedProfiles) {
    try {
      studentProfiles = JSON.parse(savedProfiles);
    } catch (e) {
      console.error('Failed to load student profiles');
    }
  }
}

// Current student profile reference
export let currentStudentProfile: StudentProfile = studentProfiles['1'];

// Session management
let currentUser: User | null = null;

// Save users to localStorage
const saveUsersToStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('vasityhub_users', JSON.stringify(users));
  }
};

// Save student profiles to localStorage
const saveStudentProfilesToStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('vasityhub_student_profiles', JSON.stringify(studentProfiles));
  }
};

// Validate South African ID Number
export const validateSAId = (saId: string): { valid: boolean; message: string } => {
  // Remove any spaces or dashes
  const cleanId = saId.replace(/[\s-]/g, '');

  // Check if exactly 13 digits
  if (!/^\d{13}$/.test(cleanId)) {
    return { valid: false, message: 'Please enter a valid 13-digit South African ID number' };
  }

  // Check if ID already exists in system
  const existingStudent = Object.values(studentProfiles).find(profile => profile.saId === cleanId);
  if (existingStudent) {
    return { valid: false, message: 'This South African ID number is already registered in the system' };
  }

  return { valid: true, message: '' };
};

// Register new user (STUDENTS ONLY - public registration)
export const registerUser = (userData: {
  name: string;
  email: string;
  password: string;
  saId?: string;
  studentType?: 'south_african' | 'foreign';
  passportNumber?: string;
  countryOfCitizenship?: string;
  visaStatus?: string;
  medicalCoverStatus?: string;
  saqaStatus?: string;
  usafExemptionStatus?: string;
}): { success: boolean; message: string } => {
  const studentType = userData.studentType || 'south_african';

  if (studentType === 'south_african') {
    const saIdValidation = validateSAId(userData.saId || '');
    if (!saIdValidation.valid) {
      return { success: false, message: saIdValidation.message };
    }
  } else {
    if (!userData.passportNumber || userData.passportNumber.trim().length < 5) {
      return { success: false, message: 'Please enter a valid passport number for foreign student registration' };
    }
    const existingPassport = Object.values(studentProfiles).find(profile => profile.passportNumber === userData.passportNumber);
    if (existingPassport) {
      return { success: false, message: 'This passport number is already registered in the system' };
    }
  }

  const existingUser = users.find(u => u.email === userData.email);
  if (existingUser) {
    return { success: false, message: 'Email already registered' };
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    email: userData.email,
    password: userData.password,
    role: 'student',
    name: userData.name,
  };

  users.push(newUser);

  const newProfile: StudentProfile = {
    id: newUser.id,
    name: userData.name,
    email: userData.email,
    saId: studentType === 'south_african' ? (userData.saId || '').replace(/[\s-]/g, '') : '',
    studentType,
    passportNumber: studentType === 'foreign' ? userData.passportNumber : '',
    countryOfCitizenship: studentType === 'foreign' ? userData.countryOfCitizenship : 'South Africa',
    visaStatus: studentType === 'foreign' ? userData.visaStatus : '',
    medicalCoverStatus: studentType === 'foreign' ? userData.medicalCoverStatus : '',
    saqaStatus: studentType === 'foreign' ? userData.saqaStatus : '',
    usafExemptionStatus: studentType === 'foreign' ? userData.usafExemptionStatus : '',
    grade11APS: undefined,
    grade12APS: undefined,
    finalAPS: undefined,
    universityAPS: [],
    subjects: undefined,
    careerTestCompleted: false,
    careerProfile: undefined,
    applications: [],
    documents: [],
    payments: [],
    premiumServices: []
  };
  studentProfiles[newUser.id] = newProfile;
  saveStudentProfilesToStorage();
  saveUsersToStorage();

  return { success: true, message: 'Registration successful' };
};

// Create admin user (ADMIN ONLY - requires authorization)
export const createAdminUser = (userData: {
  name: string;
  email: string;
  password: string;
  role: 'super_university_admin' | 'university_admin' | 'super_doe_admin' | 'doe_admin';
  university?: string;
  createdBy: string;
}): { success: boolean; message: string } => {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    return { success: false, message: 'Not authenticated' };
  }

  // Role-based authorization
  if (userData.role === 'super_university_admin' || userData.role === 'super_doe_admin') {
    if (currentUser.role !== 'super_admin') {
      return { success: false, message: 'Only the Super Admin can create elevated staff users' };
    }
  } else if (userData.role === 'university_admin') {
    if (currentUser.role !== 'super_university_admin') {
      return { success: false, message: 'Only Super University Admin can create University Admins' };
    }
  } else if (userData.role === 'doe_admin') {
    if (currentUser.role !== 'super_doe_admin') {
      return { success: false, message: 'Only Super Education Department Admin can create Education Department Admins' };
    }
  }

  // Check if email already exists
  const existingUser = users.find(u => u.email === userData.email);
  if (existingUser) {
    return { success: false, message: 'Email already registered' };
  }

  // Create new admin user
  const newUser: User = {
    id: `user-${Date.now()}`,
    email: userData.email,
    password: userData.password,
    role: userData.role,
    name: userData.name,
    university: userData.university,
    createdBy: userData.createdBy,
  };

  // Add to users array
  users.push(newUser);

  // Save to localStorage
  saveUsersToStorage();

  return { success: true, message: 'Admin user created successfully' };
};

export const login = (email: string, password: string): User | null => {
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    currentUser = user;
    // Save current session
    if (typeof window !== 'undefined') {
      localStorage.setItem('vasityhub_current_user', JSON.stringify(user));
    }
    return user;
  }
  return null;
};

export const logout = () => {
  currentUser = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('vasityhub_current_user');
  }
};

export const getCurrentUser = (): User | null => {
  // Try to restore from localStorage if not in memory
  if (!currentUser && typeof window !== 'undefined') {
    const savedUser = localStorage.getItem('vasityhub_current_user');
    if (savedUser) {
      try {
        currentUser = JSON.parse(savedUser);
      } catch (e) {
        console.error('Failed to restore user session');
      }
    }
  }
  return currentUser;
};

export const updateStudentProfile = (updates: Partial<StudentProfile>) => {
  const user = getCurrentUser();
  if (user && user.role === 'student') {
    currentStudentProfile = { ...currentStudentProfile, ...updates };
    studentProfiles[user.id] = currentStudentProfile;
    saveStudentProfilesToStorage();
  }
};

export const getStudentProfile = (): StudentProfile => {
  const user = getCurrentUser();
  if (user && user.role === 'student') {
    // Get profile for current user
    if (studentProfiles[user.id]) {
      currentStudentProfile = studentProfiles[user.id];
    } else {
      // Create new profile if doesn't exist
      const newProfile: StudentProfile = {
        id: user.id,
        name: user.name,
        email: user.email,
        saId: '', // Will need to be set during registration
        studentType: 'south_african',
        passportNumber: '',
        countryOfCitizenship: 'South Africa',
        visaStatus: '',
        medicalCoverStatus: '',
        saqaStatus: '',
        usafExemptionStatus: '',
        grade11APS: undefined,
        grade12APS: undefined,
        finalAPS: undefined,
        universityAPS: [],
        subjects: undefined,
        careerTestCompleted: false,
        careerProfile: undefined,
        applications: [],
        documents: [],
        payments: [],
        premiumServices: []
      };
      studentProfiles[user.id] = newProfile;
      currentStudentProfile = newProfile;
      saveStudentProfilesToStorage();
    }
  }
  return currentStudentProfile;
};

export const calculateAPS = (subjects: { subject: string; mark: number }[]): number => {
  const apsMapping: { [key: number]: number } = {
    80: 7, 70: 6, 60: 5, 50: 4, 40: 3, 30: 2, 0: 1
  };

  let totalAPS = 0;
  subjects.forEach(({ mark }) => {
    for (let threshold of [80, 70, 60, 50, 40, 30, 0]) {
      if (mark >= threshold) {
        totalAPS += apsMapping[threshold];
        break;
      }
    }
  });

  return totalAPS;
};

// Calculate university-specific APS based on their rules
export const calculateUniversitySpecificAPS = (
  subjects: { subject: string; mark: number }[],
  universityId: string,
  nbtScore?: number
): number => {
  const university = universities.find(u => u.id === universityId);
  if (!university) return 0;

  const rule = university.apsCalculationRule;
  const apsMapping: { [key: number]: number } = {
    80: 7, 70: 6, 60: 5, 50: 4, 40: 3, 30: 2, 0: 1
  };

  // Filter subjects based on university rules
  let subjectsToUse = [...subjects];

  // Remove Life Orientation if not included
  if (!rule.includeLifeOrientation) {
    subjectsToUse = subjectsToUse.filter(s =>
      !s.subject.toLowerCase().includes('life orientation') &&
      !s.subject.toLowerCase().includes('lo')
    );
  }

  // Sort by marks (descending) and take required number of subjects
  subjectsToUse.sort((a, b) => b.mark - a.mark);
  subjectsToUse = subjectsToUse.slice(0, rule.subjectCount);

  // Calculate APS
  let totalAPS = 0;
  subjectsToUse.forEach(({ mark }) => {
    for (let threshold of [80, 70, 60, 50, 40, 30, 0]) {
      if (mark >= threshold) {
        totalAPS += apsMapping[threshold];
        break;
      }
    }
  });

  // For UCT: Convert to their 600-point scale
  if (rule.useWeighting && universityId === 'uct') {
    // UCT Score = (APS for 6 subjects * 10) + NBT
    totalAPS = (totalAPS * 10);
    if (rule.requiresNBT && nbtScore) {
      totalAPS += nbtScore;
    }
  }

  return totalAPS;
};

// Calculate all university-specific APS scores for a student
export const calculateAllUniversityAPS = (
  subjects: { subject: string; mark: number }[],
  nbtScore?: number
): UniversityAPSScore[] => {
  return universities.map(uni => ({
    universityId: uni.id,
    universityName: uni.name,
    apsScore: calculateUniversitySpecificAPS(subjects, uni.id, nbtScore),
    calculationMethod: uni.apsCalculationRule.calculationMethod
  }));
};

export const getRecommendations = (aps: number, careerProfile?: CareerProfile): Recommendation[] => {
  const recommendations: Recommendation[] = [];

  // Course recommendations based on APS
  const eligibleCourses = courses.filter(c => c.apsRequired <= aps);

  eligibleCourses.slice(0, 5).forEach(course => {
    const diff = aps - course.apsRequired;
    const matchScore: 'high' | 'medium' | 'low' = diff >= 5 ? 'high' : diff >= 2 ? 'medium' : 'low';
    recommendations.push({
      type: 'course',
      item: course,
      matchScore,
      reason: `Your APS of ${aps} ${matchScore === 'high' ? 'exceeds' : 'meets'} the requirement`
    });
  });

  // University recommendations
  const topUniversities = universities.slice(0, 3);
  topUniversities.forEach(uni => {
    recommendations.push({
      type: 'university',
      item: uni,
      matchScore: 'high',
      reason: 'Top-ranked institution with programs matching your profile'
    });
  });

  // Career recommendations based on career test
  if (careerProfile) {
    careerProfile.suggestedCareers.forEach(career => {
      recommendations.push({
        type: 'career',
        item: career,
        matchScore: 'high',
        reason: 'Aligns with your interests and personality type'
      });
    });
  }

  return recommendations;
};

// Payment and billing functions

export const createPayment = (applicationId: string, method: 'card' | 'eft'): Payment => {
  const user = getCurrentUser();
  const profile = getStudentProfile();

  const payment: Payment = {
    id: `payment-${Date.now()}`,
    applicationId,
    studentId: user?.id || '',
    studentSaId: profile.saId,
    amount: APPLICATION_FEE,
    method,
    status: 'pending',
    createdDate: new Date().toISOString()
  };

  payments.push(payment);
  return payment;
};

export const processPayment = (paymentId: string, success: boolean): void => {
  const payment = payments.find(p => p.id === paymentId);
  if (payment) {
    payment.status = success ? 'paid' : 'failed';
    if (success) {
      payment.paidDate = new Date().toISOString();
    }

    // Update student profile
    const profile = getStudentProfile();
    const existingPaymentIndex = profile.payments.findIndex(p => p.id === paymentId);
    if (existingPaymentIndex >= 0) {
      profile.payments[existingPaymentIndex] = payment;
    } else {
      profile.payments.push(payment);
    }

    updateStudentProfile({ payments: profile.payments });
  }
};

export const getPaymentByApplicationId = (applicationId: string): Payment | undefined => {
  return payments.find(p => p.applicationId === applicationId);
};

export const getUniversityBillings = (): UniversityBilling[] => {
  return universityBillings;
};

export const markBillingAsPaid = (billingId: string): void => {
  const billing = universityBillings.find(b => b.id === billingId);
  if (billing) {
    billing.paymentStatus = 'paid';
    billing.paidDate = new Date().toISOString();
  }
};

export const generateInvoiceNumber = (): string => {
  const year = new Date().getFullYear();
  const count = universityBillings.length + 1;
  return `INV-${year}-${String(count).padStart(3, '0')}`;
};

export const purchasePremiumService = (serviceId: string): { success: boolean; message: string } => {
  const service = premiumServices.find(s => s.id === serviceId);
  if (!service) {
    return { success: false, message: 'Service not found' };
  }

  const user = getCurrentUser();
  const profile = getStudentProfile();

  const purchase: StudentPremiumPurchase = {
    id: `premium-${Date.now()}`,
    studentId: user?.id || '',
    serviceId: service.id,
    serviceName: service.name,
    amount: service.price,
    purchaseDate: new Date().toISOString(),
    status: 'active'
  };

  const updatedPremiumServices = [...profile.premiumServices, purchase];
  updateStudentProfile({ premiumServices: updatedPremiumServices });

  return { success: true, message: 'Premium service purchased successfully' };
};

export const getRevenueAnalytics = () => {
  const totalStudentPayments = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalUniversityBilling = universityBillings
    .filter(b => b.paymentStatus === 'paid')
    .reduce((sum, b) => sum + b.amountOwed, 0);

  const pendingUniversityBilling = universityBillings
    .filter(b => b.paymentStatus === 'pending')
    .reduce((sum, b) => sum + b.amountOwed, 0);

  const totalPremiumRevenue = Object.values(studentProfiles)
    .flatMap(p => p.premiumServices)
    .reduce((sum, s) => sum + s.amount, 0);

  const totalRefunds = payments
    .filter(p => p.status === 'refunded')
    .reduce((sum, p) => sum + p.amount, 0);

  return {
    totalRevenue: totalStudentPayments + totalUniversityBilling + totalPremiumRevenue - totalRefunds,
    studentPayments: totalStudentPayments,
    universityBilling: totalUniversityBilling,
    premiumRevenue: totalPremiumRevenue,
    pendingBilling: pendingUniversityBilling,
    totalApplications: payments.length,
    paidApplications: payments.filter(p => p.status === 'paid').length,
    totalRefunds,
    refundedPayments: payments.filter(p => p.status === 'refunded').length
  };
};

// Refund management functions
export const requestRefund = (paymentId: string, reason: string): { success: boolean; message: string } => {
  const payment = payments.find(p => p.id === paymentId);
  if (!payment) {
    return { success: false, message: 'Payment not found' };
  }

  if (payment.status !== 'paid') {
    return { success: false, message: 'Only paid payments can be refunded' };
  }

  payment.refundStatus = 'requested';
  payment.refundReason = reason;

  return { success: true, message: 'Refund requested successfully' };
};

export const approveRefund = (paymentId: string): { success: boolean; message: string } => {
  const payment = payments.find(p => p.id === paymentId);
  if (!payment) {
    return { success: false, message: 'Payment not found' };
  }

  if (payment.refundStatus !== 'requested') {
    return { success: false, message: 'Refund must be requested first' };
  }

  payment.refundStatus = 'approved';
  return { success: true, message: 'Refund approved' };
};

export const processRefund = (paymentId: string): { success: boolean; message: string } => {
  const payment = payments.find(p => p.id === paymentId);
  if (!payment) {
    return { success: false, message: 'Payment not found' };
  }

  if (payment.refundStatus !== 'approved') {
    return { success: false, message: 'Refund must be approved first' };
  }

  payment.status = 'refunded';
  payment.refundStatus = 'refunded';
  payment.refundDate = new Date().toISOString();

  // Update student profile
  const profile = Object.values(studentProfiles).find(p => p.id === payment.studentId);
  if (profile) {
    const paymentIndex = profile.payments.findIndex(p => p.id === paymentId);
    if (paymentIndex >= 0) {
      profile.payments[paymentIndex] = payment;
    }
  }

  return { success: true, message: 'Refund processed successfully' };
};

export const generateReceipt = (paymentId: string): PaymentReceipt | null => {
  const payment = payments.find(p => p.id === paymentId);
  if (!payment || payment.status !== 'paid') return null;

  const profile = Object.values(studentProfiles).find(p => p.id === payment.studentId);
  if (!profile) return null;

  const application = profile.applications.find(a => a.id === payment.applicationId);
  if (!application) return null;

  return {
    id: `receipt-${payment.id}`,
    paymentId: payment.id,
    studentName: profile.name,
    studentSaId: profile.saId,
    courseName: application.courseName,
    university: application.university,
    amount: payment.amount,
    paymentDate: payment.paidDate || payment.createdDate,
    referenceNumber: payment.referenceNumber || payment.id,
    paymentMethod: payment.method.toUpperCase()
  };
};

export const getAllPayments = () => payments;
