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
        "You are going to receive a message in a different language. You are really good at translating just the word 'Search' into the language of users query that you receive."
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
