import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AddDogFab, DogsScreenHeader } from "@/components/dogs/dogs-screen";
import { LoadingView } from "@/components/loading-view";
import { DogEditForm } from "@/components/ui/dog-edit-form";
import { DogTable } from "@/components/ui/dog-table";
import { Colors, Spacing } from "@/constants/theme";
import { useCanilendar } from "@/context/canilendar-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useDogEditor } from "@/hooks/use-dog-editor";

export default function DogsScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() ?? "light";
  const palette = Colors[colorScheme];
  const { deleteDog, dogs, isLoaded, markChecklistStepSeen, saveDog } =
    useCanilendar();
  const editor = useDogEditor({
    deleteDog,
    dogs,
    isLoaded,
    markChecklistStepSeen,
    saveDog,
  });

  if (!isLoaded) {
    return <LoadingView />;
  }

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={[
        styles.safeArea,
        {
          backgroundColor: palette.background,
        },
      ]}
    >
      <DogsScreenHeader
        palette={palette}
        title={t("dogs.title")}
        description={t("dogs.description")}
      />
      {editor.isEditing ? (
        <DogEditForm
          style={{
            paddingLeft: Spacing.lg,
            paddingRight: Spacing.lg,
          }}
          editingDogId={editor.editingDogId}
          form={editor.form}
          setForm={editor.setForm}
          cancelEdit={editor.cancelEdit}
          handleSave={editor.handleSave}
          pickFromCamera={() => {
            editor.handlePickPhoto("camera");
          }}
          pickFromLibrary={() => {
            editor.handlePickPhoto("library");
          }}
          removePhoto={editor.handleRemovePhoto}
          photoBusy={editor.photoBusy}
        />
      ) : (
        <>
          <DogTable
            style={{
              paddingLeft: Spacing.lg,
              paddingRight: Spacing.lg,
            }}
            dogs={dogs}
            editDog={editor.beginEditDog}
            deleteDog={editor.handleDelete}
          />
          <AddDogFab
            accessibilityLabel={t("dogs.editorAddTitle")}
            onPress={editor.beginCreateDog}
            palette={palette}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});
