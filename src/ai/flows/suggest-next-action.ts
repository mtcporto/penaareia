'use server';

/**
 * @fileOverview AI agent to suggest the next action for a sales deal.
 *
 * - suggestNextAction - Suggests the next action for a deal based on its details.
 * - SuggestNextActionInput - The input type for the suggestNextAction function.
 * - SuggestNextActionOutput - The return type for the suggestNextAction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestNextActionInputSchema = z.object({
  stage: z
    .string()
    .describe('The current stage of the deal in the sales pipeline.'),
  contactHistory: z
    .string()
    .describe('The history of communications with the contact.'),
  dealDetails: z.string().describe('Details about the deal.'),
});
export type SuggestNextActionInput = z.infer<typeof SuggestNextActionInputSchema>;

const SuggestNextActionOutputSchema = z.object({
  nextAction: z
    .string()
    .describe(
      'The most appropriate next action or communication to move the deal forward.'
    ),
  timing: z
    .string()
    .describe('The optimal timing to accomplish the suggested action.'),
});
export type SuggestNextActionOutput = z.infer<typeof SuggestNextActionOutputSchema>;

export async function suggestNextAction(
  input: SuggestNextActionInput
): Promise<SuggestNextActionOutput> {
  return suggestNextActionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestNextActionPrompt',
  input: {schema: SuggestNextActionInputSchema},
  output: {schema: SuggestNextActionOutputSchema},
  prompt: `You are an AI sales assistant. Analyze the deal's stage, contact history, and details to suggest the most appropriate next action or communication, including optimal timing, to improve the chances of moving the deal to the next sales stage.

Current Stage: {{{stage}}}
Contact History: {{{contactHistory}}}
Deal Details: {{{dealDetails}}}

Suggest the next action and optimal timing:
`, // Ensure the prompt ends with a newline character for better formatting
});

const suggestNextActionFlow = ai.defineFlow(
  {
    name: 'suggestNextActionFlow',
    inputSchema: SuggestNextActionInputSchema,
    outputSchema: SuggestNextActionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
