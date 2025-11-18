# Analytics Documentation

This document describes the advanced analytics features and real-time metrics system.

## Overview

The analytics system provides real-time insights into user behavior, program performance, and conversion metrics.

## Components

### AnalyticsWidget

A flexible widget component for displaying key metrics.

#### Basic Usage

```tsx
import { AnalyticsWidget } from '@/components/analytics/AnalyticsWidget';

<AnalyticsWidget
  title="Total Users"
  value={12345}
  change={15.3}
  changeLabel="vs last month"
  trend="up"
  icon={<UserIcon />}
/>;
```

#### Props

- `title` (string): Widget title
- `value` (string | number): Main metric value
- `change` (number, optional): Percentage change
- `changeLabel` (string, optional): Label for change metric
- `icon` (ReactNode, optional): Icon to display
- `loading` (boolean, optional): Show loading state
- `trend` ('up' | 'down' | 'neutral', optional): Trend indicator
- `footer` (ReactNode, optional): Additional content below metrics

#### Example with Loading State

```tsx
<AnalyticsWidget title="Revenue" value="$45,231" loading={isLoading} />
```

---

### ChartWidget

Container for displaying charts and graphs.

#### Usage

```tsx
import { ChartWidget } from '@/components/analytics/AnalyticsWidget';
import { LineChart } from 'recharts';

<ChartWidget title="Revenue Over Time" actions={<button>Export</button>}>
  <LineChart data={chartData} />
</ChartWidget>;
```

#### Props

- `title` (string): Chart title
- `children` (ReactNode): Chart content
- `loading` (boolean, optional): Show loading state
- `actions` (ReactNode, optional): Action buttons/controls

---

### MetricCard

Compact card for displaying single metrics.

#### Usage

```tsx
import { MetricCard } from '@/components/analytics/AnalyticsWidget';

<MetricCard label="Active Users" value={1234} subValue="+12% from yesterday" color="blue" />;
```

#### Props

- `label` (string): Metric label
- `value` (string | number): Metric value
- `subValue` (string, optional): Additional context
- `color` ('blue' | 'green' | 'yellow' | 'red' | 'purple', optional): Color theme

---

### RealtimeMetrics

Complete real-time analytics dashboard.

#### Usage

```tsx
import { RealtimeMetrics } from '@/components/analytics/RealtimeMetrics';

function AnalyticsPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <RealtimeMetrics />
    </div>
  );
}
```

#### Features

- Auto-refreshes every 30 seconds
- Displays active users, clicks, conversions, revenue
- Shows top performing programs
- Real-time update indicator
- Automatic error handling
- Loading states

---

## API Endpoints

### GET /api/analytics/realtime

Returns current day's analytics data.

#### Response

```typescript
{
  activeUsers: number; // Current active users
  clicksToday: number; // Total clicks today
  conversionsToday: number; // Total conversions today
  revenueToday: number; // Estimated revenue today
  topPrograms: Array<{
    id: string;
    name: string;
    clicks: number;
    conversions: number;
  }>;
}
```

#### Example

```typescript
const response = await fetch('/api/analytics/realtime');
const data = await response.json();

console.log(`Today's revenue: $${data.revenueToday}`);
```

#### Error Response

```typescript
{
  error: string; // Error message
}
```

#### Rate Limiting

- No authentication required for read operations
- Rate limited to 60 requests per minute per IP
- Returns 429 if limit exceeded

---

## Data Metrics

### Available Metrics

#### User Metrics

- **Active Users**: Current number of active sessions
- **Total Users**: All registered users
- **New Users**: Users registered today/this week/this month

#### Engagement Metrics

- **Clicks**: Total affiliate link clicks
- **Click-through Rate (CTR)**: Clicks / Impressions
- **Average Session Duration**: Time spent on platform
- **Pages per Session**: Average pages viewed per session

#### Conversion Metrics

- **Conversions**: Successful affiliate applications
- **Conversion Rate (CVR)**: Conversions / Clicks
- **Revenue**: Estimated commission earnings
- **Average Order Value (AOV)**: Average revenue per conversion

#### Program Metrics

- **Top Programs**: Most clicked/converted programs
- **Program Performance**: Individual program statistics
- **Network Performance**: Performance by affiliate network
- **Category Performance**: Performance by program category

---

## Calculation Methods

### Conversion Rate

```
CVR = (Conversions / Clicks) * 100
```

### Click-through Rate

```
CTR = (Clicks / Impressions) * 100
```

### Revenue Estimation

```
Revenue = Conversions * Average Commission
```

Note: Actual revenue may vary based on commission structures.

---

## Dashboard Layout

### Recommended Structure

```tsx
import { RealtimeMetrics, AnalyticsWidget, ChartWidget } from '@/components/analytics';

function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Real-time overview */}
      <RealtimeMetrics />

      {/* Custom metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AnalyticsWidget title="Metric 1" value={123} />
        <AnalyticsWidget title="Metric 2" value={456} />
        <AnalyticsWidget title="Metric 3" value={789} />
      </div>

      {/* Charts */}
      <ChartWidget title="Trends">{/* Your chart component */}</ChartWidget>
    </div>
  );
}
```

---

## Performance Optimization

### Caching

- Real-time data cached for 30 seconds
- Historical data cached for 5 minutes
- Use SWR or React Query for client-side caching

### Example with React Query

```tsx
import { useQuery } from '@tanstack/react-query';

function useRealtimeAnalytics() {
  return useQuery({
    queryKey: ['analytics', 'realtime'],
    queryFn: async () => {
      const res = await fetch('/api/analytics/realtime');
      return res.json();
    },
    refetchInterval: 30000, // Refetch every 30s
    staleTime: 25000, // Consider stale after 25s
  });
}
```

### Database Optimization

- Indexed columns: `createdAt`, `programId`, `userId`
- Aggregations pre-calculated for historical data
- Partitioning by date for large tables

---

## Testing Analytics

### Mock Data

```typescript
const mockAnalyticsData = {
  activeUsers: 42,
  clicksToday: 1234,
  conversionsToday: 89,
  revenueToday: 2225,
  topPrograms: [
    {
      id: '1',
      name: 'Program A',
      clicks: 500,
      conversions: 45,
    },
  ],
};
```

### Testing Components

```tsx
import { render } from '@testing-library/react';
import { RealtimeMetrics } from '@/components/analytics/RealtimeMetrics';

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: async () => mockAnalyticsData,
  })
);

test('displays analytics data', async () => {
  const { findByText } = render(<RealtimeMetrics />);
  expect(await findByText('1,234')).toBeInTheDocument();
});
```

---

## Security Considerations

### Data Access

- Analytics data requires authentication
- Role-based access control (RBAC) enforced
- Sensitive metrics restricted to admins

### Privacy

- User data anonymized in analytics
- GDPR compliant data handling
- Opt-out mechanism available

### Rate Limiting

Implemented on all analytics endpoints:

- 60 requests/minute for authenticated users
- 20 requests/minute for unauthenticated users
- Exponential backoff recommended

---

## Troubleshooting

### No Data Displayed

1. Check API endpoint is accessible
2. Verify database connection
3. Ensure data exists for current day
4. Check browser console for errors

### Incorrect Metrics

1. Verify calculation formulas
2. Check timezone settings
3. Ensure database queries filter correctly
4. Review data validation

### Performance Issues

1. Implement client-side caching
2. Reduce polling frequency
3. Optimize database queries
4. Consider pagination for large datasets

---

## Future Enhancements

Planned features:

- [ ] Custom date range selection
- [ ] Export to CSV/PDF
- [ ] Email reports
- [ ] Predictive analytics
- [ ] A/B testing metrics
- [ ] Funnel analysis
- [ ] Cohort analysis
- [ ] Custom metric builder

---

## Related Documentation

- [API Documentation](./API.md)
- [Database Schema](./DATABASE.md)
- [Security Policy](../SECURITY.md)
