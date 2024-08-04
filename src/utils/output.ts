export function formatStatistics(stats: {
  requestsPerSecond: number;
  avgLatency: number;
  stdevLatency: number;
  maxLatency: number;
  statusCodes: Record<number, number>;
  throughput: number;
}): string {
  let output = '\n';
  output += 'Benchmark Results\n';
  output += '------------------------------\n';
  output += `  ${'Requests per Second:'.padEnd(20)} ${stats.requestsPerSecond.toFixed(2)}\n`;
  output += `  ${'Latency (ms):'.padEnd(20)}\n`;
  output += `    ${'Avg:'.padEnd(10)} ${stats.avgLatency.toFixed(2)}ms\n`;
  output += `    ${'Stdev:'.padEnd(10)} ${stats.stdevLatency.toFixed(2)}ms\n`;
  output += `    ${'Max:'.padEnd(10)} ${stats.maxLatency.toFixed(2)}ms\n`;
  output += `  ${'Throughput (MB/s):'.padEnd(20)} ${stats.throughput.toFixed(2)}\n`;
  output += `  ${'HTTP Codes:'.padEnd(20)}\n`;

  Object.keys(stats.statusCodes).forEach(code => {
    output += `    ${code}xx: ${stats.statusCodes[parseInt(code, 10)]}\n`;
  });

  output += '------------------------------\n';

  return output;
}
