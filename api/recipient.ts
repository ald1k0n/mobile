import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useCreateRecipient = () => {
  return useMutation({
    onError: console.log,
    mutationFn: async (payload: { name: string; address: string }) =>
      await axios
        .post(`${process.env.EXPO_PUBLIC_API_URL}/recipient`, payload)
        .then((res) => res.data),
  });
};

export const useGetRecipientParcelByName = () => {
  return useMutation({
    onError: console.log,
    mutationFn: async (name: string) =>
      await axios
        .get(`${process.env.EXPO_PUBLIC_API_URL}/recipient/${name}/parcels`)
        .then((res) => res.data),
  });
};
