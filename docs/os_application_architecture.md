# MANDELA COMMUNICATIONS OS — APPLICATION DISCIPLINE & ARCHITECTURE MANUAL

**Document ID:** ARCH-OS-APPS-2026-002  
**Version:** 1.0.0 (Strict Architectural Standard)  
**Status:** Canonical Engineering Manual  

---

## 1. Operating System Mission & The Tri-Paradigm Standard

Mandela Communications OS transforms carrier telecommunications infrastructure into an intuitive, vendor-agnostic software operating system built on three foundational pillars:

1. **The Flexibility of Linux**:
   - Every system process, media socket, and dialplan is accessible and inspectable via the **Mandela Shell (`msh`)** CLI.
   - Core telecom commands (`call list`, `call barge`, `tcpdump`, `ps aux`, `cat /etc/sip.conf`) allow deep developer control without leaving the interface.

2. **The Familiarity of Windows**:
   - Predictable multi-window workspace where applications can be dragged, resized, minimized to taskbar/dock, and maximized.
   - Familiar **Task Manager** for CPU/RAM and 1,000 CPS FreeSWITCH capacity tracking.
   - Familiar **Sovereign File Explorer** for inspecting dialplan XML, NCCO JSON, CDR parquet, and PCAP traces.
   - Start Menu and quick launch panel.

3. **The UX of Apple OS**:
   - Elegant, uncluttered top macOS-style **Menu Bar** with global system commands, tenant status, and control tray.
   - Floating translucent **Dock** with scalable icons, running app indicator dots, and smooth magnification.
   - Apple traffic light window controls (Close, Minimize, Maximize).
   - Instant **Spotlight Search (⌘Space)** across all apps, active live calls, and commands.
   - Frosted glass **Control Center** with hardware sliders for FreeSWITCH master gain, African ASR sensitivity, and jitter buffers.

---

## 2. The Clean Desktop & Constant Return Navigation Anchor

A fundamental rule of this operating system is that **the user must never feel trapped or disoriented**:

1. **Clean Background**:
   - The desktop features a calm, luxurious sovereign obsidian background with ambient atmospheric lighting.
   - Large (64px) desktop grid icons allow direct, tactile application launching.
   - Desktop widgets display real-time network connectivity and digital clock.

2. **Unbroken Navigation Anchor**:
   - Regardless of which application is running or how many windows are open, the **Top Menu Bar** and **Floating Dock** remain permanently accessible.
   - The top bar features an **OS Breadcrumb** (`[ 🏠 Desktop ] > [ Active App Name ]`), enabling one-click minimization back to the clean desktop.
   - A dedicated **"Show Desktop" (F11 / ⌘D)** gesture button in the bottom-right corner immediately clears all windows to reveal the desktop.
   - Users can toggle between **Desktop OS Mode** (multi-window workspace) and **Studio Mode** (full-screen focus) at any time.

---

## 3. Strict Application Registry & Strategic Functions

Every feature, route, or piece of code written in the Mandela codebase MUST belong to one of the **10 Registered Strategic Applications**:

| Application ID | Application Name | Strategic Function | Connected Microservices & Infrastructure |
| :--- | :--- | :--- | :--- |
| `command_control` | **NOC Command & Control** | Live FreeSWITCH audio bridge monitoring, MOS telemetry, supervisor actions (Listen, Whisper, Barge), and ASR alert triggers. | FreeSWITCH Anycast ESL (1,000 CPS), Kamailio 5.7 SIP Proxy, RTPEngine NAT Traversal. |
| `terminal` | **Mandela Shell (`msh`)** | Linux telecom core CLI executing system diagnostics, process management (`ps aux`, `top`), live SIP call control, and raw packet captures. | Linux 6.8 RT-PREEMPT Kernel, FreeSWITCH ESL, Kamailio socket, RTPEngine control socket. |
| `agent_builder` | **AI Agent Creation Studio** | Natural language compiler translating operator instructions into reviewable voice agents, capability validation, simulation traces, and approval gates. | `@google/genai` Gemini 3.8 Flash SDK, 50 African Languages Neural ASR/TTS, NCCO Flow Compiler. |
| `workflow_builder` | **Visual Callflow Builder** | Drag-and-drop DAG workflow editor for VoiceXML 2.1 and NCCO call controls with step debugger and real-time XML/JSON export. | VoiceXML 2.1 Engine, Mandela Call Control State Machine, Carrier Webhooks. |
| `providers` | **Agnostic Provider Registry** | Pluggable vendor-agnostic adapter management across Telephony, Media, ASR, TTS, AI LLMs, and S3 Storage with live connection probes. | SIP OPTIONS prober, S3 Object Storage Vault, Neural Speech Gateway. |
| `task_manager` | **System Task & Resource Manager** | Windows-familiar process and thread telemetry, tracking CPU/RAM saturation, 1,000 CPS FreeSWITCH capacity, daemon restart, and End Task. | Linux cgroups / procfs, FreeSWITCH Core Thread Monitor, Kafka CDR Consumer. |
| `file_explorer` | **Sovereign Storage Explorer** | Dual-pane file manager for configuration files (`/etc/mandela`), CDR parquet streams (`/var/log/cdr`), and raw packet captures (`*.pcap`). | POSIX Virtual File System, Apache Parquet reader, Libpcap decoder. |
| `recordings` | **Call Recordings & Transcripts** | Audio waveform player with diarized multilingual transcripts, PII masking (credit card & account numbers), and raw PCAP packet trace export. | RTPEngine Recording Stream, S3 AES-GCM-256 Vault, Diarization & PII Sanitizer. |
| `dev_console` | **Developer Console & OpenAPI** | Interactive OpenAPI 3.1 REST documentation, copyable cURL snippets, and HMAC-SHA256 webhook test signature verification. | Mandela Versioned REST API (`/api/v1/*`), Webhook Dispatcher. |
| `architecture` | **Architecture Blueprint** | End-to-end interactive architecture viewer detailing carrier SIP trunks, FreeSWITCH media servers, RTPEngine, neural speech, and AI layers. | Mandela System 1 (Numbers), System 4 (Carrier SBC Core), System 7/9 (Speech & Cloud). |

---

## 4. Multi-Tenant Microservice Communication Rules

Every application must abide by these strict multi-tenant engineering invariants:

1. **Context Resolution**: Every microservice invocation carries the active `tenantId`, `role`, and `subscriptionTier`.
2. **Quota & Rate Limiting**: Applications meter CPS, ASR minutes, and storage consumption according to the active tenant's entitlement.
3. **Encryption at Rest**: Any call audio, transcript, or credential handled by an app must use AES-GCM-256 encryption.
4. **Separation of Duties**: Operational commands (Barge, PoP drain, SIM quarantine) require supervisor verification and are auditable in `/governance/audit-history`.

---

## 5. Disciplined Color System Guidelines

To avoid visual dissonance, the entire OS is locked to a disciplined luxury enterprise palette:

- **Canvas & Window Chrome**: Deep Obsidian & Zinc (`#09090b`, `#18181b`, `#27272a`).
- **Primary Accent**: Sovereign Emerald (`#10b981`, `#34d399`) for verified system health, active bridges, and primary CTAs.
- **Telemetry & Packet Accents**: Ice Slate / Cyan (`#06b6d4`, `#38bdf8`) strictly for network ports, packet traces, and media RTP streams.
- **Muted Text & Borders**: Cool Zinc (`#71717a`, `#a1a1aa`, `#27272a`).
- **Emergency / Danger**: Controlled Crimson (`#ef4444`) for BYE / hangup, end task, and quarantine.
