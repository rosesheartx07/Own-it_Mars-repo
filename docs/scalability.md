# Hosting and scalability

Own it: Mars is a **static website**: one HTML file (`game/dist/mars-outpost.html`, about 1.9 MB with the music inside). There is no server, database or account. This page explains how many players GitHub Pages can serve and when to move to another host.

> Limits below come from GitHub's documentation ("GitHub Pages limits") and can change. Check them again before relying on these numbers.

## What matters (and what does not)
- **Players at the same time: not a limit.** Each player downloads the file once and the game runs in their own browser. 30 players in the same minute is just 30 downloads of 1.9 MB (about 58 MB).
- **Monthly traffic (bandwidth) is the real limit.** GitHub Pages has a **soft limit of 100 GB per month**. "Soft" means GitHub may email us asking to reduce traffic or add a CDN instead of shutting the site down at once.
- **Other limits** (we are far below them): published site up to 1 GB (ours is under 4 MB), deployments must finish in 10 minutes, and rate limits (HTTP 429) may apply to abusive request patterns.
- **GitHub does not show a bandwidth meter** for Pages, so we cannot see how close we are. See "How to know where we are".

## How much traffic is that?
Assumption: every play loads the full file once (1.94 MB). A returning player whose browser kept a copy uses less, so these numbers are on the safe side. The fonts load from Google Fonts and do not count toward GitHub's traffic.

| Scenario | Loads per month | Traffic per month | Share of the 100 GB soft limit |
|---|---|---|---|
| One class of 30, one time | 30 | 58 MB | 0.06% |
| One class every school day (22 days) | 660 | 1.3 GB | 1.3% |
| 100 classes in a month | 3,000 | 5.8 GB | 6% |
| 10,000 players | 10,000 | 19 GB | 19% |
| 25,000 players | 25,000 | 49 GB | 49% |
| 50,000 players | 50,000 | 97 GB | 97% |
| 100,000 players | 100,000 | 194 GB | 194% (over the limit) |

**In short:** GitHub Pages can serve about **50,000 plays per month** with the current file size. That is far more than a pilot with schools needs.

## When to migrate
| Signal | What to do |
|---|---|
| About **25,000 plays per month** (about 50 GB) | Prepare the move: create the copy on another host and test it. Not urgent. |
| About **35,000–40,000 plays per month** (70–80 GB) | Move now, before reaching the limit. |
| An email from GitHub about traffic, or HTTP 429 errors | Move right away. |
| We want ads, payments, accounts or a server | GitHub Pages does not allow commercial use or SaaS. Move to a host that does. |
| Dozens of schools use it every day | Move to a host with a CDN and support. |

## Cheap ways to stretch the limit first
- **Make the music smaller.** The song is most of the file (about 1.4 MB as MP3, stored inside the HTML). A shorter loop or a lower bitrate could cut the file to about 1.2 MB, which would fit about 80,000 plays per month.
- **Load the music only after the player taps** (browsers already require a tap before playing audio).
- **Keep screenshots and videos out of the game file.** Put them in the README or in a separate page.

## How to migrate (about 10 minutes)
1. Create a free account on another static host (for example Cloudflare Pages or Netlify) and connect the repository, or upload `game/dist/mars-outpost.html` as the home page. Check that host's current limits and terms first.
2. Open the new link and test the whole game on a phone and on a laptop.
3. Change the link in the **Play** section of `README.md`.
4. Replace the content of GitHub Pages' `index.html` with a redirect to the new link, so old links still work.
5. Update this page with the new host and its limits.

## How to know where we are
- The game collects no data and makes no network calls, so **it cannot count plays**.
- GitHub's repository traffic page shows visits to the repository, **not** to the game.
- To measure real usage we would need a visit counter without cookies or personal data. If we add one, we must update the privacy statement in `docs/limitations.md` and `docs/how-to-play.md` first.
- Until then, use proxies: number of schools in the pilot × students per class × plays per student.

## Plan B
The game is a single file that works offline. If GitHub Pages is down, the same file can be published on any other static host in minutes, and the README link changed. Keep the second host ready (account created and a tested copy) before the demo day.
