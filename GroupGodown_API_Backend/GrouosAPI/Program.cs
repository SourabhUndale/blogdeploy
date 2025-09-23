using GrouosAPI.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using GrouosAPI.Models;
using Microsoft.AspNetCore.OData;
using GrouosAPI.Controllers.Function;
using Microsoft.OData.ModelBuilder;
using Microsoft.OData.Edm;
using Microsoft.AspNetCore.ResponseCompression;
using GrouosAPI.Services;
using Microsoft.OpenApi.Models;
using GrouosAPI.Interface;
using GrouosAPI.Repository;

// EDM model for OData
static IEdmModel GetEdmModel()
{
    ODataConventionModelBuilder builder = new();
    var category = builder.EntitySet<Category>("Categories");
    category.EntityType.Filter().OrderBy().Page().Count();

    builder.EntitySet<Groups>("Groups")
           .EntityType.Collection.Action("Approve")
           .ReturnsFromEntitySet<Groups>("Groups");
    // builder.EntitySet<Groups>("Groups").HasRequired(g => g.Category);

    return builder.GetEdmModel();
}

var builder = WebApplication.CreateBuilder(args);

// Add Controllers + OData
builder.Services.AddControllers().AddOData(options =>
{
    options.AddRouteComponents("odata", GetEdmModel())
           .Select().Filter().OrderBy().Count().Expand().SetMaxTop(100);
});

builder.Services.AddEndpointsApiExplorer();

// Swagger + JWT Bearer setup
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "GLinks API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter Bearer [space] generated token",
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

// App-specific Repositories
builder.Services.AddScoped<GetGroups>();
builder.Services.AddScoped<IGroupRepository, GroupRepository>();
builder.Services.AddScoped<IAdminRepository, AdminRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IReportRepository, ReportRepository>();
builder.Services.AddScoped<IAppRepository, AppRepository>();
builder.Services.AddScoped<IBlogRepository, BlogRepository>();
builder.Services.AddScoped<SitemapService>();
builder.Services.AddHttpClient();
builder.Services.AddScoped<SearchEnginePingService>();

// Enable caching & helpers
builder.Services.AddMemoryCache();
builder.Services.AddHttpContextAccessor();

// Enable response compression (gzip / brotli)
builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
    options.Providers.Add<BrotliCompressionProvider>();
    options.Providers.Add<GzipCompressionProvider>();
});
builder.Services.Configure<BrotliCompressionProviderOptions>(o =>
    o.Level = System.IO.Compression.CompressionLevel.Fastest);
builder.Services.Configure<GzipCompressionProviderOptions>(o =>
    o.Level = System.IO.Compression.CompressionLevel.Fastest);

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", cors =>
        cors.WithOrigins(
                "http://localhost:5173",
                "http://localhost:5174",
                "http://93.127.166.134:5000",
                "http://93.127.166.134:5001",
                "https://groupgodown.com",
                "https://www.groupgodown.com",
                "https://admin.groupgodown.com",
                "https://www.admin.groupgodown.com",
                "http://groupgodown.com",
                "http://www.groupgodown.com",
                "http://admin.groupgodown.com",
                "http://www.admin.groupgodown.com",
                "https://group-godown-user-frontend.vercel.app",
                "https://group-godown-admin-frontend.vercel.app"
            )
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});

// JWT Authentication
var key = "lecture123456$$$jhgfjkdgfmhgkhjkfgjhgf";
builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(x =>
{
    x.RequireHttpsMetadata = false;
    x.SaveToken = true;
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(key)),
        ValidateIssuer = false,
        ValidateAudience = false,
    };
});

builder.Services.AddSingleton<JwtAuthenticationManager>(new JwtAuthenticationManager(key));

// Database
var connectionStringSql = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<DataContext>(options =>
{
    options.UseMySql(connectionStringSql, ServerVersion.AutoDetect(connectionStringSql));
});

var app = builder.Build();

// Dev: Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("CorsPolicy");

app.UseStaticFiles();            // ✅ Serve images from wwwroot/images
app.UseResponseCompression();    // ✅ Compress JSON responses
app.UseHttpsRedirection();

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
