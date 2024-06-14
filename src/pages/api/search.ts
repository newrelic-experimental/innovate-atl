// pages/api/detect-language.ts

import { NextApiRequest, NextApiResponse } from 'next';
import {ChatOpenAI} from "@langchain/openai";
import {HumanMessage, SystemMessage, ToolMessage} from "@langchain/core/messages";

const systemPromptToEnglish = new SystemMessage(`You are the best translator in the world.  You are going to receive a message in a different language.
For each message, you will need to detect the language of the message, and translate the phrase into English.  You will return the detected language, three hyphens, and then the translated phrase.
For examples, if you receive the message 'Hola, ¿cómo estás?', you should detect the language as Spanish and respond with 'Spanish---Hello, how are you?'.  If you receive the message 'Bonjour, comment ça va?', you should detect the language as French and respond with 'French---Hello, how are you?'.  
If you receive the message 'Hallo, wie geht es dir?', you should detect the language as German and respond with 'German---Hello, how are you?'.  If you receive the message 'Ciao, come stai?', you should detect the language as Italian and respond with 'Italian---Hello, how are you?'.  
If you receive the message 'Olá, como você está?', you should detect the language as Portuguese and respond with 'Portuguese---Hello, how are you?'.`);

type SearchResult = {
  title: string;
  summary: string;
  url: string;
  location?: string;
  locationTitle?: string;
}

type Translation = {
  translatedText: string;
  detectedLanguage: string;
}

type Data = {
  results?: Translation;
  error?: string;
}


//Translate phrase into English
async function Results(phrase: string) {
  const model = new ChatOpenAI({
    model: "gpt-4o",
    temperature: 0.9,
  }).bind({
    // response_format: {
    // 	type: "json_object",
    // },
    tools: [
      {
        type: "function",
        function: {
          name: "search_faq",
          description: "Translate a phrase and detect the language",
          parameters: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "English search query that needs to be translated",
              },
            },
            required: ["query"],
          },
        },
      },
    ],
    tool_choice: "auto",
  });

  const ogPrompt = [
    systemPromptToEnglish,
    new HumanMessage(phrase)
  ];
  const result = await model.invoke(ogPrompt);

  return result;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const result = await Results(req.body.text);
  console.log(result.content);
  //Search with translated phrase to get results

  //Translate results back to original language



    if (typeof result.content === "string") {
      const spl = result.content.split("---");
      res.status(200).json({ results: {translatedText: spl[1], detectedLanguage: spl[0]}});
    } else {
      res.status(500).json({ error: 'Failed to detect language' });
    }

  } catch (error) {
    console.error('Error detecting language:', error);
    res.status(500).json({ error: 'Failed to detect language' });
  }
}
