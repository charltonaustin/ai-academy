# Bonus Module: Google OAuth Integration

## Prerequisites

**✅ Required before starting:**

- JWT authentication complete (Day 3)
- User model with passwordHash exists
- Login/register functionality working
- Comfortable with backend authentication patterns

**If missing prerequisites:** Complete JWT authentication first (Day 3 required feature).

---

## What You'll Build

**A "Sign in with Google" authentication flow:**

- **Google OAuth button** on login page
- **OAuth 2.0 flow** (redirect to Google → callback → JWT token)
- **Account linking** (existing users can link Google account)
- **New user creation** (first-time Google users auto-registered)
- **Environment-specific redirect URIs** (dev vs production)

**User experience:**

1. User clicks "Sign in with Google"
2. Redirects to Google consent screen
3. User approves access
4. Google redirects back to your app with code
5. Backend exchanges code for Google profile
6. Backend generates JWT token (same as password login)
7. User is logged in

---

## Implementation Guide

### Phase 1: Google Cloud Console Setup (30 minutes)

**Create Google OAuth credentials:**

1. **Go to Google Cloud Console:**

    - Visit: https://console.cloud.google.com/
    - Create new project (or use existing)

2. **Enable Google+ API:**

    - APIs & Services → Library
    - Search "Google+ API"
    - Click "Enable"

3. **Create OAuth credentials:**

    - APIs & Services → Credentials
    - Click "Create Credentials" → "OAuth client ID"
    - Application type: "Web application"
    - Name: "CRM OAuth Client"

4. **Configure authorized redirect URIs:**

   ```
   Development:
   http://localhost:3000/api/auth/google/callback

   Production (if deploying):
   https://your-domain.com/api/auth/google/callback
   ```

5. **Save credentials:**
    - Copy "Client ID"
    - Copy "Client Secret"
    - Store in `.env` file

**Environment variables to add:**

```bash
# .env file
GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
```

**Add to `.env.example`:**

```bash
# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
```

---

### Phase 2: Backend Implementation

#### Install dependencies:

```bash
cd ~/ai-academy-<your-name>/backend
npm install passport-google-oauth20
npm install -D @types/passport-google-oauth20
```

#### Update User model (add Google fields):

**File:** `backend/src/users/entities/user.entity.ts`

```typescript
@Column({ nullable: true })
googleId?: string;

@Column({ nullable: true })
googleEmail?: string;

@Column({ nullable: true })
googleProfilePicture?: string;
```

**Run migration to add fields to database.**

---

#### Create Google strategy:

**File:** `backend/src/auth/strategies/google.strategy.ts`

```typescript
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from "passport-google-oauth20";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "../auth.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(
    private configService: ConfigService,
    private authService: AuthService
  ) {
    super({
      clientID: configService.get<string>("GOOGLE_CLIENT_ID"),
      clientSecret: configService.get<string>("GOOGLE_CLIENT_SECRET"),
      callbackURL: configService.get<string>("GOOGLE_CALLBACK_URL"),
      scope: ["email", "profile"],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile
  ): Promise<any> {
    const { id, emails, photos, displayName } = profile;

    const email = emails?.[0]?.value;
    const profilePicture = photos?.[0]?.value;

    // Find or create user
    const user = await this.authService.validateGoogleUser({
      googleId: id,
      email,
      googleEmail: email,
      googleProfilePicture: profilePicture,
      name: displayName,
    });

    return user;
  }
}
```

---

#### Update AuthService (add Google validation):

**File:** `backend/src/auth/auth.service.ts`

Add method:

```typescript
async validateGoogleUser(googleUser: {
  googleId: string;
  email: string;
  googleEmail: string;
  googleProfilePicture?: string;
  name: string;
}): Promise<User> {
  // Check if user exists by Google ID
  let user = await this.usersService.findByGoogleId(googleUser.googleId);

  if (user) {
    // User exists, update Google info
    return user;
  }

  // Check if user exists by email (account linking)
  user = await this.usersService.findByEmail(googleUser.email);

  if (user) {
    // Link Google account to existing user
    return this.usersService.linkGoogleAccount(user.id, {
      googleId: googleUser.googleId,
      googleEmail: googleUser.googleEmail,
      googleProfilePicture: googleUser.googleProfilePicture,
    });
  }

  // Create new user
  return this.usersService.createGoogleUser(googleUser);
}
```

---

#### Update UsersService (add Google methods):

**File:** `backend/src/users/users.service.ts`

Add methods:

```typescript
async findByGoogleId(googleId: string): Promise<User | null> {
  return this.userRepository.findOne({
    where: { googleId },
  });
}

async linkGoogleAccount(
  userId: string,
  googleData: {
    googleId: string;
    googleEmail: string;
    googleProfilePicture?: string;
  },
): Promise<User> {
  await this.userRepository.update(userId, googleData);
  return this.findById(userId);
}

async createGoogleUser(googleUser: {
  googleId: string;
  email: string;
  googleEmail: string;
  googleProfilePicture?: string;
  name: string;
}): Promise<User> {
  const user = this.userRepository.create({
    email: googleUser.email,
    googleId: googleUser.googleId,
    googleEmail: googleUser.googleEmail,
    googleProfilePicture: googleUser.googleProfilePicture,
    // No password hash - Google-only user
  });

  return this.userRepository.save(user);
}
```

---

#### Create OAuth controller:

**File:** `backend/src/auth/auth.controller.ts`

Add routes:

```typescript
import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Response } from "express";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get("google")
  @UseGuards(AuthGuard("google"))
  googleAuth() {
    // Initiates Google OAuth flow
  }

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    // User is attached to req.user by GoogleStrategy
    const user = req.user;

    // Generate JWT token
    const token = this.authService.generateJwtToken(user);

    // Redirect to frontend with token
    res.redirect(`http://localhost:3001/auth/callback?token=${token}`);
  }
}
```

---

#### Register Google strategy in AuthModule:

**File:** `backend/src/auth/auth.module.ts`

```typescript
import { GoogleStrategy } from "./strategies/google.strategy";

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "7d" },
    }),
    ConfigModule,
  ],
  providers: [AuthService, JwtStrategy, GoogleStrategy], // Add GoogleStrategy
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
```

---

### Phase 3: Frontend Implementation (30-45 minutes)

#### Add Google OAuth button to login page:

**File:** `frontend/src/app/pages/login/login.component.ts`

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
})
export class LoginComponent {
  handleGoogleLogin(): void {
    // Redirect to backend Google OAuth route
    window.location.href = 'http://localhost:3000/api/auth/google';
  }
}
```

**File:** `frontend/src/app/pages/login/login.component.html`

```html
<h1>Login</h1>

<!-- Existing email/password form -->
<form (ngSubmit)="handleSubmit()"><!-- ... existing fields ... --></form>

<div style="margin: 20px 0; text-align: center;">
  <p>-- OR --</p>
</div>

<!-- Google OAuth button -->
<button
  type="button"
  (click)="handleGoogleLogin()"
  style="width:100%; padding:12px; background:#4285F4; color:white;
         border:none; border-radius:4px; cursor:pointer; font-size:16px;"
>
  Sign in with Google
</button>
```

---

#### Create OAuth callback handler:

**File:** `frontend/src/app/pages/auth-callback/auth-callback.component.ts`

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  template: '<p>Completing sign in...</p>',
})
export class AuthCallbackComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (token) {
      // Store JWT token
      localStorage.setItem('authToken', token);

      // Redirect to dashboard
      this.router.navigate(['/dashboard']);
    } else {
      // Error case
      this.router.navigate(['/login'], { queryParams: { error: 'oauth_failed' } });
    }
  }
}
```

---

#### Add route for callback page:

**File:** `frontend/src/app/app.routes.ts`

```typescript
import { Routes } from '@angular/router';
import { AuthCallbackComponent } from './pages/auth-callback/auth-callback.component';

export const routes: Routes = [
  // ... existing routes ...
  { path: 'auth/callback', component: AuthCallbackComponent },
];
```

---

### Phase 4: Testing (30 minutes)

#### Manual testing flow:

1. **Start backend and frontend:**

   ```bash
   # Terminal 1 (backend)
   cd ~/ai-academy-<your-name>/backend
   npm run start:dev

   # Terminal 2 (frontend)
   cd ~/ai-academy-<your-name>/frontend
   npm start
   ```

2. **Test Google OAuth flow:**

    - Navigate to `http://localhost:3001/login`
    - Click "Sign in with Google"
    - Should redirect to Google consent screen
    - Approve access
    - Should redirect back to your app
    - Should be logged in and see dashboard

3. **Test account linking:**

    - Create account with email/password
    - Log out
    - Click "Sign in with Google" (use same email)
    - Should link Google account to existing user

4. **Test new user creation:**
    - Use Google account that doesn't exist in system
    - Should create new user automatically

---

#### Automated testing:

**Test Google strategy validation:**

**File:** `backend/src/auth/strategies/google.strategy.spec.ts`

```typescript
import { Test } from "@nestjs/testing";
import { GoogleStrategy } from "./google.strategy";
import { AuthService } from "../auth.service";
import { ConfigService } from "@nestjs/config";

describe("GoogleStrategy", () => {
  let strategy: GoogleStrategy;
  let authService: AuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GoogleStrategy,
        {
          provide: AuthService,
          useValue: {
            validateGoogleUser: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config = {
                GOOGLE_CLIENT_ID: "test-client-id",
                GOOGLE_CLIENT_SECRET: "test-secret",
                GOOGLE_CALLBACK_URL:
                  "http://localhost:3000/api/auth/google/callback",
              };
              return config[key];
            }),
          },
        },
      ],
    }).compile();

    strategy = module.get<GoogleStrategy>(GoogleStrategy);
    authService = module.get<AuthService>(AuthService);
  });

  it("should validate Google user", async () => {
    const mockProfile = {
      id: "google-123",
      emails: [{ value: "user@example.com" }],
      photos: [{ value: "https://photo.url" }],
      displayName: "Test User",
    };

    const mockUser = { id: "1", email: "user@example.com" };
    jest.spyOn(authService, "validateGoogleUser").mockResolvedValue(mockUser);

    const result = await strategy.validate(
      "access-token",
      "refresh-token",
      mockProfile as any
    );

    expect(authService.validateGoogleUser).toHaveBeenCalledWith({
      googleId: "google-123",
      email: "user@example.com",
      googleEmail: "user@example.com",
      googleProfilePicture: "https://photo.url",
      name: "Test User",
    });
    expect(result).toEqual(mockUser);
  });
});
```

---

### Phase 5: Run Validation Gates (15 minutes)

```bash
cd ~/ai-academy-<your-name>

# TypeScript validation
npm run type-check

# Linting
npm run lint

# Tests
npm test

# Check for hanging processes
ps aux | grep node

# Browser testing
# Manual test: Google OAuth flow works
```

---

## Technical Considerations

### Security

**Environment variables:**

- Never commit `GOOGLE_CLIENT_SECRET` to git
- Use different OAuth credentials for dev vs production
- Keep `.env` in `.gitignore`

**Token handling:**

- Use same JWT token strategy as password auth
- Set appropriate token expiration (7 days recommended)
- Validate tokens on every protected route

**Account linking:**

- Match by email to link Google account to existing user
- Prevent email conflicts (one email = one user)

---

### User Experience

**Loading states:**

- Show "Completing sign in..." on callback page
- Handle errors gracefully (show message on login page)

**Error handling:**

- OAuth cancelled by user → redirect to login with message
- Invalid credentials → log error, redirect to login
- Network errors → show retry option

**Profile pictures:**

- Store Google profile picture URL
- Display in user menu (nice visual indicator)
- Optional: Download and store locally

---

### Multi-Environment Setup

**Development:**

```bash
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
```

**Production:**

```bash
GOOGLE_CALLBACK_URL=https://your-domain.com/api/auth/google/callback
```

**Update Google Cloud Console:**

- Add production redirect URI
- Keep development URI for local testing

---

## Expected Outcomes

**After completing this module:**

- ✅ "Sign in with Google" button on login page
- ✅ OAuth 2.0 flow working (redirect → consent → callback)
- ✅ New users created automatically from Google profile
- ✅ Existing users can link Google account
- ✅ JWT token generated (same auth flow as password)
- ✅ All validation gates passing
- ✅ Browser tested and working

**Skills learned:**

- OAuth 2.0 flows
- Passport.js strategies
- External service integration
- Environment-specific configuration
- Account linking patterns

**Transferable to company work:**

- OAuth integration (Google, GitHub, Microsoft)
- Third-party authentication
- Account management
- Secure credential handling

---

## Troubleshooting

**"Redirect URI mismatch" error:**

- Check Google Cloud Console authorized redirect URIs
- Ensure exact match: `http://localhost:3000/api/auth/google/callback`
- No trailing slash
- Correct protocol (http vs https)

**User not redirected after Google consent:**

- Check backend `/auth/google/callback` route exists
- Verify `GOOGLE_CALLBACK_URL` in `.env`
- Check browser console for errors

**Token not stored in localStorage:**

- Verify callback page (`/auth/callback`) extracts token from URL
- Check `localStorage.setItem('authToken', token)` executes
- Test with browser dev tools (Application → Local Storage)

**Existing user not linked:**

- Verify `findByEmail` method in UsersService
- Check `linkGoogleAccount` updates user record
- Test with user that has same email as Google account

---

**✅ Bonus Module: Google OAuth**

**Back to:** [Bonus Modules Overview](README.md)
