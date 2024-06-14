import { NextApiRequest, NextApiResponse } from 'next';
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { searchWithPrompt } from "@/app/searchLoad";

const systemPromptToEnglish = new SystemMessage(`You are the best translator in the world. You are going to receive a message in a different language.
For each message, you will need to detect the language of the message, and translate the phrase into English. You will return the detected language, three hyphens, and then the translated phrase.
For examples, if you receive the message 'Hola, ¿cómo estás?', you should detect the language as Spanish and respond with 'Spanish---Hello, how are you?'. If you receive the message 'Bonjour, comment ça va?', you should detect the language as French and respond with 'French---Hello, how are you?'.  
If you receive the message 'Hallo, wie geht es dir?', you should detect the language as German and respond with 'German---Hello, how are you?'. If you receive the message 'Ciao, come stai?', you should detect the language as Italian and respond with 'Italian---Hello, how are you?'.  
If you receive the message 'Olá, como você está?', you should detect the language as Portuguese and respond with 'Portuguese---Hello, how are you?'. If the input is already in english you should respond with 'English---$message'.`);

const systemPromptToLanguage = new SystemMessage(`You are the best translator in the world. You are going to receive a message in English and a language to translate it into. The messages will be formatted like this: '$message --- $language'. You will return the translated message.
For examples, if you receive the message 'Hello, how are you? --- Spanish', you should respond with 'Hola, ¿cómo estás?'. If you receive the message 'Hello, how are you? --- French', you should respond with 'Bonjour, comment ça va?'. Convert urls to translate.google.com urls with the correct target language.`);

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
  results?: string;
  error?: string;
}

//Translate phrase into English
async function Results(phrase: string) {
  const model = new ChatOpenAI({
    model: "gpt-4o",
    temperature: 0.9,
  });

  const ogPrompt = [
    systemPromptToEnglish,
    new HumanMessage(phrase)
  ];
  const result = await model.invoke(ogPrompt);

  return result;
}

//Translate phrase into original language
async function TranslateToOriginal(phrase: string, language: string) {
  const model = new ChatOpenAI({
    model: "gpt-4o",
    temperature: 0.9,
  });

  console.log("phrase - ", `${phrase} --- ${language}`);

  const ogPrompt = [
    systemPromptToLanguage,
    new HumanMessage(`${phrase} --- ${language}`)
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
    let searchResults: string | undefined;
    let translatedResult: string | undefined;

    const result = await Results(req.body.text);
    console.log(result.content);

    if (typeof result.content === "string") {
      const spl = result.content.split("---");
      const translation: Translation = {
        translatedText: spl[1],
        detectedLanguage: spl[0],
      }
      console.log(translation);

      //Search with translated phrase to get results
      searchResults = (await searchWithPrompt(translation.translatedText))?.answer;
      console.log(searchResults);

      // If the detected language is not English, translate the results back to the original language
      if (translation.detectedLanguage !== "English") {
        const resultx = (await TranslateToOriginal(searchResults, translation.detectedLanguage))?.content;
        console.log("translated back - ", resultx);
        console.log(typeof resultx);
        if (typeof resultx === "string") {
          translatedResult = resultx;
        }
      } else {
        translatedResult = searchResults;
      }
      console.log("translatedResult - ", translatedResult);
    }

    if (typeof translatedResult === "string") {
      res.status(200).json({ results: translatedResult });
    } else {
      res.status(500).json({ error: 'Failed to translate and search' });
    }

  } catch (error) {
    console.error('Error detecting language:', error);
    res.status(500).json({ error: 'Failed to translate and search' });
  }
}
