import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// DeepSeek API endpoint
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_API_KEY = process.env.VITE_DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY;

// Analyze code endpoint
app.post('/api/deepseek/analyze', async (req, res) => {
  try {
    const { code, language, includeExplanations } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    // Construct prompt for the DeepSeek API
    const prompt = `
You are a code analysis expert. Analyze the following ${language || 'JavaScript'} code and provide suggestions for improvement.
${includeExplanations ? 'Include detailed explanations for each suggestion.' : ''}

For each issue found, provide the following information in JSON format:
- line: the line number where the issue occurs
- category: one of [security, performance, bug, style, logic, best_practice, refactoring]
- message: a brief description of the issue
- explanation: detailed explanation of why this is an issue and how to fix it
- suggestedCode: improved code snippet that fixes the issue
- originalCode: the original problematic code

CODE TO ANALYZE:
\`\`\`${language || 'js'}
${code}
\`\`\`

Respond with a JSON array of suggestions in the following format:
[
  {
    "line": <number>,
    "category": "<category>",
    "message": "<brief message>",
    "explanation": "<detailed explanation>",
    "suggestedCode": "<improved code>",
    "originalCode": "<original code>"
  }
]
`;

    // Call DeepSeek API
    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful code analysis expert.'
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 4000,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
        }
      }
    );

    // Extract suggestions from response
    const content = response.data.choices[0].message.content;

    // Parse JSON from the response content
    // Try to find JSON in the response (might be surrounded by text)
    const jsonMatch = content.match(/\[\s*\{.*\}\s*\]/s);
    
    if (jsonMatch) {
      try {
        const suggestions = JSON.parse(jsonMatch[0]);
        return res.json({ suggestions });
      } catch (error) {
        console.error('Failed to parse JSON from response:', error);
        return res.status(500).json({ 
          error: 'Failed to parse API response', 
          rawResponse: content 
        });
      }
    } else {
      return res.status(500).json({ 
        error: 'No JSON data found in API response', 
        rawResponse: content 
      });
    }
  } catch (error) {
    console.error('Error calling DeepSeek API:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to analyze code', 
      details: error.response?.data || error.message 
    });
  }
});

// Apply suggestion endpoint
app.post('/api/deepseek/apply-suggestion', async (req, res) => {
  try {
    const { code, suggestion } = req.body;

    if (!code || !suggestion) {
      return res.status(400).json({ error: 'Code and suggestion are required' });
    }

    // Construct prompt for the DeepSeek API
    const prompt = `
You are a code improvement assistant. Apply the following suggestion to the code:

ORIGINAL CODE:
\`\`\`
${code}
\`\`\`

SUGGESTION:
${JSON.stringify(suggestion, null, 2)}

Apply this suggestion to the code and return ONLY the modified code without any additional explanations or markdown formatting.
`;

    // Call DeepSeek API
    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful code improvement assistant.'
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.1,
        max_tokens: 4000,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
        }
      }
    );

    // Extract modified code from response
    const modifiedCode = response.data.choices[0].message.content.trim();
    
    // Clean up any markdown code blocks if present
    const cleanedCode = modifiedCode.replace(/^```[\w]*\n|```$/g, '');
    
    return res.json({ modifiedCode: cleanedCode });
  } catch (error) {
    console.error('Error applying suggestion:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to apply suggestion', 
      details: error.response?.data || error.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
