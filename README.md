# metrics-monkey 🐒🚀

The `metrics-monkey` is a no-nonsense, high-performance CLI HTTP benchmarking tool that's a swiss army knife for developers and performance engineers who want to:

- 📈 **Supercharge Web Performance:** Benchmark your web services to spot performance bottlenecks and optimize your application for top-notch speed and reliability.
- 🔄 **Test API Endpoints:** Simulate various traffic patterns, including high concurrency, large number of requests, and prolonged durations, to ensure your API endpoints can handle the load.
- 🔍 **Assess API Dependencies:** Verify if the APIs you depend on can withstand the load and determine their maximum capacity.

## Installation

You can install metrics-monkey via npm:
```bash
npm install -g metrics-monkey
```

## Usage

```bash
metrics-monkey --url <url> --method <method> --requests <requests> --concurrency <concurrency> --timeout <timeout> --duration <duration> --headers <headers> --body <body> --output <output>
```

**Options:**
- `--url:` The URL to benchmark.
- `--method:` The HTTP method to use (GET, POST, PUT, DELETE).
- `--requests:` The total number of requests to make.
- `--concurrency:` The number of concurrent requests.
- `--timeout:` The timeout for each request in seconds.
- `--duration:` The duration of the test in milliseconds.
- `--headers:` The headers to include with each request (in JSON format).
- `--body:` The body content to include with POST or PUT requests.
- `--output:` The output format (plain or json).

## Examples 
### 1: Basic GET Request Benchmark
```bash
metrics-monkey --url https://jsonplaceholder.typicode.com/posts --method GET --requests 1000 --concurrency 50 --timeout 10 --duration 60000
```

**Description:** Benchmarks a GET request to https://jsonplaceholder.typicode.com/posts. The test will issue 1000 requests with a concurrency of 50, a timeout of 10 seconds per request, and will run for 6 seconds. 

**Example Output:**
```bash
progress [======================================--] 94% | ETA: 1s | 943/1000

Benchmark Results
------------------------------
  Requests per Second: 163.67
  Latency (ms):       
    Avg:       250.38ms
    Stdev:     341.99ms
    Max:       2.26ms
  Throughput (MB/s):   0.00
  HTTP Codes:         
    200xx: 943
------------------------------

Total time: 6s
```

### 2: POST Request with Custom Headers
```bash
metrics-monkey --url https://api.example.com/data --method POST --requests 500 --concurrency 20 --timeout 5 --headers '{"Authorization": "Bearer my-token"}' --body '{"key": "value"}' 
```
**Description:** Sends 500 POST requests to https://api.example.com/data, including a custom Authorization header and a JSON body. The tool will use a concurrency of 20, a timeout of 5 seconds per request

**Example Output:**
```bash
progress [========================================] 100% | ETA: 0s | 500/500

Benchmark Results
------------------------------
  Requests per Second: 75.41
  Latency (ms):       
    Avg:       260.07ms
    Stdev:     304.49ms
    Max:       1.99ms
  Throughput (MB/s):   0.00
  HTTP Codes:         
    0xx: 500
------------------------------

Total time: 6s
```
### 3: PUT Request with Extended Duration
```bash
metrics-monkey --url https://api.example.com/update --method PUT --requests 2000 --concurrency 100 --timeout 15 --duration 120000 
```
**Description:** Performs a PUT request to https://api.example.com/update with 2000 requests and a concurrency of 100. The test will run for 2 minutes (120,000 milliseconds) with each request timing out after 15 seconds. The results will be displayed in plain text format.

**Example Output:**
```bash
progress [========================================] 100% | ETA: 0s | 2000/2000

Benchmark Results
------------------------------
  Requests per Second: 38.01
  Latency (ms):       
    Avg:       2595.13ms
    Stdev:     3039.69ms
    Max:       12.60ms
  Throughput (MB/s):   0.00
  HTTP Codes:         
    0xx: 2000
------------------------------

Total time: 52s
```
