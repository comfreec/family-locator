# 📍 가족 위치 공유 앱

가족 구성원의 실시간 위치를 지도에 표시하는 앱입니다.

## 기술 스택

- **Expo** (React Native) - iOS / Android 크로스플랫폼
- **Firebase Realtime Database** - 실시간 위치 동기화
- **Firebase Authentication** - 이메일 로그인
- **react-native-maps** - 지도 표시
- **expo-location** - GPS 위치 추적

## 시작하기

### 1. Firebase 프로젝트 설정

1. [Firebase Console](https://console.firebase.google.com) 에서 새 프로젝트 생성
2. Authentication → 이메일/비밀번호 로그인 활성화
3. Realtime Database 생성 (서울 리전 권장)
4. `firebase.rules.json` 내용을 Realtime Database 규칙에 적용
5. 프로젝트 설정 → 웹 앱 추가 → 설정값 복사

### 2. Firebase 설정 적용

`lib/firebase.ts` 파일에서 YOUR_* 값들을 실제 Firebase 설정으로 교체:

```ts
const firebaseConfig = {
  apiKey: "실제_API_KEY",
  authDomain: "프로젝트.firebaseapp.com",
  databaseURL: "https://프로젝트-default-rtdb.firebaseio.com",
  projectId: "프로젝트_ID",
  ...
};
```

### 3. 실행

```bash
npm install
npx expo start
```

## 주요 기능

- 이메일 회원가입 / 로그인
- 가족 그룹 생성 및 초대 코드로 참여
- 실시간 위치 공유 (5m 이동 시 업데이트)
- 지도에 가족 마커 표시 (이름 이니셜 + 색상)
- 온라인/오프라인 상태 표시
- 초대 코드 공유 기능
- 모든 가족 한눈에 보기 (지도 자동 맞춤)

## 폴더 구조

```
app/
  (auth)/     - 로그인, 회원가입
  (tabs)/     - 지도, 가족, 설정
components/   - FamilyMarker, MemberCard
hooks/        - useAuth, useLocation, useFamily
lib/          - firebase 설정, 타입 정의
context/      - AuthContext
```
