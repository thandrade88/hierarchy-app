import { POISON_ARRAY } from "./constants";

export function make32(inputString: string) {
    const targetLength = 32;
    let resultString = "";
    while (resultString.length < targetLength) { 
        resultString += inputString; 
    }    
    resultString = resultString.substring(0, targetLength);
    return Array.from(resultString, (char) => char.charCodeAt(0));
}

export function encode(email: string, password: string) { 
    const emailChars = make32(email); 
    const passwordChars = make32(password); 
    let encodedResult = ""; 
    for (let i = 0; i < 32; ++i) { 
        const index = (emailChars[i] ^ passwordChars[i]) & 0xff; 
        const value = POISON_ARRAY[index]; 
        encodedResult += value.toString(16).padStart(2, "0").toUpperCase(); 
    } 
    return encodedResult; 
}