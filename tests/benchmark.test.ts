import axios from 'axios';
import { Benchmark } from '../src/core/benchmark';
import { BenchmarkOptions } from '../src/types';
import { formatStatistics } from '../src/utils/output';

jest.mock('axios');
const mockedAxios = axios as jest.MockedFunction<typeof axios>;

describe('Benchmark', () => {
  let benchmark: Benchmark;

  beforeEach(() => {
    const options: BenchmarkOptions = {
      url: 'https://jsonplaceholder.typicode.com/posts',
      method: 'GET',
      headers: {},
      body: '',
      requests: 100,
      concurrency: 10,
      timeout: 5,
      duration: 60000,
      output: 'plain'
    };
    benchmark = new Benchmark(options);
  });

  test('should initialize with correct options', () => {
    expect(benchmark).toBeDefined();
    expect(benchmark['options'].url).toBe('https://jsonplaceholder.typicode.com/posts');
  });

  test('should handle successful requests', async () => {
    mockedAxios.mockResolvedValueOnce({ status: 200, data: {} });

    await benchmark.run();

    expect(mockedAxios).toHaveBeenCalled();
    expect(mockedAxios).toHaveBeenCalledWith(expect.objectContaining({
      method: 'GET',
      url: 'https://jsonplaceholder.typicode.com/posts',
    }));
  });

  test('should handle failed requests', async () => {
    mockedAxios.mockRejectedValueOnce({ response: { status: 500 } });

    await benchmark.run();

    expect(mockedAxios).toHaveBeenCalled();
    expect(mockedAxios).toHaveBeenCalledWith(expect.objectContaining({
      method: 'GET',
      url: 'https://jsonplaceholder.typicode.com/posts',
    }));
  });

  test('should handle timeout correctly', async () => {
    mockedAxios.mockImplementationOnce(() => new Promise((_, reject) => setTimeout(() => reject({ response: { status: 408 } }), 6000)));

    await benchmark.run();

    expect(mockedAxios).toHaveBeenCalled();
    expect(mockedAxios).toHaveBeenCalledWith(expect.objectContaining({
      method: 'GET',
      url: 'https://jsonplaceholder.typicode.com/posts',
    }));
  });

  test('should handle different HTTP methods', async () => {
    const options: BenchmarkOptions = {
      url: 'https://jsonplaceholder.typicode.com/posts',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'foo', body: 'bar', userId: 1 }),
      requests: 100,
      concurrency: 10,
      timeout: 5,
      duration: 60000,
      output: 'plain'
    };
    benchmark = new Benchmark(options);

    mockedAxios.mockResolvedValueOnce({ status: 201, data: {} });

    await benchmark.run();

    expect(mockedAxios).toHaveBeenCalled();
    expect(mockedAxios).toHaveBeenCalledWith(expect.objectContaining({
      method: 'POST',
      url: 'https://jsonplaceholder.typicode.com/posts',
      data: JSON.stringify({ title: 'foo', body: 'bar', userId: 1 }),
    }));
  });

  test('should handle invalid URL', async () => {
    const options: BenchmarkOptions = {
      url: 'invalid-url',
      method: 'GET',
      headers: {},
      body: '',
      requests: 100,
      concurrency: 10,
      timeout: 5,
      duration: 60000,
      output: 'plain'
    };
    benchmark = new Benchmark(options);

    await expect(benchmark.run()).rejects.toThrow('Invalid URL');
  });

  test('should calculate statistics correctly', () => {
    // Simulate some response times
    benchmark['responseTimes'] = [20, 25, 30, 15, 35];
    benchmark['statusCodes'] = { 200: 100, 500: 5 };

    const stats = benchmark['calculateLatencyStats']();
    expect(stats.avg).toBeCloseTo(25, 1);
    expect(stats.stdev).toBeCloseTo(7.5, 1);
    expect(stats.max).toBe(35);

    const throughput = benchmark['calculateThroughput']();
    expect(throughput).toBeGreaterThan(0);
  });

  test('should format statistics correctly', () => {
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
    expect(formatted).toContain('TPS: 1500.00');
    expect(formatted).toContain('Latency (ms):');
    expect(formatted).toContain('Avg: 20.00ms');
    expect(formatted).toContain('Stdev: 5.00ms');
    expect(formatted).toContain('Max: 50.00ms');
    expect(formatted).toContain('Throughput (MB/s): 0.50');
    expect(formatted).toContain('HTTP Codes:');
    expect(formatted).toContain('200xx: 1000');
  });

  test('should output results to file when --output flag is used', async () => {
    const fs = require('fs');
    const mockWriteFile = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});

    benchmark['options'].output = 'json'; // Or 'plain'

    await benchmark.run();

    expect(mockWriteFile).toHaveBeenCalled();
    mockWriteFile.mockRestore();
  });
});