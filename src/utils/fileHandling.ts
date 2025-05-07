export const convertImage = async (e: React.ChangeEvent<HTMLInputElement>) : Promise<string> => {
   return new Promise((resolve) => { 
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result as string);
        }
        resolve("");
      };
    } else {
      resolve("");
    }
  });
};