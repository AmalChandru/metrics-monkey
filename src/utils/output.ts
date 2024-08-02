export function formatStatistics(stats: {
  requestsPerSecond: number;
  avgLatency: number;
  stdevLatency: number;
  maxLatency: number;
  statusCodes: Record<number, number>;
  throughput: number;
}): string {
  let output = 'Statistics\n';
  output += '------------------------------\n';
  output += `  Avg      Stdev      Max\n`;
  output += `  Reqs/sec    ${stats.requestsPerSecond.toFixed(2)}    ${stats.stdevLatency.toFixed(2)}    ${stats.maxLatency.toFixed(2)}\n`;
  output += `  Latency      ${stats.avgLatency.toFixed(2)}us   ${stats.stdevLatency.toFixed(2)}us    ${stats.maxLatency.toFixed(2)}ms\n`;
  output += `  HTTP codes:\n`;

  Object.keys(stats.statusCodes).forEach(code => {
    output += `    ${code}xx - ${stats.statusCodes[parseInt(code, 10)]}\n`;
  });

  output += `  Throughput:   ${stats.throughput.toFixed(2)} MB/s\n`;
  output += '------------------------------\n';

  return output;
}
