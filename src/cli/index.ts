import { Benchmark } from '../core/benchmark';
import { BenchmarkOptions } from '../types';
import * as yargs from 'yargs';

// Parse command-line arguments using yargs
const argv = yargs
   .usage('Usage: $0 [options]')
  .command('help', 'Provides information about available commands and their usage', () => {}, () => {
    yargs.showHelp();
  })
  .option('url', { type: 'string', demandOption: true, describe: 'The URL to benchmark' })
  .option('method', { type: 'string', default: 'GET', describe: 'HTTP method' })
  .option('headers', { type: 'string', default: '{}', describe: 'HTTP headers in JSON format' })
  .option('body', { type: 'string', default: '', describe: 'Request body' })
  .option('requests', { type: 'number', demandOption: true, describe: 'Number of requests to send' })
  .option('concurrency', { type: 'number', demandOption: true, describe: 'Number of concurrent connections' })
  .option('timeout', { type: 'number', default: 10, describe: 'Request timeout in seconds' })
  .option('duration', { type: 'number', default: 0, describe: 'Benchmark duration in milliseconds' })
  .option('output', { type: 'string', default: 'plain', choices: ['plain', 'json'], describe: 'Output format' })
  .argv as yargs.Arguments;

if (!argv._.length || argv._.includes('help')) {
  yargs.showHelp();
  process.exit(0);
}
const options: BenchmarkOptions = {
  url: argv.url as string,
  method: (argv.method as string).toUpperCase() as 'GET' | 'POST' | 'PUT' | 'DELETE',
  headers: JSON.parse(argv.headers as string),
  body: argv.body as string,
  requests: argv.requests as number,
  concurrency: argv.concurrency as number,
  timeout: argv.timeout as number,
  duration: argv.duration as number,
  output: argv.output as 'plain' | 'json',
};


// Create an instance of Benchmark and run it
const benchmark = new Benchmark(options);
benchmark.run();
