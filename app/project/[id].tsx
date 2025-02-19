import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, Alert, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useProjectStore } from '@/store/ProjectStore';
import { Ionicons } from '@expo/vector-icons';

export default function ProjectDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { projects, addImageToProject, deleteProject, pauseProject, resumeProject } = useProjectStore();
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraType, setCameraType] = useState('back');
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const cameraRef = useRef(null);

  const projectId = route.params?.id;
  const project = projects.find(p => p.id === projectId);

  useEffect(() => {
    (async () => {
      if (!permission) {
        await requestPermission();
      }
      const mediaStatus = await MediaLibrary.requestPermissionsAsync();
      if (mediaStatus.status !== 'granted') {
        Alert.alert('Permission required', 'Please grant media library permissions to pick images.');
      }
    })();
  }, [permission]);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      addImageToProject(projectId, photo.uri);
      setIsCameraVisible(false);
    }
  };

  /*const pickImage = async () => {
    try {
      const result = await MediaLibrary.getAssetsAsync({
        first: 1,
        mediaType: MediaLibrary.MediaType.photo,
      });
      if (result.assets.length > 0) {
        const asset = result.assets[0];
        addImageToProject(projectId, asset.uri);
      }
    } catch (err) {
      console.warn(err);
      Alert.alert('Error', 'Failed to pick an image from gallery');
    }
  };*/

  const handleDeleteProject = () => {
    Alert.alert(
      "Delete Project",
      "Are you sure you want to delete this project?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => {
          deleteProject(projectId);
          navigation.goBack();
        }}
      ]
    );
  };

  const toggleProjectStatus = () => {
    if (project.status === 'active') {
      pauseProject(projectId);
    } else {
      resumeProject(projectId);
    }
  };

  const exportProject = () => {
    Alert.alert("Export", "Export functionality to be implemented");
  };

  if (!project) {
    return <Text>Project not found</Text>;
  }

  if (!permission || !permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{project.name}</Text>
      <Text style={styles.progress}>
        Progress: {project.currentImageCount} / {project.targetImageCount}
      </Text>

      {isCameraVisible ? (
        <CameraView
          style={styles.camera}
          facing={cameraType}
          ref={cameraRef}
        >
          <View style={styles.cameraButtonsContainer}>
            <TouchableOpacity
              style={styles.flipButton}
              onPress={() => {
                setCameraType(
                  cameraType === 'back' ? 'front' : 'back'
                );
              }}>
              <Text style={styles.flipButtonText}>Flip</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      ) : (
        <FlatList
          data={project.images}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Image source={{ uri: item.uri }} style={styles.thumbnail} />
          )}
          numColumns={3}
        />
      )}

      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={() => setIsCameraVisible(true)}>
          <Ionicons name="camera" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDeleteProject}>
          <Ionicons name="trash" size={24} color="red" />
        </TouchableOpacity>
        <TouchableOpacity onPress={exportProject}>
          <Ionicons name="share" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {isCameraVisible && (
        <TouchableOpacity
          style={styles.captureButton}
          onPress={takePicture}
        >
          <Ionicons name="camera" size={24} color="black" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    color: 'white'
  },
  progress: {
    padding: 16,
    color: 'white'
  },
  camera: {
    flex: 1,
  },
  cameraButtonsContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
  },
  flipButton: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  flipButtonText: {
    fontSize: 18,
    marginBottom: 10,
    color: 'white',
  },
  thumbnail: {
    width: 100,
    height: 100,
    margin: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
  },
  captureButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 50
  }
});