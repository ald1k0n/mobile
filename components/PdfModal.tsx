import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Pdf from "react-native-pdf";
import { Feather } from "@expo/vector-icons";

interface PDFViewerProps {
  fileUri: string;
  fileName?: string;
  onClose?: () => void;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({
  fileUri,
  fileName = "Document",
  onClose,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLoadComplete = (numberOfPages: number) => {
    setLoading(false);
    setTotalPages(numberOfPages);
  };

  const handleError = (error: Error) => {
    setLoading(false);
    setError(error.message);
    console.error("Error loading PDF:", error);
  };

  const handlePageChanged = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {onClose && (
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Feather name="x" size={24} color="#333" />
          </TouchableOpacity>
        )}
        <Text
          style={styles.headerTitle}
          numberOfLines={1}
          ellipsizeMode="middle"
        >
          {fileName}
        </Text>
        <Text style={styles.pageInfo}>
          {loading ? "" : `${currentPage} / ${totalPages}`}
        </Text>
      </View>

      {/* PDF Viewer */}
      <View style={styles.pdfContainer}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007aff" />
            <Text style={styles.loadingText}>Loading document...</Text>
          </View>
        )}

        {error ? (
          <View style={styles.errorContainer}>
            <Feather name="alert-circle" size={48} color="#ff3b30" />
            <Text style={styles.errorTitle}>Failed to load PDF</Text>
            <Text style={styles.errorMessage}>{error}</Text>
          </View>
        ) : (
          <Pdf
            source={{ uri: fileUri }}
            style={styles.pdf}
            onLoadComplete={handleLoadComplete}
            onPageChanged={handlePageChanged}
            // onError={handleError}
            enablePaging={true}
            horizontal={false}
            // renderActivityIndicator={() => null}
            trustAllCerts={false}
          />
        )}
      </View>

      {/* Controls */}
      {!loading && !error && totalPages > 1 && (
        <View style={styles.controls}>
          <TouchableOpacity
            style={[
              styles.navButton,
              currentPage === 1 && styles.navButtonDisabled,
            ]}
            disabled={currentPage === 1}
            onPress={() => {
              // The PDF component doesn't have direct methods to change pages
              // This is handled by the component internally, but we could
              // implement custom navigation if needed
            }}
          >
            <Feather
              name="chevron-left"
              size={24}
              color={currentPage === 1 ? "#999" : "#007aff"}
            />
            <Text
              style={[
                styles.navButtonText,
                currentPage === 1 && styles.navButtonTextDisabled,
              ]}
            >
              Previous
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.navButton,
              currentPage === totalPages && styles.navButtonDisabled,
            ]}
            disabled={currentPage === totalPages}
            onPress={() => {
              // The PDF component doesn't have direct methods to change pages
              // This is handled by the component internally, but we could
              // implement custom navigation if needed
            }}
          >
            <Text
              style={[
                styles.navButtonText,
                currentPage === totalPages && styles.navButtonTextDisabled,
              ]}
            >
              Next
            </Text>
            <Feather
              name="chevron-right"
              size={24}
              color={currentPage === totalPages ? "#999" : "#007aff"}
            />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginHorizontal: 12,
    textAlign: "center",
  },
  pageInfo: {
    fontSize: 14,
    color: "#666",
    minWidth: 60,
    textAlign: "right",
  },
  pdfContainer: {
    flex: 1,
    backgroundColor: "#e0e0e0",
  },
  pdf: {
    flex: 1,
    width,
    height: height - 120, // Adjust based on header and controls height
    backgroundColor: "#e0e0e0",
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    zIndex: 1,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#333",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    color: "#007aff",
    marginHorizontal: 4,
  },
  navButtonTextDisabled: {
    color: "#999",
  },
});
