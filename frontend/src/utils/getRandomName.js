import { uniqueNamesGenerator, adjectives } from 'unique-names-generator';
const customConfig = {
    dictionaries: [adjectives, adjectives], 
    separator: '-',
    length: 2,
};


export function getRandomName() {
    return uniqueNamesGenerator(customConfig) + Math.floor(Math.random() * 1000);
}