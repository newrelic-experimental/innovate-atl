// pages/api/detect-language.ts

import { NextApiRequest, NextApiResponse } from 'next';
import {ChatOpenAI} from "@langchain/openai";
import {HumanMessage, SystemMessage} from "@langchain/core/messages";

type Data = {
  translatedText?: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const model = new ChatOpenAI({
      model: "gpt-4o",
      temperature: 0.9,
    });

    const result = await model.invoke([
      new SystemMessage(
        "You are going to receive a message in a different language. For each message, you will need to detect the language of the message, and translate the english word 'Search' into that detected language.  You should have no memory and treat each message as a new conversation.  You should only ever respond with a single word as the translaiton of the word 'Search' and return nothing else.  Use the following as examples of how you should respond.  For the user message 'Como eu posso', you should detect the language as Portuguese and respond with 'Buscar'.  For the user message 'Comment puis-je', you should detect the language as French and respond with 'Rechercher'.  For the user message 'Wie kann ich', you should detect the language as German and respond with 'Suche'.  For the user message 'Cómo puedo', you should detect the language as Spanish and respond with 'Buscar'.  For the user message 'Come posso', you should detect the language as Italian and respond with 'Cercare'."
      ),
      new HumanMessage(text)
    ]);

    if (typeof result.content === "string") {
      res.status(200).json({ translatedText: result.content });
    } else {
      res.status(500).json({ error: 'Failed to detect language' });
    }

  } catch (error) {
    console.error('Error detecting language:', error);
    res.status(500).json({ error: 'Failed to detect language' });
  }
}
