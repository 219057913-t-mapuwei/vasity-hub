using Microsoft.EntityFrameworkCore;
namespace VasityHub.Api;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<UserRole> Roles => Set<UserRole>();
    public DbSet<AppUser> Users => Set<AppUser>();
    public DbSet<Student> Students => Set<Student>();
    public DbSet<ForeignStudentProfile> ForeignStudentProfiles => Set<ForeignStudentProfile>();
    public DbSet<University> Universities => Set<University>();
    public DbSet<Course> Courses => Set<Course>();
    public DbSet<Application> Applications => Set<Application>();
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AppUser>().HasIndex(x => x.Email).IsUnique();
        modelBuilder.Entity<UserRole>().HasIndex(x => x.Name).IsUnique();
    }
}
public class UserRole { public int Id { get; set; } public string Name { get; set; } = ""; }
public class AppUser { public int Id { get; set; } public string Email { get; set; } = ""; public string PasswordHash { get; set; } = ""; public string FullName { get; set; } = ""; public int RoleId { get; set; } public UserRole Role { get; set; } = null!; public bool IsActive { get; set; } = true; public int? CreatedByUserId { get; set; } public DateTime CreatedAt { get; set; } = DateTime.UtcNow; }
public class Student { public int Id { get; set; } public int AppUserId { get; set; } public AppUser AppUser { get; set; } = null!; public string FullName { get; set; } = ""; public string? SaIdNumber { get; set; } public string? PassportNumber { get; set; } public bool IsForeignStudent { get; set; } public int? FinalAps { get; set; } }
public class ForeignStudentProfile { public int Id { get; set; } public int StudentId { get; set; } public string? CountryOfCitizenship { get; set; } public string? CountryOfResidence { get; set; } public string? VisaStatus { get; set; } public string? StudyPermitStatus { get; set; } public string? MedicalCoverStatus { get; set; } public string? QualificationCountry { get; set; } public string? QualificationType { get; set; } public string? SaqaStatus { get; set; } public string? UsafExemptionStatus { get; set; } public string? EnglishProficiencyStatus { get; set; } public bool TranslationRequired { get; set; } }
public class University { public int Id { get; set; } public string Name { get; set; } = ""; public string Province { get; set; } = ""; public string WebsiteUrl { get; set; } = ""; public List<Course> Courses { get; set; } = new(); }
public class Course { public int Id { get; set; } public int UniversityId { get; set; } public University University { get; set; } = null!; public string Name { get; set; } = ""; public string Faculty { get; set; } = ""; public int MinimumAps { get; set; } public string Duration { get; set; } = ""; public decimal ApplicationFee { get; set; } public DateTime ClosingDate { get; set; } }
public class Application { public int Id { get; set; } public int StudentId { get; set; } public Student Student { get; set; } = null!; public int CourseId { get; set; } public Course Course { get; set; } = null!; public string Status { get; set; } = "Draft"; public string PaymentStatus { get; set; } = "Pending"; public DateTime SubmittedAt { get; set; } = DateTime.UtcNow; public DateTime UpdatedAt { get; set; } = DateTime.UtcNow; }
public record RegisterStudentRequest(string FullName, string Email, string Password, bool IsForeignStudent, string? SaIdNumber, string? PassportNumber);
public record LoginRequest(string Email, string Password);
public record CreateStaffRequest(string FullName, string Email, string Password, string RoleName, int? CreatedByUserId);
public record CreateApplicationRequest(int StudentId, int CourseId);
public record UpdateApplicationStatusRequest(string Status);
public static class DbSeeder
{
    public static void Seed(AppDbContext db)
    {
        if (!db.Roles.Any()) { db.Roles.AddRange(new UserRole{Name="SuperAdmin"}, new UserRole{Name="Admin"}, new UserRole{Name="UniversityStaff"}, new UserRole{Name="SupportStaff"}, new UserRole{Name="Student"}); db.SaveChanges(); }
        if (!db.Users.Any(u=>u.Email=="superadmin@vasityhub.co.za")) { var role=db.Roles.Single(r=>r.Name=="SuperAdmin"); db.Users.Add(new AppUser{Email="superadmin@vasityhub.co.za", FullName="Vasity Hub Super Admin", PasswordHash=BCrypt.Net.BCrypt.HashPassword("ChangeMe@12345"), RoleId=role.Id}); db.SaveChanges(); }
        if (!db.Universities.Any()) { var uct=new University{Name="University of Cape Town",Province="Western Cape",WebsiteUrl="https://www.uct.ac.za"}; var wits=new University{Name="University of the Witwatersrand",Province="Gauteng",WebsiteUrl="https://www.wits.ac.za"}; db.Universities.AddRange(uct,wits); db.SaveChanges(); db.Courses.AddRange(new Course{UniversityId=uct.Id,Name="Bachelor of Commerce",Faculty="Commerce",MinimumAps=36,Duration="3 years",ApplicationFee=100,ClosingDate=new DateTime(2026,9,30)}, new Course{UniversityId=wits.Id,Name="Bachelor of Science in Computer Science",Faculty="Science",MinimumAps=42,Duration="3 years",ApplicationFee=100,ClosingDate=new DateTime(2026,9,30)}); db.SaveChanges(); }
    }
}
