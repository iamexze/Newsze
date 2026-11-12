"""
Spike S4 -- entity resolution precision on Indian market names.

Target: >=97% precision on NSE-500 + S&P-500 (PRD FR-M1/stage 3).
Precision matters far more than recall here: a MISSED entity costs us one link,
a WRONG entity publishes an impact against the wrong company. That is a
correction event, and corrections are the thing our credibility cannot spend.

Three-stage cascade, cheapest first:
    1. exact alias lookup      ~0 cost, highest precision
    2. normalised / fuzzy      ~0 cost, needs a confidence floor
    3. LLM disambiguation      real cost -- reached only on misses
Stage 3 is stubbed here; the spike measures how often stages 1-2 leave work for it,
because that number is what determines the production inference bill.
"""
import re, unicodedata
from difflib import SequenceMatcher

# --- seed dictionary. In production this is `entity_aliases`, mirrored to Redis.
SEED = {
    "NSE:HDFCBANK": ["HDFC Bank", "HDFCBANK", "HDFC Bank Ltd", "HDFC Bank Limited",
                     "HDB", "एचडीएफसी बैंक", "HDFC Bk"],
    "NSE:HDFCLIFE": ["HDFC Life", "HDFCLIFE", "HDFC Life Insurance",
                     "HDFC Standard Life"],
    "NSE:HDFCAMC":  ["HDFC AMC", "HDFCAMC", "HDFC Asset Management"],
    "NSE:ICICIBANK":["ICICI Bank", "ICICIBANK", "IBN", "ICICI Bank Ltd"],
    "NSE:ICICIGI":  ["ICICI Lombard", "ICICIGI", "ICICI Lombard General Insurance"],
    "NSE:INFY":     ["Infosys", "INFY", "Infosys Ltd", "Infosys Limited", "इन्फोसिस"],
    "NSE:TCS":      ["TCS", "Tata Consultancy", "Tata Consultancy Services"],
    "NSE:TATAMOTORS":["Tata Motors", "TATAMOTORS", "Tata Motors Ltd", "TTM"],
    "NSE:TATASTEEL":["Tata Steel", "TATASTEEL", "Tata Steel Ltd"],
    "NSE:TATAPOWER":["Tata Power", "TATAPOWER"],
    "NSE:RELIANCE": ["Reliance", "RELIANCE", "Reliance Industries", "RIL",
                     "Reliance Industries Ltd", "रिलायंस"],
    "NSE:BAJFINANCE":["Bajaj Finance", "BAJFINANCE", "Bajaj Finance Ltd"],
    "NSE:BAJAJFINSV":["Bajaj Finserv", "BAJAJFINSV"],
    "NSE:BAJAJ-AUTO":["Bajaj Auto", "BAJAJ-AUTO", "Bajaj Auto Ltd"],
    "NSE:SBIN":     ["SBI", "State Bank of India", "SBIN", "State Bank"],
    "NSE:SBILIFE":  ["SBI Life", "SBILIFE", "SBI Life Insurance"],
    "NSE:SBICARD":  ["SBI Card", "SBICARD", "SBI Cards"],
    "NSE:AXISBANK": ["Axis Bank", "AXISBANK", "Axis Bank Ltd"],
    "NSE:KOTAKBANK":["Kotak Bank", "KOTAKBANK", "Kotak Mahindra Bank", "Kotak"],
    "NSE:WIPRO":    ["Wipro", "WIPRO", "Wipro Ltd", "WIT"],
    "NSE:ADANIENT": ["Adani Enterprises", "ADANIENT", "Adani Ent"],
    "NSE:ADANIPORTS":["Adani Ports", "ADANIPORTS", "Adani Ports and SEZ", "APSEZ"],
    "NSE:ADANIGREEN":["Adani Green", "ADANIGREEN", "Adani Green Energy"],
    "IDX:NIFTY50":  ["Nifty", "Nifty 50", "NIFTY50", "Nifty50"],
    "IDX:NIFTYBANK":["Bank Nifty", "NIFTYBANK", "Nifty Bank", "BankNifty"],
}

STOP = {"ltd", "limited", "inc", "corp", "corporation", "plc", "the", "co",
        "company", "industries", "india"}


def norm(s):
    s = unicodedata.normalize("NFKC", s).lower()
    s = re.sub(r"[^\w\s-]", " ", s)
    toks = [t for t in s.split() if t not in STOP]
    return " ".join(toks)


class Resolver:
    def __init__(self, seed=SEED):
        self.exact, self.normed = {}, {}
        for eid, aliases in seed.items():
            for a in aliases:
                self.exact[a] = eid
                self.normed.setdefault(norm(a), set()).add(eid)

    def resolve(self, text, floor=0.88):
        """Returns (entity_id | None, stage, confidence)."""
        if text in self.exact:                                  # stage 1
            return self.exact[text], "exact", 1.0
        n = norm(text)
        if n in self.normed:
            ids = self.normed[n]
            if len(ids) == 1:
                return next(iter(ids)), "normalised", 0.97
            return None, "ambiguous->llm", 0.0                  # genuinely ambiguous
        best, score = None, 0.0                                 # stage 2
        for cand, ids in self.normed.items():
            r = SequenceMatcher(None, n, cand).ratio()
            if r > score:
                score, best = r, (next(iter(ids)) if len(ids) == 1 else None)
        if best and score >= floor:
            return best, "fuzzy", round(score, 3)
        return None, "unresolved->llm", round(score, 3)         # stage 3 handoff
