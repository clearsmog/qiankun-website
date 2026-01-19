# AI Agents

Agents differ from workflows in their autonomy. While a workflow follows a pre-defined path, an agent decides its own path.

## The Loop
An agent typically operates in a loop:
1.  **Observe:** Look at the user goal and current state.
2.  **Think/Reason:** Decide what to do next (e.g., "I need to search Google").
3.  **Act:** Execute a tool (run the search).
4.  **Evaluate:** Look at the result. Is the goal met? If not, loop back to step 1.

## ReAct Pattern
**Re**asoning + **Act**ing. The agent explicitly writes down its thought process before taking an action.
> *Thought: The user wants the weather in Tokyo. I should use the weather tool.*
> *Action: `get_weather("Tokyo")`*
> *Observation: It is 15°C and raining.*
> *Thought: I have the answer.*
> *Final Answer: It's currently raining and 15°C in Tokyo.*

## Multi-Agent Systems
Using multiple specialized agents that collaborate.
- **Manager Agent:** Breaks down the plan and assigns tasks.
- **Coder Agent:** Writes code.
- **Reviewer Agent:** Checks code.

## Challenges with Agents
- **Loops:** Getting stuck repeating the same action.
- **Cost:** Many steps = many tokens.
- **Unpredictability:** Harder to debug than linear workflows.
