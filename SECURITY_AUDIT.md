# Security Audit: API Keys Found

## Summary
Found 4 API keys hardcoded in the project:

### 1. Gemini API Key (Google AI)
- **Key**: AIzaSyCHoP2pFhdjt3qmsoC4zHfTdcIVJPkSMlc
- **Locations**:
  - `run_cluster_manual.py` (line 27)
  - `backend/test_gemini.py` (line 4)
  - `backend/processing/narrative_namer.py` (line 11)

### 2. Twitter API Bearer Token
- **Key**: AAAAAAAAAAAAAAAAAAAAAGHN7AEAAAAAXp6jhYBtmG5WCILJYg2R9VokoNo%3Dmu6w9SCDNFVMmlWYQ0vzJX3alYAGtMOiT8MZmAyG6NDztYmfzr
- **Locations**:
  - `backend/data_collectors/twitter_scraper.py` (line 73)
  - `backend/data_collectors/data_fusion.py` (line 23)

### 3. Metal Price API Key
- **Key**: 23e2ec99f2041769e7bae47551d049d0
- **Locations**:
  - `backend/data_collectors/data_fusion.py` (line 21)

### 4. Firebase Web API Key
- **Key**: AIzaSyBKtoWREU3vGux_wIO0pjeOgNmnHXRZE1A
- **Locations**:
  - `frontend/src/firebase.js` (line 6)

---

## ⚠️ Security Risks

1. **Hardcoded keys are committed to Git** - Anyone with repo access can see them
2. **If repo is public** - Keys are exposed to the entire internet
3. **API quota abuse** - Others can use your keys and exhaust your quotas
4. **Potential costs** - Unauthorized usage could incur charges

---

## ✅ Recommended Actions

### Immediate (Before Deployment):

1. **Rotate ALL API keys** (generate new ones):
   - Google Gemini: https://makersuite.google.com/app/apikey
   - Twitter API: https://developer.twitter.com/en/portal/dashboard
   - Metal Price API: Check your provider's dashboard
   - Firebase: Can stay public (it's designed for client-side use with security rules)

2. **Create `.env` file** (backend):
   ```env
   GOOGLE_API_KEY=your_new_gemini_key
   TWITTER_BEARER_TOKEN=your_new_twitter_token
   METAL_PRICE_API_KEY=your_new_metal_api_key
   ```

3. **Update `.gitignore`** to exclude:
   ```
   .env
   .env.local
   .env.production
   ```

4. **Remove keys from Git history** (if already committed):
   ```bash
   git filter-branch --force --index-filter \
   "git rm --cached --ignore-unmatch backend/test_gemini.py" \
   --prune-empty --tag-name-filter cat -- --all
   ```

### For Deployment:

- **Backend (Render)**: Add keys as environment variables in Render dashboard
- **Frontend (Vercel)**: Firebase key can stay in code (it's public by design)
- **Never commit** `.env` files to Git

---

## Firebase API Key Note

The Firebase API key in `frontend/src/firebase.js` is **safe to be public** because:
- It's designed for client-side use
- Security is enforced by Firebase Security Rules
- It only identifies your Firebase project

However, ensure your **Firestore Security Rules** are properly configured to prevent unauthorized access.
