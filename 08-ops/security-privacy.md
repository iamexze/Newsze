# Security & Privacy

**Status:** Draft v1 · **Date:** 2026-11-12 · **Baseline:** OWASP ASVS Level 2

---

## 1. Threat model — what we're actually protecting

| Asset | Threat | Why it matters here |
|---|---|---|
| **The raw signal corpus** | Exfiltration | It *is* Moat 1. Irreplaceable; cannot be re-accumulated |
| **The Accuracy Ledger's integrity** | Tampering (internal or external) | A ledger that can be edited is worth nothing. **This is the highest-integrity asset in the system** |
| Published content | Unauthorised publication | Someone publishing a false Impact under our name could move money and destroy trust in a day |
| Licensed market data | Over-distribution | A licence breach is a contractual and legal event (Gate G1) |
| User PII | Breach | DPDP/GDPR exposure, trust |
| Payment data | Fraud | Mitigated by never touching card data (PCI SAQ-A via Razorpay/Stripe) |
| Model/config | Unauthorised change | A silent threshold change could publish garbage at scale |

> Note the ordering: for most products PII tops the list. Here, **ledger integrity and
> publication control rank alongside it**, because the product's value *is* its
> trustworthiness.

## 2. Controls

### Application
Input validation at every boundary (Zod/Pydantic) · parameterised queries only · output
encoding · CSP with nonces, HSTS, X-Frame-Options, Referrer-Policy · CSRF tokens on
state-changing requests · rate limits at the edge before application code · secure cookie
flags · no secrets in client bundles (CI scans the build output).

### Authentication & session
Email/phone OTP + Google OAuth · short-lived access tokens + rotating refresh tokens in
httpOnly cookies · device list with remote revoke · **MFA mandatory for all staff roles** ·
step-up re-auth for kill switch, role assignment, PII access, refunds · brute-force
lockout + anomaly detection on OTP.

### Authorisation
RBAC per [user-roles.md](../01-requirements/user-roles.md) · **enforced at the API/serialiser,
never only in the UI** · Postgres RLS on tenant tables · least-privilege DB roles per service
(the ingest worker has no grant on `users`; no application role can DELETE from `signals`,
`outcomes` or `ledger_entries`) · per-org API keys with scopes and IP allowlists.

### Data
TLS 1.3 everywhere, mTLS between services · encryption at rest on all stores · field-level
encryption for phone numbers and payment references · **PII never in logs, analytics
properties, LLM prompts, or error reports** (scrubbed in `beforeSend` and in the log
formatter) · 🔴 **cache keys always include entitlement class** — the likeliest path to a
licensing breach is a shared CDN or Redis entry crossing tiers.

### Infrastructure
Private networking; no public database endpoints · bastion-free access via SSM/Tailscale ·
WAF + DDoS + bot management at Cloudflare · signed container images · quarterly secret
rotation and on every staff departure · **break-glass production access requires a second
approver and is auto-reviewed within 24h**.

### Supply chain
Pinned dependencies + lockfiles · automated vulnerability scanning with an SLA (critical 24h,
high 7d) · SBOM per release · provenance attestation on builds · **new dependencies require
review** — a financial data product is a supply-chain target.

### AI-specific
Prompt-injection defence: source content is **data, never instruction** — classification
prompts are structurally separated from ingested text, and outputs are schema-validated
before use · no tool access from content-processing LLM calls · output deny-list scan
(advice language) before publish · **no PII or user data ever enters a prompt** · model
responses never execute code or trigger actions directly.

## 3. Privacy (DPDP Act 2023 + GDPR)

| Principle | Implementation |
|---|---|
| Lawful basis | Contract for service delivery; consent for marketing |
| Purpose limitation | Behavioural data used for product improvement only. **Never sold, never shared with data brokers, never used to infer and trade on user positions** — stated in the privacy policy as a binding commitment |
| Minimisation | We collect what the product needs. No contacts, no device graph, no third-party tracking pixels on authenticated surfaces |
| Transparency | Plain-language privacy policy; a "what we know about you" page in account settings |
| Rights | Self-serve export (JSON + CSV) and deletion; 30-day hard purge; rectification in-product |
| Breach notification | Per DPDP/GDPR timelines; incident runbook includes the notification path |
| Children | Service not offered under 18 (financial content); age attestation at signup |
| Cross-border | Indian PII stays in ap-south-1; global replicas carry **content only** |
| Retention | Per [entities.md §17](../05-data-model/entities.md) |
| Consent manager | DPDP Consent Manager integration assessed in Phase 6 |

## 4. Compliance calendar
| Activity | Cadence |
|---|---|
| Access review (all staff roles) | Quarterly |
| **Data-licence audit** (what we display, to whom, at what latency, under which clause) | Quarterly |
| Secret rotation | Quarterly + on departure |
| Dependency audit | Monthly |
| Penetration test | Before public launch, then annually |
| Privacy-policy review | Semi-annual + on any new data use |
| Disaster-recovery drill | Quarterly |
| Incident-response tabletop (incl. "we published something wrong") | Semi-annual |

## 5. Responsible disclosure
`security@newze.com` with a published PGP key · safe-harbour commitment for good-faith
research · 90-day coordinated disclosure · acknowledgements page. A bug-bounty programme is
considered after public launch.
