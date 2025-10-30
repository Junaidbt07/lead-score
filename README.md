# AI Lead Scoring Service

This is a backend service built for a hiring assignment. The application accepts product information and a CSV of leads, then uses a hybrid scoring model (rule-based + AI) to qualify each lead's buying intent.

The service is built with Node.js, Express, TypeScript, and MongoDB, and it integrates with the Google Gemini AI for advanced analysis. It is designed to run in a serverless environment like Vercel and is also fully containerized with Docker.

**Live URL (Vercel):**   //url to be added

---

## Features

- **Offer Management:** POST endpoint to set and update the product/offer context.
- **CSV Lead Upload:** POST endpoint using `multer` and `csv-parser` to stream-process and upload a leads CSV to the database.
- **Hybrid Scoring Pipeline:**
  - **Rule Layer (50%):** Applies rule-based logic for role, industry, and data completeness.
  - **AI Layer (50%):** Uses Google Gemini (`gemini-1.5-flash`) for intent classification and qualitative reasoning.
- **Asynchronous Job Processing:** The `/api/score` endpoint returns an immediate `202 Accepted` response and processes the leads in the background, preventing server timeouts.
- **Results Endpoint:** GET endpoint to retrieve all scored leads with scores, intent, and AI reasoning.
- **Bonus: CSV Export:** GET endpoint to download the scored results as a `lead_scoring_results.csv` file.
- **Bonus: Dockerized:** Fully containerized with a multi-stage Dockerfile for production.

---

## Tech Stack

- **Backend:** Node.js, Express.js, TypeScript
- **Database:** MongoDB (with Mongoose)
- **File Handling:** multer, csv-parser, json2csv
- **AI Integration:** Vercel AI SDK (@ai-sdk/google) with Zod for structured JSON output
- **Deployment:** Vercel
- **Containerization:** Docker

---

## Scoring Logic Explained

The final score (0-100) is a combination of two layers.

### 1. Rule Layer (Max 50 Points)

This layer applies objective, predefined rules:

**Role Relevance (Max 20 pts):**
- **+20:** Role contains "decision-maker" keywords (e.g., VP, Head of, Founder, Director).
- **+10:** Role contains "influencer" keywords (e.g., Manager, Lead, Senior).
- **+0:** Otherwise.

**Industry Match (Max 20 pts):**
- **+20:** Industry exactly matches one of the `ideal_use_cases` from the offer.
- **+10:** Industry contains an adjacent keyword (e.g., SaaS, Software, B2B, Agency).
- **+0:** Otherwise.

**Data Completeness (Max 10 pts):**
- **+10:** All required fields (name, role, company, industry, linkedin_bio) are present and not empty.
- **+0:** Any required field is missing.

### 2. AI Layer (Max 50 Points)

This layer uses Google Gemini to provide a qualitative assessment. The lead and offer details are sent to the AI with the following prompt:

```
You are an expert sales development representative. Your task is to score a lead's buying intent based on their profile and the product we are selling.

--- OFFER DETAILS (Our Product) ---
Product Name: [Offer Name]
Value Propositions: [Prop 1, Prop 2]
Ideal Use Cases (ICP): [Case 1, Case 2]

--- LEAD DETAILS (The Prospect) ---
Name: [Lead Name]
Role: [Lead Role]
Company: [Lead Company]
Industry: [Lead Industry]
Location: [Lead Location]
LinkedIn Bio: [Lead Bio]

--- TASK ---
Analyze the LEAD DETAILS in the context of the OFFER DETAILS.

Classify the lead's buying intent as "High", "Medium", or "Low".

Provide a 1-2 sentence explanation for your classification, referencing the lead and offer.

Return only a valid JSON object with the exact {"intent": "...", "reasoning": "..."} structure.
```

The AI's JSON response is then mapped to points:
- **"High":** +50 points
- **"Medium":** +30 points
- **"Low":** +10 points

---

## Local Setup & Running

### Clone the repository:

```bash
git clone https://github.com/Junaidbt07/lead-score.git
cd lead-score
```

### Install dependencies:

```bash
npm install
```

### Create `.env` file:

Create a `.env` file in the root and add your keys. Get your MongoDB URI from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and your API key from [Google AI Studio](https://ai.google.dev/).

```env
PORT=5000
MONGODB_URI=mongodb+srv://...your_atlas_connection_string...
GOOGLE_API_KEY=...your_google_ai_api_key...
```

### Run the development server:

```bash
npm run dev
```

The server will be running at `http://localhost:5000`.

---

## API Testing Workflow (Postman / cURL)

This is the recommended 5-step workflow to test the entire application.

### Step 1: POST `/api/offer`

Set the product/offer context.

**cURL:**

```bash
curl -X POST 'http://localhost:5000/api/offer' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "AI Outreach Automation",
    "value_props": ["24/7 outreach", "6x more meetings"],
    "ideal_use_cases": ["B2B SaaS mid-market", "Sales teams"]
}'
```

**Expected Response:** `201 Created`

---

### Step 2: POST `/api/leads/upload`

Upload a CSV of leads. Use a `test_leads.csv` file.

**cURL:**

```bash
curl -X POST 'http://localhost:5000/api/leads/upload' \
-F 'file=@"/path/to/your/test_leads.csv"'
```

**Note:** In Postman, use the `form-data` body type with a `file` key.

**Expected Response:** `201 Created` (e.g., `{"message": "Successfully uploaded and saved 6 leads."}`)

---

### Step 3: POST `/api/score`

Trigger the asynchronous scoring pipeline.

**cURL:**

```bash
curl -X POST 'http://localhost:5000/api/score'
```

**Expected Response (Immediate):** `202 Accepted`

The server will now process all "pending" leads in the background. You can watch the `npm run dev` terminal logs to see the progress.

---

### Step 4: GET `/api/results`

Retrieve the final, scored results. Wait a few moments after Step 3 for the scoring to complete.

**cURL:**

```bash
curl -X GET 'http://localhost:5000/api/results'
```

**Expected Response:** `200 OK` with a JSON body matching the PDF specification, containing a summary and results array.

---

### Step 5: GET `/api/results/export` (Bonus)

Download the scored leads as a CSV file.

**How to Test:** The easiest way is to open this URL directly in your web browser:

```
http://localhost:5000/api/results/export
```

**Expected Response:** A file named `lead_scoring_results.csv` will automatically download.

---

## Docker (Bonus)

This application is fully containerized.

### Build the image:

```bash
docker build -t lead-scorer .
```

### Run the container:

Pass in your environment variables at runtime.

```bash
docker run -d -p 5000:5000 \
  -e MONGODB_URI="your_mongodb_atlas_uri_string" \
  -e GOOGLE_API_KEY="your_google_api_key" \
  --name lead-scorer-app \
  lead-scorer
```

### Test:

The service is now running at `http://localhost:5000`. You can use the same Postman tests as above.

### Stop the container:

```bash
docker stop lead-scorer-app
```

---

