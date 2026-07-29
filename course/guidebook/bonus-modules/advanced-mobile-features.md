# Bonus Module: Advanced PWA Features

## Prerequisites

**✅ Required before starting:**

- PWA foundation complete (Day 4) - `@angular/pwa` added, service worker + manifest working
- Lead list and detail views working
- Angular + service worker basics understood
- Comfortable with Angular services, RxJS, and Angular `HttpClient`

**If missing prerequisites:** Complete the Day 4 PWA foundation first.

---

## What You'll Build

**Four advanced PWA features:**

1. **Offline Mode** - App works without internet, syncs when reconnected
2. **Web Push Notifications** - Alerts when the app is closed/backgrounded
3. **PWA CRUD Operations** - Create/edit leads, complete tasks - offline-aware
4. **Geolocation for Check-ins** - Log lead meetings with location

**Choose features based on interest and time:**

---

## Feature 1: Offline Mode with Data Sync (45-60 minutes)

### What You'll Build

**Offline-first architecture:**

- Local storage (IndexedDB) for cached data
- App works fully without internet
- Queue local changes (create/edit/delete)
- Sync to server when connection restored
- Conflict resolution (server wins)

> **Why IndexedDB and not the service worker cache?** Angular's service worker `dataGroups`
> cache **GET** requests, so read-only lead lists/details can be cached there directly. But we
> still need IndexedDB for the **offline write queue** — POST/PATCH/DELETE writes made while
> offline must be stored and replayed on reconnect, which the service worker cache can't do.

### Implementation Guide

#### Install dependencies:

```bash
cd ~/ai-academy-<your-name>/crm-frontend
npm install idb        # tiny IndexedDB wrapper with a promise API
```

#### Create offline storage service:

**File:** `crm-frontend/src/app/core/offline-storage.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface PendingChange {
  type: 'create' | 'update' | 'delete';
  data: any;
  timestamp: number;
}

interface CrmDB extends DBSchema {
  leads: { key: string; value: any };
  pendingChanges: { key: number; value: PendingChange };
}

@Injectable({ providedIn: 'root' })
export class OfflineStorageService {
  private dbPromise: Promise<IDBPDatabase<CrmDB>> = openDB<CrmDB>('crm', 1, {
    upgrade(db) {
      db.createObjectStore('leads', { keyPath: 'id' });
      db.createObjectStore('pendingChanges', { autoIncrement: true });
    },
  });

  /** Cache leads locally */
  async cacheLeads(leads: any[]): Promise<void> {
    const db = await this.dbPromise;
    const tx = db.transaction('leads', 'readwrite');
    await Promise.all(leads.map((lead) => tx.store.put(lead)));
    await tx.done;
  }

  /** Get cached leads */
  async getCachedLeads(): Promise<any[]> {
    const db = await this.dbPromise;
    return db.getAll('leads');
  }

  /** Queue a change for sync */
  async queueChange(change: Omit<PendingChange, 'timestamp'>): Promise<void> {
    const db = await this.dbPromise;
    await db.add('pendingChanges', { ...change, timestamp: Date.now() });
  }

  /** Get pending changes */
  async getPendingChanges(): Promise<PendingChange[]> {
    const db = await this.dbPromise;
    return db.getAll('pendingChanges');
  }

  /** Clear pending changes after sync */
  async clearPendingChanges(): Promise<void> {
    const db = await this.dbPromise;
    await db.clear('pendingChanges');
  }
}
```

---

#### Create network status service:

**File:** `crm-frontend/src/app/core/network-status.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { fromEvent, merge, map, startWith, shareReplay } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NetworkStatusService {
  /** Emits true when online, false when offline */
  readonly online$ = merge(
    fromEvent(window, 'online').pipe(map(() => true)),
    fromEvent(window, 'offline').pipe(map(() => false)),
  ).pipe(
    startWith(navigator.onLine),
    shareReplay({ bufferSize: 1, refCount: false }),
  );
}
```

---

#### Create sync service:

**File:** `crm-frontend/src/app/core/sync.service.ts`

```typescript
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { OfflineStorageService } from './offline-storage.service';
import { LeadsService } from '../api/leads.service';

@Injectable({ providedIn: 'root' })
export class SyncService {
  private leadsApi = inject(LeadsService);
  private storage = inject(OfflineStorageService);

  async syncPendingChanges(): Promise<{ synced: number }> {
    const changes = await this.storage.getPendingChanges();
    if (changes.length === 0) {
      return { synced: 0 };
    }

    let synced = 0;

    for (const change of changes) {
      try {
        if (change.type === 'create') {
          await firstValueFrom(this.leadsApi.createLead(change.data));
        } else if (change.type === 'update') {
          await firstValueFrom(this.leadsApi.updateLead(change.data.id, change.data));
        } else if (change.type === 'delete') {
          await firstValueFrom(this.leadsApi.deleteLead(change.data.id));
        }
        synced++;
      } catch (error) {
        console.error('Sync error:', error);
        // Continue with other changes
      }
    }

    // Clear pending changes after attempting sync
    await this.storage.clearPendingChanges();
    return { synced };
  }
}
```

---

#### Update the LeadList component to be offline-aware:

**File:** `crm-frontend/src/app/pages/lead-list/lead-list.component.ts`

```typescript
import { Component, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { OfflineStorageService } from '../../core/offline-storage.service';
import { NetworkStatusService } from '../../core/network-status.service';
import { SyncService } from '../../core/sync.service';
import { LeadsService } from '../../api/leads.service';

@Component({
  selector: 'app-lead-list',
  standalone: true,
  templateUrl: './lead-list.component.html',
})
export class LeadListComponent {
  private leadsApi = inject(LeadsService);
  private storage = inject(OfflineStorageService);
  private sync = inject(SyncService);
  private network = inject(NetworkStatusService);

  readonly isOnline = toSignal(this.network.online$, { initialValue: navigator.onLine });
  readonly leads = signal<any[]>([]);

  constructor() {
    this.network.online$.subscribe(async (online) => {
      if (online) {
        // Online: fetch fresh data (GET /leads), cache it, and flush the sync queue
        const leads = await firstValueFrom(this.leadsApi.getLeads());
        this.leads.set(leads);
        await this.storage.cacheLeads(leads);
        await this.sync.syncPendingChanges();
      } else {
        // Offline: load cached data
        this.leads.set(await this.storage.getCachedLeads());
      }
    });
  }
}
```

**File:** `crm-frontend/src/app/pages/lead-list/lead-list.component.html`

```html
@if (!isOnline()) {
  <div class="offline-banner">
    Offline Mode — changes will sync when you're back online
  </div>
}

@for (lead of leads(); track lead.id) {
  <!-- ... lead card ... -->
}
```

---

## Feature 2: Web Push Notifications (45-60 minutes)

### What You'll Build

**Push notifications when the app is closed:**

- New lead assigned to you
- Task due soon
- Lead status changed
- Integration with backend WebSocket notifications

> Angular exposes the Push API through `SwPush` (from `@angular/service-worker`). Web push
> uses **VAPID** keys instead of a native FCM/APNs push token.

### Implementation Guide

#### Generate VAPID keys (one-time):

```bash
# In the backend project
npx web-push generate-vapid-keys
# Store the public key in the frontend environment and the private key in backend secrets
```

#### Create the push service:

**File:** `crm-frontend/src/app/core/push-notification.service.ts`

```typescript
import { inject, Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PushNotificationService {
  private swPush = inject(SwPush);

  get isEnabled(): boolean {
    return this.swPush.isEnabled;
  }

  /** Ask the user for permission and subscribe to push */
  async subscribe(): Promise<PushSubscription | null> {
    if (!this.swPush.isEnabled) {
      console.log('Push notifications are not available (no service worker / unsupported)');
      return null;
    }

    try {
      const subscription = await this.swPush.requestSubscription({
        serverPublicKey: environment.vapidPublicKey,
      });
      // Send the subscription to the backend to associate with the user
      return subscription;
    } catch (error) {
      console.error('Could not subscribe to push notifications:', error);
      return null;
    }
  }

  /** Respond to notification clicks (e.g. navigate to a lead) */
  listenForClicks(onClick: (data: any) => void): void {
    this.swPush.notificationClicks.subscribe(({ notification }) => {
      onClick(notification.data);
    });
  }
}
```

---

#### Subscribe on app start:

**File:** `crm-frontend/src/app/app.component.ts`

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { PushNotificationService } from './core/push-notification.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
export class AppComponent implements OnInit {
  private push = inject(PushNotificationService);
  private router = inject(Router);

  async ngOnInit(): Promise<void> {
    const subscription = await this.push.subscribe();
    if (subscription) {
      console.log('Push subscription:', subscription.toJSON());
      // TODO: POST the subscription to the backend to associate with the user
    }

    // Navigate when the user taps a notification
    this.push.listenForClicks((data) => {
      if (data?.leadId) {
        this.router.navigate(['/leads', data.leadId]);
      }
    });
  }
}
```

---

#### Backend: send web push notifications (optional):

**File:** `backend/src/notifications/notifications.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import * as webPush from 'web-push';

@Injectable()
export class NotificationsService {
  constructor() {
    webPush.setVapidDetails(
      'mailto:you@example.com',
      process.env.VAPID_PUBLIC_KEY!,
      process.env.VAPID_PRIVATE_KEY!,
    );
  }

  async sendPushNotification(
    subscription: webPush.PushSubscription,
    title: string,
    body: string,
    data: Record<string, unknown> = {},
  ): Promise<void> {
    const payload = JSON.stringify({
      notification: {
        title,
        body,
        data,
        // vibration, icon, actions, etc.
      },
    });

    try {
      await webPush.sendNotification(subscription, payload);
    } catch (error) {
      console.error('Error sending push notification:', error);
    }
  }

  // Call this when creating notifications
  async notifyUser(userId: string, title: string, body: string): Promise<void> {
    // Get the user's stored push subscription from the database
    const user = await this.usersService.findById(userId);

    if (user.pushSubscription) {
      await this.sendPushNotification(user.pushSubscription, title, body, {
        userId,
      });
    }
  }
}
```

---

## Feature 3: PWA CRUD Operations (30-45 minutes)

### What You'll Build

**Full create/edit functionality, offline-aware:**

- Create new leads
- Edit existing leads
- Create/complete tasks
- Delete operations (queued when offline)

### Implementation Guide

#### Create a reactive form component:

**File:** `crm-frontend/src/app/components/lead-form/lead-form.component.ts`

```typescript
import { Component, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { firstValueFrom } from 'rxjs';
import { LeadsService } from '../../api/leads.service';
import { NetworkStatusService } from '../../core/network-status.service';
import { OfflineStorageService } from '../../core/offline-storage.service';

@Component({
  selector: 'app-lead-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './lead-form.component.html',
})
export class LeadFormComponent {
  private fb = inject(FormBuilder);
  private leadsApi = inject(LeadsService);
  private network = inject(NetworkStatusService);
  private storage = inject(OfflineStorageService);

  /** Pass a lead to edit; omit to create */
  readonly lead = input<any | undefined>();
  readonly complete = output<void>();

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    company: [''],
    budget: [0],
  });

  ngOnInit(): void {
    const lead = this.lead();
    if (lead) {
      this.form.patchValue(lead);
    }
  }

  async handleSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const input = this.form.getRawValue();
    const lead = this.lead();

    // Offline: queue the change for later sync
    if (!navigator.onLine) {
      await this.storage.queueChange({
        type: lead ? 'update' : 'create',
        data: lead ? { ...input, id: lead.id } : input,
      });
      this.complete.emit();
      return;
    }

    try {
      if (lead) {
        await firstValueFrom(this.leadsApi.updateLead(lead.id, input));
      } else {
        await firstValueFrom(this.leadsApi.createLead(input));
      }
      this.complete.emit();
    } catch (error) {
      console.error('Error saving lead:', error);
    }
  }
}
```

**File:** `crm-frontend/src/app/components/lead-form/lead-form.component.html`

```html
<form [formGroup]="form" (ngSubmit)="handleSubmit()">
  <mat-form-field>
    <mat-label>Name</mat-label>
    <input matInput formControlName="name" />
  </mat-form-field>

  <mat-form-field>
    <mat-label>Email</mat-label>
    <input matInput type="email" formControlName="email" />
  </mat-form-field>

  <mat-form-field>
    <mat-label>Phone</mat-label>
    <input matInput type="tel" formControlName="phone" />
  </mat-form-field>

  <mat-form-field>
    <mat-label>Company</mat-label>
    <input matInput formControlName="company" />
  </mat-form-field>

  <mat-form-field>
    <mat-label>Budget</mat-label>
    <input matInput type="number" formControlName="budget" />
  </mat-form-field>

  <button mat-raised-button color="primary" type="submit">
    {{ lead() ? 'Update Lead' : 'Create Lead' }}
  </button>
</form>
```

---

#### Wire up create/edit routes:

**File:** `crm-frontend/src/app/pages/create-lead/create-lead.component.ts`

```typescript
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LeadFormComponent } from '../../components/lead-form/lead-form.component';

@Component({
  selector: 'app-create-lead',
  standalone: true,
  imports: [LeadFormComponent],
  template: `<app-lead-form (complete)="onComplete()" />`,
})
export class CreateLeadComponent {
  private router = inject(Router);
  onComplete(): void {
    this.router.navigate(['/leads']);
  }
}
```

**File:** `crm-frontend/src/app/pages/edit-lead/edit-lead.component.ts`

```typescript
import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { LeadFormComponent } from '../../components/lead-form/lead-form.component';

@Component({
  selector: 'app-edit-lead',
  standalone: true,
  imports: [LeadFormComponent],
  template: `<app-lead-form [lead]="lead()" (complete)="onComplete()" />`,
})
export class EditLeadComponent {
  // Provided via withComponentInputBinding() from the route resolver/param
  readonly lead = input<any>();
  private router = inject(Router);
  onComplete(): void {
    this.router.navigate(['/leads']);
  }
}
```

---

## Feature 4: Geolocation for Check-ins (30-45 minutes)

### What You'll Build

**Log lead meetings with location:**

- "Check in" button on the lead detail view
- Captures GPS coordinates (browser Geolocation API)
- Logs an interaction with location data
- Shows location on a map (optional)

### Implementation Guide

#### Create a location service:

**File:** `crm-frontend/src/app/core/location.service.ts`

```typescript
import { Injectable } from '@angular/core';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

@Injectable({ providedIn: 'root' })
export class LocationService {
  /** Get the current position via the browser Geolocation API */
  getCurrentLocation(): Promise<Coordinates | null> {
    return new Promise((resolve) => {
      if (!('geolocation' in navigator)) {
        console.log('Geolocation is not supported by this browser');
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) =>
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }),
        (error) => {
          console.error('Error getting location:', error);
          resolve(null);
        },
        { enableHighAccuracy: true },
      );
    });
  }

  /**
   * Reverse-geocode coordinates to an address.
   * The browser has no built-in reverse geocoder, so call a geocoding API.
   * (Example uses OpenStreetMap Nominatim - respect its usage policy, or use a paid provider.)
   */
  async reverseGeocode(latitude: number, longitude: number): Promise<string> {
    try {
      const url =
        `https://nominatim.openstreetmap.org/reverse?format=json` +
        `&lat=${latitude}&lon=${longitude}`;
      const response = await fetch(url, { headers: { 'Accept-Language': 'en' } });
      const result = await response.json();
      return result.display_name ?? 'Unknown location';
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return 'Unknown location';
    }
  }
}
```

---

#### Add a check-in action to lead detail:

**File:** `crm-frontend/src/app/pages/lead-detail/lead-detail.component.ts`

```typescript
import { Component, inject, input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { LocationService } from '../../core/location.service';
import { InteractionsService } from '../../api/interactions.service';

@Component({
  selector: 'app-lead-detail',
  standalone: true,
  templateUrl: './lead-detail.component.html',
})
export class LeadDetailComponent {
  readonly lead = input.required<any>();
  private interactionsApi = inject(InteractionsService);
  private location = inject(LocationService);
  private snackBar = inject(MatSnackBar);

  async handleCheckIn(): Promise<void> {
    const coords = await this.location.getCurrentLocation();
    if (!coords) {
      this.snackBar.open('Unable to get location. Please enable location services.', 'Dismiss');
      return;
    }

    const address = await this.location.reverseGeocode(coords.latitude, coords.longitude);

    try {
      await firstValueFrom(
        this.interactionsApi.createInteraction({
          leadId: this.lead().id,
          type: 'meeting',
          notes: `Check-in at ${address}`,
          date: new Date().toISOString(),
          location: { ...coords, address },
        }),
      );
      this.snackBar.open(`Checked in at ${address}`, 'OK');
    } catch (error) {
      console.error('Error checking in:', error);
      this.snackBar.open('Failed to check in', 'Dismiss');
    }
  }
}
```

**File:** `crm-frontend/src/app/pages/lead-detail/lead-detail.component.html`

```html
<!-- ... existing lead detail content ... -->
<button mat-raised-button color="primary" (click)="handleCheckIn()">Check In</button>
```

---

## Testing All Features

### Manual testing:

```bash
# Service worker + push require a production build served over a static server
cd ~/ai-academy-<your-name>/crm-frontend
npm run build
npx http-server dist/crm-frontend/browser -p 8080
```

**Test offline mode:**

1. Open the app, view leads
2. In DevTools → Network, toggle **Offline** (or turn off wifi)
3. App should still show cached leads
4. Edit a lead offline (the change is queued)
5. Go back **online**
6. Queued changes should sync to the server

**Test web push notifications:**

1. Subscribe for notifications (check console/DevTools → Application → Service Workers)
2. Send a test push from the backend (`web-push`) or DevTools "Push" button
3. The notification should appear even when the tab/app is closed

**Test PWA CRUD:**

1. Create a new lead
2. Edit an existing lead
3. Delete a lead
4. Verify changes reach the backend (and queue/sync correctly when offline)

**Test geolocation:**

1. Click "Check In" on lead detail
2. Grant location permission
3. Interaction logged with location
4. Verify in the backend/database

---

## Expected Outcomes

**After completing this module:**

- ✅ Offline mode (app works without internet)
- ✅ Web push notifications (alerts when app closed)
- ✅ PWA CRUD (create/edit leads and tasks, offline-aware)
- ✅ Geolocation check-ins (log meetings with location)
- ✅ All validation gates passing
- ✅ Verified via Lighthouse + DevTools (installed/offline)

**Skills learned:**

- Offline-first architecture with IndexedDB
- Local storage and background data sync
- Web push (VAPID) setup with `SwPush`
- Angular reactive forms + Angular Material
- Browser geolocation integration

**Transferable to company work:**

- PWA offline capabilities
- Web push notification systems
- Client-side data sync strategies
- Location-based features

---

**✅ Bonus Module: Advanced PWA Features**

**Back to:** [Bonus Modules Overview](README.md)
