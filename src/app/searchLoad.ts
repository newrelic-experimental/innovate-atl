import { SearchApiLoader } from "@langchain/community/document_loaders/web/searchapi";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { TokenTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

const SEARCH_SITE = "atlantaga.gov";
const SEARCH_API_API_KEY: string = process.env.SEARCH_API_API_KEY ? process.env.SEARCH_API_API_KEY : "";

export async function searchWithPrompt(prompt: string) {
  // Initialize the necessary components
  const llm = new ChatOpenAI({
    model: "gpt-4o",
  });
  const embeddings = new OpenAIEmbeddings();

  const loader = new SearchApiLoader({
    q: `site:${SEARCH_SITE} ${prompt}`,
    apiKey: SEARCH_API_API_KEY,
    engine: "google",
  });
  const inputSearchData = await loader.load();

  const textSplitter = new TokenTextSplitter({
    chunkSize: 800,
    chunkOverlap: 100,
  });

  const splitSearchInput = await textSplitter.splitDocuments(inputSearchData);

  // Use MemoryVectorStore to store the loaded documents in memory
  const vectorStore = await MemoryVectorStore.fromDocuments(
    splitSearchInput,
    embeddings
  );
  
  // Use MemoryVectorStore to store the loaded documents in memory
  const questionAnsweringPrompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "Answer the user's questions based on the below context and provide any web links if available:\n\n{context}",
    ],
    ["human", "{input}"],
  ]);
  
  const combineDocsChain = await createStuffDocumentsChain({
    llm,
    prompt: questionAnsweringPrompt,
  });
  
  const chain = await createRetrievalChain({
    retriever: vectorStore.asRetriever(),
    combineDocsChain,
  });
  
  const res = await chain.invoke({
    input: prompt,
  });

  return res;
}
