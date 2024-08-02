export interface BenchmarkOptions {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  requests: number;
  concurrency: number;
  timeout: number;
  duration?: number;
  output?: 'plain' | 'json';
}
