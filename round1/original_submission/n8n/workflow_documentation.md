# n8n POC documentation

## Purpose

The workflow demonstrates the Round 1 process without external credentials. It uses a transparent rules baseline to extract requirements, score the lead and match a synthetic property catalogue.

## Import and run

1. Open n8n and select **Import from file**.
2. Choose `proplead_round1_workflow.json`.
3. Open the **Sample enquiry** node to change the message.
4. Select **Execute workflow**.
5. Inspect the final **Agent review queue** node.

## Nodes

1. Manual trigger
2. Sample enquiry
3. Extract and score lead
4. Match properties
5. Agent review queue

## Round 2 upgrade

Replace the transparent extraction baseline with an LLM structured-output node, keep the same schema and evaluate both versions in LangSmith. Add a webhook, CRM integration and an approval step before sending the response.
