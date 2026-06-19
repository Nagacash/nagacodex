#!/usr/bin/env bash
# Lightweight SEO crawl audit — repeatable baseline for seo-geo-audit skill.
# Usage: crawl-audit.sh <base-url> [output-json]
#
# Requires: curl, python3 (stdlib only)

set -euo pipefail

BASE_URL="${1:?Usage: crawl-audit.sh <base-url> [output-json]}"
OUTPUT="${2:-.seo/crawl-latest.json}"
BASE_URL="${BASE_URL%/}"

mkdir -p "$(dirname "$OUTPUT")"

python3 - "$BASE_URL" "$OUTPUT" <<'PY'
import json
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from html.parser import HTMLParser
from datetime import datetime, timezone

base, out_path = sys.argv[1], sys.argv[2]
issues = []
pages = {}
visited = set()
queue = [base + "/"]
max_pages = 200

class LinkParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.title = ""
        self.meta_robots = ""
        self.canonical = ""
        self.h1 = []
        self.in_title = False
        self.in_h1 = False
        self.json_ld = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "title":
            self.in_title = True
        if tag == "h1":
            self.in_h1 = True
        if tag == "a" and "href" in attrs:
            self.links.append(attrs["href"])
        if tag == "link" and attrs.get("rel") == "canonical" and "href" in attrs:
            self.canonical = attrs["href"]
        if tag == "meta":
            name = (attrs.get("name") or attrs.get("property") or "").lower()
            if name == "robots" and "content" in attrs:
                self.meta_robots = attrs["content"]
        if tag == "script" and attrs.get("type") == "application/ld+json":
            self._json_ld_tag = True
            self._json_ld_buf = []
        elif tag == "script":
            self._json_ld_tag = False

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False
        if tag == "h1":
            self.in_h1 = False
        if tag == "script" and getattr(self, "_json_ld_tag", False):
            self.json_ld.append("".join(self._json_ld_buf))
            self._json_ld_tag = False

    def handle_data(self, data):
        if self.in_title:
            self.title += data
        if self.in_h1:
            self.h1.append(data.strip())
        if getattr(self, "_json_ld_tag", False):
            self._json_ld_buf.append(data)


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "seo-geo-audit/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            body = resp.read().decode("utf-8", errors="replace")
            return resp.status, resp.headers.get("Content-Type", ""), body
    except urllib.error.HTTPError as e:
        return e.code, e.headers.get("Content-Type", ""), e.read().decode("utf-8", errors="replace")
    except Exception as e:
        return 0, "", str(e)


def normalize(url, href):
    if href.startswith(("mailto:", "tel:", "javascript:", "#")):
        return None
    return urllib.parse.urljoin(url, href)


def same_origin(a, b):
    pa, pb = urllib.parse.urlparse(a), urllib.parse.urlparse(b)
    return pa.netloc == pb.netloc


# robots.txt
robots_url = base + "/robots.txt"
status, _, robots_body = fetch(robots_url)
robots = {"url": robots_url, "status": status, "body": robots_body[:2000] if robots_body else ""}
if status != 200:
    issues.append({"severity": "critical", "axis": "crawlability", "issue": "robots.txt missing or error", "url": robots_url})

# sitemap.xml
sitemap_url = base + "/sitemap.xml"
smap_status, _, smap_body = fetch(sitemap_url)
sitemap = {"url": sitemap_url, "status": smap_status}
if smap_status != 200:
    issues.append({"severity": "high", "axis": "crawlability", "issue": "sitemap.xml missing or error", "url": sitemap_url})

while queue and len(visited) < max_pages:
    url = queue.pop(0)
    if url in visited:
        continue
    visited.add(url)
    status, ctype, body = fetch(url)
    entry = {"url": url, "status": status, "content_type": ctype}

    if status != 200:
        sev = "critical" if status in (0, 404, 500, 503) else "high"
        issues.append({"severity": sev, "axis": "crawlability", "issue": f"HTTP {status}", "url": url})
        pages[url] = entry
        continue

    if "html" not in ctype.lower():
        pages[url] = entry
        continue

    p = LinkParser()
    try:
        p.feed(body)
    except Exception:
        pass

    entry.update({
        "title": p.title.strip()[:120],
        "meta_robots": p.meta_robots,
        "canonical": p.canonical,
        "h1": [h for h in p.h1 if h],
        "has_json_ld": bool(p.json_ld),
        "internal_links": 0,
    })

    if not entry["title"]:
        issues.append({"severity": "medium", "axis": "titles", "issue": "missing title", "url": url})
    if "noindex" in (p.meta_robots or "").lower():
        issues.append({"severity": "high", "axis": "indexation", "issue": "noindex", "url": url})
    if not entry["h1"]:
        issues.append({"severity": "medium", "axis": "titles", "issue": "missing H1", "url": url})
    if not p.json_ld:
        issues.append({"severity": "low", "axis": "structured_data", "issue": "no JSON-LD", "url": url})

    for href in p.links:
        n = normalize(url, href)
        if n and same_origin(base, n):
            entry["internal_links"] += 1
            if n not in visited and n not in queue:
                queue.append(n.split("#")[0])

    pages[url] = entry

orphans_note = f"crawled {len(pages)} pages (max {max_pages})"
report = {
    "generated_at": datetime.now(timezone.utc).isoformat(),
    "base_url": base,
    "robots": robots,
    "sitemap": sitemap,
    "pages": pages,
    "issues": issues,
    "summary": {
        "pages_crawled": len(pages),
        "critical": sum(1 for i in issues if i["severity"] == "critical"),
        "high": sum(1 for i in issues if i["severity"] == "high"),
        "medium": sum(1 for i in issues if i["severity"] == "medium"),
        "low": sum(1 for i in issues if i["severity"] == "low"),
        "note": orphans_note,
    },
}

with open(out_path, "w") as f:
    json.dump(report, f, indent=2)

print(json.dumps(report["summary"], indent=2))
PY

echo "Wrote $OUTPUT" >&2
