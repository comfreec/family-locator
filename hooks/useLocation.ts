import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { ref, set } from 'firebase/database';
import { db } from '../lib/firebase';

const BACKGROUND_LOCATION_TASK = 'background-location-task';

// 백그라운드 태스크 정의 (모듈 최상단에 위치해야 함)
TaskManager.defineTask(BACKGROUND_LOCATION_TASK, async ({ data, error }: any) => {
  if (error) {
    console.error('Background location error:', error);
    return;
  }
  if (data) {
    const { locations } = data;
    const loc = locations[0];
    if (loc) {
      // AsyncStorage에서 uid 가져오기
      try {
        const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
        const uid = await AsyncStorage.getItem('currentUid');
        if (uid) {
          await set(ref(db, `users/${uid}/location`), {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            accuracy: loc.coords.accuracy,
            timestamp: loc.timestamp,
          });
        }
      } catch (e) {
        console.error('Background task DB error:', e);
      }
    }
  }
});

export function useLocation(uid: string | null) {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) return;

    let active = true;

    const startTracking = async () => {
      // uid를 AsyncStorage에 저장 (백그라운드 태스크에서 사용)
      const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
      await AsyncStorage.setItem('currentUid', uid);

      // 포그라운드 권한 요청
      const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
      if (fgStatus !== 'granted') {
        setError('위치 권한이 필요합니다.');
        return;
      }

      // 백그라운드 권한 요청
      const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();

      // 현재 위치 즉시 가져오기
      const current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      if (active) {
        setLocation(current);
        await set(ref(db, `users/${uid}/location`), {
          latitude: current.coords.latitude,
          longitude: current.coords.longitude,
          accuracy: current.coords.accuracy,
          timestamp: current.timestamp,
        });
      }

      // 포그라운드 위치 감시
      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          distanceInterval: 10,
          timeInterval: 15000,
        },
        async (loc) => {
          if (active) {
            setLocation(loc);
            await set(ref(db, `users/${uid}/location`), {
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
              accuracy: loc.coords.accuracy,
              timestamp: loc.timestamp,
            });
          }
        }
      );

      // 백그라운드 위치 추적 시작
      if (bgStatus === 'granted') {
        const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_LOCATION_TASK);
        if (!isRegistered) {
          await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
            accuracy: Location.Accuracy.Balanced,
            distanceInterval: 20,        // 20미터 이동 시 업데이트
            timeInterval: 30000,          // 최소 30초 간격
            showsBackgroundLocationIndicator: true,
            foregroundService: {
              notificationTitle: '가족 위치 공유 중',
              notificationBody: '백그라운드에서 위치를 공유하고 있습니다.',
              notificationColor: '#4A90E2',
            },
            pausesUpdatesAutomatically: false,
          });
        }
      }
    };

    startTracking();

    return () => {
      active = false;
    };
  }, [uid]);

  // 앱 종료 시 백그라운드 태스크는 유지 (의도적으로 cleanup 안 함)

  return { location, error };
}
