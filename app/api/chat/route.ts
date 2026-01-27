import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	let locale = 'en';
	
	try {
		const { message, locale: requestLocale } = await request.json();
		locale = requestLocale || 'en';

		if (!message) {
			return NextResponse.json(
				{ error: 'Message is required' },
				{ status: 400 }
			);
		}

		const glmApiKey = process.env.GLM_API_KEY;
		const openaiApiKey = process.env.OPENAI_API_KEY;

		if (!glmApiKey && !openaiApiKey) {
			return NextResponse.json(
				{ reply: locale === 'zh' ? 'AI功能尚未配置。请在.env.local中配置GLM_API_KEY或OPENAI_API_KEY。' : 'AI feature not configured. Please configure GLM_API_KEY or OPENAI_API_KEY in .env.local.' },
				{ status: 200 }
			);
		}

		let reply = '';

		if (glmApiKey) {
			const systemPrompt = locale === 'zh'
				? '你是一个友好的AI助手，帮助用户回答关于技术、编程和博客相关的问题。请简洁明了地回答，控制在150字以内。'
				: 'You are a friendly AI assistant helping users with questions about technology, programming, and blog-related topics. Please answer concisely within 150 words.';

			const controller = new AbortController();
			const timeout = setTimeout(() => controller.abort(), 15000);

			try {
				const startTime = Date.now();
				console.log('🚀 [TIMING] Starting API request at:', new Date().toISOString());

				const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${glmApiKey}`,
					},
					body: JSON.stringify({
						model: 'glm-4-flash',
						messages: [
							{
								role: 'system',
								content: systemPrompt,
							},
							{
								role: 'user',
								content: message,
							},
						],
						max_tokens: 150,
						temperature: 0.5,
						top_p: 0.9,
					}),
					signal: controller.signal,
				});

				const responseTime = Date.now() - startTime;
				console.log('⏱️  [TIMING] API response received in:', responseTime, 'ms');

				clearTimeout(timeout);

				console.log('GLM API Response Status:', response.status);
				console.log('GLM API Response Headers:', Object.fromEntries(response.headers.entries()));

				if (!response.ok) {
					const errorText = await response.text();
					console.error('GLM API Error Response:', errorText);
					throw new Error(`GLM API error: ${response.status} - ${errorText}`);
				}

				const parseStartTime = Date.now();
				const responseText = await response.text();
				const parseTime = Date.now() - parseStartTime;
				console.log('⏱️  [TIMING] Response text parsed in:', parseTime, 'ms');
				console.log('GLM API Response Text:', responseText);

				if (!responseText.trim()) {
					throw new Error('GLM API returned empty response');
				}

				let data;
				try {
					const jsonStartTime = Date.now();
					data = JSON.parse(responseText);
					const jsonTime = Date.now() - jsonStartTime;
					console.log('⏱️  [TIMING] JSON parsed in:', jsonTime, 'ms');
					console.log('GLM API Parsed Data:', JSON.stringify(data, null, 2));
				} catch (parseError) {
					console.error('Failed to parse GLM API response:', parseError);
					throw new Error('Invalid JSON response from GLM API');
				}

				if (data.error) {
					throw new Error(data.error.message || JSON.stringify(data.error));
				}

				reply = data.choices?.[0]?.message?.content || '';
				console.log('GLM API Reply Content:', reply);
				console.log('GLM API Choices:', data.choices);
				console.log('📊 [USAGE] Tokens used:', data.usage);
				
				const totalTime = Date.now() - startTime;
				console.log('✅ [TIMING] Total API processing time:', totalTime, 'ms');
			} catch (error) {
				clearTimeout(timeout);
				if (error instanceof Error && error.name === 'AbortError') {
					throw new Error('API request timeout. Please try again.');
				}
				throw error;
			}
		} else if (openaiApiKey) {
			const systemPrompt = locale === 'zh'
				? '你是一个友好的AI助手，帮助用户回答关于技术、编程和博客相关的问题。'
				: 'You are a friendly AI assistant helping users with questions about technology, programming, and blog-related topics.';

			const response = await fetch('https://api.openai.com/v1/chat/completions', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${openaiApiKey}`,
				},
				body: JSON.stringify({
					model: 'gpt-3.5-turbo',
					messages: [
						{
							role: 'system',
							content: systemPrompt,
						},
						{
							role: 'user',
							content: message,
						},
					],
					max_tokens: 500,
					temperature: 0.7,
				}),
			});

			console.log('OpenAI API Response Status:', response.status);

			if (!response.ok) {
				const errorText = await response.text();
				console.error('OpenAI API Error Response:', errorText);
				throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
			}

			const responseText = await response.text();
			console.log('OpenAI API Response Text:', responseText);

			if (!responseText.trim()) {
				throw new Error('OpenAI API returned empty response');
			}

			let data;
			try {
				data = JSON.parse(responseText);
			} catch (parseError) {
				console.error('Failed to parse OpenAI API response:', parseError);
				throw new Error('Invalid JSON response from OpenAI API');
			}

			if (data.error) {
				throw new Error(data.error.message || JSON.stringify(data.error));
			}

			reply = data.choices?.[0]?.message?.content || '';
		}

		if (!reply) {
			throw new Error('No content in API response');
		}

		return NextResponse.json({ reply });
	} catch (error) {
		console.error('Error in chat API:', error);
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		return NextResponse.json(
			{ reply: locale === 'zh' ? `抱歉，发生了错误：${errorMessage}。请稍后再试。` : `Sorry, an error occurred: ${errorMessage}. Please try again later.` },
			{ status: 500 }
		);
	}
}
