"""Run from the repo root:  pytest backend/tests -q   (no API key or network needed)"""
import main
import pytest
from fastapi.testclient import TestClient

c = TestClient(main.app)
FAKE = dict(truth_score=12, summary="s", scores=dict(hype=90, burnout_risk=95, hidden_selling=70, evidence_quality=5),
            key_findings=["a"], red_flags=[dict(quote="sleep is for the weak", reason="r", severity="high")],
            questions_to_ask=["q"], realistic_rewrite="r", recommendation="r", extracted_text="", facts=[dict(label="Fee", value="Rs 1800")], checklist=["Verify"])


@pytest.fixture(autouse=True)
def reset(monkeypatch):
    main._hits.clear()
    monkeypatch.setattr(main, "MODE", "live")
    monkeypatch.setattr(main, "client", object())

    async def fake(*a, **k):
        return dict(FAKE)

    async def no_domains(domains):
        return [dict(domain=d, status="unknown", age_days=None) for d in domains]
    monkeypatch.setattr(main, "run_model", fake)
    monkeypatch.setattr(main, "check_domains", no_domains)
    monkeypatch.setattr(main, "FEEDBACK_FILE", main.BACKEND_DIR / "test_feedback.jsonl")


def test_health():
    assert c.get("/health").json()["status"] == "online"


def test_analyze_text_ok_and_category_derived():
    r = c.post("/analyze", json={"content": "Sleep is for the weak, hustle 24/7 and win."})
    assert r.status_code == 200 and r.json()["category"] == "Misleading" and r.json()["demo"] is False


def test_too_short_and_too_long():
    assert c.post("/analyze", json={"content": "hi"}).status_code == 400
    assert c.post("/analyze", json={"content": "x" * (main.MAX_CHARS + 1)}).status_code == 400


def test_unconfigured(monkeypatch):
    monkeypatch.setattr(main, "MODE", "unconfigured")
    assert c.post("/analyze", json={"content": "a" * 30}).status_code == 503


def test_rate_limit():
    codes = [c.post("/analyze", json={"content": "a" * 30}).status_code for _ in range(main.RATE_LIMIT + 1)]
    assert codes[-1] == 429


def test_blocks_private_urls():
    assert c.post("/analyze", json={"url": "http://127.0.0.1:8000/health"}).status_code == 400


def test_bad_image():
    assert c.post("/analyze", json={"image": "!!notbase64!!"}).status_code == 400


def test_job_kind_and_payment_cap(monkeypatch):
    async def fake(text, image, mime, kind="advice", *a, **k):
        assert kind == "job"
        return dict(FAKE, truth_score=90)
    monkeypatch.setattr(main, "run_model", fake)
    r = c.post("/analyze", json={"kind": "job", "content": "You are selected! Pay Rs 1800 registration fee to join."}).json()
    assert r["kind"] == "job" and r["truth_score"] == 25 and r["category"] == "Misleading"


def test_signals():
    s = main.signals("Mail hr@gmail.com on WhatsApp. Pay Rs 500 processing fee. 100% guarantee")
    assert "free email" in s and "payment" in s and "WhatsApp" in s


def test_domains_and_statuses():
    assert main.base_domain("mail.acme.co.in") == "acme.co.in"
    assert main.find_domains("Mail hr@gmail.com or visit https://www.fast-jobs.in/apply") == ["gmail.com", "fast-jobs.in"]
    assert main.domain_status("gmail.com", None) == "free_email"
    assert main.domain_status("x.in", 10) == "new" and main.domain_status("x.in", 200) == "recent"
    assert main.domain_status("x.in", 2000) == "established" and main.domain_status("x.in", None) == "unknown"
    assert "free email" in main.domain_hint([dict(domain="gmail.com", status="free_email")])


def test_job_response_includes_domain_checks():
    r = c.post("/analyze", json={"kind": "job", "content": "Mail hr@fastjobs.in to confirm your joining today please."}).json()
    assert r["domain_checks"][0]["domain"] == "fastjobs.in"


def test_pdf_accepted_and_source_label():
    import base64
    r = c.post("/analyze", json={"image": base64.b64encode(b"%PDF-1.4 test").decode(), "image_mime": "application/pdf"})
    assert r.status_code == 200 and r.json()["source"] == "pdf"


def test_youtube_detection():
    assert main.YT_RX.match("https://youtu.be/dQw4w9WgXcQ").group(1) == "dQw4w9WgXcQ"
    assert main.YT_RX.match("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=5").group(1) == "dQw4w9WgXcQ"
    assert main.YT_RX.match("https://example.com/watch?v=dQw4w9WgXcQ") is None


def test_video_url_goes_to_model(monkeypatch):
    seen = {}

    async def fake(text, image, mime, kind="advice", video=None, hint=""):
        seen["video"] = video
        return dict(FAKE)

    async def title(u):
        return "A video"
    monkeypatch.setattr(main, "run_model", fake)
    monkeypatch.setattr(main, "youtube_title", title)
    r = c.post("/analyze", json={"url": "https://youtu.be/dQw4w9WgXcQ"}).json()
    assert r["source"] == "video" and r["source_title"] == "A video" and "dQw4w9WgXcQ" in seen["video"]


def test_parse_claims():
    raw = 'Here you go ```json {"claims":[{"claim":"50 LPA average","verdict":"Disputed","explanation":"x"},{"claim":"y","verdict":"???","explanation":"z"}]} ```'
    got = main.parse_claims(raw)
    assert got[0]["verdict"] == "disputed" and got[1]["verdict"] == "unverified"
    with pytest.raises(ValueError):
        main.parse_claims("no json here")


def test_claims_needs_live_ai(monkeypatch):
    monkeypatch.setattr(main, "MODE", "demo")
    assert c.post("/claims", json={"text": "a" * 40}).status_code == 503


def test_feedback_saved():
    f = main.FEEDBACK_FILE
    f.unlink(missing_ok=True)
    assert c.post("/feedback", json={"rating": "wrong", "kind": "job", "category": "Misleading", "score": 12, "comment": "x" * 500}).json()["ok"]
    rec = __import__("json").loads(f.read_text().splitlines()[0])
    f.unlink()
    assert rec["rating"] == "wrong" and len(rec["comment"]) == 300
    assert c.post("/feedback", json={"rating": "bad"}).status_code == 422


def test_negated_fee_is_not_a_payment_request():
    assert main.asks_for_payment("Pay Rs 1,800 registration fee today.")
    assert not main.asks_for_payment("No registration fee is required at any stage.")
    assert not main.asks_for_payment("We never ask you to pay Rs 500 or any deposit.")
    assert "payment" not in main.signals("There is no processing fee. Reply by Friday.")


def test_refund_alone_is_not_a_warning_signal():
    assert "guarantee" not in main.signals("7-day refund and a full syllabus.")
    assert "guarantee" in main.signals("100% placement guarantee in top MNCs")


# ---------- Pages and links ----------
FRONTEND = main.FRONTEND_DIR
PAGES = ["/", "/check", "/check/job-offer", "/check/course", "/features", "/how-it-works", "/practice", "/history", "/faq", "/about",
         "/privacy", "/terms", "/check/internship", "/check/scholarship", "/check/college-placement", "/check/salary",
         "/check/scam-message", "/compare-courses", "/scam-intelligence", "/features/ask-ai", "/results/123"]


@pytest.mark.parametrize("path", PAGES)
def test_every_page_is_served(path):
    r = c.get(path)
    assert r.status_code == 200 and "text/html" in r.headers["content-type"]


def test_unknown_page_gets_friendly_404_but_api_clients_get_json():
    page = c.get("/no-such-page", headers={"accept": "text/html"})
    assert page.status_code == 404 and "could not find" in page.text
    assert c.get("/no-such-page").json() == {"detail": "Not Found"}
    assert c.get("/check.html").status_code == 404      # pages are served on clean URLs only


def test_scripts_styles_and_icons_exist():
    for f in (
        "styles.css", "sw.js",
        "scripts/common.js", "scripts/layout.js", "scripts/theme.js",
        "assets/manifest.webmanifest", "assets/icon.svg", "assets/icon-192.png",
        "common.js", "layout.js", "theme.js", "manifest.webmanifest", "icon.svg", "icon-192.png"
    ):
        assert c.get(f"/{f}").status_code == 200, f


def test_html_files_only_reference_files_that_exist():
    import re
    for html in (FRONTEND / "pages").glob("*.html"):
        for ref in re.findall(r'(?:src|href)="/([\w.-]+(?:/[\w.-]+)*\.(?:js|css|png|svg|webmanifest))"', html.read_text(encoding="utf-8")):
            assert (FRONTEND / ref).exists(), f"{html.name} references missing {ref}"


def test_no_dead_internal_links():
    import re
    targets = set()
    for html in (FRONTEND / "pages").glob("*.html"):
        targets |= set(re.findall(r'href="(/[^"#?]*)', html.read_text(encoding="utf-8")))
    for js in ("features.js", "layout.js"):
        targets |= set(re.findall(r"(?:path|href):\s*'(/[^'#?]*)", (FRONTEND / "scripts" / js).read_text(encoding="utf-8")))
        targets |= set(re.findall(r"\['[^']+',\s*'(/[^'#?]*)'\]", (FRONTEND / "scripts" / js).read_text(encoding="utf-8")))
    assert len(targets) > 15
    for t in sorted(targets):
        if "." in t.rsplit("/", 1)[-1]:
            assert (FRONTEND / t.lstrip("/")).exists(), t      # an asset
        else:
            assert c.get(t).status_code == 200, t


def test_risk_score_is_the_inverse_of_the_trust_score_in_the_frontend():
    assert "riskOf = (r) => 100 - clamp(r.truth_score)" in (FRONTEND / "scripts" / "common.js").read_text(encoding="utf-8")
