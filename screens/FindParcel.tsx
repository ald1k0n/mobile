import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  FlatList,
  Alert,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Button } from "../components/Button";
import { useGetRecipientParcelByName } from "../api/recipient";
import { Feather } from "@expo/vector-icons";
import { useGetParcelPdf } from "../api/parcel";
import * as Clipboard from "expo-clipboard";

type FormData = {
  recipientName: string;
};

type Parcel = {
  id: string;
  trackingNumber: string;
  status: string;
};

const FindParcelsScreen = () => {
  const [parcels, setParcels] = useState<Parcel[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      recipientName: "",
    },
  });

  const { mutateAsync: getByName, isPending } = useGetRecipientParcelByName();
  const { mutateAsync: getPdfUri } = useGetParcelPdf();

  const fetchParcelsByRecipient = async (
    recipientName: string
  ): Promise<Parcel[]> => {
    const data = await getByName(recipientName).catch(() => setParcels([]));
    return data?.map((d: any) => ({
      trackingNumber: d?.trackNumber,
      id: d?.id,
      status: d?.status,
    }));
  };

  const onSubmit = async (data: FormData) => {
    setError(null);

    try {
      const result = await fetchParcelsByRecipient(data.recipientName);
      setParcels(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setParcels(null);
    }
  };

  const renderParcelItem = ({ item }: { item: Parcel }) => (
    <View style={styles.parcelItem}>
      <View style={styles.parcelRow}>
        <Text style={styles.parcelLabel}>Трек номер</Text>
        <TouchableOpacity
          onPress={() => {
            Clipboard.setStringAsync(item.trackingNumber);
            Alert.alert("Скопировано", "Трек номер скопирован в буфер обмена");
          }}
        >
          <Text style={[styles.parcelValue, styles.copyableText]}>
            {item.trackingNumber}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.parcelRow}>
        <Text style={styles.parcelLabel}>Статус:</Text>
        <Text style={[styles.parcelValue, styles.statusText]}>
          {item.status}
        </Text>
      </View>

      <View style={styles.parcelRow}>
        <Button
          onPress={async () => {
            const pdfUri = await getPdfUri(item.id);
          }}
        >
          <Feather name="download-cloud" size={20} color={"blue"} />
        </Button>
      </View>
    </View>
  );

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formContainer}>
            <Text style={styles.title}>Найти посылку по имени получателя</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Имя получателя</Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      errors.recipientName ? styles.inputError : null,
                    ]}
                    placeholder="Введите имя получателя"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="recipientName"
              />
              {errors.recipientName && (
                <Text style={styles.errorText}>
                  {errors.recipientName.message}
                </Text>
              )}
            </View>

            <Button
              style={styles.searchButton}
              onPress={handleSubmit(onSubmit)}
              disabled={isPending}
            >
              {isPending ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.searchButtonText}>Найти посылки</Text>
              )}
            </Button>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorMessage}>{error}</Text>
            </View>
          )}

          {/* Parcels List */}
          {parcels && parcels.length > 0 && (
            <View style={styles.resultsContainer}>
              <Text style={styles.resultsTitle}>
                Найдено {parcels.length}{" "}
                {parcels.length > 1 ? "посылки" : "посылка"}
              </Text>

              <FlatList
                data={parcels}
                renderItem={renderParcelItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                contentContainerStyle={styles.parcelsList}
              />
            </View>
          )}

          {parcels && parcels.length === 0 && (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>Посылки не найдены</Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  copyableText: {
    textDecorationLine: "underline",
    color: "#007aff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: "#ff3b30",
  },
  errorText: {
    color: "#ff3b30",
    fontSize: 14,
    marginTop: 4,
  },
  searchButton: {
    backgroundColor: "#007aff",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  errorContainer: {
    backgroundColor: "#ffebee",
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  errorMessage: {
    color: "#d32f2f",
    fontSize: 14,
    textAlign: "center",
  },
  resultsContainer: {
    marginTop: 10,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  parcelsList: {
    gap: 12,
  },
  parcelItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  parcelRow: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "center",
  },
  parcelLabel: {
    fontSize: 14,
    color: "#666",
    width: 100,
  },
  parcelValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
    flex: 1,
  },
  statusText: {
    fontWeight: "bold",
    color: "#0070f3",
  },
  deliveredStatus: {
    color: "#2e7d32",
  },
  outForDeliveryStatus: {
    color: "#ff9800",
  },
  noResultsContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  noResultsText: {
    fontSize: 16,
    color: "#666",
  },
});

export default FindParcelsScreen;
