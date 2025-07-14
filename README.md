🧠 EduCrypt — Project Overview (Split App Version)
EduCrypt is a two-app mobile system built with Expo + React Native:

🎓 educrypt-creator/ – for university staff to issue and sign academic credentials

✅ educrypt-verifier/ – for students, employers, or agencies to verify credentials

🔐 What Problem Does It Solve?
EduCrypt ensures that academic credentials are:

✅ Authentic — digitally signed using RSA/EC
✅ Tamper-proof — hashed and optionally Merkle-rooted
✅ Verifiable offline — no internet required after a snapshot is downloaded

📱 App Overview
1. educrypt-creator/ (Creator App)
Used by university staff to issue credentials.

Core Features:
📝 Credential form (name, degree, graduation date, issuer)

🔒 Sign credential with private key (RSA/EC)

🔁 Hash with SHA-256

📤 Export signed credential as .json or QR

📦 Export snapshot of all hashes (JSON for offline verifier use)

(🔐 Optional: login with PIN or JWT)

(🔗 Optional: Submit to backend or blockchain Merkle tree)

2. educrypt-verifier/ (Verifier App)
Used by students, employers, or agencies to verify credentials.

Core Features:
📥 Load credential from file or QR code

🔁 Hash credential content

🔏 Verify signature using issuer's public key

✅ Check hash match from:

Offline snapshot (downloaded earlier)

Merkle proof (later)

Blockchain (optional, Phase 2)

📴 Offline mode with local snapshot in SQLite or file system

🔧 Tech Stack (Both Apps)
Layer	Tools
UI	Expo + React Native + TypeScript
Styling	NativeWind (Tailwind for React Native)
State	Zustand
Crypto	crypto-js, node-forge, elliptic, or jsrsasign
Storage	expo-file-system, expo-document-picker, SQLite or AsyncStorage
QR	expo-barcode-scanner
Offline	File-based snapshot or local SQLite
Backend	(Optional) Node.js + Express + Knex + JWT + Ethereum (Phase 2)

📁 Folder Structure (Split Repos or Directories)
educrypt-creator/
├── App.tsx
├── screens/
├── components/
├── lib/
├── store/
├── utils/
└── snapshot/

educrypt-verifier/
├── App.tsx
├── screens/
├── components/
├── lib/
├── store/
├── utils/
└── snapshot/
🔏 Credential Format (JSON)
{
  "name": "Paul Antigo",
  "degree": "Bachelor of Computer Science",
  "graduationDate": "2024-05-15",
  "issuer": "President Ramon Magsaysay State University",
  "signature": "BASE64_SIGNATURE"
}
Optional fields:

"merkleProof": for verifying against Merkle root (Phase 2)

"batchId": to group credentials

🧪 Verification Process (Verifier App)
Import credential (.json or QR)

Canonically stringify and hash (SHA-256)

Verify signature (RSA or EC) using issuer public key

Check hash exists in:

✅ Offline snapshot (JSON or SQLite)

✅ Merkle proof (optional)

✅ Live blockchain (Phase 2)

Show result:
✅ Valid | ❌ Invalid Signature | ⚠️ Hash Not Found

📴 Offline Mode Support
Snapshot file (JSON) downloaded from Creator app

Stored in file system or SQLite

Verifier app can validate without internet

🪜 Roadmap
✅ MVP: (No blockchain yet)
Creator app issues + signs credentials

Export credentials + snapshot

Verifier app loads credentials, verifies hash + signature

Works offline via snapshot

🔜 Phase 2:
Merkle tree generation on Creator app

Export Merkle proofs

Smart contract to store Merkle root (Ethereum)

Verifier app validates with Merkle proof + root

💬 In One Sentence
EduCrypt is a two-app mobile system that lets universities issue cryptographically signed academic credentials and allows verifiers to check their authenticity — even offline — using snapshots, Merkle proofs, or blockchain roots.

✅ Why a Split-App Setup Works Better Than a Monorepo
Benefit	Why it Matters
🔒 Security	Signature keys never leave Creator app
🎯 Focus	Each app serves one clear user type
🌐 Public/Private separation	Verifier can be distributed publicly; Creator is staff-only
📴 Offline support	Verifier can operate offline from a trusted snapshot
🧱 Easier to build independently	No complex monorepo tools required

---

## educrypt-creator Setup Instructions

### 1. Install Dependencies

Run the following command to install the required packages:

```
npm install @react-navigation/native @react-navigation/stack react-native-screens react-native-safe-area-context zustand nativewind crypto-js expo-file-system expo-document-picker
```

### 2. Run the App

```
npx expo start
```

### 3. Folder Structure

- `App.tsx` — Entry point
- `screens/` — App screens
- `components/` — Reusable UI components
- `lib/` — Crypto and utility functions
- `store/` — Zustand state management
- `utils/` — Helper utilities
- `snapshot/` — Exported hash snapshots

---