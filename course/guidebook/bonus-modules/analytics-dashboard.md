# Bonus Module: Analytics Dashboard

## Prerequisites

**✅ Required before starting:**

- Core CRM complete with CRUD operations
- AI features implemented (summaries, scoring, recommendations)
- Lead and interaction data exists in database
- Comfortable with data visualization concepts

**If missing prerequisites:** Complete Days 1-2 required features first.

---

## What You'll Build

**A comprehensive analytics dashboard with:**

1. **Lead Pipeline Visualization** - Funnel chart showing lead stages and conversion rates
2. **Activity Trends** - Line chart showing interactions over time
3. **Conversion Metrics** - KPI cards with key numbers
4. **AI Scoring Distribution** - Bar chart showing score distribution
5. **Budget Analysis** - Pie chart showing budget allocation

**Dashboard layout:**

```
+--------------------------------------------------+
| Analytics Dashboard                              |
+--------------------------------------------------+
| [Total Leads] [Active Tasks] [Conversion Rate]  | ← KPI Cards
+--------------------------------------------------+
| Lead Pipeline Funnel          | Activity Trends | ← Charts (row 1)
+--------------------------------------------------+
| AI Score Distribution         | Budget Analysis | ← Charts (row 2)
+--------------------------------------------------+
```

---

## Implementation Guide

### Phase 1: Install Dependencies (5 minutes)

**Install chart library (ngx-charts):**

```bash
cd ~/ai-academy-<your-name>/frontend
npm install @swimlane/ngx-charts d3
```

**Why ngx-charts?**

- Angular-first (declarative component API, built on D3)
- Responsive by default
- Good TypeScript support
- Covers all chart types we need

---

### Phase 2: Backend Analytics Queries (30-45 minutes)

#### Create analytics controller:

**File:** `backend/src/analytics/analytics.controller.ts`

```typescript
import { Controller, Get, Query } from "@nestjs/common";
import { AnalyticsService } from "./analytics.service";

@Controller("analytics")
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get()
  async analytics() {
    return this.analyticsService.getAnalytics();
  }

  @Get("pipeline")
  async pipelineData() {
    return this.analyticsService.getPipelineData();
  }

  @Get("activity-trends")
  async activityTrends(@Query("days") days = 30) {
    return this.analyticsService.getActivityTrends(Number(days));
  }

  @Get("score-distribution")
  async scoreDistribution() {
    return this.analyticsService.getScoreDistribution();
  }

  @Get("budget")
  async budgetAnalysis() {
    return this.analyticsService.getBudgetAnalysis();
  }
}
```

---

#### Create analytics service with aggregation queries:

**File:** `backend/src/analytics/analytics.service.ts`

```typescript
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Lead } from "../leads/entities/lead.entity";
import { Interaction } from "../interactions/entities/interaction.entity";
import { Task } from "../tasks/entities/task.entity";

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Lead)
    private leadRepository: Repository<Lead>,
    @InjectRepository(Interaction)
    private interactionRepository: Repository<Interaction>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>
  ) {}

  async getAnalytics() {
    const totalLeads = await this.leadRepository.count();
    const activeLeads = await this.leadRepository.count({
      where: { status: "active" },
    });
    const activeTasks = await this.taskRepository.count({
      where: { status: "pending" },
    });
    const convertedLeads = await this.leadRepository.count({
      where: { status: "closed_won" },
    });

    const conversionRate =
      totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

    return {
      totalLeads,
      activeLeads,
      activeTasks,
      convertedLeads,
      conversionRate: parseFloat(conversionRate.toFixed(2)),
    };
  }

  async getPipelineData() {
    // Group leads by status (pipeline stage)
    const result = await this.leadRepository
      .createQueryBuilder("lead")
      .select("lead.status", "stage")
      .addSelect("COUNT(*)", "count")
      .groupBy("lead.status")
      .getRawMany();

    // Calculate conversion rates between stages
    const totalLeads = await this.leadRepository.count();

    return result.map((row) => ({
      stage: row.stage,
      count: parseInt(row.count),
      percentage: totalLeads > 0 ? (parseInt(row.count) / totalLeads) * 100 : 0,
    }));
  }

  async getActivityTrends(days: number) {
    // Get interactions grouped by date
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const result = await this.interactionRepository
      .createQueryBuilder("interaction")
      .select("DATE(interaction.date)", "date")
      .addSelect("COUNT(*)", "count")
      .where("interaction.date >= :startDate", { startDate })
      .groupBy("DATE(interaction.date)")
      .orderBy("DATE(interaction.date)", "ASC")
      .getRawMany();

    return result.map((row) => ({
      date: row.date,
      count: parseInt(row.count),
    }));
  }

  async getScoreDistribution() {
    // Group leads by activity score ranges
    const result = await this.leadRepository
      .createQueryBuilder("lead")
      .select(
        `CASE
          WHEN lead.activityScore >= 80 THEN 'High (80-100)'
          WHEN lead.activityScore >= 60 THEN 'Medium (60-79)'
          WHEN lead.activityScore >= 40 THEN 'Low (40-59)'
          ELSE 'Very Low (0-39)'
        END`,
        "range"
      )
      .addSelect("COUNT(*)", "count")
      .where("lead.activityScore IS NOT NULL")
      .groupBy("range")
      .getRawMany();

    return result.map((row) => ({
      range: row.range,
      count: parseInt(row.count),
    }));
  }

  async getBudgetAnalysis() {
    // Group leads by budget ranges
    const result = await this.leadRepository
      .createQueryBuilder("lead")
      .select(
        `CASE
          WHEN lead.budget >= 100000 THEN 'Enterprise (100k+)'
          WHEN lead.budget >= 50000 THEN 'Large (50-100k)'
          WHEN lead.budget >= 10000 THEN 'Medium (10-50k)'
          ELSE 'Small (<10k)'
        END`,
        "range"
      )
      .addSelect("COUNT(*)", "count")
      .addSelect("SUM(lead.budget)", "total")
      .where("lead.budget IS NOT NULL")
      .groupBy("range")
      .getRawMany();

    return result.map((row) => ({
      range: row.range,
      count: parseInt(row.count),
      total: parseFloat(row.total),
    }));
  }
}
```

---

#### Create the shared response types:

**File:** `backend/src/analytics/dto/analytics.types.ts`

```typescript
// Plain interfaces — the shared API contract, imported by the frontend too.
export interface AnalyticsData {
  totalLeads: number;
  activeLeads: number;
  activeTasks: number;
  convertedLeads: number;
  conversionRate: number;
}

export interface PipelineStageData {
  stage: string;
  count: number;
  percentage: number;
}

export interface ActivityTrendData {
  date: string;
  count: number;
}

export interface ScoreDistributionData {
  range: string;
  count: number;
}

export interface BudgetData {
  range: string;
  count: number;
  total: number;
}
```

---

### Phase 3: Frontend Dashboard

#### Create the analytics data service:

**File:** `frontend/src/app/analytics/analytics.service.ts`

```typescript
import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import type {
  AnalyticsData,
  PipelineStageData,
  ActivityTrendData,
  ScoreDistributionData,
  BudgetData,
} from "./analytics.types"; // shared types imported from the backend contract

@Injectable({ providedIn: "root" })
export class AnalyticsService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/analytics`;

  getAnalytics() {
    return this.http.get<AnalyticsData>(this.base);
  }

  getPipelineData() {
    return this.http.get<PipelineStageData[]>(`${this.base}/pipeline`);
  }

  getActivityTrends(days = 30) {
    return this.http.get<ActivityTrendData[]>(`${this.base}/activity-trends`, {
      params: { days },
    });
  }

  getScoreDistribution() {
    return this.http.get<ScoreDistributionData[]>(`${this.base}/score-distribution`);
  }

  getBudgetAnalysis() {
    return this.http.get<BudgetData[]>(`${this.base}/budget`);
  }
}
```

---

#### Create KPI card component:

**File:** `frontend/src/app/components/kpi-card/kpi-card.component.ts`

```typescript
import { Component, input } from '@angular/core';

export interface KpiTrend {
  value: number;
  isPositive: boolean;
}

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  templateUrl: './kpi-card.component.html',
  styleUrl: './kpi-card.component.scss',
})
export class KpiCardComponent {
  readonly title = input.required<string>();
  readonly value = input.required<string | number>();
  readonly icon = input<string>();      // Material icon name
  readonly trend = input<KpiTrend>();
}
```

**File:** `frontend/src/app/components/kpi-card/kpi-card.component.html`

```html
<div class="kpi-card">
  <div class="kpi-card__body">
    <div>
      <div class="kpi-card__title">{{ title() }}</div>
      <div class="kpi-card__value">{{ value() }}</div>
      @if (trend(); as t) {
        <div class="kpi-card__trend" [class.is-positive]="t.isPositive">
          {{ t.isPositive ? '↑' : '↓' }} {{ t.value }}%
        </div>
      }
    </div>
    @if (icon()) {
      <mat-icon class="kpi-card__icon">{{ icon() }}</mat-icon>
    }
  </div>
</div>
```

**File:** `frontend/src/app/components/kpi-card/kpi-card.component.scss`

```scss
.kpi-card {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &__body {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &__title { font-size: 14px; color: #666; margin-bottom: 8px; }
  &__value { font-size: 32px; font-weight: bold; color: #333; }
  &__trend { font-size: 12px; color: #ef4444; margin-top: 4px; }
  &__trend.is-positive { color: #10b981; }
  &__icon { font-size: 48px; opacity: 0.2; }
}
```

---

#### Create dashboard page:

**File:** `frontend/src/app/pages/analytics/analytics.component.ts`

`ngx-charts` expects data as `{ name, value }` (or a series of those), so we map each
REST response into that shape with a `computed` signal.

```typescript
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { KpiCardComponent } from '../../components/kpi-card/kpi-card.component';
import { AnalyticsService } from '../../analytics/analytics.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [NgxChartsModule, KpiCardComponent],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss',
})
export class AnalyticsComponent {
  private analyticsApi = inject(AnalyticsService);

  readonly colorScheme = { domain: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'] };

  private analytics = toSignal(this.analyticsApi.getAnalytics());

  readonly totalLeads = computed(() => this.analytics()?.totalLeads ?? 0);
  readonly activeLeads = computed(() => this.analytics()?.activeLeads ?? 0);
  readonly activeTasks = computed(() => this.analytics()?.activeTasks ?? 0);
  readonly conversionRate = computed(() => `${this.analytics()?.conversionRate ?? 0}%`);

  // Bar/pie charts: [{ name, value }]
  readonly pipeline = toSignal(
    this.analyticsApi.getPipelineData().pipe(
      map((rows) => rows.map((d) => ({ name: d.stage, value: d.count }))),
    ),
    { initialValue: [] },
  );

  readonly scoreDistribution = toSignal(
    this.analyticsApi.getScoreDistribution().pipe(
      map((rows) => rows.map((d) => ({ name: d.range, value: d.count }))),
    ),
    { initialValue: [] },
  );

  readonly budget = toSignal(
    this.analyticsApi.getBudgetAnalysis().pipe(
      map((rows) => rows.map((d) => ({ name: d.range, value: d.count }))),
    ),
    { initialValue: [] },
  );

  // Line chart: [{ name: series, series: [{ name: x, value: y }] }]
  readonly trends = toSignal(
    this.analyticsApi.getActivityTrends(30).pipe(
      map((rows) => [
        {
          name: 'Activity',
          series: rows.map((d) => ({ name: d.date, value: d.count })),
        },
      ]),
    ),
    { initialValue: [] },
  );
}
```

**File:** `frontend/src/app/pages/analytics/analytics.component.html`

```html
<div class="analytics">
  <h1>Analytics Dashboard</h1>

  <!-- KPI Cards -->
  <div class="analytics__kpis">
    <app-kpi-card title="Total Leads" [value]="totalLeads()" />
    <app-kpi-card title="Active Leads" [value]="activeLeads()" />
    <app-kpi-card title="Active Tasks" [value]="activeTasks()" />
    <app-kpi-card title="Conversion Rate" [value]="conversionRate()" />
  </div>

  <!-- Charts Row 1 -->
  <div class="analytics__row">
    <div class="analytics__card">
      <h3>Lead Pipeline</h3>
      <ngx-charts-bar-vertical
        [results]="pipeline()"
        [xAxis]="true"
        [yAxis]="true"
        [scheme]="colorScheme"
      />
    </div>

    <div class="analytics__card">
      <h3>Activity Trends (30 Days)</h3>
      <ngx-charts-line-chart
        [results]="trends()"
        [xAxis]="true"
        [yAxis]="true"
        [scheme]="colorScheme"
      />
    </div>
  </div>

  <!-- Charts Row 2 -->
  <div class="analytics__row">
    <div class="analytics__card">
      <h3>AI Score Distribution</h3>
      <ngx-charts-bar-vertical
        [results]="scoreDistribution()"
        [xAxis]="true"
        [yAxis]="true"
        [scheme]="colorScheme"
      />
    </div>

    <div class="analytics__card">
      <h3>Budget Distribution</h3>
      <ngx-charts-pie-chart
        [results]="budget()"
        [labels]="true"
        [scheme]="colorScheme"
      />
    </div>
  </div>
</div>
```

**File:** `frontend/src/app/pages/analytics/analytics.component.scss`

```scss
.analytics {
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;

  h1 { margin-bottom: 24px; }

  &__kpis {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
  }
  &__row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
  }
  &__card {
    padding: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    h3 { margin-bottom: 16px; }
  }
}
```

---

#### Add route for analytics:

**File:** `frontend/src/app/app.routes.ts`

```typescript
import { Routes } from '@angular/router';
import { AnalyticsComponent } from './pages/analytics/analytics.component';

export const routes: Routes = [
  // ... existing routes ...
  { path: 'analytics', component: AnalyticsComponent },
];
```

---

#### Add navigation link:

**File:** `frontend/src/app/components/navigation/navigation.component.html`

```html
<nav>
  <a routerLink="/dashboard">Dashboard</a>
  <a routerLink="/analytics">Analytics</a> <!-- Add this -->
  <a routerLink="/tasks">Tasks</a>
</nav>
```

---

### Phase 4: Advanced Features (Optional, +30-60 minutes)

#### Add date range filter:

```typescript
// In AnalyticsComponent
readonly dateRange = signal(30); // days

// Re-fetch when the range changes (toObservable bridges the signal to the request)
readonly trends = toSignal(
  toObservable(this.dateRange).pipe(
    switchMap((days) =>
      this.analyticsApi.getActivityTrends(days).pipe(
        map((rows) => [
          {
            name: 'Activity',
            series: rows.map((d) => ({ name: d.date, value: d.count })),
          },
        ]),
      ),
    ),
  ),
  { initialValue: [] },
);
```

```html
<select [value]="dateRange()" (change)="dateRange.set(+$any($event.target).value)">
  <option [value]="7">Last 7 days</option>
  <option [value]="30">Last 30 days</option>
  <option [value]="90">Last 90 days</option>
</select>
```

#### Add export to CSV:

```typescript
function exportToCSV(data: any[], filename: string) {
  const csv = [
    Object.keys(data[0]).join(","),
    ...data.map((row) => Object.values(row).join(",")),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
}
```

```html
<button (click)="exportToCSV(pipeline(), 'pipeline-data.csv')">Export to CSV</button>
```

#### Add real-time updates:

```typescript
// HttpClient has no built-in polling — use RxJS `timer` to re-fetch every 30 seconds.
// (For true server push, use a WebSocket/SSE gateway instead of polling.)
readonly analytics = toSignal(
  timer(0, 30_000).pipe(switchMap(() => this.analyticsApi.getAnalytics())),
);
```

---

## Testing

### Manual testing:

```bash
cd ~/ai-academy-<your-name>

# Start backend and frontend
# Terminal 1
cd backend && npm run start:dev

# Terminal 2
cd frontend && npm start
```

**Test dashboard:**

1. Navigate to `/analytics`
2. Verify KPI cards show correct numbers
3. Verify charts display data
4. Test date range filter (if implemented)
5. Test export to CSV (if implemented)

---

### Automated testing:

**Test analytics service:**

**File:** `backend/src/analytics/analytics.service.spec.ts`

```typescript
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { AnalyticsService } from "./analytics.service";
import { Lead } from "../leads/entities/lead.entity";

describe("AnalyticsService", () => {
  let service: AnalyticsService;
  let leadRepository: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        {
          provide: getRepositoryToken(Lead),
          useValue: {
            count: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
        // ... other repositories
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
    leadRepository = module.get(getRepositoryToken(Lead));
  });

  it("should calculate analytics correctly", async () => {
    leadRepository.count.mockResolvedValueOnce(100); // totalLeads
    leadRepository.count.mockResolvedValueOnce(80); // activeLeads
    // ... mock other counts

    const result = await service.getAnalytics();

    expect(result.totalLeads).toBe(100);
    expect(result.activeLeads).toBe(80);
  });
});
```

---

### Run validation gates:

```bash
cd ~/ai-academy-<your-name>

npm run type-check  # 0 errors
npm run lint        # 0 warnings
npm test            # All passing
# Check processes
# Browser test: Dashboard displays
```

---

## Performance Optimization

### Caching expensive queries:

```typescript
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Injectable()
export class AnalyticsService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getAnalytics() {
    const cacheKey = "analytics_data";
    const cached = await this.cacheManager.get(cacheKey);

    if (cached) {
      return cached;
    }

    const data = await this.computeAnalytics();

    // Cache for 5 minutes
    await this.cacheManager.set(cacheKey, data, 300);

    return data;
  }
}
```

### Pagination for large datasets:

```typescript
async getActivityTrends(days: number, limit: number = 100) {
  // ... query with LIMIT
  .limit(limit)
  .getRawMany();
}
```

---

## Expected Outcomes

**After completing this module:**

- ✅ Complete analytics dashboard with 4+ charts
- ✅ KPI cards showing key metrics
- ✅ Lead pipeline visualization (funnel/bar chart)
- ✅ Activity trends over time (line chart)
- ✅ AI score distribution (bar chart)
- ✅ Budget analysis (pie chart)
- ✅ All validation gates passing
- ✅ Tested in browser

**Skills learned:**

- Data aggregation queries (SQL grouping)
- Chart library integration (ngx-charts)
- Dashboard layout and design
- Performance optimization (caching)
- Data visualization best practices

**Transferable to company work:**

- Business intelligence dashboards
- Data visualization
- Analytics queries
- Report generation
- KPI tracking

---

## Troubleshooting

**Charts not rendering:**

- Check console for errors
- Verify data format matches chart expected format
- Ensure ResponsiveContainer has parent with defined height

**API request errors:**

- Verify the backend controller returns the correct response shape
- Check database has data (seed if empty)
- Test the endpoints with `curl` or Postman (e.g. `curl http://localhost:3000/analytics`)

**Performance issues with large datasets:**

- Add indexes to frequently queried columns
- Implement caching for expensive queries
- Add pagination/limits to queries
- Consider database views for complex aggregations

**Empty charts:**

- Verify database has data
- Check date ranges (not filtering out all data)
- Test queries directly in database
- Add loading states to show when data is fetching

---

**✅ Bonus Module: Analytics Dashboard**

**Back to:** [Bonus Modules Overview](README.md)
