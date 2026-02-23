
import urllib.request
import urllib.error

BASE_URL = "http://localhost:10087"

def check_url(path):
    url = f"{BASE_URL}{path}"
    print(f"Checking {url}...")
    try:
        with urllib.request.urlopen(url) as response:
            if response.status == 200:
                content = response.read().decode('utf-8')
                # Check if it looks like a valid HTML page (has <title> or <div id="app"> or similar)
                if "<html" in content or "<!DOCTYPE html>" in content:
                    print(f"✅ {url} is accessible (Status: {response.status})")
                    return True
                else:
                    print(f"⚠️ {url} returned 200 but content doesn't look like HTML. First 100 chars: {content[:100]}")
                    return False
            else:
                print(f"❌ {url} returned status {response.status}")
                return False
    except urllib.error.HTTPError as e:
        print(f"❌ {url} returned status {e.code}")
        return False
    except Exception as e:
        print(f"❌ Error accessing {url}: {e}")
        return False

def run_tests():
    # In Hash mode, all requests to / or /index.html should work.
    # Requests to /search (without hash) will likely fail if server doesn't have rules, but that's expected.
    # We check if index.html loads, which contains the JS bundle that handles routing.
    
    routes = [
        "/",
        "/index.html"
    ]

    results = {}
    for route in routes:
        results[route] = check_url(route)

    print("\n=== Test Summary ===")
    all_passed = True
    for route, passed in results.items():
        status = "PASS" if passed else "FAIL"
        print(f"{route}: {status}")
        if not passed:
            all_passed = False

    if all_passed:
        print("\n✅ Root and index.html accessible. Hash mode likely working.")
    else:
        print("\n❌ Root or index.html failed.")

if __name__ == "__main__":
    run_tests()
