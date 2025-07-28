# halggeol-fe

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## 🚀 GitHub Pages 배포

이 프로젝트는 GitHub Actions를 통해 자동으로 GitHub Pages에 배포됩니다.

### 배포 설정 단계

1. **GitHub 저장소 설정**
   - 저장소 Settings → Pages로 이동
   - Source를 "GitHub Actions"로 설정

2. **자동 배포**
   - `main` 또는 `master` 브랜치에 푸시하면 자동으로 배포됩니다
   - `.github/workflows/deploy.yml` 파일이 배포를 관리합니다

3. **배포 URL**
   - 배포된 사이트: `https://{username}.github.io/halggeol-fe/`
   - 예: `https://m2nuu.github.io/halggeol-fe/`

### 로컬에서 프로덕션 빌드 테스트

```sh
# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

### 배포 상태 확인

- GitHub 저장소의 "Actions" 탭에서 배포 진행 상황을 확인할 수 있습니다
- 빌드가 실패하면 Actions 로그에서 오류를 확인하세요

### 주의사항

- `vite.config.js`에서 `base` 경로가 저장소 이름과 일치하는지 확인하세요
- 현재 설정: `/halggeol-fe/` (저장소명이 다르다면 수정 필요)
