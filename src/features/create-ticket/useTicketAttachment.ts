import useFilePicker from "./useFilePicker";
import useImagePicker from "./useImagePicker";
import * as FileSystem from "expo-file-system";
import { useAppDispatch } from "@/redux/reduxHooks";
import { setAttachmentInput } from "@/redux/slices/ticketInputSlice";
import { useActionSheet } from "@expo/react-native-action-sheet";

// allows user to select an image or file and set as the attachment input
// user chooses image or file from action sheet, then selects file to attach
const useTicketAttachment = () => {
  const dispatch = useAppDispatch();
  const { showActionSheetWithOptions } = useActionSheet();
  const pickFile = useFilePicker();
  const pickImage = useImagePicker();

  // action if user wants to attach an image
  const handleImagePick = async () => {
    // select an image through the UI
    const image = await pickImage();

    // if image selected (with required fields for upload), set in state
    if (image !== undefined && image.mimeType && image.base64)
      dispatch(
        setAttachmentInput({
          name: image.fileName || null,
          uri: image.uri,
          data: image.base64,
          type: image.mimeType,
        })
      );
  };

  const handleFilePick = async () => {
    // select a file through the UI
    const file = await pickFile();

    // get the base64 file data
    const fileData =
      file &&
      (await FileSystem.readAsStringAsync(file.uri, {
        encoding: "base64",
      }));

    // if a file is selected (with required upload fields), set in state
    if (file !== undefined && file.mimeType && fileData)
      dispatch(
        setAttachmentInput({
          name: file.name,
          uri: file.uri,
          data: fileData,
          type: file.mimeType,
        })
      );
  };

  // open the action sheet to select which kind of file to attach
  const pickAttachment = async () => {
    // options to select either an image or file attachment
    const options = ["Attach Image", "Attach File", "Cancel"];
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (selectedIndex?: number) => {
        switch (selectedIndex) {
          case 0:
            await handleImagePick();
            break;
          case 1:
            await handleFilePick();
            break;
          case cancelButtonIndex:
            break;
        }
      }
    );
  };

  // removes the currently selected attachment from the ticket
  const removeAttachment = () => {
    dispatch(setAttachmentInput(null));
  };

  return {
    pickAttachment,
    removeAttachment,
  };
};

export default useTicketAttachment;
