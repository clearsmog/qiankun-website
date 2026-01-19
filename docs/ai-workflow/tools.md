# AI Tooling Ecosystem

The landscape for building AI workflows is vast and evolving.

## Orchestration Frameworks

### LangChain
The most popular framework. Huge ecosystem of integrations. Good for chaining and standard RAG, though can be abstract.

### LlamaIndex
Specialized in **data**. Excellent for building advanced RAG pipelines, indexing, and retrieving structured/unstructured data.

### AutoGen (Microsoft)
Focuses on **Multi-Agent** conversation patterns. Great for simulating complex group dynamics between agents.

## Evaluation

### Ragas
Framework for evaluating RAG pipelines (Context Precision, Faithfulness, etc.).

### LangSmith / LangFuse
Observability platforms. Essential for tracing what happens inside your chains, debugging latency, and tracking costs.

## Vector Databases
Where your data lives for retrieval.
- **Pinecone / Weaviate / Qdrant:** Dedicated vector stores.
- **pgvector:** Vector search within PostgreSQL.
