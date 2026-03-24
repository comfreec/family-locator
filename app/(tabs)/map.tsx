import React, { useRef, useState } from 'react';
import {
  View, StyleSheet, TouchableOpacity, Text,
  ActivityIndicator, Platform,
} from 'react-native';
import MapView, { PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import { useAuthContext } from '../../context/AuthContext';
import { useFamily } from '../../hooks/useFamily';
import { useLocation } from '../../hooks/useLocation';
import FamilyMarker from '../../components/FamilyMarker';

export default function MapScreen() {
  const { user } = useAuthContext();
  const { members, loading, family } = useFamily(user?.uid ?? null);
  const { location, error } = useLocation(user?.uid ?? null);
  const mapRef = useRef<MapView>(null);
  const [following, setFollowing] = useState(true);

  // 내 위치로 카메라 이동
  const goToMyLocation = () => {
    if (!location) return;
    mapRef.current?.animateToRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }, 800);
  };

  // 모든 가족 보기
  const fitAllMembers = () => {
    const withLocation = members.filter((m) => m.location);
    if (withLocation.length === 0) return;
    const coords = withLocation.map((m) => ({
      latitude: m.location!.latitude,
      longitude: m.location!.longitude,
    }));
    mapRef.current?.fitToCoordinates(coords, {
      edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
      animated: true,
    });
  };

  const initialRegion = location
    ? {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }
    : {
        latitude: 37.5665,
        longitude: 126.978,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };

  if (!family) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>🏠</Text>
        <Text style={styles.emptyTitle}>가족 그룹이 없습니다</Text>
        <Text style={styles.emptySubtitle}>가족 탭에서 그룹을 만들거나 참여하세요</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
      )}

      <MapView
        ref={mapRef}
        style={styles.map}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
        initialRegion={initialRegion}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass
        showsScale
      >
        {members.map((member) => (
          <FamilyMarker
            key={member.uid}
            member={member}
            isCurrentUser={member.uid === user?.uid}
          />
        ))}
      </MapView>

      {/* 가족 이름 헤더 */}
      <View style={styles.header}>
        <Text style={styles.familyName}>📍 {family.name}</Text>
        <Text style={styles.memberCount}>{members.length}명</Text>
      </View>

      {/* 컨트롤 버튼 */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlBtn} onPress={goToMyLocation}>
          <Text style={styles.controlBtnText}>📍</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlBtn} onPress={fitAllMembers}>
          <Text style={styles.controlBtnText}>👨‍👩‍👧‍👦</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#4A90E2" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  header: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  familyName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  memberCount: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '600',
  },
  controls: {
    position: 'absolute',
    right: 16,
    bottom: 100,
    gap: 10,
  },
  controlBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  controlBtnText: {
    fontSize: 22,
  },
  errorBanner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: '#FF6B6B',
    padding: 10,
    alignItems: 'center',
  },
  errorText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F6FF',
    padding: 24,
  },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#1A1A2E', marginBottom: 8 },
  emptySubtitle: { fontSize: 15, color: '#666', textAlign: 'center' },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
