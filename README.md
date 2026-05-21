# Vasity Hub Refined Full Solution

This version uses the refined **Student Application Platform UI/UX** upload as the frontend design source and renames the system to **Vasity Hub**.

## Stack

- React + Vite frontend
- ASP.NET Core Web API backend
- SQL Server / Azure SQL Free database
- GitHub repository
- Netlify frontend hosting
- Azure App Service backend hosting

## What is included

```text
vasity-hub-refined
├── frontend
│   └── vasity-hub-web
├── backend
│   └── VasityHub.Api
├── database
│   └── vasityhub-create-tables.sql
└── README.md
```

## Frontend pages included

The refined UI is a proper multi-page React application, not a one-pager.

### Auth
- Login
- Student registration
- South African student registration
- Foreign student registration

### Student
- Dashboard
- Grade 11 marks
- Career test
- Career results
- Recommendations
- University search
- Application module
- Application tracking
- Document upload
- Payment page
- Premium services

### University
- University dashboard
- Applicant details
- Course management

### Vasity Hub / Super Admin
- Super Admin dashboard
- Billing dashboard
- Financial reporting
- Refund management
- Create staff/admin access

### Education / support style modules
- Support/admin dashboards
- Create support/admin users

## Access control rule

Students can self-register.

Staff users cannot self-register. These are created through elevated admin access only:

- Admin
- University Staff
- Support Staff

Default Super Admin:

```text
Email: superadmin@vasityhub.co.za
Password: ChangeMe@12345
```

Other frontend demo users:

```text
Student: student@test.com / 1234
Vasity Hub Admin: admin@vasityhub.co.za / ChangeMe@12345
University Staff: university@vasityhub.co.za / ChangeMe@12345
Support Staff: support@vasityhub.co.za / ChangeMe@12345
```

## Foreign student support

Foreign students can register with:

- Passport number
- Country of citizenship
- Visa status
- Medical cover status
- SAQA status
- USAf exemption status

Foreign student document checklist includes:

- Passport copy
- Academic transcript
- Final school qualification
- SAQA / USAf evaluation
- Study visa / permit
- Medical cover proof
- Sworn translations where applicable
- Proof of payment

## Running from Downloads on Windows

First extract the ZIP.

### Run the backend

Open **Command Prompt**.

```cmd
cd %USERPROFILE%\Downloads\vasity-hub-refined\backend\VasityHub.Api
dotnet restore
dotnet build
dotnet run
```

Open Swagger using the localhost URL shown in the terminal, for example:

```text
https://localhost:7001/swagger
```

### Run the frontend

Open a second **Command Prompt** window.

```cmd
cd %USERPROFILE%\Downloads\vasity-hub-refined\frontend\vasity-hub-web
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## PowerShell npm issue

If PowerShell blocks `npm install` with an execution policy error, use **Command Prompt** instead of PowerShell.

Search Windows for:

```text
cmd
```

Then run the frontend commands from there.

## Azure SQL Free configuration

In Azure Portal:

1. Create Azure SQL Database.
2. Choose the free Azure SQL option if available on your subscription.
3. Database name: `VasityHubDb`
4. Enable firewall access for your current IP.
5. Enable Azure services to access the server.
6. Copy your connection string.

Update backend `appsettings.json` locally:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=tcp:YOUR_SERVER.database.windows.net,1433;Initial Catalog=VasityHubDb;Persist Security Info=False;User ID=YOUR_USER;Password=YOUR_PASSWORD;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"
  }
}
```

Do not push real passwords to GitHub.

## Deploy backend to Azure App Service

1. Create App Service.
2. Runtime: .NET 8.
3. Connect deployment to GitHub.
4. Set backend folder as the deploy source.
5. Add app settings:

```text
ConnectionStrings__DefaultConnection
Jwt__Key
Jwt__Issuer
Jwt__Audience
```

## Deploy frontend to Netlify

In Netlify:

```text
Base directory: frontend/vasity-hub-web
Build command: npm run build
Publish directory: dist
```

Add environment variable:

```text
VITE_API_URL=https://YOUR-AZURE-APP.azurewebsites.net/api
```

## Important notes

This is a strong demo/starter system. For production, still add:

- Real Azure Blob Storage file upload
- Email OTP / forgot password
- Payment gateway integration
- Stronger authorization on all API endpoints
- Proper audit logging on every staff action
- University staff assignment rules
- Final APS rules per university prospectus
