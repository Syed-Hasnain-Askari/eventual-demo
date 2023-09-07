export const generateAiLikeUuid = () => {
    // Generate a random string of characters
    function generateRandomChars(length) {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let randomChars = '';
      for (let i = 0; i < length; i++) {
        randomChars += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return randomChars;
    }
  
    // Generate a random UUID
    function generateRandomUuid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
  
    const randomChars = generateRandomChars(6);
    const randomUuid = generateRandomUuid();
  
    // Combine the "AI" prefix, random characters, and UUID
    const aiLikeUuid = `AI-${randomChars}-${randomUuid}`;
  
    return aiLikeUuid;
  }
  