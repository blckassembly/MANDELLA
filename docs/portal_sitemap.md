# MANDELA CORE — MASTER PORTAL SITEMAP & NAVIGATION ARCHITECTURE

**Document ID:** ARCH-SITEMAP-2026-001  
**Version:** 1.0.0 (Production Release)  
**Classification:** Core System Architecture & Multi-Tenant Portal Specifications  
**Status:** Approved  

---

## 1. Architectural Access Model & Session Resolution

Mandela Core operates as a unified, multi-tenant sovereign communications operating system. Every session resolves context deterministically before granting access to any portal destination:

```
User → Identity → Organization / Tenant → Active Role → Product Entitlements → Allowed Actions → Workspace
```

### Core Separation-of-Duties Principles
1. **Tenant Isolation**: Organizations execute within cryptographically isolated tenants. Switching organizational context requires an explicit session re-evaluation.
2. **Boundary Enforcement**: Customer users (external enterprises, developers, fintechs) are restricted from accessing internal engineering toolchains, network infrastructure administration, government regulator connectors, fraud evidence archives, or platform-wide operational controls.
3. **Dual-Key Governance**: Consequential infrastructure mutations (such as session border controller PoP draining, BGP peering failovers, and SIM-swap emergency quarantine) mandate two-person approval workflows.
4. **Least Privilege**: Personas resolve only the navigation trees and functional sub-tabs mandated by their active role and subscription entitlement.

---

## 2. Master Portal Navigation Sitemap

```
MANDELA CORE UNIFIED PLATFORM
│
├── [1] CUSTOMER PORTAL                (External Clients, FinTechs, Developers)
├── [2] OPERATIONS PORTAL              (NOC Operators, Provisioning, Carrier Ops)
├── [3] ENGINEERING PORTAL             (Core Network Engineers, SREs, Architects)
├── [4] SECURITY & GOVERNANCE PORTAL   (CISO, SecOps, Legal, Regulatory Compliance)
└── [5] PLATFORM ADMINISTRATION PORTAL (Platform Owners, Billing Leads, SuperAdmins)
```

---

## 3. Detailed Portal Navigation Specifications

### 3.1 [Portal 1] Customer Portal
**Primary Audience:** External Enterprise Clients, Developers, Agritech Operators, FinTechs, and Commercial Consumers.  
**Access Scope:** Self-service provisioning, consumption monitoring, billing, API credential management, and organization team administration.

| Route / URI | Section Name | Key Capabilities & Functional Sub-views | Required Permission |
| :--- | :--- | :--- | :--- |
| `/customer/overview` | **Overview** | • Real-time wallet balance & metered consumption gauges<br/>• Active lines, DIDs, SMS throughput, and IVR channels summary<br/>• Critical account alerts, maintenance notices, and quick-start links | `portal.customer.view` |
| `/customer/my-products` | **My Products** | • Provisioned E.164 phone numbers and active DID inventory<br/>• Multilingual IVR voice flows (Zawadi, Adeola, Amani)<br/>• Active SMPP v5 binds & 2-way SMS short codes<br/>• Direct-to-Device 3GPP Rel-17 satellite NTN subscriptions | `products.view` |
| `/customer/activate` | **Activate Products** | • E.164 Sovereign DID Search & instant reservation wizard<br/>• GSMA SGP.22 eSIM QR code cryptographic issuance<br/>• Number Portability (MNP) transfer request submission<br/>• SIP trunk credentials generator (Asterisk, FreeSWITCH, 3CX) | `products.provision` |
| `/customer/api-developer` | **API & Developer Center**| • Live & Sandbox API Keys management (HMAC-SHA256 secrets)<br/>• Webhook endpoint registrations with delivery retry logs<br/>• Interactive API Console & Swagger / OpenAPI 3.1 playground<br/>• SDK downloads (TypeScript, Python, Go, Java, cURL snippets) | `developer.keys.manage` |
| `/customer/usage` | **Usage & Consumption** | • Granular voice call duration & FreeSWITCH media minutes<br/>• High-volume SMS / USSD delivery receipts & latency charts<br/>• Storage footprint (call audio recordings, OCR KYC docs)<br/>• Exportable CDR telemetry reports (CSV, Parquet, JSON) | `usage.view` |
| `/customer/billing` | **Billing & Subscriptions**| • Current subscription tier (Starter, Growth, Enterprise, Sovereign)<br/>• Prepaid wallet auto-reload triggers & payment methods<br/>• Invoices, VAT tax receipts, and payment history<br/>• Enterprise contract add-ons and capacity reservation upgrades | `billing.manage` |
| `/customer/organization` | **Organization & Team** | • Organization profile & registered corporate entity details<br/>• Team member invitation & role assignment (Admin, Dev, Billing)<br/>• Single Sign-On (SAML 2.0 / OIDC) configuration<br/>• Mandatory Multi-Factor Authentication (MFA / FIDO2) policy | `org.members.manage` |
| `/customer/identity-security`| **Identity & Security** | • Active user sessions, IP geofencing, and credential rotation<br/>• Customer-side audit logs (login attempts, API key usages)<br/>• Mutual TLS (mTLS) certificate uploads for SIP / webhook endpoints<br/>• Data residency policies and export requests | `security.customer.view` |
| `/customer/support` | **Support Center** | • Support ticket submission (Severity 1 to 4)<br/>• Ticket status tracker & resolution timeline<br/>• Multi-turn Gemini AI Telecom Assistant for immediate troubleshooting<br/>• System operational status & scheduled maintenance windows | `support.tickets.create` |
| `/customer/notifications` | **Notifications** | • Usage threshold alerts (80%, 90%, 100% wallet or quota)<br/>• Delivery receipt failure alerts and rate changes<br/>• Security advisories (new IP logins, key revocations)<br/>• Notification channel preferences (Email, SMS, Webhook) | `notifications.read` |
| `/customer/settings` | **Settings** | • Company metadata, billing email, and technical contacts<br/>• Default timezone, language preference, and dial codes<br/>• System webhook URL defaults & notification webhooks<br/>• Dangerous actions (Deactivate account, purge test data) | `org.settings.manage` |

---

### 3.2 [Portal 2] Operations Portal
**Primary Audience:** Network Operations Center (NOC) Engineers, Telecom Tier-2/3 Specialists, Customer Provisioning Specialists, and Carrier Integration Leads.  
**Access Scope:** Real-time Continental telemetry, provisioning queues, SIP call traces, trunk arbitration, and incident triage.

| Route / URI | Section Name | Key Capabilities & Functional Sub-views | Required Permission |
| :--- | :--- | :--- | :--- |
| `/ops/overview` | **Operations Overview** | • Continental traffic heat map & real-time Concurrent Calls (CPS)<br/>• FreeSWITCH media server cluster capacity (1,000 calls/node)<br/>• Global Mean Opinion Score (MOS) index & jitter distribution<br/>• Active P1/P2 operational incident banner | `ops.telemetry.view` |
| `/ops/customer-queue` | **Customer Service Queue**| • Pending customer onboarding requests & verification queue<br/>• Corporate KYC validation and regulatory documentation review<br/>• Provisioning approval tickets for high-volume enterprise DIDs<br/>• Direct communication channel to customer administrators | `ops.customers.manage` |
| `/ops/provisioning` | **Provisioning Requests** | • E.164 Number inventory allocation & national block assignments<br/>• Mobile Number Portability (MNP) inter-carrier dispute queues<br/>• eSIM profile batch generation (GSMA SGP.22 SAS-SM)<br/>• Satellite terminal VSAT authorization & ground beam bindings | `ops.provision.execute` |
| `/ops/activations` | **Service Activation** | • Wholesale carrier bilateral SIP trunk validation<br/>• Direct SMPP v5 binds to African MNOs (Safaricom, MTN, Vodacom)<br/>• SIGTRAN SS7 link alignment and routing context check<br/>• Test call dispatch & end-to-end PDU trace verification | `ops.activations.write` |
| `/ops/telecom-noc` | **Telecom Operations** | • Kamailio 5.7 SIP Proxy & FreeSWITCH media servers dashboard<br/>• Live SIP Ladder trace inspector (INVITE, 100 Trying, 180, 200 OK)<br/>• 30-Second Packet Diagnostic trigger with live RTP/PCAP stream<br/>• PoP traffic draining, maintenance cordoning, and dynamic scaling | `ops.sbc.control` |
| `/ops/network-noc` | **Network Operations** | • Subsea fiber link status (Equiano, WACS, 2Africa, SAT-3, SEACOM)<br/>• Continental BGP Anycast mesh routing & peer latency<br/>• Satellite NTN ground station teleports (14 continental dishes)<br/>• IXP interconnect health & packet loss telemetry | `ops.network.view` |
| `/ops/incidents` | **Incident Management** | • Active incident registry (Sev-1 Outage to Sev-4 Informational)<br/>• Automated incident timeline, responder assignments, and war room<br/>• Telecommunications SLA breach timers & customer notification bus<br/>• Post-mortem documentation generator & root-cause analysis | `ops.incidents.manage` |
| `/ops/escalations` | **Escalations** | • Carrier Grey-route quarantine & voice CLI spoofing escalations<br/>• High-loss routing path quarantine & automated route demotion<br/>• Priority customer technical escalations<br/>• Inter-carrier technical dispatch tickets | `ops.escalations.manage`|
| `/ops/service-health` | **Service Health** | • Per-PoP real-time health (Lagos, Nairobi, Johannesburg, Cairo)<br/>• ASR/TTS neural speech model latency (50 African dialects)<br/>• SMPP message queue depth, retry rate, and TPS utilization<br/>• RTPEngine NAT traversal buffer health & packet loss | `ops.health.view` |
| `/ops/change-requests` | **Change Requests** | • Scheduled maintenance change calendar & impact assessments<br/>• Peer review sign-offs for SBC dialplan modifications<br/>• Carrier rate deck revision approvals & LCR profile updates<br/>• Emergency rollback plan attachments & post-change audits | `ops.change.submit` |
| `/ops/reports` | **Operational Reports** | • Wholesale carrier settlement mediation & margin reports<br/>• Carrier quality ranking (ASR, ALOC, PDD, NER)<br/>• Regulatory E.164 utilization compliance filings<br/>• SLA availability reports for sovereign enterprise customers | `ops.reports.read` |

---

### 3.3 [Portal 3] Engineering Portal
**Primary Audience:** Core Telephony Engineers, Platform Infrastructure Architects, Site Reliability Engineers (SREs), and QA Automation Leads.  
**Access Scope:** Service mesh topology, code & module registry, OpenAPI contracts, CI/CD pipelines, load injectors, and distributed traces.

| Route / URI | Section Name | Key Capabilities & Functional Sub-views | Required Permission |
| :--- | :--- | :--- | :--- |
| `/eng/overview` | **Engineering Overview** | • End-to-end service mesh topology (Kamailio, FreeSWITCH, Express)<br/>• Microservice health, CPU/RAM container saturation, thread pools<br/>• Build & release velocity (daily deploy frequency, MTTR, change fail)<br/>• Critical runtime exception rates and Sentry / OpenTelemetry alerts | `eng.core.view` |
| `/eng/service-catalog` | **Service Catalog** | • Microservices directory (SBC Core, ASR Engine, Dataverse, NTN)<br/>• Internal gRPC, Protobuf, and REST endpoint definitions<br/>• Service ownership, slack channels, on-call schedules, and runbooks<br/>• Service health dependencies & SLA contracts | `eng.services.view` |
| `/eng/module-registry` | **Module Registry** | • Machine-readable module inventory (25 system modules)<br/>• Implementation status tracker (`EXISTING`, `PARTIAL`, `MOCK`)<br/>• Source code paths, test coverage %, and known technical debt<br/>• Migration status and architectural remediation roadmap | `eng.modules.view` |
| `/eng/architecture` | **Architecture & Data Flows**| • Interactive dependency graph (Carrier → SBC → Media → AI → Storage)<br/>• In-memory vs persistent state topology (Redis, PostgreSQL, S3)<br/>• VoiceXML 2.1 & NCCO execution pipeline flow diagrams<br/>• 3GPP Rel-17 NTN Doppler shift compensation pipeline spec | `eng.architecture.view`|
| `/eng/api-contracts` | **API Contracts & Schemas** | • Versioned OpenAPI 3.1 specifications (`/api/v1/openapi.json`)<br/>• AsyncAPI specifications for WebSocket real-time events<br/>• Schema diff validator (breaking change detection)<br/>• FreeSWITCH ESL (Event Socket Library) command specifications | `eng.contracts.view` |
| `/eng/deployments` | **Deployments & Canary** | • Multi-region Kubernetes cluster deployment management<br/>• Canary release traffic split controls (0% to 100% traffic shift)<br/>• Active container images, commit SHA tags, and helm releases<br/>• Instant rollback trigger & health check telemetry | `eng.deploy.execute` |
| `/eng/ci-cd` | **CI/CD Pipelines** | • Automated build pipelines status (Lint, TypeScript, Unit, E2E)<br/>• Artifact container registry scan results (Trivy, Grype vulnerabilities)<br/>• Docker build logs and caching benchmarks<br/>• Deployment pipeline gates and approval triggers | `eng.cicd.view` |
| `/eng/testing-qa` | **Testing & QA Suite** | • Synthetic SIP traffic load injectors (10,000 Concurrent Calls)<br/>• Automated MOS speech quality evaluation harness<br/>• Network impairment simulators (packet loss, jitter, latency spikes)<br/>• Multi-dialect ASR accuracy regression test runner | `eng.testing.execute` |
| `/eng/logs-telemetry` | **Logs & Telemetry** | • Distributed tracing dashboard (OpenTelemetry, Jaeger)<br/>• eBPF XDP packet drop logs and kernel event stream<br/>• Centralized structured logs query engine with regex filter<br/>• High-resolution latency histograms for SIP transaction states | `eng.telemetry.view` |
| `/eng/feature-flags` | **Feature Flags** | • Dynamic feature flag manager (Growth, Beta, Sovereign flags)<br/>• Tenant-scoped canary flag assignments<br/>• Percentage-based rollout dials and kill-switches<br/>• Audit log of flag toggles and configuration revisions | `eng.flags.manage` |
| `/eng/dependency-graph` | **Dependency Graph** | • Deep dependency explorer across internal & external components<br/>• Third-party package CVE security vulnerability scanner<br/>• Database schema migration dependency graph (Drizzle / PostgreSQL)<br/>• Inter-service circular dependency detector | `eng.dependencies.view`|
| `/eng/change-history` | **Change History** | • Centralized engineering changelog & commit ledger<br/>• Database DDL schema migration history<br/>• Configuration version history with unified diff views<br/>• Release notes generator for customer-facing deployments | `eng.history.view` |

---

### 3.4 [Portal 4] Security & Governance Portal
**Primary Audience:** Chief Information Security Officer (CISO), SOC Lead Analysts, Legal Counsel, and Sovereign Telecommunications Regulators.  
**Access Scope:** Sovereign data residency enforcement, SIM-swap quarantine, voice biometrics, audit logs, and kill-switches.

| Route / URI | Section Name | Key Capabilities & Functional Sub-views | Required Permission |
| :--- | :--- | :--- | :--- |
| `/governance/overview` | **Governance Overview** | • Continental sovereignty compliance posture score (AU Malabo)<br/>• Active cyber threats, DDoS scrubbing status, and SIM-box alerts<br/>• Open regulatory data requests & judicial interception warrants<br/>• High-risk identity verification escalations summary | `sec.overview.view` |
| `/governance/identity-policies`| **Identity & KYC Policies** | • System 16 sovereign KYC tiers (Tier 1 Basic to Tier 3 Biometric)<br/>• GSMA SGP.22 eSIM cryptographic attestation policy<br/>• National ID verification adapters rules (NIN, Aadhaar, BVN)<br/>• Facial recognition & liveness detection strictness thresholds | `sec.identity.manage` |
| `/governance/fraud-monitoring`| **Fraud & Anomaly Monitoring**| • Spatial-Temporal Graph Neural Network (ST-GNN) SIM-box alerts<br/>• Geodesic velocity engine (impossible travel between cell towers)<br/>• High-frequency SMS toll fraud & revenue share attack detection<br/>• Automated Grey-route detection with caller-ID manipulation | `sec.fraud.view` |
| `/governance/kyc-operations` | **KYC Operations** | • Sovereign identity manual review & document verification inbox<br/>• Purpose-bound PII viewing tokens (access justification logging)<br/>• Document forgery & deepfake identity rejection workflow<br/>• Identity denial appeal processing and resolution recording | `sec.kyc.review` |
| `/governance/country-compliance`| **Country Compliance** | • 54 African country sovereign regulatory licensing tracker<br/>• In-country data residency enforcement (Dataverse local storage)<br/>• Lawful Interception (ETSI / CALEA) interface compliance<br/>• Universal Service Fund (USF) telecom levy calculation audits | `sec.compliance.view` |
| `/governance/access-reviews` | **Access Reviews** | • Quarterly Privileged Access Management (PAM) audit logs<br/>• Separation-of-Duties conflict detector (e.g. Developer + Approver)<br/>• Dormant employee and contractor credential automatic revocation<br/>• Access certification sign-off workflows for compliance officers | `sec.access.audit` |
| `/governance/suspicious-activity`| **Voice Biometrics & Deepfakes**| • RawNet3 neural acoustic deepfake audio analysis stream<br/>• Voice biometric anti-spoofing confidence score thresholds<br/>• CLI Spoofing & STIR/SHAKEN certificate validation failures<br/>• Voice fraud honeypot recordings & audio fingerprint repository | `sec.biometrics.manage` |
| `/governance/approval-center`| **HITL Approval Center** | • Two-Person Authorization (Two-Man Rule) approval queue<br/>• PoP traffic draining & BGP failover sign-off requests<br/>• Cryptographic root key rotation & license revocation requests<br/>• Mass SMS campaign content approval for high-risk categories | `sec.approvals.execute` |
| `/governance/audit-history` | **Immutable Audit Ledger**| • Tamper-evident cryptographic ledger (SHA-256 hash chains)<br/>• Immutable record of every administrative login and config mutation<br/>• Legal discovery export (cryptographically signed JSON-LD / PDF)<br/>• Real-time ledger integrity verification & anomaly scanner | `sec.audit.read` |
| `/governance/data-retention` | **Data Retention & Privacy** | • Automated data expiration policies (CDR retention, audio recordings)<br/>• Right-to-be-forgotten / GDPR / NDPR automated deletion queues<br/>• Cryptographic shredding verification certificates<br/>• Redaction rules for call transcripts & PII masking in logs | `sec.privacy.manage` |
| `/governance/emergency-controls`| **Emergency Controls** | • Global & Regional network kill-switches (Instant SIP traffic cut)<br/>• SIM-Swap automated containment lockdown & carrier freeze<br/>• Blacklisted IMEI / IMSI broadcast across African MNO mesh<br/>• Incident containment isolation mode (read-only posture switch) | `sec.emergency.execute` |

---

### 3.5 [Portal 5] Platform Administration Portal
**Primary Audience:** Platform Super-Administrators, Executive Directors, Billing Infrastructure Leads, and Multi-Tenant Architects.  
**Access Scope:** Tenant account provisioning, global pricing models, African country dialplans, and platform infrastructure fleet.

| Route / URI | Section Name | Key Capabilities & Functional Sub-views | Required Permission |
| :--- | :--- | :--- | :--- |
| `/admin/overview` | **Platform Overview** | • Global platform utilization, active tenants, and revenue run-rate<br/>• Total provisioned E.164 numbers across all 54 African countries<br/>• Consolidated platform health index & multi-region database lag<br/>• System-wide licensing & regulatory status summary | `admin.platform.view` |
| `/admin/tenant-provisioning`| **Tenant Provisioning** | • New organization creation wizard & tenant slug allocation<br/>• Dedicated sovereign schema generation in MANDELA Dataverse<br/>• Tenant master admin credential assignment & invite link generation<br/>• Tenant resource quota assignment (CPS, storage, SMS TPS) | `admin.tenants.provision`|
| `/admin/organizations` | **Organizations Directory**| • Global directory of all sovereign operators, telcos, and fintechs<br/>• Tenant status controls (Active, Suspended, Delinquent, Quarantined)<br/>• Subscription tier allocation (Starter SME to Sovereign Infrastructure)<br/>• Tenant consumption override dials and enterprise custom pricing | `admin.tenants.manage` |
| `/admin/role-templates` | **Role Templates Matrix** | • Master RBAC role templates editor (Admin, Operator, SRE, Auditor)<br/>• Granular capability flag assignment across all 5 portals<br/>• Cross-tenant role inheritance & constraint specifications<br/>• Built-in security role template versioning | `admin.roles.manage` |
| `/admin/permission-management`| **Permission Management** | • Attribute-Based Access Control (ABAC) rule engine<br/>• Dynamic permission assignment based on IP, MFA, and time<br/>• Separation-of-Duties constraint matrix enforcement rules<br/>• Permission revocation audit trail | `admin.permissions.manage`|
| `/admin/product-catalog` | **Product Catalog** | • Commercial tier configuration (Pricing, included allowances)<br/>• Add-on service pricing (Satellite bandwidth, ASR minutes, DIDs)<br/>• Promotional discount codes, enterprise contract custom tiers<br/>• Paywall gate configuration & feature availability rules | `admin.catalog.manage` |
| `/admin/billing-config` | **Billing Configuration** | • Payment gateway connectors (Stripe, Flutterwave, M-Pesa B2B, Paystack)<br/>• Multi-currency exchange rate tables (USD, KES, NGN, ZAR, GHS)<br/>• Automated VAT and local telecom excise tax calculation engines<br/>• Dunning management, grace periods, and suspension triggers | `admin.billing.manage` |
| `/admin/country-config` | **Country & Dialplan Config**| • 54 African national dial code profiles and E.164 numbering plans<br/>• National regulatory authority parameters and filing schedules<br/>• Alphanumeric sender ID mandatory registration requirements<br/>• Emergency dial code routing (e.g., 999, 112, 911) per territory | `admin.country.manage` |
| `/admin/infrastructure` | **Infrastructure Fleet** | • Hardware & Cloud Node fleet (14 Teleports, 6 Kamailio/FreeSWITCH PoPs)<br/>• Storage cluster replication (Ceph, MinIO S3, PostgreSQL Drizzle)<br/>• Bare-metal server inventory, firmware versions, and warranties<br/>• Cloud provider cost tracking (GCP, AWS, Sovereign Data Centers) | `admin.infra.manage` |
| `/admin/service-registry` | **Service Registry** | • Centralized service discovery registry (Consul / Etcd endpoints)<br/>• Dynamic DNS anycast endpoint mappings<br/>• External carrier peering IP whitelist & firewall sync<br/>• Model gateway routing (Gemini 3.8 Flash, Claude 3.5, Local ASR) | `admin.registry.manage` |
| `/admin/platform-health` | **Platform Health** | • Global platform uptime monitors and multi-region heartbeat<br/>• Sovereign Dataverse CDC pipeline latency & replication queue<br/>• Cache hit-rate and ephemeral state synchronization (Redis cluster)<br/>• SRE on-call rotation schedules and escalation paging system | `admin.health.view` |

---

## 4. Cross-Portal Role-Based Access Matrix (RBAC)

| User Persona | Customer Portal | Operations Portal | Engineering Portal | Security & Governance | Platform Administration |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Customer Administrator** | **Full Access** | *No Access* | *No Access* | *No Access* | *No Access* |
| **Customer Developer** | **API / Webhooks / Docs** | *No Access* | *No Access* | *No Access* | *No Access* |
| **Customer Billing Manager**| **Billing / Usage Only** | *No Access* | *No Access* | *No Access* | *No Access* |
| **NOC Operations Specialist**| *No Access* | **Full Access** | *Read Only* | *Escalate Only* | *No Access* |
| **Telecom Core Engineer** | *No Access* | *Read Only* | **Full Access** | *Audit Only* | *No Access* |
| **Platform SRE / DevOps** | *No Access* | *Read Only* | **Full Access** | *Incident View* | **Infra / Health** |
| **SOC Security Analyst** | *No Access* | *Read Only* | *Logs Only* | **Full Access** | *No Access* |
| **Regulatory / Compliance** | *No Access* | *Audit Only* | *No Access* | **KYC & Audit** | *Country Config* |
| **Platform Super-Admin** | *Tenant Impersonate* | **Full Access** | **Full Access** | **Full Access** | **Full Access** |

*Note: All tenant switching and cross-portal transitions generate cryptographic audit events logged to `/governance/audit-history`.*

---

## 5. Source Code Mapping & Implementation Linkages

The 5 Core Portals map directly to the active source modules in the repository:

| Portal Destination | Primary Front-End Source Locations | Backend Handlers & API Routes |
| :--- | :--- | :--- |
| **1. Customer Portal** | • `/src/components/customer/CustomerPortalView.tsx`<br/>• `/src/components/MyNumbersView.tsx`<br/>• `/src/components/SoftphoneModal.tsx`<br/>• `/src/components/messaging/CampaignDispatcher.tsx` | • `/server.ts` (Number provisioning & metered billing)<br/>• `/src/services/aiService.ts`<br/>• `/src/services/geminiChatService.ts` |
| **2. Operations Portal** | • `/src/components/sbc/SbcNocDashboard.tsx`<br/>• `/src/components/sbc/PacketDiagnosticModal.tsx`<br/>• `/src/components/interconnect/RateDeckManager.tsx`<br/>• `/src/components/interconnect/LcrRoutingEngine.tsx`<br/>• `/src/components/interconnect/CdrMediationStream.tsx`<br/>• `/src/components/agnostic-os/CommandControlDashboard.tsx` | • `/server.ts` (`POST /api/v1/calls/supervisor`)<br/>• `/server.ts` (`POST /api/v1/workflows/simulate`)<br/>• `/server.ts` (`POST /api/v1/providers/test`) |
| **3. Engineering Portal** | • `/src/components/agnostic-os/VisualWorkflowBuilder.tsx`<br/>• `/src/components/agnostic-os/AgentBuilderStudio.tsx`<br/>• `/src/components/agnostic-os/DeveloperConsoleView.tsx`<br/>• `/src/components/stress/UxArchitectureWalkthrough.tsx` | • `/server.ts` (`GET /api/v1/openapi.json`)<br/>• `/server.ts` (`POST /api/v1/agents/generate-from-prompt`)<br/>• `/src/services/euiccAttestationService.ts` |
| **4. Security & Governance**| • `/src/components/edge/EdgeDefenseSuite.tsx`<br/>• `/src/components/edge/SiemFabricSuite.tsx`<br/>• `/src/components/edge/AiAnomalyVoiceSuite.tsx`<br/>• `/src/components/edge/SocC2Suite.tsx`<br/>• `/src/components/ComplianceRegistry.tsx` | • `/server.ts` (`POST /api/chat` - Telecom Security Copilot)<br/>• `/src/components/edge/` (SIM-swap quarantine & deepfake filters) |
| **5. Platform Admin** | • `/src/components/auth/TenantLoginModal.tsx`<br/>• `/src/components/onboarding/OnboardingWizardModal.tsx`<br/>• `/src/components/dataverse/GovernanceRbac.tsx`<br/>• `/src/components/dataverse/SchemaDesigner.tsx`<br/>• `/src/components/dataverse/EventPipeline.tsx` | • `/src/hooks/useGlobalSessionPersistence.ts`<br/>• `/src/data/mockMultiTenantData.ts`<br/>• `/src/data/mockDataverseData.ts` |

---

## 6. SRE Reliability & Offline Operational Safeguards

In accordance with sovereign telecommunications resilience standards:
- **Workbox Offline Cache**: Critical read-only views for Customer, NOC Operations, and Security incident monitoring remain operational during remote transmission breaks via registered service worker caches.
- **HMAC Signatures & Webhook Buses**: All external webhook notifications across Customer, Operations, and Security destinations require SHA-256 HMAC signature verification with unique, rotatable shared secrets.
- **Fail-Safe Circuit Breakers**: If downstream AI models or external telemetry services become degraded, portals fall back to deterministic, rules-based operational profiles with zero system downtime.
