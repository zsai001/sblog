type Dictionary = {
    archiveTitle: string;
    // Add other translation keys as needed
};

export async function getDictionary(lang: string): Promise<Dictionary> {
    // This is a simple implementation. You might want to fetch translations from a file or API
    const dictionaries: Record<string, Dictionary> = {
        en: {
            archiveTitle: "Archive",
            // Add other English translations
        },
        // Add other languages as needed
    };

    return dictionaries[lang] || dictionaries.en; // Default to English if language not found
}