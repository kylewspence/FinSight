import { Transaction } from '@/types/transaction';

export async function renameDescriptions(transactions: Transaction[]): Promise<Transaction[]> {
  try {
    if (!transactions.length) return transactions;

    // Group transactions by description
    const descriptionGroups = new Map<string, Transaction[]>();
    transactions.forEach(transaction => {
      const desc = transaction.description || 'no description';
      const group = descriptionGroups.get(desc) || [];
      group.push(transaction);
      descriptionGroups.set(desc, group);
    });

    // Process each unique description
    let processedCount = 0;
    for (const [originalDesc, group] of descriptionGroups.entries()) {
      if (originalDesc === 'no description') continue;

      try {
        const response = await fetch('/api/openai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            description: originalDesc,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('API Error:', response.status, response.statusText);
          continue;
        }

        const data = await response.json();
        const { newDescription, usage } = data;
        console.log('OpenAI API usage:', usage); // Track token usage

        // Update all transactions with this description
        group.forEach(transaction => {
          transaction.description = newDescription;
        });
      } catch (error) {
        console.error(`Error processing description "${originalDesc}":`, error);
      }
    }

    return transactions;
  } catch (error) {
    console.error('Error in renameDescriptions:', error);
    return transactions;
  }
} 