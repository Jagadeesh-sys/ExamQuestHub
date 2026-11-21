# Security Summary

**Reviewed Files**: 36
**Issues Resolved**: 10

### Issues Resolved
| Area | File | Line | What Was Happening | Impact | Status | How It Was Fixed |
|---|---|---|---|---|---|---|
| Open Database Writes | `firestore.rules` | 105 | Public users without sign-in could create, overwrite, or delete documents in `questions` and `mockQuestions`, and `admins` / `syllabusProgress` allowed broad listing. | High | Needs Follow-Up | Restricted `questions` and `mockQuestions` writes to verified admins (`isAdmin()`), split `get`/`list` rules, validated URL fields and document IDs, and added a catch-all deny rule. Updated `firestore.rules` in repo; publish to the `examquesthub` Firebase project via Firebase CLI or Console to enforce remotely. |
| Offline Admin Auth Bypass | `src/context/AuthContext.jsx` | 14 | A legacy client-side `localStorage` flag (`eqh_demo_admin_user`) or unverified email check could grant admin UI access without a valid Firebase Auth session. | High | Fixed | Removed client-only demo admin sign-in, purged legacy `localStorage` tokens on startup/logout, required verified Firebase Auth accounts for bootstrap admins, and added email/password validation plus a 5-attempt / 30-second sign-in cooldown. |
| Unsafe Link & Image URLs | `src/utils/security.js` | 18 | Dynamically loaded `applyUrl`, `officialUrl`, `pdfUrl`, `downloadUrl`, `paperUrl`, `sourceUrl`, and `imageUrl` values were passed directly into `<a href>` and `<img src>`, permitting `javascript:` or SVG script data URI injection. | High | Fixed | Created `sanitizeExternalUrl`, `sanitizeDocumentUrl`, and `sanitizeMediaUrl` to permit only `https://`, `http://`, single-slash `/...` routes, base64 PDFs, and raster image data URIs, blocking scriptable schemes and protocol-relative `//` redirects. |
| Card, Feed & Upload Rendering | `src/components/CurrentAffairCard.jsx` | 27 | Components and uploaders (`CurrentAffairCard`, `StraightLineCurrentAffair`, `NotificationCard`, `StraightLineNotification`, `LiveAlertsBar`, `EditorialCurrentAffairsSection`, `MockTestCard`, `OfficialMockTestCard`, `DocumentFileUploader`, `ImagePasteUploader`) rendered unvalidated URLs and accepted SVG URLs on paste. | High | Fixed | Wired all media, document, and external portal links through `sanitizeMediaUrl`, `sanitizeDocumentUrl`, and `sanitizeExternalUrl`, and rejected unsafe pasted/entered URLs in uploaders with clear error messages. |
| Page Download & Portal Links | `src/pages/JobDetailPage.jsx` | 139 | Public pages (`JobDetailPage`, `JobsPage`, `CurrentAffairDetailPage`, `PreviousPapersPage`, `StudyMaterialPage`, `AdmitCardsPage`, `ResultsPage`, `SyllabusDetailPage`, `TestSeriesPage`, `MockTestEnginePage`, `MockTestsHubPage`) bound unvalidated database/JSON URLs to `href` and `src`. | Medium | Fixed | Sanitized all rendered notification, paper, syllabus PDF, source, and question diagram URLs before rendering links or images. |
| JSON Prototype Pollution & Floods | `src/pages/AdminPage.jsx` | 439 | Raw `JSON.parse` across bulk imports (`AdminPage`, `AdminMockTestsTab`, `syllabusService`) and local caches (`firestoreService`, `rrbMockService`, `MockTestEnginePage`, `TestSeriesPage`, `MockTestsHubPage`, `questionStats`, `errorLogger`) accepted unbounded payloads and special keys (`__proto__`, `constructor`, `prototype`). | Medium | Fixed | Added `safeJsonParse` and `stripDangerousKeys` to drop dangerous prototype keys during parsing/saving and enforced payload byte caps (2 MB–6 MB) plus batch item caps (200–5,000 items). |
| Tab-Napping on External Links | `src/components/Footer.jsx` | 65 | Several `target="_blank"` links across `Header`, `Footer`, `CurrentAffairCard`, `AdminSyllabusTab`, `CurrentAffairsPage`, `SyllabusDetailPage`, `TestSeriesPage`, and `MockTestEnginePage` used `rel="noreferrer"` without `noopener`. | Low | Fixed | Upgraded all `target="_blank"` anchors across `src/` to `rel="noopener noreferrer"`. |
| Write Path Payload Sanitization | `src/firebase/firestoreService.js` | 427 | Client write helpers passed raw `fields` directly to `setDoc` without stripping prototype keys or checking URL schemes prior to local cache updates. | Medium | Fixed | Wrapped write payloads (`saveUpdate`, `saveCurrentAffair`, `bulkSaveCurrentAffairs`, `saveResource`, `saveQuestion`, `saveMockQuestion`, `bulkSaveMockQuestions`) with `stripDangerousKeys`, URL sanitizers, and inline data URI size checks. |
| Topic Fallback Media Filtering | `src/firebase/topicImages.js` | 1 | Topic image URL validation allowed any non-empty string rather than enforcing safe media schemes. | Low | Fixed | Delegated `sanitizeTopicImageUrl` to `sanitizeMediaUrl` so malformed or scriptable image URLs fall back safely to vetted topic photography. |
| Missing HTTP Security Headers | `vercel.json` | 58 | Response headers lacked `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`, and `Cross-Origin-Opener-Policy`. | Low | Fixed | Added `Referrer-Policy`, `Permissions-Policy`, HSTS, and `Cross-Origin-Opener-Policy: same-origin-allow-popups` (preserving Firebase Google sign-in popups). |

### Safeguards Verified
| Area | File | How It's Protected |
|---|---|---|
| HTML & Dynamic Script Execution | `src/` | Verified zero uses of `dangerouslySetInnerHTML`, `innerHTML`, `eval`, or `new Function` anywhere in application source code. |
| Client Secret Hygiene | `src/firebase/config.js` | Firebase client configuration uses public `VITE_*` project identifiers with no private service-account secrets or hardcoded API credentials. |
| Error Log Redaction | `src/utils/errorLogger.js` | `sanitizeMessage` redacts `apiKey`, `password`, `token`, `bearer`, and `AIza...` strings before recording diagnostics to memory or `sessionStorage`. |
| Dependency Audit | `package.json` | Checked installed packages with `bun audit`; 4 transitive advisories exist in upstream build/compat chains (`@grpc/grpc-js` under `firebase`, `glob`/`minimatch` under `vite-plugin-pwa`), none reachable from untrusted browser runtime input (`firebase@13.1.0` and `vite-plugin-pwa@2.0.0` are already on current major releases). |

---

## PoC Verification

### 1. Unauthorized Database Write Attempt on Question Banks
#### Summary
| Field | Value |
|---|---|
| Issue Type | Missing Access Control on Database Writes |
| Impact | High |
| Affected File | `firestore.rules:105` |
| Test Scenario | Unauthenticated client calls `setDoc(doc(db, 'mockQuestions', 'hack-1'), { question: 'tampered' })` or `deleteDoc(...)` against `questions` or `mockQuestions`. |

#### How It Was Fixed
Changed `match /questions/{id}` and `match /mockQuestions/{id}` in `firestore.rules` from `allow write: if true;` to `allow create, update: if isAdmin() && isValidId(id) && isValidQuestionPayload(request.resource.data);` and `allow delete: if isAdmin() && isValidId(id);`, where `isAdmin()` requires a signed-in verified bootstrap email or an existing `admins/{uid}` document.

#### Step-by-Step Trace
| Step | What Happens in the Code | Outcome |
|---|---|---|
| 1 | Unauthenticated request hits `match /mockQuestions/{id}` (`firestore.rules:111`) | Enters rule evaluation |
| 2 | `allow create, update:` invokes `isAdmin()` (`firestore.rules:23`) which calls `bootstrapAdmin()` (`firestore.rules:8`) and `signedIn()` (`firestore.rules:4`) | `request.auth != null` evaluates to `false` |
| 3 | Firestore security engine rejects write before mutating data | **Blocked (Permission Denied)** |

#### Conclusion
**Fix Verified** - Once published to the `examquesthub` Firebase project, unauthenticated or non-admin users can no longer write or delete `questions` or `mockQuestions` documents.

---

### 2. Offline / LocalStorage Admin Authentication Bypass
#### Summary
| Field | Value |
|---|---|
| Issue Type | Client-Side Admin Session Spoofing |
| Impact | High |
| Affected File | `src/context/AuthContext.jsx:78` |
| Test Scenario | Attacker runs `localStorage.setItem('eqh_demo_admin_user', '{"uid":"demo-admin-uid-101"}')` in DevTools and reloads `/admin`, or submits an unconfigured/unverified account. |

#### How It Was Fixed
Removed the fallback that trusted `eqh_demo_admin_user` from `localStorage`, added active removal of that key on startup (`AuthContext.jsx:81`) and logout (`AuthContext.jsx:205`), enforced `isVerifiedBootstrapAccount()` (`AuthContext.jsx:26`), and enforced Firebase Auth login plus brute-force cooldown (`AuthContext.jsx:144`).

#### Step-by-Step Trace
| Step | What Happens in the Code | Outcome |
|---|---|---|
| 1 | `AuthProvider` mounts on `/admin` (`src/context/AuthContext.jsx:78`) | Runs `useEffect` initialization |
| 2 | Line 81 calls `window.localStorage?.removeItem(LEGACY_LOCAL_ADMIN_KEY)` | Forged token is deleted |
| 3 | Firebase `onAuthStateChanged` finds no signed-in user (`src/context/AuthContext.jsx:92`) | `setCurrentUser(null); setIsAdmin(false)` |
| 4 | Any sign-in attempt without verified bootstrap/admin status hits `resolveAdminStatus` (`src/context/AuthContext.jsx:116`, `167`) | Signs user out and denies access |

#### Conclusion
**Fix Verified** - Client-side storage manipulation cannot grant admin privileges; Firebase Authentication is mandatory.

---

### 3. Scriptable URL (`javascript:` / SVG Data URI) Injection in Links & Images
#### Summary
| Field | Value |
|---|---|
| Issue Type | Unsafe Dynamic Link and Media Scheme Rendering |
| Impact | High |
| Affected File | `src/utils/security.js:18`, `src/components/CurrentAffairCard.jsx:27` |
| Test Scenario | Malicious record or admin paste supplies `sourceUrl: "javascript:alert(document.cookie)"` or `imageUrl: "data:image/svg+xml,<svg onload=alert(1)>"`. |

#### How It Was Fixed
`sanitizeExternalUrl`, `sanitizeDocumentUrl`, and `sanitizeMediaUrl` strip control characters, validate the scheme using `new URL(...)`, allow only `http:`, `https:`, single-slash `/...` internal paths, base64 PDFs, and raster image MIME types (`png|jpeg|jpg|webp|gif`), rejecting `javascript:`, `vbscript:`, `//evil.com`, and `data:image/svg+xml`.

#### Step-by-Step Trace
| Step | What Happens in the Code | Outcome |
|---|---|---|
| 1 | `CurrentAffairCard` receives `item.sourceUrl = "javascript:alert(1)"` (`src/components/CurrentAffairCard.jsx:28`) | Passed to `sanitizeExternalUrl(item.sourceUrl, '')` |
| 2 | `sanitizeExternalUrl` (`src/utils/security.js:29-36`) parses protocol `javascript:` which fails `parsed.protocol === 'https:' || 'http:'` | Returns `''` fallback |
| 3 | `safeSourceUrl ? <a href={safeSourceUrl} ...>` (`src/components/CurrentAffairCard.jsx:103`) | Anchor tag is omitted from DOM |
| 4 | `ImagePasteUploader` (`src/components/ImagePasteUploader.jsx:156`, `222`) passes SVG data URI to `sanitizeMediaUrl(..., '')` | Returns `''` and displays validation error |

#### Conclusion
**Fix Verified** - Neither clickable links nor image tags nor clipboard uploads can render or execute `javascript:` or SVG script URIs.

---

### 4. Prototype Pollution & Oversized Payload in Bulk JSON Imports
#### Summary
| Field | Value |
|---|---|
| Issue Type | Prototype Key Injection & Resource Exhaustion on JSON Parse |
| Impact | Medium |
| Affected File | `src/utils/security.js:93`, `src/pages/AdminPage.jsx:439` |
| Test Scenario | Admin bulk import receives `'[{"title":"Job","__proto__":{"isAdmin":true}}]'` or a 15 MB / 50,000-item JSON file. |

#### How It Was Fixed
Replaced raw `JSON.parse` with `safeJsonParse(raw, null, maxBytes)` (`src/utils/security.js:93`) which caps byte size before parsing, drops `__proto__`, `constructor`, and `prototype` in the `JSON.parse` reviver and recursively in `stripDangerousKeys()`, and enforces per-batch item caps in `AdminPage.jsx` (500 items), `AdminMockTestsTab.jsx` (5,000 items), and `syllabusService.js` (200 items).

#### Step-by-Step Trace
| Step | What Happens in the Code | Outcome |
|---|---|---|
| 1 | Bulk import submits payload to `importParseStatus` / `handleCaBulkImport` (`src/pages/AdminPage.jsx:439`, `493`) or `handleGkBulkImport` (`src/pages/AdminPage.jsx:631`) | Calls `safeJsonParse(raw, null, 2 * 1024 * 1024)` |
| 2 | If size > 2 MB (`src/utils/security.js:96`), `safeJsonParse` returns `null` immediately | Oversized payload rejected |
| 3 | Valid-size JSON runs through reviver `DANGEROUS_KEYS.has(key) ? undefined : val` (`src/utils/security.js:98`) and `stripDangerousKeys` (`src/utils/security.js:75`) | `__proto__` / `constructor` / `prototype` keys stripped |
| 4 | Write helpers (`src/firebase/firestoreService.js:427`) re-run `stripDangerousKeys` before persisting | **Handled Safely** |

#### Conclusion
**Fix Verified** - Prototype pollution keys and oversized JSON imports are blocked before affecting application objects or Firestore writes.
