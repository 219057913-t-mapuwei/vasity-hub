import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/layouts/RootLayout";
import { LoginPage } from "./components/auth/LoginPage";
import { RegisterPage } from "./components/auth/RegisterPage";
import { LandingPage } from "./components/public/LandingPage";
import { ForeignStudentsPage } from "./components/public/ForeignStudentsPage";
import { StudentDashboard } from "./components/student/StudentDashboard";
import { Grade11Marks } from "./components/student/Grade11Marks";
import { CareerTest } from "./components/student/CareerTest";
import { CareerResults } from "./components/student/CareerResults";
import { Recommendations } from "./components/student/Recommendations";
import { UniversitySearch } from "./components/student/UniversitySearch";
import { ApplicationModule } from "./components/student/ApplicationModule";
import { DocumentUpload } from "./components/student/DocumentUpload";
import { ApplicationTracking } from "./components/student/ApplicationTracking";
import { PaymentPage } from "./components/student/PaymentPage";
import { PremiumServices } from "./components/student/PremiumServices";
import { UniversityDashboard } from "./components/university/UniversityDashboard";
import { ApplicantDetails } from "./components/university/ApplicantDetails";
import { CourseManagement } from "./components/university/CourseManagement";
import { DHEDashboard } from "./components/dhe/DHEDashboard";
import { BillingDashboard } from "./components/dhe/BillingDashboard";
import { FinancialReporting } from "./components/dhe/FinancialReporting";
import { RefundManagement } from "./components/dhe/RefundManagement";
import { CreateSuperAdmin } from "./components/dhe/CreateSuperAdmin";
import { SuperUniversityDashboard } from "./components/super-university/SuperUniversityDashboard";
import { CreateUniversityAdmin } from "./components/super-university/CreateUniversityAdmin";
import { SuperDoeDashboard } from "./components/super-doe/SuperDoeDashboard";
import { CreateDoeAdmin } from "./components/super-doe/CreateDoeAdmin";
import { DOEDashboard } from "./components/doe/DOEDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: LandingPage },
      { path: "login", Component: LoginPage },
      { path: "register", Component: RegisterPage },
      { path: "foreign-students", Component: ForeignStudentsPage },
      { path: "student/dashboard", Component: StudentDashboard },
      { path: "student/grades", Component: Grade11Marks },
      { path: "student/career-test", Component: CareerTest },
      { path: "student/career-results", Component: CareerResults },
      { path: "student/recommendations", Component: Recommendations },
      { path: "student/university-search", Component: UniversitySearch },
      { path: "student/apply", Component: ApplicationModule },
      { path: "student/payment", Component: PaymentPage },
      { path: "student/premium", Component: PremiumServices },
      { path: "student/documents", Component: DocumentUpload },
      { path: "student/applications", Component: ApplicationTracking },
      { path: "university/dashboard", Component: UniversityDashboard },
      { path: "university/applicant/:id", Component: ApplicantDetails },
      { path: "university/courses", Component: CourseManagement },
      { path: "dhe/dashboard", Component: DHEDashboard },
      { path: "dhe/billing", Component: BillingDashboard },
      { path: "dhe/financial-reports", Component: FinancialReporting },
      { path: "dhe/refunds", Component: RefundManagement },
      { path: "dhe/create-admin", Component: CreateSuperAdmin },
      { path: "super-university/dashboard", Component: SuperUniversityDashboard },
      { path: "super-university/create-admin", Component: CreateUniversityAdmin },
      { path: "super-doe/dashboard", Component: SuperDoeDashboard },
      { path: "super-doe/create-admin", Component: CreateDoeAdmin },
      { path: "doe/dashboard", Component: DOEDashboard },
    ],
  },
]);
