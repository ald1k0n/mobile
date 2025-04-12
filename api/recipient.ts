import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useCreateRecipient = () => {
  return useMutation({
    onError: console.log,
    mutationFn: async (payload: { name: string; address: string }) =>
      await axios
        .post("http://192.168.1.70:8000/recipient", payload)
        .then((res) => res.data),
  });
};

export const useGetRecipientParcelByName = () => {
  return useMutation({
    onError: console.log,
    mutationFn: async (name: string) =>
      await axios
        .get(`http://192.168.1.70:8000/recipient/${name}/parcels`)
        .then((res) => res.data),
  });
};
