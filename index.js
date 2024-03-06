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

async function generateContentStream(request) {
    const streamingResp = await generativeVisionModel.generateContentStream(request);
    for await (const item of streamingResp.stream) {
      console.log('stream chunk: ', JSON.stringify(item));
    }
    const aggregatedResponse = await streamingResp.response;
    const fullTextResponse =
    aggregatedResponse.candidates[0].content.parts[0].text;

    return fullTextResponse;
}

async function extractAcryonyms(inputText) {
    const task = `Extract the acronyms from the text below in an array format:
    TEXT: ${inputText}`; 
    const request = {
      contents: [{role: 'user', parts: [{text: task}]}],
    };
    
    return await generateContentStream(request);
}


async function getNameOfAcronym(acronym) {
    const task = `What is ${acronym} stands for?`; 
    const request = {
      contents: [{role: 'user', parts: [{text: task}]}],
    };
    return await generateContentStream(request);
}

async function getMeaningOfName(name) {
    const task = `What is ${name}?`; 
    const request = {
      contents: [{role: 'user', parts: [{text: task}]}],
    };
    return await generateContentStream(request);
}


functions.http('helloGET', async (req, res) => {
    try {
        const inputText = req.body.text;
        const content = await extractAcryonyms(inputText);
        let acronyms = [];
        try {
            acronyms = JSON.parse(content);
        } catch (error) {
            acronyms = content.split('\n').map(item => item.trim().substring(2));
        }

        acronyms = await Promise.all(acronyms.map( async acronym => {
            let name = await getNameOfAcronym(acronym);
            let meaning = await getMeaningOfName(name);
            return {
                acronym: acronym,
                abbrFor: [
                    {
                      name: name,
                      meaning: meaning
                    },
                  ]
            }
        }));

        res.status(200).send(acronyms);        
    } catch (error) {
        console.log(error);
        res.status(200).send([]);        
    }
  });