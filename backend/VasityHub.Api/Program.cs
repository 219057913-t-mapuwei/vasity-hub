using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using VasityHub.Api;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy => policy
        .WithOrigins("http://localhost:5173", "https://vasity-hub.netlify.app")
        .AllowAnyHeader()
        .AllowAnyMethod());
});

var jwtKey = builder.Configuration["Jwt:Key"]!;
var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = key
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
    DbSeeder.Seed(db);
}

app.MapGet("/api/health", () => Results.Ok(new { status = "ok", name = "Vasity Hub API" }));

app.MapPost("/api/auth/register-student", async (RegisterStudentRequest req, AppDbContext db) =>
{
    if (await db.Users.AnyAsync(u => u.Email == req.Email)) return Results.BadRequest("Email already exists");
    var role = await db.Roles.SingleAsync(r => r.Name == "Student");
    var user = new AppUser { Email = req.Email, PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password), RoleId = role.Id, FullName = req.FullName, IsActive = true };
    db.Users.Add(user); await db.SaveChangesAsync();
    db.Students.Add(new Student { AppUserId = user.Id, FullName = req.FullName, IsForeignStudent = req.IsForeignStudent, SaIdNumber = req.SaIdNumber, PassportNumber = req.PassportNumber });
    await db.SaveChangesAsync();
    return Results.Ok(new { message = "Student registered", user.Id });
});

app.MapPost("/api/auth/login", async (LoginRequest req, AppDbContext db, IConfiguration config) =>
{
    var user = await db.Users.Include(u => u.Role).SingleOrDefaultAsync(u => u.Email == req.Email && u.IsActive);
    if (user is null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash)) return Results.Unauthorized();
    var claims = new[] { new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()), new Claim(ClaimTypes.Email, user.Email), new Claim(ClaimTypes.Role, user.Role.Name), new Claim("fullName", user.FullName) };
    var creds = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!)), SecurityAlgorithms.HmacSha256);
    var token = new JwtSecurityToken(config["Jwt:Issuer"], config["Jwt:Audience"], claims, expires: DateTime.UtcNow.AddHours(8), signingCredentials: creds);
    return Results.Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token), role = user.Role.Name, user.FullName });
});

app.MapPost("/api/super-admin/staff", async (CreateStaffRequest req, AppDbContext db) =>
{
    var allowed = new[] { "Admin", "UniversityStaff", "SupportStaff" };
    if (!allowed.Contains(req.RoleName)) return Results.BadRequest("Only Admin, UniversityStaff and SupportStaff can be created here.");
    if (await db.Users.AnyAsync(u => u.Email == req.Email)) return Results.BadRequest("Email already exists");
    var role = await db.Roles.SingleAsync(r => r.Name == req.RoleName);
    var user = new AppUser { Email = req.Email, PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password), FullName = req.FullName, RoleId = role.Id, CreatedByUserId = req.CreatedByUserId, IsActive = true };
    db.Users.Add(user); await db.SaveChangesAsync();
    return Results.Ok(new { message = "Staff user created by Super Admin", user.Id });
});

app.MapGet("/api/universities", async (AppDbContext db) => await db.Universities.Include(u => u.Courses).ToListAsync());
app.MapGet("/api/courses", async (AppDbContext db) => await db.Courses.Include(c => c.University).ToListAsync());
app.MapPost("/api/applications", async (CreateApplicationRequest req, AppDbContext db) =>
{
    var appEntity = new Application { StudentId = req.StudentId, CourseId = req.CourseId, Status = "Submitted", SubmittedAt = DateTime.UtcNow, PaymentStatus = "Pending" };
    db.Applications.Add(appEntity); await db.SaveChangesAsync();
    return Results.Ok(appEntity);
});
app.MapGet("/api/applications", async (AppDbContext db) => await db.Applications.Include(a => a.Student).Include(a => a.Course).ThenInclude(c => c.University).ToListAsync());
app.MapPut("/api/applications/{id:int}/status", async (int id, UpdateApplicationStatusRequest req, AppDbContext db) =>
{
    var entity = await db.Applications.FindAsync(id);
    if (entity is null) return Results.NotFound();
    entity.Status = req.Status; entity.UpdatedAt = DateTime.UtcNow; await db.SaveChangesAsync();
    return Results.Ok(entity);
});
app.MapPost("/api/students/{studentId:int}/foreign-profile", async (int studentId, ForeignStudentProfile req, AppDbContext db) =>
{
    req.StudentId = studentId; db.ForeignStudentProfiles.Add(req); await db.SaveChangesAsync(); return Results.Ok(req);
});

app.Run();
