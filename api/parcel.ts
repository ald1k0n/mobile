import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Platform } from "react-native";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";

export const useGetTrackParcel = () => {
  return useMutation({
    onError: console.log,
    mutationFn: async (trackNumber: string) =>
      await axios
        .get(`http://192.168.1.70:8000/parcel/${trackNumber}`)
        .then((res) => res.data),
  });
};

export const useCreateParcel = () => {
  return useMutation({
    mutationFn: async (recipientId: string) =>
      await axios
        .post(`http://192.168.1.70:8000/parcel`, {
          recipientId,
        })
        .then((res) => res.data),
    onError: console.log,
  });
};
export const useGetParcelPdf = () => {
  return useMutation({
    mutationFn: async (parcelId: string) => {
      const response = await axios.get(
        `http://192.168.1.70:8000/parcel/pdf/${parcelId}`,
        { responseType: "arraybuffer" }
      );
      return response.data;
    },

    onSuccess: async (pdfData: ArrayBuffer, parcelId: string) => {
      const path = `${FileSystem.documentDirectory}parcel_${parcelId}.pdf`;

      const base64Pdf = arrayBufferToBase64(pdfData);

      await FileSystem.writeAsStringAsync(path, base64Pdf, {
        encoding: FileSystem.EncodingType.Base64,
      });

      console.log("PDF saved to", path);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(path);
      } else {
        console.warn("Sharing not available on this platform");
      }
    },

    onError: (err) => {
      console.error("PDF download error:", err);
    },
  });
};

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
