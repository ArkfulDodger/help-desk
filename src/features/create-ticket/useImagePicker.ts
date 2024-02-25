import * as ImagePicker from "expo-image-picker";

// provides image picking callback
const useImagePicker = () => {
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      base64: true, // use for upload to supabase
    });

    // return the first (only) result from the array
    if (result.assets) {
      return result.assets[0];
    }
  };

  return pickImage;
};

export default useImagePicker;
