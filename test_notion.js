const { Client } = require('@notionhq/client');

async function verifyNotionConnection() {
    const notion = new Client({ auth: process.env.NOTION_API_KEY });
    try {
        const response = await notion.users.list({});
        console.log('Successfully connected to Notion!');
        console.log('Users found:', response.results.length);
        process.exit(0);
    } catch (error) {
        console.error('Failed to connect to Notion:', error.message);
        process.exit(1);
    }
}

verifyNotionConnection();
