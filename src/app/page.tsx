import { ChatOpenAI } from "@langchain/openai";
import { Suspense } from "react";
import SearchBox from "@/app/components/SearchBox";

import { HumanMessage, SystemMessage, ToolMessage } from "@langchain/core/messages";

const systemPrompt = new SystemMessage(`You are the best librarian for frequently asked questions about the city of Atlanta. You will be given search queries in given spoken language, any you will search for a answer and relay the response in the original spoken language of the user.`);


async function Results() {
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
					description: "Search the City of Atlanta frequently asked questions",
					parameters: {
						type: "object",
						properties: {
							query: {
								type: "string",
								description: "English search query for the frequently asked questions",
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
		systemPrompt,
		new HumanMessage("¿Cómo pago mi factura de agua?")
	];
	const res = await model.invoke(ogPrompt);

	const toolMessages = res.additional_kwargs.tool_calls?.map((toolCall) => {
		return new ToolMessage({
			tool_call_id: toolCall.id,
			name: toolCall.function.name,
			content: "You can pay your water bill online, by phone, by mail, or in person. Learn more about how to pay your bill on our website.",
		});
	});

	const finalResponse = await model.invoke([
		...ogPrompt,
		res,
		...(toolMessages ?? []),
	]);

	return (<span>{JSON.stringify(finalResponse.content)}</span>);
}

export default function Home() {
	return (
		<main className="flex min-h-screen min-w-screen flex-col items-center justify-between p-24">
			<SearchBox />
		</main >
	);
}
