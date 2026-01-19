# Workflow Patterns

Building reliable AI systems often involves standard architectural patterns.

## 1. Linear Chains
The simplest workflow. Step A -> Step B -> Step C.
*Example: Translate user input -> Summarize translation -> Extract keywords.*

## 2. Routing
Directing an input to the specialized workflow best suited to handle it.
*Example: If the user asks about "Refunds", route to the Support Workflow. If they ask about "Coding", route to the Technical Workflow.*

## 3. Parallelization
Running multiple tasks at once to save time or generate diverse perspectives.
- **Sectioning:** Breaking a task (like writing a report) into sections and generating them in parallel.
- **Voting:** Generating 3 distinct answers and having a model pick the best one.

## 4. Evaluator-Optimizer
A feedback loop where one model generates content and another (or the same one) evaluates and critiques it.
1.  **Generate:** Draft an email.
2.  **Evaluate:** Check if it's polite and clear.
3.  **Refine:** Rewrite based on the feedback.
4.  **Repeat** until it passes.

## 5. Map-Reduce
Useful for processing large documents.
1.  **Map:** Summarize every chunk of a long document independently.
2.  **Reduce:** Combine all the summaries into a final overview.
