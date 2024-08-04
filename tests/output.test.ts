import { formatStatistics } from '../src/utils/output';

describe('formatStatistics', () => {
  test('should format statistics correctly for plain text', () => {
    const stats = {
      requestsPerSecond: 1500,
      tps: 1500,
      avgLatency: 20,
      stdevLatency: 5,
      maxLatency: 50,
      statusCodes: { 200: 1000 },
      throughput: 0.5
    };

    const formatted = formatStatistics(stats);
    expect(formatted).toContain('Requests per Second: 1500.00');
    expect(formatted).toContain('Latency (ms):');
    expect(formatted).toContain('Avg: 20.00ms');
    expect(formatted).toContain('Stdev: 5.00ms');
    expect(formatted).toContain('Max: 50.00ms');
    expect(formatted).toContain('Throughput (MB/s): 0.50');
    expect(formatted).toContain('HTTP Codes:');
    expect(formatted).toContain('200xx: 1000');
  });

  test('should handle zero values correctly', () => {
    const stats = {
      requestsPerSecond: 0,
      tps: 0,
      avgLatency: 0,
      stdevLatency: 0,
      maxLatency: 0,
      statusCodes: { 200: 0 },
      throughput: 0
    };

    const formatted = formatStatistics(stats);
    expect(formatted).toContain('Requests per Second: 0.00');
    expect(formatted).toContain('Latency (ms):');
    expect(formatted).toContain('Avg: 0.00ms');
    expect(formatted).toContain('Stdev: 0.00ms');
    expect(formatted).toContain('Max: 0.00ms');
    expect(formatted).toContain('Throughput (MB/s): 0.00');
    expect(formatted).toContain('HTTP Codes:');
    expect(formatted).toContain('200xx: 0');
  });

  test('should handle missing status codes correctly', () => {
    const stats = {
      requestsPerSecond: 1500,
      tps: 1500,
      avgLatency: 20,
      stdevLatency: 5,
      maxLatency: 50,
      statusCodes: {},
      throughput: 0.5
    };

    const formatted = formatStatistics(stats);
    expect(formatted).toContain('Requests per Second: 1500.00');
    expect(formatted).toContain('Latency (ms):');
    expect(formatted).toContain('Avg: 20.00ms');
    expect(formatted).toContain('Stdev: 5.00ms');
    expect(formatted).toContain('Max: 50.00ms');
    expect(formatted).toContain('Throughput (MB/s): 0.50');
    expect(formatted).toContain('HTTP Codes:');
    expect(formatted).toContain('No HTTP Codes');
  });

  test('should handle multiple status codes correctly', () => {
    const stats = {
      requestsPerSecond: 1500,
      tps: 1500,
      avgLatency: 20,
      stdevLatency: 5,
      maxLatency: 50,
      statusCodes: { 200: 1000, 404: 50, 500: 10 },
      throughput: 0.5
    };

    const formatted = formatStatistics(stats);
    expect(formatted).toContain('Requests per Second: 1500.00');
    expect(formatted).toContain('Latency (ms):');
    expect(formatted).toContain('Avg: 20.00ms');
    expect(formatted).toContain('Stdev: 5.00ms');
    expect(formatted).toContain('Max: 50.00ms');
    expect(formatted).toContain('Throughput (MB/s): 0.50');
    expect(formatted).toContain('HTTP Codes:');
    expect(formatted).toContain('200xx: 1000');
    expect(formatted).toContain('404xx: 50');
    expect(formatted).toContain('500xx: 10');
  });
});