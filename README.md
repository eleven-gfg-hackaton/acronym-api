# Acronym Extractor

This project is a Node.js application that uses Google Cloud's Vertex AI to extract acronyms from a given text. It first tries to find the acronyms in a local cache, and if it can't find them, it uses Vertex AI to generate them.

## Dependencies

- `@google-cloud/functions-framework`
- `@google-cloud/vertexai`

## Setup

1. Install the dependencies:

```bash
npm install @google-cloud/functions-framework @google-cloud/vertexai
```

2. Replace `'gfg-hackathon2-team-11'` and `'us-central1'` with your Google Cloud project ID and location.

3. Replace `'gemini-1.0-pro-vision'` with the ID of your Vertex AI model.

## Usage

This application exposes a single HTTP function `helloGET` that accepts a POST request with a body containing the text from which to extract acronyms.

Example request:

```bash
curl -X POST http://localhost:8080/helloGET -d '{"text": "NASA, the National Aeronautics and Space Administration, is a great place to work."}'
```

The function will return a JSON array of objects, each containing an acronym, the full form of the acronym, and a summary of the full form.

## Functions

- `generateContentStream(request)`: Generates a content stream from the Vertex AI model.
- `extractAcryonyms(inputText)`: Extracts acronyms from the input text using Vertex AI.
- `getNameOfAcronym(acronym)`: Gets the full form of an acronym using Vertex AI.
- `getMeaningOfName(name)`: Gets a summary of a name using Vertex AI.
- `getAcronymsFromAI(inputText)`: Extracts acronyms from the input text using Vertex AI and gets their full forms and summaries.
- `getAcronymsFromCache(inputText)`: Extracts acronyms from the input text using a local cache.

## Cache

The application uses a local cache to speed up acronym extraction. The cache is a JSON file where each key is a word and each value is an object containing the word, its definition, and its topic. If an acronym is found in the cache, the application will use the cached value instead of querying Vertex AI.