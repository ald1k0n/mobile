import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Button } from "../components/Button";
import { useCreateParcel } from "../api/parcel";
import { useCreateRecipient } from "../api/recipient";
import { useNavigation } from "@react-navigation/native";

type FormData = {
  name: string;
  address: string;
};

const Home = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      address: "",
    },
  });
  const navigation = useNavigation();
  const { mutateAsync: createParcel } = useCreateParcel();
  const { mutateAsync: createRecipient } = useCreateRecipient();
  const onSubmit = async (data: FormData) => {
    await createRecipient(data).then((recipient) => {
      Alert.alert("Успех", "Получатель добавлен! Желаете добавить посылку?", [
        {
          text: "OK",
          onPress: async () => {
            try {
              const { trackNumber } = await createParcel(recipient?.id);
              navigation.navigate("TrackParcel", { trackNumber });
            } catch (error) {
              reset();
            }
          },
        },
        {
          text: "Отмена",
          onPress: () => reset(),
        },
      ]);
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Добавить получателя</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Имя</Text>
            <Controller
              control={control}
              rules={{
                required: "Имя обязательно",
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, errors.name ? styles.inputError : null]}
                  placeholder="Введите имя получателя"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="name"
            />
            {errors.name && (
              <Text style={styles.errorText}>{errors.name.message}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Адрес</Text>
            <Controller
              control={control}
              rules={{
                required: "Адрес обязателен",
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    errors.address ? styles.inputError : null,
                  ]}
                  placeholder="Введите адрес получателя"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  multiline
                  numberOfLines={3}
                />
              )}
              name="address"
            />
            {errors.address && (
              <Text style={styles.errorText}>{errors.address.message}</Text>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <Button
              style={styles.submitButton}
              onPress={handleSubmit(onSubmit)}
            >
              <Text style={styles.submitButtonText}>Создать</Text>
            </Button>
          </View>
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
  formContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
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
    backgroundColor: "#fff",
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
  buttonContainer: {
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: "#007aff",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  resetButton: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  resetButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Home;
