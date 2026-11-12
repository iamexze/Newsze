"""
Golden set. Every row is (surface form, expected entity or None).

Deliberately loaded with the cases that break naive matchers -- these are real
patterns from Indian market copy, and they are where precision is lost:
  * HDFC Bank vs HDFC Life vs HDFC AMC   (shared prefix, different companies)
  * SBI vs SBI Life vs SBI Card
  * Tata Motors vs Tata Steel vs Tata Power
  * ADR tickers (HDB, IBN, WIT) that differ from the NSE symbol
  * Devanagari forms
  * NEGATIVE cases that must resolve to None -- a matcher that resolves these
    is the dangerous kind
"""
GOLDEN = [
    ("HDFC Bank", "NSE:HDFCBANK"), ("HDFCBANK", "NSE:HDFCBANK"),
    ("HDFC Bank Ltd", "NSE:HDFCBANK"), ("HDFC Bank Limited", "NSE:HDFCBANK"),
    ("एचडीएफसी बैंक", "NSE:HDFCBANK"), ("HDB", "NSE:HDFCBANK"),
    ("HDFC Life", "NSE:HDFCLIFE"), ("HDFC Life Insurance", "NSE:HDFCLIFE"),
    ("HDFC AMC", "NSE:HDFCAMC"), ("HDFC Asset Management", "NSE:HDFCAMC"),
    ("ICICI Bank", "NSE:ICICIBANK"), ("IBN", "NSE:ICICIBANK"),
    ("ICICI Lombard", "NSE:ICICIGI"),
    ("Infosys", "NSE:INFY"), ("Infosys Ltd", "NSE:INFY"), ("INFY", "NSE:INFY"),
    ("इन्फोसिस", "NSE:INFY"),
    ("Tata Consultancy Services", "NSE:TCS"), ("TCS", "NSE:TCS"),
    ("Tata Motors", "NSE:TATAMOTORS"), ("Tata Motors Ltd", "NSE:TATAMOTORS"),
    ("Tata Steel", "NSE:TATASTEEL"), ("Tata Power", "NSE:TATAPOWER"),
    ("Reliance Industries", "NSE:RELIANCE"), ("RIL", "NSE:RELIANCE"),
    ("रिलायंस", "NSE:RELIANCE"), ("Reliance Industries Ltd", "NSE:RELIANCE"),
    ("Bajaj Finance", "NSE:BAJFINANCE"), ("Bajaj Finserv", "NSE:BAJAJFINSV"),
    ("Bajaj Auto", "NSE:BAJAJ-AUTO"),
    ("State Bank of India", "NSE:SBIN"), ("SBI", "NSE:SBIN"),
    ("SBI Life", "NSE:SBILIFE"), ("SBI Card", "NSE:SBICARD"),
    ("Axis Bank", "NSE:AXISBANK"), ("Kotak Mahindra Bank", "NSE:KOTAKBANK"),
    ("Wipro Ltd", "NSE:WIPRO"), ("WIT", "NSE:WIPRO"),
    ("Adani Enterprises", "NSE:ADANIENT"), ("Adani Ports", "NSE:ADANIPORTS"),
    ("Adani Ports and SEZ", "NSE:ADANIPORTS"), ("Adani Green Energy", "NSE:ADANIGREEN"),
    ("Nifty 50", "IDX:NIFTY50"), ("Bank Nifty", "IDX:NIFTYBANK"),
    ("BankNifty", "IDX:NIFTYBANK"),
    # --- negatives: must NOT resolve ---
    ("HDFC", None),                  # ambiguous since the merger: Bank? Life? AMC?
    ("Tata", None),                  # group, not a company
    ("Adani", None),                 # group
    ("Bajaj", None),                 # group
    ("the bank", None),
    ("Reliance Jio", None),          # unlisted subsidiary -- NOT Reliance Industries
    ("Tata Sons", None),             # unlisted holding company
    ("HDFC Securities", None),       # unlisted subsidiary
    ("ICICI Prudential AMC", None),  # different listed entity, not in our seed
    ("State Bank of Mauritius", None),
    ("Infosys BPM", None),           # subsidiary
]


# ---------------------------------------------------------------------------
# HARD SET -- surface forms that are NOT in the seed dictionary.
#
# The base GOLDEN set scores ~100% because it is drawn from the dictionary that
# the resolver was built from. That is a rigged test and tells us nothing. Real
# wire copy contains truncations, possessives, headline casing, typos and
# constructions nobody thought to seed. This is the set that produces the honest
# number, and it is the one the Phase 0 bar should be measured against.
# ---------------------------------------------------------------------------
HARD = [
    ("HDFC Bank's", "NSE:HDFCBANK"),            # possessive
    ("HDFC BANK", "NSE:HDFCBANK"),              # headline caps
    ("Hdfc bank", "NSE:HDFCBANK"),              # sloppy casing
    ("HDFC  Bank", "NSE:HDFCBANK"),             # double space
    ("Infosys'", "NSE:INFY"),
    ("INFOSYS LTD.", "NSE:INFY"),               # trailing period
    ("Tata Motors'", "NSE:TATAMOTORS"),
    ("TATA MOTORS LIMITED", "NSE:TATAMOTORS"),
    ("Reliance Inds", "NSE:RELIANCE"),          # abbreviation
    ("Reliance Industries Limited.", "NSE:RELIANCE"),
    ("Bajaj Fin", "NSE:BAJFINANCE"),            # ambiguous abbreviation (Finance/Finserv)
    ("State Bank Of India", "NSE:SBIN"),
    ("Kotak Mahindra Bank Ltd", "NSE:KOTAKBANK"),
    ("Axis Bank's", "NSE:AXISBANK"),
    ("Nifty-50", "IDX:NIFTY50"),                # hyphenated
    ("NIFTY BANK", "IDX:NIFTYBANK"),
    ("Bank Nifty index", "IDX:NIFTYBANK"),      # trailing noun
    ("Adani Ports & SEZ", "NSE:ADANIPORTS"),    # ampersand
    ("Tata Consultancy Svcs", "NSE:TCS"),       # abbreviation
    ("Wipro Limited", "NSE:WIPRO"),
    # --- hard negatives: superficially close, must NOT resolve ---
    ("HDFC Bank of Mauritius", None),           # not a real entity, close string
    ("Tata Motors Finance", None),              # unlisted subsidiary
    ("Reliance Power", None),                   # DIFFERENT listed company (ADAG group)
    ("Reliance Capital", None),                 # different company again
    ("Adani Wilmar", None),                     # not in seed
    ("Bajaj Holdings", None),                   # different listed entity
    ("Axis Max Life", None),
    ("Kotak Mahindra AMC", None),               # unlisted
    ("Nifty Next 50", None),                    # DIFFERENT index
    ("Nifty Midcap 50", None),                  # different index
    ("Infosys Finacle", None),                  # product, not entity
]
