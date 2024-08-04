import axios from 'axios';
import { performance } from 'perf_hooks';
import { SingleBar, Presets } from 'cli-progress';
import { BenchmarkOptions } from '../types';
import { formatStatistics } from '../utils/output';
import { formatDuration } from '../utils/duration';

export class Benchmark {
  private options: BenchmarkOptions;
  private progressBar: SingleBar;
  private totalRequests: number;
  private responseTimes: number[] = [];
  private statusCodes: Record<number, number> = {};
  private startTime: number;

  constructor(options: BenchmarkOptions) {
    this.options = options;
    this.progressBar = new SingleBar({}, Presets.legacy);
    this.totalRequests = options.requests;
    this.startTime = performance.now();
  }

  async run() {
    const { url, method, headers, body, requests, concurrency, duration } = this.options;
  
    this.progressBar.start(requests, 0);
  
    const promises = [];
    for (let i = 0; i < concurrency; i++) {
      promises.push(this.makeRequests(Math.ceil(requests / concurrency)));
    }
  
    if (duration) {
      setTimeout(() => {
        this.progressBar.stop();
        this.printStatistics();
        process.exit(0);
      }, duration);
    }
  
    const results = await Promise.all(promises);
  
    this.progressBar.stop();
    this.printStatistics();
  }
  
  private async makeRequests(count: number) {
    const results = [];
    for (let i = 0; i < count; i++) {
      const start = performance.now();
      try {
        const response = await axios({
          method: this.options.method,
          url: this.options.url,
          headers: this.options.headers,
          data: this.options.body,
          timeout: this.options.timeout * 1000,
        });
        const duration = performance.now() - start;
        this.recordResponse(response.status, duration);
        results.push(duration);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const duration = performance.now() - start;
          this.recordResponse(error.response ? error.response.status : 0, duration);
          results.push(duration);
        } else {
          console.error('Unexpected error:', error);
          throw error;
        }
      }
      this.progressBar.increment();
    }
    return results;
  }

  private recordResponse(statusCode: number, duration: number) {
    this.responseTimes.push(duration);
    this.statusCodes[statusCode] = (this.statusCodes[statusCode] || 0) + 1;
  }

  private printStatistics() {
    const endTime = performance.now();
    const totalTime = (endTime - this.startTime) / 1000; // in seconds
    const requestsPerSecond = this.totalRequests / totalTime;
    const latencyStats = this.calculateLatencyStats();
    const throughput = this.calculateThroughput();

    const stats = {
      requestsPerSecond,
      avgLatency: latencyStats.avg,
      stdevLatency: latencyStats.stdev,
      maxLatency: latencyStats.max,
      statusCodes: this.statusCodes,
      throughput
    };

    console.log(formatStatistics(stats));
    console.log(`Total time: ${formatDuration(totalTime * 1000)}`);
  }

  private calculateLatencyStats() {
    const avg = this.responseTimes.reduce((sum, time) => sum + time, 0) / this.responseTimes.length;
    const stdev = Math.sqrt(this.responseTimes.reduce((sum, time) => sum + Math.pow(time - avg, 2), 0) / this.responseTimes.length);
    const max = Math.max(...this.responseTimes);
    return { avg, stdev, max: max / 1000 }; // Convert max to milliseconds
  }

  private calculateThroughput() {
    // Assuming body is the size of each request in bytes if not empty
    const requestSize = this.options.body ? Buffer.byteLength(this.options.body) : 0;
    const totalSize = this.totalRequests * requestSize; // in bytes
    const totalTime = (performance.now() - this.startTime) / 1000; // in seconds
    const throughputMB = (totalSize / totalTime) / (1024 * 1024); // MB/s
    return throughputMB;
  }  
}
