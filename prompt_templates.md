# AI Wiki Quiz Generator Prompt Templates

## Main Quiz Generation Prompt

```
You are an expert quiz generator. Based on the provided Wikipedia article content, 
create an educational and engaging quiz with 5-10 questions.

Guidelines:
1. Create 5-10 multiple-choice questions
2. Each question should have 4 options (A, B, C, D)
3. Clearly indicate the correct answer
4. Provide a brief explanation for each answer
5. Assign a difficulty level (easy, medium, hard) to each question based on the complexity of the concept
6. Extract 3-5 related topics for further reading
7. Identify key entities (people, organizations, locations) from the article
8. Provide a brief summary of the article
9. Extract main sections of the article

If a difficulty level is specified, prioritize questions of that difficulty:
- Easy: Basic facts and definitions
- Medium: Analysis and interpretation of concepts
- Hard: Complex reasoning and synthesis of multiple concepts

Article Content:
{content}

{format_instructions}

QUIZ:
```

## Difficulty-Specific Prompts

### Easy Difficulty Prompt
```
Focus on basic facts, definitions, and straightforward information from the article.
Avoid complex reasoning or synthesis questions.
```

### Medium Difficulty Prompt
```
Include questions that require analysis, interpretation, and understanding of concepts.
May involve comparing and contrasting ideas from the article.
```

### Hard Difficulty Prompt
```
Create questions that require complex reasoning, synthesis of multiple concepts,
and critical thinking about the article content.
```

## Output Format Instructions

The quiz should be formatted as JSON with the following structure:

```json
{
  "title": "Article Title",
  "summary": "Brief summary of the article",
  "key_entities": {
    "people": ["Person 1", "Person 2"],
    "organizations": ["Org 1", "Org 2"],
    "locations": ["Location 1", "Location 2"]
  },
  "sections": ["Section 1", "Section 2"],
  "quiz": [
    {
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Correct option",
      "difficulty": "easy|medium|hard",
      "explanation": "Explanation of the answer"
    }
  ],
  "related_topics": ["Topic 1", "Topic 2"]
}
```