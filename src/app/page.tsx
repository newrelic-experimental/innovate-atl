import Image from "next/image";
import { OpenAI } from "@langchain/openai";
import { Suspense } from "react";
import SearchBox from "@/app/components/SearchBox";

async function Results() {
	const model = new OpenAI({
		model: "gpt-4o",
		temperature: 0.9,
	});
	const res = await model.invoke(
		"What makes Atlanta GA an OK place to live?"
	);

	return (<span>{res}</span>);
}

export default function Home() {

	const detectLanguageAndTranslate = async (text: String) => {
	};

	return (
		<main className="flex min-h-screen min-w-screen flex-col items-center justify-between p-24">
			<SearchBox />
		</main >
	);
}
