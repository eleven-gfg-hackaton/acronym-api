const functions = require('@google-cloud/functions-framework');
const {VertexAI} = require('@google-cloud/vertexai');

const project = 'gfg-hackathon2-team-11';
const location = 'us-central1';
// For the latest list of available Gemini models in Vertex, please refer to https://cloud.google.com/vertex-ai/docs/generative-ai/learn/models#gemini-models
const visionModel = 'gemini-1.0-pro-vision';

const vertex_ai = new VertexAI({project: project, location: location});

const generativeVisionModel = vertex_ai.getGenerativeModel({
    model: visionModel,
});
async function extractAcryonyms(inputText) {
    const task = "Extract acronyms from this passage and return an array: " + inputText; 
    const request = {
      contents: [{role: 'user', parts: [{text: task}]}],
    };
    const streamingResp = await generativeVisionModel.generateContentStream(request);
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
        const content = await extractAcryonyms(inputText);
        let acronyms = JSON.parse(content);
        acronyms = acronyms.map(acronym => {
            return {
                acronym: acronym,
                abbrFor: [
                    {
                      name: 'Acknowledgement',
                      meaning: 'Acknowledgement'
                    },
                  ]
            }
        })
        res.status(200).send(acronyms);        
    } catch (error) {
        console.log(error);
        res.status(200).send([]);        
    }
  });