# Core Concepts

Before building complex workflows, it's essential to understand the fundamental components of modern AI applications.

## Large Language Models (LLMs)
The engine of the workflow. Models like GPT-4, Claude, or Llama process text (and images) to generate responses. Understanding their **context window**, **latency**, and **reasoning capabilities** is key to choosing the right one.

## Prompts & Prompt Engineering
The interface to the model.
- **Zero-shot:** Asking without examples.
- **Few-shot:** Providing examples to guide the model's style and logic.
- **Chain-of-Thought:** Asking the model to "think step-by-step" to improve reasoning.

## Context Management
LLMs have no memory of past requests unless you provide it. Managing context involves:
- **Conversation History:** Summarizing or truncating past turns.
- **Context Window Optimization:** Ensuring you don't exceed the model's limits.

## Retrieval Augmented Generation (RAG)
Combining parametric memory (what the model knows) with non-parametric memory (your data).
1.  **Retrieve:** Search a vector database or API for relevant information.
2.  **Augment:** Insert that information into the prompt.
3.  **Generate:** Ask the LLM to answer using the retrieved context.

## Structured Output
For programmatic workflows, we often need JSON or XML, not free text. Techniques include:
- **Function Calling:** Defining tool schemas the LLM can "call".
- **Json Mode:** Constraining the model to valid JSON.
