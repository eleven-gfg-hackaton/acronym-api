const functions = require('@google-cloud/functions-framework');
const {VertexAI, HarmCategory, HarmBlockThreshold, GoogleSearchRetrievalTool, RetrievalTool} = require('@google-cloud/vertexai');

const project = 'gfg-hackathon2-team-11';
const location = 'us-central1';
// For the latest list of available Gemini models in Vertex, please refer to https://cloud.google.com/vertex-ai/docs/generative-ai/learn/models#gemini-models
const textModel =  'gemini-1.0-pro';

const vertex_ai = new VertexAI({project: project, location: location});

// Instantiate models
const generativeModel = vertex_ai.getGenerativeModel({
    model: textModel,
    // The following parameters are optional
    // They can also be passed to individual content generation requests
    safety_settings: [{category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE}],
    generation_config: {max_output_tokens: 256},
  });

async function extractAcryonyms(inputText) {
    const task = "Extract acronyms from this passage and return an array: " + inputText; 
    const request = {
      contents: [{role: 'user', parts: [{text: task}]}],
    };
    const streamingResp = await generativeModel.generateContentStream(request);
    for await (const item of streamingResp.stream) {
      console.log('stream chunk: ', JSON.stringify(item));
    }
    console.log('aggregated response: ', JSON.stringify(await streamingResp.response));
    const aggregatedResponse = await streamingResp.response;
    const fullTextResponse =
    aggregatedResponse.candidates[0].content.parts[0].text;

    return fullTextResponse;
}

functions.http('helloGET', async (req, res) => {
    try {
        const inputText = req.body.text;
        console.log(inputText);
        const content = await extractAcryonyms(inputText);
        res.status(200).send(content);
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message)
    }
  });