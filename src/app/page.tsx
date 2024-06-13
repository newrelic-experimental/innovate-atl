import Image from "next/image";
import { OpenAI } from "@langchain/openai";
import { Suspense } from "react";

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
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<Suspense fallback={<div>Loading...</div>}>
				<Results />
			</Suspense>
		</main >
	);
}
