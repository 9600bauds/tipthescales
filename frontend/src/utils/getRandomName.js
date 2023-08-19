import { uniqueNamesGenerator, adjectives, colors } from 'unique-names-generator';
const customConfig = {
    dictionaries: [adjectives, colors], 
    separator: '-',
    length: 2,
};


export function getRandomName() {
    return uniqueNamesGenerator(customConfig) + Math.floor(Math.random() * 100);
}