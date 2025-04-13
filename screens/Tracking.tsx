import React, { useEffect, useState } from "react";
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
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Button } from "../components/Button";
import { useGetParcelPdf, useGetTrackParcel } from "../api/parcel";
import { Feather } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";

type FormData = {
  trackingNumber: string;
};

type TrackingResult = {
  id: string;
  trackingNumber: string;
  status: string;
  recipient: string;
};

const TrackingScreen = () => {
  const [trackingResult, setTrackingResult] = useState<TrackingResult | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync: getPdfUri } = useGetParcelPdf();

  const route = useRoute();

  useEffect(() => {
    if (route.params?.trackNumber) {
      fetchTrackingInfo(route.params?.trackNumber);
      reset({
        trackingNumber: route.params?.trackNumber,
      });
    }
  }, [route.params?.trackNumber]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      trackingNumber: "",
    },
  });
  const { mutateAsync: getParcel, isPending } = useGetTrackParcel();
  const fetchTrackingInfo = async (
    trackingNumber: string
  ): Promise<TrackingResult> => {
    const data = await getParcel(trackingNumber);

    return {
      trackingNumber: data?.trackNumber,
      status: data?.status,
      recipient: data?.recipient?.name,
      id: data?.id,
    };
  };

  const onSubmit = async (data: FormData) => {
    setError(null);

    try {
      const result = await fetchTrackingInfo(data.trackingNumber);
      setTrackingResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setTrackingResult(null);
    }
  };

  const handleReset = () => {
    reset();
    setTrackingResult(null);
    setError(null);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text style={styles.title}>Отслеживание посылки</Text>
          <Text style={styles.subtitle}>
            Введите трек номер для получения текущего статуса посылки
          </Text>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Трек номер</Text>
              <Controller
                control={control}
                rules={{
                  required: "Трек номер обязателен",
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      errors.trackingNumber ? styles.inputError : null,
                    ]}
                    placeholder="Введите трек номер"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="characters"
                  />
                )}
                name="trackingNumber"
              />
              {errors.trackingNumber && (
                <Text style={styles.errorText}>
                  {errors.trackingNumber.message}
                </Text>
              )}
            </View>

            <Button
              style={styles.trackButton}
              onPress={handleSubmit(onSubmit)}
              disabled={isPending}
            >
              {isPending ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.trackButtonText}>Найти посылку</Text>
              )}
            </Button>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorMessage}>{error}</Text>
            </View>
          )}

          {trackingResult && (
            <View style={styles.resultContainer}>
              <View style={styles.resultHeader}>
                <Text style={styles.resultTitle}>Информация о посылке</Text>
                <TouchableOpacity onPress={handleReset}>
                  <Text style={styles.resetText}>Отследить другую</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.resultCard}>
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Трек номер</Text>
                  <Text style={styles.resultValue}>
                    {trackingResult.trackingNumber}
                  </Text>
                </View>

                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Статус:</Text>
                  <Text style={[styles.resultValue, styles.statusText]}>
                    {trackingResult.status}
                  </Text>
                </View>

                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Получатель:</Text>
                  <Text style={styles.resultValue}>
                    {trackingResult.recipient}
                  </Text>
                </View>
                <View style={styles.resultRow}>
                  <Button
                    onPress={async () => {
                      const pdfUri = await getPdfUri(trackingResult.id);
                    }}
                  >
                    <Feather name="download-cloud" size={20} color={"blue"} />
                  </Button>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
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
  inputGroup: {
    marginBottom: 20,
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
  trackButton: {
    backgroundColor: "#007aff",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
  trackButtonText: {
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
  resultContainer: {
    marginTop: 10,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  resetText: {
    color: "#007aff",
    fontSize: 14,
  },
  resultCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultRow: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "center",
  },
  resultLabel: {
    fontSize: 14,
    color: "#666",
    width: 100,
  },
  resultValue: {
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
});

export default TrackingScreen;
