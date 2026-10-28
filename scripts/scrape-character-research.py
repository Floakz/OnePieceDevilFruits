"""Use the existing character scraper for this site's small, curated roster.

Raw research stays outside public/ and is never bundled into the website.
Run with the scraper's Python environment. See docs/characters.md.
"""

import argparse
import json
import sys
from pathlib import Path


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--scraper", required=True, type=Path)
    parser.add_argument("--output", type=Path, default=Path(".character-research.local"))
    args = parser.parse_args()
    sys.path.insert(0, str(args.scraper.resolve()))

    from scrapy.crawler import CrawlerProcess
    from scrapy.settings import Settings
    from one_piece_character_data_scraper.spiders.char_info import OnepieceSpider

    root = Path(__file__).resolve().parent.parent
    profiles = json.loads((root / "src/data/characterProfiles.json").read_text(encoding="utf-8"))
    output = args.output.resolve()
    temporary = output.with_name(output.name + ".partial.local")
    temporary.unlink(missing_ok=True)

    class RosterSpider(OnepieceSpider):
        name = "arabasta_roster"

        async def start(self):
            for profile in profiles:
                yield self.article_request(profile["source"])

    settings = Settings()
    settings.setmodule("one_piece_character_data_scraper.settings")
    settings.set("FEEDS", {str(temporary): {"format": "json", "overwrite": True}})
    settings.set("HTTPCACHE_ENABLED", False)
    process = CrawlerProcess(settings)
    process.crawl(RosterSpider)
    process.start()
    if not temporary.exists():
        raise SystemExit("No research exported. Check the crawl errors above.")
    records = json.loads(temporary.read_text(encoding="utf-8"))
    fetched = {record["article"]["url"] for item in records for record in item.values()}
    missing = {profile["source"] for profile in profiles} - fetched
    failures = [error for item in records for record in item.values() for error in record.get("crawl_errors", [])]
    print(f"Exported {len(records)}/{len(profiles)} profiles; {len(failures)} section errors.")
    if missing or failures:
        raise SystemExit(f"Incomplete research. Missing pages: {sorted(missing)}; section errors: {failures}")
    temporary.replace(output)


if __name__ == "__main__":
    main()
