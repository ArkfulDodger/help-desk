import { getDocumentAsync } from "expo-document-picker";

// provides file picking callback
const useFilePicker = () => {
  // pick a file to attach
  const pickFile = async () => {
    // get asset object with picker
    const result = await getDocumentAsync({ copyToCacheDirectory: true });

    // if asset retrieved return it
    if (result.assets) {
      return result.assets[0];
    }
  };

  return pickFile;
};

export default useFilePicker;
